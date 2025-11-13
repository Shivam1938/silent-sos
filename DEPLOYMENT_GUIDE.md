# Silent SOS - Deployment & Physical Device Setup Guide

## 🚀 Quick Fix Summary

All issues have been fixed! Here's what was changed:

### ✅ Fixed Issues:

1. **Device ID Generation** - Fixed iOS vendor ID error on Android devices
   - Now uses persistent device ID stored in AsyncStorage
   - Better fallback mechanisms for all platforms

2. **Login/Logout Flow** - Properly resets navigation after logout
   - Fixed authentication state management
   - Navigation now correctly switches between Login and Home screens

3. **Location Tracking** - Improved accuracy for physical devices
   - Uses `BestForNavigation` accuracy mode
   - Updates every 10 seconds or every 5 meters
   - Better timeout handling

4. **Location Storage** - Properly tracks lastLocation in database
   - Added `lastLocation` and `lastUpdate` fields to SOS Event model
   - SMS alerts use most accurate location

5. **Physical Device Support** - Deployment ready
   - Server automatically detects and displays local IP
   - CORS properly configured
   - Better error handling

---

## 📱 Physical Device Setup (Step by Step)

### Step 1: Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (usually starts with 192.168.x.x)

**Mac/Linux:**
```bash
ifconfig
# or
ip addr
```

### Step 2: Update Mobile .env File

Open `mobile/.env` and set:
```
EXPO_PUBLIC_API_URL=http://YOUR_IP:4000
```

Example:
```
EXPO_PUBLIC_API_URL=http://192.168.1.87:4000
```

**Important:**
- Replace `YOUR_IP` with your actual IP from Step 1
- Ensure both phone and computer are on **same WiFi network**

### Step 3: Start Backend Server

```bash
cd server
npm install  # if not already done
npm run dev
```

The server will automatically display:
- Your local IP address
- Instructions for setting mobile .env

### Step 4: Start Mobile App

```bash
cd mobile
npm install  # if not already done
npm start
```

Then:
1. Scan QR code with Expo Go app on your phone
2. Or press `a` for Android / `i` for iOS

### Step 5: Test Connection

1. App should load without network errors
2. Try registering a new account
3. If it works, you're all set! 🎉

---

## 🔧 Troubleshooting

### Problem: "Network Error" on phone

**Solution:**
1. ✅ Check phone and computer are on same WiFi
2. ✅ Verify IP address in `mobile/.env` matches server console output
3. ✅ Ensure server is running (`npm run dev` in server folder)
4. ✅ Try restarting both server and mobile app

### Problem: Location not working / inaccurate

**Solution:**
1. ✅ Grant location permissions when app asks
2. ✅ Go to phone Settings → Apps → Expo Go → Permissions → Location (Allow all the time)
3. ✅ Try triggering SOS in an open area (better GPS signal)
4. ✅ Wait a few seconds after tapping SOS button

### Problem: Login not working after registration

**Solution:**
1. ✅ Make sure you're using the same 4-digit PIN
2. ✅ Check device ID is properly stored (app should remember it)
3. ✅ Try logging out and back in
4. ✅ Clear app data and re-register if needed

### Problem: Windows Firewall blocking connection

**Solution:**
Run PowerShell as Administrator:
```powershell
New-NetFirewallRule -DisplayName "Silent SOS Server" -Direction Inbound -LocalPort 4000 -Protocol TCP -Action Allow
```

Or manually:
1. Open Windows Defender Firewall
2. Advanced Settings → Inbound Rules → New Rule
3. Port → TCP → 4000 → Allow → All profiles

---

## 🚢 Production Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. **Set Environment Variables:**
   ```env
   NODE_ENV=production
   PORT=4000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key-min-16-chars
   TWILIO_ACCOUNT_SID=your-sid
   TWILIO_AUTH_TOKEN=your-token
   TWILIO_FROM_NUMBER=+1234567890
   CLIENT_BASE_URL=https://your-app-domain.com,https://your-mobile-app-domain.com
   ```

2. **Build and Deploy:**
   ```bash
   cd server
   npm run build
   npm start
   ```

3. **Update Mobile .env:**
   ```
   EXPO_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
   ```

### Mobile App Deployment

**For Expo (EAS Build):**
```bash
cd mobile
npx eas-cli build --platform android
# or
npx eas-cli build --platform ios
```

**For Standalone Build:**
```bash
cd mobile
expo prebuild
npx expo run:android
# or
npx expo run:ios
```

---

## 📋 Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/silent-sos
JWT_SECRET=your-super-secret-jwt-key-min-16-chars
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_FROM_NUMBER=+1234567890
CLIENT_BASE_URL=*
```

### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=http://192.168.1.87:4000
# For production: EXPO_PUBLIC_API_URL=https://your-backend-url.com
```

---

## ✅ Checklist for Physical Device

- [ ] Backend server running on `0.0.0.0:4000`
- [ ] Found computer's local IP address
- [ ] Updated `mobile/.env` with correct IP
- [ ] Phone and computer on same WiFi
- [ ] Expo app reloaded on phone
- [ ] Location permissions granted
- [ ] Tested registration
- [ ] Tested login with PIN
- [ ] Tested SOS trigger
- [ ] Tested location sharing

---

## 🎯 What's New in This Update

1. **Better Device ID Handling**
   - Persistent storage prevents re-registration issues
   - Works on all Android devices (no more iOS vendor ID errors)

2. **Improved Location**
   - More accurate GPS tracking
   - Faster updates (10 seconds / 5 meters)
   - Better handling on physical devices

3. **Fixed Auth Flow**
   - Proper logout functionality
   - Navigation resets correctly
   - State management improved

4. **Deployment Ready**
   - Automatic IP detection
   - Better error messages
   - Production-ready configurations

---

## 🆘 Still Having Issues?

1. **Check Server Console:**
   - Look for the IP address it displays
   - Ensure it matches your mobile .env

2. **Check Mobile Logs:**
   - Shake phone to open Expo menu
   - Check "Logs" for errors

3. **Network Test:**
   - On phone browser, try: `http://YOUR_IP:4000/api/health`
   - Should return: `{"status":"ok"}`
   - If not, firewall is blocking

4. **Restart Everything:**
   - Stop server (Ctrl+C)
   - Close Expo app completely
   - Restart server
   - Restart Expo
   - Reload app

---

**Ready to deploy! 🚀**

For production deployment, make sure to:
- Use HTTPS for backend
- Set proper CORS origins
- Use secure JWT secrets
- Configure Twilio properly
- Set up MongoDB Atlas for database

Good luck! 🛡️

