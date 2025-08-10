# Socket.IO Chat App

A real-time chat application built with Node.js, Express, and Socket.IO.

## Features

- Real-time messaging
- Room-based chat
- User join/leave notifications
- Location sharing
- Profanity filtering
- Responsive design

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Deployment to Vercel

### Prerequisites

1. Make sure your code is pushed to a GitHub repository
2. Have a Vercel account (sign up at [vercel.com](https://vercel.com))

### Deployment Steps

1. **Connect your GitHub repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Node.js project

2. **Configure the deployment:**
   - **Framework Preset:** Node.js
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** Leave empty (not needed for this project)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

3. **Environment Variables (if needed):**
   - No environment variables are required for basic functionality
   - The app uses `process.env.PORT` which Vercel provides automatically

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a URL like `https://your-app-name.vercel.app`

### Important Notes

- **WebSocket Support:** Vercel doesn't natively support persistent WebSocket connections, but Socket.IO will fall back to polling transport when WebSockets aren't available
- **Serverless Limitations:** The app is configured to work with Vercel's serverless functions
- **CORS:** The app includes CORS configuration to allow connections from any origin
- **Socket.IO Client:** Uses CDN version to avoid serverless limitations

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

## Project Structure

```
chat-app/
├── public/           # Static files (HTML, CSS, JS)
├── src/             # Server-side code
│   ├── index.js     # Main server file
│   └── utils/       # Utility functions
├── package.json     # Dependencies and scripts
├── vercel.json      # Vercel configuration
└── README.md        # This file
```

## Technologies Used

- **Backend:** Node.js, Express, Socket.IO
- **Frontend:** HTML, CSS, JavaScript
- **Libraries:** bad-words (profanity filtering), moment.js (time formatting), Mustache (templating)
- **Deployment:** Vercel

## License

ISC 