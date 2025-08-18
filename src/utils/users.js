const users = []
const { aiAgent } = require('./aiAgent')

// Emoji array for user assignment
const userEmojis = ['😊', '😎', '🤖', '👻', '🦄', '🐱', '🐶', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸', '🐙', '🦋', '🦅', '🦉', '🦒', '🦘', '🦔']

// Function to get random emoji for user
function getRandomEmoji() {
    return userEmojis[Math.floor(Math.random() * userEmojis.length)]
}

// Function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    const user = {
        id,
        username: capitalizeFirstLetter(username),
        room: room.toUpperCase(),
        emoji: getRandomEmoji()
    }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const roomUsers = users.filter((user) => user.room.toLowerCase() === room)

    // Add AI Agent to the room users list with emoji
    const agentInRoom = {
        id: aiAgent.id,
        username: aiAgent.name,
        room: room.toUpperCase(),
        emoji: '🤖'
    }

    return [...roomUsers, agentInRoom]
}

const getAgentInfo = () => {
    return aiAgent
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getAgentInfo
}