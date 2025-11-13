# 🚀 Next Steps - Connect Mobile App to Deployed Server

Your backend is live! Now let's connect your mobile app to it.

## Step 1: Test Your Deployed Server ✅

First, verify your server is working:

**Option A: Browser Test**
1. Open: https://silent-sos.onrender.com/api/health
2. Should see: `{"status":"ok","timestamp":"..."}`

**Option B: Command Line Test**
```bash
curl https://silent-sos.onrender.com/api/health
```

## Step 2: Update Mobile App Configuration 📱

### Create/Update `.env` file in `mobile/` directory:

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Create `.env` file** (if it doesn't exist):
   ```bash
   # On Windows PowerShell
   New-Item -Path .env -ItemType File
   
   # Or just create it manually in your editor
   ```

3. **Add this line to `mobile/.env`:**
   ```
   EXPO_PUBLIC_API_URL=https://silent-sos.onrender.com
   ```

   **Important:** 
   - No quotes around the URL
   - No trailing slash
   - Use `https://` (not `http://`)

### Your `mobile/.env` should look like:
```
EXPO_PUBLIC_API_URL=https://silent-sos.onrender.com
```

## Step 3: Restart Your Mobile App 🔄

1. **Stop the current Expo server** (if running):
   - Press `Ctrl+C` in the terminal

2. **Clear cache and restart:**
   ```bash
   cd mobile
   npm start -- --clear
   ```

3. **Or if you prefer:**
   ```bash
   cd mobile
   npx expo start --clear
   ```

## Step 4: Test the Connection 🧪

1. **Open the app** on your device/emulator
2. **Try to register a new account:**
   - Enter display name, email, and PIN
   - Tap "Register"
   - Should connect to your deployed server

3. **Check for errors:**
   - If you see network errors, verify the `.env` file is correct
   - Make sure you restarted Expo after changing `.env`

## Step 5: Verify Environment Variables in Render 🔐

Make sure all these are set in your Render dashboard:

1. Go to: https://dashboard.render.com
2. Click on your service: `silent-sos` (or whatever you named it)
3. Go to **Environment** tab
4. Verify these are set:
   - ✅ `NODE_ENV=production`
   - ✅ `MONGODB_URI=your-mongodb-connection-string`
   - ✅ `JWT_SECRET=your-secret-min-16-chars`
   - ✅ `TWILIO_ACCOUNT_SID=AC...`
   - ✅ `TWILIO_AUTH_TOKEN=...`
   - ✅ `TWILIO_FROM_NUMBER=+1234567890`
   - ✅ `CLIENT_BASE_URL=*`

## Step 6: Test Full Flow 🎯

Test the complete app flow:

1. ✅ **Register** a new account
2. ✅ **Login** with your credentials
3. ✅ **Add contacts** (trusted contacts who will receive SOS alerts)
4. ✅ **Trigger SOS** (triple-tap the button)
5. ✅ **Verify SMS** is sent to your contacts
6. ✅ **Cancel SOS** when done

## Troubleshooting 🔧

### Mobile app can't connect to server

**Check 1: `.env` file location**
- Must be in `mobile/` directory (same level as `package.json`)
- File name is exactly `.env` (not `.env.txt` or `.env.example`)

**Check 2: Restart Expo**
- After changing `.env`, you MUST restart Expo
- Use `npm start -- --clear` to clear cache

**Check 3: Server URL**
- Should be: `https://silent-sos.onrender.com`
- No `http://`, no trailing `/`
- Check for typos

**Check 4: Server is running**
- Visit https://silent-sos.onrender.com/api/health in browser
- If it times out, server might be spinning up (free tier)

### Server returns 404

- This is normal! Your API routes are under `/api/*`
- Test: https://silent-sos.onrender.com/api/health (should work)

### "Service Unavailable" or Timeout

- **Free tier spins down** after 15 minutes of inactivity
- **First request** after spin-down takes ~30 seconds
- Wait a bit and try again
- Consider upgrading to paid plan for always-on service

### Database connection errors

1. Check `MONGODB_URI` in Render environment variables
2. Verify MongoDB Atlas:
   - Network Access → Add IP `0.0.0.0/0` (allows all)
   - Database Access → Verify user credentials

### SMS not sending

1. Check Twilio credentials in Render
2. Verify Twilio account has balance
3. Check Render logs for Twilio errors
4. Verify phone numbers include country code (e.g., `+91` for India)

## Quick Reference 📋

**Your Server URL:**
```
https://silent-sos.onrender.com
```

**API Endpoints:**
- Health: `GET /api/health`
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Contacts: `GET /api/contacts`, `POST /api/contacts`, `DELETE /api/contacts/:id`
- SOS: `POST /api/sos/trigger`, `POST /api/sos/heartbeat`, `POST /api/sos/cancel`

**Mobile `.env` file:**
```
EXPO_PUBLIC_API_URL=https://silent-sos.onrender.com
```

## What's Next? 🎉

Once everything is working:

1. ✅ Test on a physical device
2. ✅ Share with friends/family to test
3. ✅ Monitor Render logs for any issues
4. ✅ Consider upgrading to paid plan (optional, for always-on service)
5. ✅ Build production app with EAS Build (optional)

---

**Need Help?**
- Check Render logs: Dashboard → Your Service → Logs
- Check Expo logs: Shake device → View Logs
- Verify environment variables are set correctly

**You're all set! 🚀**

