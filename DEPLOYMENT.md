# Vercel Deployment Guide

## 🚀 **Deployment Steps**

### **1. Environment Variables Setup**

In your Vercel dashboard, go to **Project Settings → Environment Variables** and add:

#### **Required Variables:**
```
PUSHER_APP_ID=your_app_id_here
PUSHER_KEY=your_key_here
PUSHER_SECRET=your_secret_here
PUSHER_CLUSTER=your_cluster_here
```

#### **Optional Variables (for AI Agent):**
```
AI_PROVIDER=openai
AI_MODEL=gpt-3.5-turbo
OPENAI_API_KEY=your_openai_key_here
```

### **2. Build Configuration**

The `vercel.json` file is already configured correctly:
- ✅ **Entry point**: `src/index.js`
- ✅ **Node.js runtime**: `@vercel/node`
- ✅ **API routes**: All `/api/*` routes properly configured
- ✅ **Static files**: Served from `public/` directory

### **3. Common Build Issues & Solutions**

#### **Issue 1: Missing Dependencies**
```bash
# Make sure all dependencies are installed
npm install
```

#### **Issue 2: Environment Variables Not Set**
- Set all required environment variables in Vercel dashboard
- Redeploy after setting variables

#### **Issue 3: Port Configuration**
- The app uses `process.env.PORT` (Vercel sets this automatically)
- No manual port configuration needed

#### **Issue 4: File Path Issues**
- All file paths are relative to project root
- Static files served from `public/` directory

### **4. Testing Deployment**

#### **Health Check:**
```
GET https://your-app.vercel.app/api/health
```

#### **Pusher Config Check:**
```
GET https://your-app.vercel.app/api/pusher-config
```

### **5. Troubleshooting**

#### **If build fails:**
1. Check Vercel build logs for specific errors
2. Ensure all environment variables are set
3. Verify `package.json` has correct dependencies
4. Make sure `src/index.js` exports the app correctly

#### **If app doesn't work after deployment:**
1. Check browser console for errors
2. Verify Pusher credentials are correct
3. Test API endpoints individually
4. Check Vercel function logs

### **6. Local Testing**

```bash
# Install dependencies
npm install

# Set environment variables in .env file
cp .env.example .env
# Edit .env with your actual values

# Start development server
npm run dev
```

## 🎯 **Success Indicators**

✅ **Build succeeds** in Vercel dashboard  
✅ **Health check** returns `{"status":"ok"}`  
✅ **Pusher config** returns your credentials  
✅ **Chat interface** loads without errors  
✅ **Real-time messaging** works between users  

## 📞 **Support**

If you continue to have issues:
1. Check Vercel build logs
2. Verify all environment variables are set
3. Test locally first
4. Check browser console for client-side errors
