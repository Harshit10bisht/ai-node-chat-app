# Vercel Deployment Troubleshooting Guide

## 🚨 **Immediate Actions to Fix Deployment Failure**

### **1. Set Environment Variables (MOST IMPORTANT)**

Go to your **Vercel Dashboard → Project Settings → Environment Variables** and add:

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

### **2. Redeploy After Setting Variables**
- Click **"Redeploy"** in Vercel dashboard
- Or push a new commit to trigger automatic deployment

## 🔍 **How to Check What's Wrong**

### **1. Check Vercel Build Logs**
1. Go to Vercel Dashboard → Your Project
2. Click on the failed deployment
3. Check the **"Build Logs"** tab
4. Look for specific error messages

### **2. Test Health Endpoint**
After deployment, test:
```
GET https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-XX...",
  "pusher": {
    "configured": true,
    "hasKey": true,
    "hasCluster": true
  },
  "ai": {
    "configured": true,
    "provider": "openai"
  }
}
```

### **3. Test Pusher Config Endpoint**
```
GET https://your-app.vercel.app/api/pusher-config
```

## 🛠️ **Common Issues & Solutions**

### **Issue 1: "Module not found" errors**
**Solution:** All dependencies are properly configured in `package.json`

### **Issue 2: "Environment variables not set"**
**Solution:** Set the required environment variables in Vercel dashboard

### **Issue 3: "Pusher not configured"**
**Solution:** 
1. Get Pusher credentials from [pusher.com](https://pusher.com)
2. Set all 4 Pusher environment variables
3. Redeploy

### **Issue 4: "Function timeout"**
**Solution:** The app is configured for 30-second timeout, which should be sufficient

### **Issue 5: "Build failed"**
**Solution:** 
1. Check build logs for specific errors
2. Ensure all files are committed to git
3. Verify `vercel.json` configuration

## 📋 **Pre-Deployment Checklist**

- ✅ **Environment variables set** in Vercel dashboard
- ✅ **All files committed** to git repository
- ✅ **vercel.json** properly configured
- ✅ **package.json** has correct dependencies
- ✅ **src/index.js** exports app correctly
- ✅ **No syntax errors** in code

## 🧪 **Local Testing Before Deployment**

```bash
# Test locally first
npm install
npm start

# Test health endpoint
curl http://localhost:3000/api/health

# Test Pusher config endpoint
curl http://localhost:3000/api/pusher-config
```

## 🎯 **Success Indicators**

✅ **Build succeeds** in Vercel dashboard  
✅ **Health endpoint** returns status "ok"  
✅ **Pusher config** returns your credentials  
✅ **No errors** in Vercel function logs  
✅ **App loads** without console errors  

## 🆘 **If Still Failing**

1. **Check Vercel build logs** for specific error messages
2. **Verify environment variables** are set correctly
3. **Test locally** to ensure code works
4. **Check Vercel function logs** for runtime errors
5. **Contact Vercel support** if build logs don't show the issue

## 📞 **Quick Fix Commands**

```bash
# If you need to test locally without env vars
node -e "console.log('App loads:', require('./src/index.js') ? 'YES' : 'NO')"

# Check if all required files exist
ls -la src/ public/ package.json vercel.json
```

## 🔧 **Emergency Fallback**

If deployment continues to fail, the app now has **graceful error handling**:
- ✅ **App will start** even without environment variables
- ✅ **Health endpoint** will show what's missing
- ✅ **No crashes** from missing configuration
- ✅ **Helpful error messages** for debugging

**The most likely cause of your deployment failure is missing environment variables. Set them in Vercel dashboard and redeploy!** 🚀
