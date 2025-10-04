// Rate limiting for AI agent usage
const userLimits = new Map() // userId -> { count: number, date: string }

const DAILY_LIMIT = 3
const RESET_HOUR = 0 // Reset at midnight

// Get current date string (YYYY-MM-DD)
function getCurrentDate() {
     return new Date().toISOString().split('T')[0]
}

// Check if user has exceeded their daily limit
function hasExceededLimit(userId) {
     const today = getCurrentDate()
     const userLimit = userLimits.get(userId)

     if (!userLimit) {
          return false
     }

     // If it's a new day, reset the limit
     if (userLimit.date !== today) {
          userLimits.delete(userId)
          return false
     }

     return userLimit.count >= DAILY_LIMIT
}

// Increment user's AI request count
function incrementUsage(userId) {
     const today = getCurrentDate()
     const userLimit = userLimits.get(userId)

     if (!userLimit || userLimit.date !== today) {
          // New day or new user
          userLimits.set(userId, { count: 1, date: today })
     } else {
          // Same day, increment count
          userLimit.count++
     }
}

// Get remaining requests for user
function getRemainingRequests(userId) {
     const today = getCurrentDate()
     const userLimit = userLimits.get(userId)

     if (!userLimit || userLimit.date !== today) {
          return DAILY_LIMIT
     }

     return Math.max(0, DAILY_LIMIT - userLimit.count)
}

// Reset user's limit (when they rejoin room)
function resetUserLimit(userId) {
     userLimits.delete(userId)
}

// Clean up old entries (optional, for memory management)
function cleanupOldEntries() {
     const today = getCurrentDate()
     for (const [userId, limit] of userLimits.entries()) {
          if (limit.date !== today) {
               userLimits.delete(userId)
          }
     }
}

// Run cleanup every hour
setInterval(cleanupOldEntries, 60 * 60 * 1000)

module.exports = {
     hasExceededLimit,
     incrementUsage,
     getRemainingRequests,
     resetUserLimit,
     DAILY_LIMIT
}
