const path = require('path')
const express = require('express')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const { generateAIResponse, isAgentMessage } = require('./utils/aiAgent')
const { triggerToRoom, EVENTS } = require('./utils/pusher')
const { addMessage, getRoomMessages } = require('./utils/messageStore')
const { hasExceededLimit, incrementUsage, getRemainingRequests, resetUserLimit, DAILY_LIMIT } = require('./utils/rateLimiter')
const config = require('../config')

const app = express()

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

// Middleware
app.use(express.static(publicDirectoryPath))
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        pusher: {
            configured: !!(config.PUSHER_KEY && config.PUSHER_CLUSTER),
            hasKey: !!config.PUSHER_KEY,
            hasCluster: !!config.PUSHER_CLUSTER
        },
        ai: {
            configured: !!(config.OPENAI_API_KEY || config.OPENROUTER_API_KEY),
            provider: config.AI_PROVIDER
        }
    })
})

// Pusher configuration endpoint (safe to expose key and cluster)
app.get('/api/pusher-config', (req, res) => {
    if (!config.PUSHER_KEY || !config.PUSHER_CLUSTER) {
        return res.status(500).json({
            error: 'Pusher not configured. Please set PUSHER_KEY and PUSHER_CLUSTER environment variables.',
            missing: {
                key: !config.PUSHER_KEY,
                cluster: !config.PUSHER_CLUSTER
            }
        })
    }

    res.json({
        key: config.PUSHER_KEY,
        cluster: config.PUSHER_CLUSTER
    })
})

// API endpoint for joining a room
app.post('/api/join', (req, res) => {
    const { username, room } = req.body

    if (!username || !room) {
        return res.status(400).json({ error: 'Username and room are required' })
    }

    const { error, user } = addUser({ id: Date.now().toString(), username, room })

    if (error) {
        return res.status(400).json({ error })
    }

    // Reset user's rate limit when they join/rejoin the room
    resetUserLimit(user.id)

    try {
        // Send welcome message to the user
        const welcomeMessage = generateMessage('Admin', 'Welcome!', '👋')
        addMessage(user.room, welcomeMessage)
        triggerToRoom(room, EVENTS.MESSAGE, welcomeMessage)

        // Notify others in the room
        const joinMessage = generateMessage('Admin', `New joined member is ${user.username}`, '👋')
        addMessage(user.room, joinMessage)
        triggerToRoom(room, EVENTS.USER_JOINED, {
            message: joinMessage,
            user: user
        })

        // Update room data for all users in the room (including the new user)
        triggerToRoom(room, EVENTS.ROOM_DATA, {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        res.json({ success: true, user })
    } catch (error) {
        console.error('Error in join endpoint:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// API endpoint for getting room messages
app.get('/api/room-messages/:room', (req, res) => {
    const { room } = req.params

    if (!room) {
        return res.status(400).json({ error: 'Room is required' })
    }

    try {
        const messages = getRoomMessages(room.toUpperCase())
        res.json({ success: true, messages })
    } catch (error) {
        console.error('Error fetching room messages:', error)
        res.status(500).json({ error: 'Error fetching messages' })
    }
})

// API endpoint for getting room data
app.get('/api/room-data/:room', (req, res) => {
    const { room } = req.params

    if (!room) {
        return res.status(400).json({ error: 'Room is required' })
    }

    try {
        const roomData = {
            room: room.toUpperCase(),
            users: getUsersInRoom(room.toUpperCase())
        }
        res.json({ success: true, roomData })
    } catch (error) {
        console.error('Error fetching room data:', error)
        res.status(500).json({ error: 'Error fetching room data' })
    }
})

// API endpoint for checking user's AI request limit
app.get('/api/ai-limit/:userId', (req, res) => {
    const { userId } = req.params

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' })
    }

    try {
        const remaining = getRemainingRequests(userId)
        const hasExceeded = hasExceededLimit(userId)

        res.json({
            success: true,
            remaining,
            limit: DAILY_LIMIT,
            hasExceeded
        })
    } catch (error) {
        console.error('Error checking AI limit:', error)
        res.status(500).json({ error: 'Error checking AI limit' })
    }
})

// API endpoint for sending messages
app.post('/api/message', async (req, res) => {
    const { userId, message } = req.body

    if (!userId || !message) {
        return res.status(400).json({ error: 'User ID and message are required' })
    }

    const user = getUser(userId)
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }

    const filter = new Filter()
    if (filter.isProfane(message)) {
        return res.status(400).json({ error: 'Profanity is not allowed' })
    }

    try {
        // Check if this is an AI agent message
        if (isAgentMessage(message)) {
            // Check rate limit for AI requests
            if (hasExceededLimit(userId)) {
                const remaining = getRemainingRequests(userId)
                const limitMessage = generateMessage('Admin',
                    `@${user.username} You have reached your daily limit of ${DAILY_LIMIT} AI requests. Please rejoin the room to reset your limit.`,
                    '⚠️'
                )
                addMessage(user.room, limitMessage)
                triggerToRoom(user.room, EVENTS.MESSAGE, limitMessage)
                return res.json({ success: true, rateLimited: true })
            }

            // Create user message
            const userMessage = generateMessage(user.username, message, user.emoji)

            // Store and send the user's message
            addMessage(user.room, userMessage)
            triggerToRoom(user.room, EVENTS.MESSAGE, userMessage)

            // Increment usage counter
            incrementUsage(userId)

            // Generate AI response
            const aiResponse = await generateAIResponse(message, user.room, user.username)
            const aiMessage = generateMessage('Agent', aiResponse, '🤖')

            // Store and send AI response
            addMessage(user.room, aiMessage)
            triggerToRoom(user.room, EVENTS.MESSAGE, aiMessage)

            // Send remaining requests info
            const remaining = getRemainingRequests(userId)
            if (remaining <= 1) {
                const warningMessage = generateMessage('Admin',
                    `@${user.username} You have ${remaining} AI request(s) remaining today.`,
                    'ℹ️'
                )
                addMessage(user.room, warningMessage)
                triggerToRoom(user.room, EVENTS.MESSAGE, warningMessage)
            }

            res.json({ success: true })
        } else {
            // Regular message
            const messageObj = generateMessage(user.username, message, user.emoji)
            addMessage(user.room, messageObj)
            triggerToRoom(user.room, EVENTS.MESSAGE, messageObj)
            res.json({ success: true })
        }
    } catch (error) {
        console.error('Error in message endpoint:', error)
        res.status(500).json({ error: 'Error processing message' })
    }
})

// API endpoint for sending location
app.post('/api/location', (req, res) => {
    const { userId, coords } = req.body

    if (!userId || !coords) {
        return res.status(400).json({ error: 'User ID and coordinates are required' })
    }

    const user = getUser(userId)
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }

    try {
        const locationMessage = generateLocationMessage(
            user.username,
            `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
            user.emoji
        )

        // Store location message
        addMessage(user.room, locationMessage)
        triggerToRoom(user.room, EVENTS.LOCATION_MESSAGE, locationMessage)
        res.json({ success: true })
    } catch (error) {
        console.error('Error in location endpoint:', error)
        res.status(500).json({ error: 'Error processing location' })
    }
})

// API endpoint for leaving a room
app.post('/api/leave', (req, res) => {
    const { userId } = req.body

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' })
    }

    try {
        const user = removeUser(userId)
        if (user) {
            const leaveMessage = generateMessage('Admin', `A user who left was ${user.username}`, '👋')
            addMessage(user.room, leaveMessage)
            triggerToRoom(user.room, EVENTS.USER_LEFT, {
                message: leaveMessage,
                user: user
            })

            triggerToRoom(user.room, EVENTS.ROOM_DATA, {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

        res.json({ success: true })
    } catch (error) {
        console.error('Error in leave endpoint:', error)
        res.status(500).json({ error: 'Error processing leave request' })
    }
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
});

// module.exports = app