require('dotenv').config()

module.exports = {
     // Provider: 'openai' (default) or 'openrouter'
     AI_PROVIDER: process.env.AI_PROVIDER || 'openai',
     AI_MODEL: process.env.AI_MODEL || 'gpt-3.5-turbo',

     // OpenAI
     OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',

     // OpenRouter
     OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
     OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',

     // Optional metadata for OpenRouter
     APP_URL: process.env.APP_URL || '',
     APP_NAME: process.env.APP_NAME || 'Chat App',

     // Pusher Configuration
     PUSHER_APP_ID: process.env.PUSHER_APP_ID || '',
     PUSHER_KEY: process.env.PUSHER_KEY || '',
     PUSHER_SECRET: process.env.PUSHER_SECRET || '',
     PUSHER_CLUSTER: process.env.PUSHER_CLUSTER || 'us2'
}
