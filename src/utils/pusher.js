const Pusher = require('pusher')
const config = require('../../config')

// Check if Pusher is configured
const isPusherConfigured = config.PUSHER_APP_ID && config.PUSHER_KEY && config.PUSHER_SECRET && config.PUSHER_CLUSTER

// Initialize Pusher server instance only if configured
let pusher = null
if (isPusherConfigured) {
     try {
          pusher = new Pusher({
               appId: config.PUSHER_APP_ID,
               key: config.PUSHER_KEY,
               secret: config.PUSHER_SECRET,
               cluster: config.PUSHER_CLUSTER,
               useTLS: true
          })
     } catch (error) {
          console.error('Failed to initialize Pusher:', error)
     }
}

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
     if (!pusher) {
          console.warn('Pusher not configured, skipping event:', event)
          return Promise.resolve()
     }

     try {
          return pusher.trigger(`room-${room}`, event, data)
     } catch (error) {
          console.error('Error triggering Pusher event:', error)
          return Promise.resolve()
     }
}

function triggerToUser(userId, event, data) {
     if (!pusher) {
          console.warn('Pusher not configured, skipping event:', event)
          return Promise.resolve()
     }

     try {
          return pusher.trigger(`private-user-${userId}`, event, data)
     } catch (error) {
          console.error('Error triggering Pusher event:', error)
          return Promise.resolve()
     }
}

module.exports = {
     pusher,
     CHANNELS,
     EVENTS,
     triggerToRoom,
     triggerToUser,
     isPusherConfigured
}
