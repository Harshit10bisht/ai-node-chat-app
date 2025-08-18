const path = require('path')
const express = require('express')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const { generateAIResponse, isAgentMessage } = require('./utils/aiAgent')
const { triggerToRoom, EVENTS } = require('./utils/pusher')
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
            configured: !!(config.PUSHER_KEY && config.PUSHER_CLUSTER)
        }
    })
})

// Pusher configuration endpoint (safe to expose key and cluster)
app.get('/api/pusher-config', (req, res) => {
    if (!config.PUSHER_KEY || !config.PUSHER_CLUSTER) {
        return res.status(500).json({
            error: 'Pusher not configured. Please set PUSHER_KEY and PUSHER_CLUSTER environment variables.'
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

    // Send welcome message to the user
    triggerToRoom(room, EVENTS.MESSAGE, generateMessage('Admin', 'Welcome!', '👋'))

    // Notify others in the room
    triggerToRoom(room, EVENTS.USER_JOINED, {
        message: generateMessage('Admin', `New joined member is ${user.username}`, '👋'),
        user: user
    })

    // Update room data
    triggerToRoom(room, EVENTS.ROOM_DATA, {
        room: user.room,
        users: getUsersInRoom(user.room)
    })

    res.json({ success: true, user })
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

    // Check if this is an AI agent message
    if (isAgentMessage(message)) {
        try {
            // Send the user's message first
            triggerToRoom(user.room, EVENTS.MESSAGE, generateMessage(user.username, message, user.emoji))

            // Generate AI response
            const aiResponse = await generateAIResponse(message, user.room, user.username)

            // Send AI response
            triggerToRoom(user.room, EVENTS.MESSAGE, generateMessage('Agent', aiResponse, '🤖'))

            res.json({ success: true })
        } catch (error) {
            console.error('AI Agent Error:', error)
            res.status(500).json({ error: 'Error processing AI request' })
        }
    } else {
        // Regular message
        triggerToRoom(user.room, EVENTS.MESSAGE, generateMessage(user.username, message, user.emoji))
        res.json({ success: true })
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

    const locationMessage = generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
        user.emoji
    )

    triggerToRoom(user.room, EVENTS.LOCATION_MESSAGE, locationMessage)
    res.json({ success: true })
})

// API endpoint for leaving a room
app.post('/api/leave', (req, res) => {
    const { userId } = req.body

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' })
    }

    const user = removeUser(userId)
    if (user) {
        triggerToRoom(user.room, EVENTS.USER_LEFT, {
            message: generateMessage('Admin', `A user who left was ${user.username}`, '👋'),
            user: user
        })

        triggerToRoom(user.room, EVENTS.ROOM_DATA, {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    }

    res.json({ success: true })
})

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log('Server is up on port ' + port)
        console.log('Pusher configured:', !!(config.PUSHER_KEY && config.PUSHER_CLUSTER))
    })
}

// For Vercel deployment
module.exports = app