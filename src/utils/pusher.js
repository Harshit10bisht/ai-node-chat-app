const Pusher = require('pusher')
const config = require('../../config')

// Initialize Pusher server instance
const pusher = new Pusher({
     appId: config.PUSHER_APP_ID,
     key: config.PUSHER_KEY,
     secret: config.PUSHER_SECRET,
     cluster: config.PUSHER_CLUSTER,
     useTLS: true
})

// Channel names
const CHANNELS = {
     CHAT: 'chat',
     ROOM_DATA: 'room-data'
}

// Event names
const EVENTS = {
     MESSAGE: 'message',
     LOCATION_MESSAGE: 'location-message',
     ROOM_DATA: 'room-data',
     USER_JOINED: 'user-joined',
     USER_LEFT: 'user-left'
}

// Helper functions
function triggerToRoom(room, event, data) {
     return pusher.trigger(`room-${room}`, event, data)
}

function triggerToUser(userId, event, data) {
     return pusher.trigger(`private-user-${userId}`, event, data)
}

module.exports = {
     pusher,
     CHANNELS,
     EVENTS,
     triggerToRoom,
     triggerToUser
}
