const OpenAI = require('openai')
const config = require('../../config')

function createClient() {
     const provider = (config.AI_PROVIDER || 'openai').toLowerCase()
     if (provider === 'openrouter') {
          if (!config.OPENROUTER_API_KEY) return { client: null, model: null, reason: 'Missing OPENROUTER_API_KEY' }
          const client = new OpenAI({
               apiKey: config.OPENROUTER_API_KEY,
               baseURL: config.OPENROUTER_BASE_URL,
               defaultHeaders: {
                    'HTTP-Referer': config.APP_URL || 'http://localhost:3000',
                    'X-Title': config.APP_NAME || 'Chat App'
               }
          })
          return { client, model: config.AI_MODEL || 'openrouter/auto', reason: null }
     }
     // default: openai
     if (!config.OPENAI_API_KEY) return { client: null, model: null, reason: 'Missing OPENAI_API_KEY' }
     const client = new OpenAI({ apiKey: config.OPENAI_API_KEY })
     return { client, model: config.AI_MODEL || 'gpt-3.5-turbo', reason: null }
}

const aiAgent = {
     name: 'Agent',
     id: 'ai-agent-001'
}

async function generateAIResponse(message, room, username) {
     const { client, model, reason } = createClient()
     if (!client) {
          return `AI is not configured: ${reason}. Set environment variables and redeploy.`
     }
     try {
          const cleanMessage = message.replace(/^@Agent\s*/i, '').trim()
          if (!cleanMessage) {
               return "Hello! I'm your AI assistant. How can I help you today?"
          }
          const systemPrompt = `You are a helpful AI assistant in a chat room called "${room}". A user named "${username}" is asking you a question. Provide a concise, friendly response under 200 words.`
          const completion = await client.chat.completions.create({
               model,
               messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: cleanMessage }
               ],
               max_tokens: 500,
               temperature: 0.7
          })
          return completion.choices?.[0]?.message?.content || "(No response)"
     } catch (error) {
          console.error('AI Agent Error:', error?.response?.data || error)
          if (error?.response?.status === 429) {
               return "AI quota/rate limit reached. Try again later or switch provider (see README)."
          }
          if (String(error?.message || '').includes('quota')) {
               return "Your AI plan quota has been exceeded. Add billing or switch provider (see README)."
          }
          return "Sorry, I'm having trouble processing your request right now. Please try again later."
     }
}

function isAgentMessage(message) {
     return /^@Agent\s+/i.test(message)
}

module.exports = {
     aiAgent,
     generateAIResponse,
     isAgentMessage
}
