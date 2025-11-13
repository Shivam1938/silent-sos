# ✅ Verify Your Render Deployment

Your server is now live at: **https://silent-sos.onrender.com**

## Quick Verification

### 1. Test Health Endpoint

Open in browser or run:
```bash
curl https://silent-sos.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-13T18:34:41.687Z"
}
```

### 2. Test API Endpoints

**Register a test user:**
```bash
curl -X POST https://silent-sos.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Test User",
    "email": "test@example.com",
    "password": "1234",
    "deviceId": "test-device-123"
  }'
```

**Expected response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "displayName": "Test User",
    "email": "test@example.com"
  }
}
```

## About the 404 Errors

The 404 errors you see in logs for `GET /` are **normal and expected**:
- Your API routes are under `/api/*` (e.g., `/api/health`, `/api/auth`)
- There's no root route (`/`), so requests to the base URL return 404
- This is fine - your API endpoints work correctly

## Update Mobile App

Now update your mobile app to use the deployed server:

1. **Edit `mobile/.env`:**
   ```
   EXPO_PUBLIC_API_URL=https://silent-sos.onrender.com
   ```

2. **Restart your mobile app:**
   ```bash
   cd mobile
   npm start
   ```

## Important Notes

### Free Tier Behavior
- ⚠️ **Spins down after 15 minutes** of inactivity
- ⚠️ **First request after spin-down** takes ~30 seconds (cold start)
- This is normal for Render's free tier

### Port Configuration
The server logs show "port 4000" but Render handles port mapping internally. Your service is correctly configured.

### Environment Variables
Make sure all these are set in Render dashboard:
- ✅ `NODE_ENV=production`
- ✅ `MONGODB_URI=your-connection-string`
- ✅ `JWT_SECRET=your-secret`
- ✅ `TWILIO_ACCOUNT_SID=your-sid`
- ✅ `TWILIO_AUTH_TOKEN=your-token`
- ✅ `TWILIO_FROM_NUMBER=+1234567890`
- ✅ `CLIENT_BASE_URL=*`

## Testing Checklist

- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Mobile app connects to deployed server
- [ ] SOS trigger works end-to-end
- [ ] SMS notifications are sent

## Troubleshooting

### "Service Unavailable" or Timeout
- Service might be spinning up (free tier)
- Wait 30 seconds and try again
- Check Render dashboard → Logs

### Database Connection Errors
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas → Network Access (allow all IPs: `0.0.0.0/0`)
- Verify database user credentials

### SMS Not Sending
- Check Twilio credentials in environment variables
- Verify Twilio account has balance
- Check Render logs for Twilio errors

## Next Steps

1. ✅ Test all API endpoints
2. ✅ Update mobile app `.env` file
3. ✅ Test full flow (register → login → add contacts → trigger SOS)
4. ✅ Monitor Render logs for any issues
5. ✅ Consider upgrading to paid plan for always-on service (optional)

---

**Your API Base URL:** `https://silent-sos.onrender.com`

**API Endpoints:**
- Health: `GET /api/health`
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Contacts: `GET /api/contacts`, `POST /api/contacts`, `DELETE /api/contacts/:id`
- SOS: `POST /api/sos/trigger`, `POST /api/sos/heartbeat`, `POST /api/sos/cancel`

🎉 **Deployment Successful!**

