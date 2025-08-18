# Pusher Integration Setup Guide

## Step 1: Get Pusher Credentials

1. **Create Pusher Account**
   - Go to [https://pusher.com/](https://pusher.com/)
   - Sign up for a free account
   - Create a new Channels app

2. **Get Your Credentials**
   - In your Pusher dashboard, go to "App Keys"
   - Copy the following values:
     - **App ID** (e.g., `1234567`)
     - **Key** (e.g., `abcdef123456`)
     - **Secret** (e.g., `xyz789def456`)
     - **Cluster** (e.g., `us2`, `eu`, `ap1`)

## Step 2: Configure Environment Variables

### Local Development
Create a `.env` file in your project root:
```bash
# Pusher Configuration
PUSHER_APP_ID=your_app_id_here
PUSHER_KEY=your_key_here
PUSHER_SECRET=your_secret_here
PUSHER_CLUSTER=your_cluster_here

# AI Configuration (existing)
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key_here
```

### Vercel Deployment
In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add the same variables as above
3. Redeploy your project

## Step 3: Test the Integration

1. **Start locally:**
   ```bash
   npm run dev
   ```

2. **Test the chat:**
   - Open `http://localhost:3000`
   - Join a room
   - Send messages
   - Test AI agent with `@Agent your question`

3. **Deploy to Vercel:**
   - Push your changes to GitHub
   - Vercel will automatically redeploy
   - Test the deployed version

## Step 4: Verify Everything Works

### ✅ **What Should Work:**
- Real-time messaging between users
- User join/leave notifications
- Room user list updates
- AI agent responses
- Location sharing
- No connection errors in browser console

### 🔧 **Troubleshooting:**

**If you see "YOUR_PUSHER_KEY" or "YOUR_PUSHER_CLUSTER" errors:**
- The app now automatically fetches credentials from the server
- Make sure your environment variables are set correctly
- Check that the `/api/pusher-config` endpoint returns your credentials

**If messages aren't sending:**
- Check browser console for errors
- Verify Pusher credentials are correct
- Ensure environment variables are set

**If real-time updates aren't working:**
- Check Pusher dashboard for connection status
- Verify cluster region matches your location
- Check browser console for subscription errors

**If AI agent isn't responding:**
- Verify OpenAI/OpenRouter credentials
- Check server logs for AI errors

## How It Works Now

The app now uses a **dynamic configuration system**:

1. **Server-side**: Environment variables store your Pusher credentials securely
2. **Client-side**: JavaScript fetches credentials from `/api/pusher-config` endpoint
3. **Automatic**: No manual configuration needed in the client code
4. **Secure**: Only the public key and cluster are exposed (this is safe)

## Pusher Free Tier Limits

- **200,000 messages/day**
- **100 concurrent connections**
- **Unlimited channels**
- **Perfect for small to medium chat apps**

## Security Notes

- Never commit your `.env` file to git
- Keep your Pusher secret secure
- The `.gitignore` file is already configured
- Use environment variables for all sensitive data
- Only the public key and cluster are exposed to the client (this is normal and safe)

## Benefits of Pusher over Socket.IO on Vercel

- ✅ **No serverless limitations**
- ✅ **Reliable WebSocket connections**
- ✅ **Built-in scaling**
- ✅ **Better error handling**
- ✅ **No connection timeouts**
- ✅ **Works perfectly with Vercel**
- ✅ **Dynamic configuration** (no manual client updates needed)
