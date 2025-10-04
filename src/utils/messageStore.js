// In-memory message store for persistence
const messages = new Map() // room -> array of messages

const addMessage = (room, message) => {
     if (!messages.has(room)) {
          messages.set(room, [])
     }

     const roomMessages = messages.get(room)
     roomMessages.push(message)

     // Keep only last 100 messages per room to prevent memory issues
     if (roomMessages.length > 100) {
          roomMessages.shift()
     }
}

const getRoomMessages = (room) => {
     return messages.get(room) || []
}

const clearRoomMessages = (room) => {
     messages.delete(room)
}

module.exports = {
     addMessage,
     getRoomMessages,
     clearRoomMessages
}
