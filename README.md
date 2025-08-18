# Socket.IO Chat App with AI Agent

A real-time chat application built with Node.js, Express, and Socket.IO, featuring an integrated AI assistant.

## Features

- Real-time messaging
- Room-based chat
- User join/leave notifications
- Location sharing
- Profanity filtering
- **AI Agent Integration** - Ask questions with "@Agent"
- Responsive design

## AI Agent Setup

### Option A: OpenAI (default)

1. Create an account at `https://platform.openai.com/`
2. Create an API key
3. Add to `.env`:
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your_key
AI_MODEL=gpt-3.5-turbo
```

If you see "You exceeded your current quota": your free trial may be expired or you have no billing set. Add a small billing limit (e.g., $5) in the usage/billing dashboard or switch to Option B below.

### Option B: OpenRouter (fallback, generous free routes)

1. Create an account at `https://openrouter.ai/`
2. Get your API key
3. Add to `.env`:
```bash
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=or-your_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
# Optional but recommended for OpenRouter analytics
APP_URL=https://your-deployed-url.vercel.app
APP_NAME=Chat App
# Pick a free/cheap model, examples:
AI_MODEL=meta-llama/llama-3.1-8b-instruct:free
# or AI_MODEL=google/gemma-7b-it:free
```

Restart the app after changing provider.

## Using the AI Agent

- Type `@Agent` followed by your question in any chat room
- Example: `@Agent Summarize the main points of HTTP/2`

## Local Development

```bash
npm install
# create .env with one of the provider configs above
npm run dev
```

Open `http://localhost:3000` and try `@Agent ...`.

## Deployment to Vercel

- Set the same environment variables in your Vercel project settings
- Redeploy

### Important Notes

- **WebSocket Support:** Vercel doesn't natively support persistent WebSocket connections, but Socket.IO will fall back to polling transport when WebSockets aren't available
- **Serverless Limitations:** The app is configured to work with Vercel's serverless functions
- **CORS:** The app includes CORS configuration to allow connections from any origin
- **Socket.IO Client:** Uses CDN version to avoid serverless limitations
- **AI Agent:** Requires OpenAI API key to function
- **Transport:** Forced to use polling transport for serverless compatibility

### Troubleshooting

1. **If the chat doesn't work:**
   - Check the browser console for errors
   - Ensure the Socket.IO client is connecting properly
   - Verify that the `vercel.json` file is in the root directory

2. **If deployment fails:**
   - Check that all dependencies are in `package.json`
   - Ensure the `main` field in `package.json` points to `src/index.js`
   - Verify the `vercel.json` configuration is correct

3. **For WebSocket issues:**
   - The app is configured to use polling as a fallback
   - This ensures compatibility with Vercel's serverless environment

4. **If you get "404 Not Found" for socket.io.js:**
   - The app now uses a CDN version of Socket.IO client
   - Make sure the chat.html file includes the CDN script tag
   - Check that the CDN URL is accessible from your deployment region

5. **If AI Agent doesn't respond:**
   - Verify your OpenAI API key is correctly set in environment variables
   - Check that you have sufficient API credits
   - Ensure you're using the correct format: `@Agent your question`

6. **Socket.IO Connection Issues on Vercel:**
   - The app is configured to use polling transport only (no WebSockets)
   - Check browser console for connection errors
   - Verify your Vercel function timeout is set to 60 seconds
   - Test the health endpoint: `https://your-app.vercel.app/api/health`
   - If still failing, check Vercel function logs in the dashboard

## Project Structure

```
chat-app/
├── public/           # Static files (HTML, CSS, JS)
├── src/             # Server-side code
│   ├── index.js     # Main server file
│   └── utils/       # Utility functions
│       ├── messages.js
│       ├── users.js
│       └── aiAgent.js  # AI agent functionality
├── config.js        # Configuration file
├── package.json     # Dependencies and scripts
├── vercel.json      # Vercel configuration
└── README.md        # This file
```

## Technologies Used

- **Backend:** Node.js, Express, Socket.IO
- **Frontend:** HTML, CSS, JavaScript
- **Libraries:** bad-words (profanity filtering), moment.js (time formatting), Mustache (templating)
- **AI:** OpenAI GPT-3.5-turbo
- **Deployment:** Vercel

## License

ISC 