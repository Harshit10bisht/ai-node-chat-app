const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const { generateAIResponse, isAgentMessage } = require('./utils/aiAgent')

const app = express()
const server = http.createServer(app)

// Configure Socket.IO for Vercel serverless environment
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    transports: ['polling'], // Force polling for serverless compatibility
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000
})

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New Websocket connection:', socket.id)

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', 'New joined member is ' + user.username))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', async (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        // Check if this is an AI agent message
        if (isAgentMessage(message)) {
            try {
                // Send the user's message first
                io.to(user.room).emit('message', generateMessage(user.username, message))

                // Generate AI response
                const aiResponse = await generateAIResponse(message, user.room, user.username)

                // Send AI response
                io.to(user.room).emit('message', generateMessage('Agent', aiResponse))

                callback()
            } catch (error) {
                console.error('AI Agent Error:', error)
                callback('Error processing AI request')
            }
        } else {
            // Regular message
            io.to(user.room).emit('message', generateMessage(user.username, message))
            callback()
        }
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, 'https://google.com/maps?q=' + coords.latitude + ',' + coords.longitude))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', 'A user who left was' + user.username))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    // Handle connection errors
    socket.on('error', (error) => {
        console.error('Socket error:', error)
    })
})

// For local development
if (process.env.NODE_ENV !== 'production') {
    server.listen(port, () => {
        console.log('Server is up on port ' + port)
    })
}

// For Vercel deployment
module.exports = app