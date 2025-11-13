# 🚀 Deploying Silent SOS to Render

This guide will walk you through deploying the Silent SOS backend server to Render.

## Prerequisites

1. ✅ **GitHub Repository**: Your code should be pushed to GitHub (e.g., `https://github.com/Shivam1938/silent-sos`)
2. ✅ **Render Account**: Sign up at [render.com](https://render.com) (free tier available)
3. ✅ **MongoDB Atlas**: Set up a MongoDB database (free tier available at [mongodb.com/atlas](https://www.mongodb.com/atlas))
4. ✅ **Twilio Account**: Set up Twilio for SMS (get credentials from [twilio.com](https://www.twilio.com))

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

Make sure your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Fix TypeScript errors for Render deployment"
git push origin main
```

### Step 2: Create a Web Service on Render

1. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**:
   - If first time: Click "Connect GitHub" and authorize Render
   - Select your repository: `Shivam1938/silent-sos`

### Step 3: Configure the Service

Fill in the following settings:

#### Basic Settings:
- **Name**: `silent-sos-server` (or any name you prefer)
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `server` ⚠️ **IMPORTANT**: Set this to `server` since your server code is in a subdirectory
- **Runtime**: `Node`
- **Build Command**: `npm install` (Render will automatically run `postinstall` which runs `npm run build`)
- **Start Command**: `npm start`

#### Environment Variables:

Click "Add Environment Variable" and add these one by one:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/silent-sos?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-16-chars-here
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token-here
TWILIO_FROM_NUMBER=+1234567890
CLIENT_BASE_URL=*
```

**Important Notes:**
- `PORT`: ⚠️ **DO NOT SET THIS** - Render automatically sets the `PORT` environment variable. Your code will automatically use it via `process.env.PORT || 4000`
- `MONGODB_URI`: Get this from MongoDB Atlas → Connect → Connect your application
- `JWT_SECRET`: Generate a strong random string (minimum 16 characters). You can use: `openssl rand -hex 32`
- `TWILIO_*`: Get these from your Twilio Console → Account Info
- `CLIENT_BASE_URL`: Use `*` for development, or specific URLs for production (comma-separated)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will start building your application
3. Watch the build logs - it should:
   - Clone your repository
   - Run `npm install` in the `server` directory
   - Run `npm run build` (via postinstall script)
   - Start the server with `npm start`

### Step 5: Verify Deployment

Once deployed, you'll get a URL like: `https://silent-sos-server.onrender.com`

Test the health endpoint:
```bash
curl https://silent-sos-server.onrender.com/api/health
```

Should return: `{"status":"ok"}`

## Configuration Details

### Root Directory
Since your server code is in the `server/` subdirectory, you **must** set:
- **Root Directory**: `server`

This tells Render to run all commands from the `server` directory.

### Build Process
Render will:
1. Clone your repo
2. `cd` into the `server` directory (because of Root Directory setting)
3. Run `npm install`
4. Run `npm run build` (via `postinstall` script in package.json)
5. Run `npm start` which executes `node dist/index.js`

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | ⚠️ **DO NOT SET** - Render sets this automatically | (auto) |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens (min 16 chars) | `your-secret-key` |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | `ACxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | `your-token` |
| `TWILIO_FROM_NUMBER` | Twilio phone number | `+1234567890` |
| `CLIENT_BASE_URL` | CORS allowed origins | `*` or `https://app.com,https://mobile.com` |

## Troubleshooting

### Build Fails with TypeScript Errors

✅ **Fixed!** The TypeScript errors have been resolved. If you still see errors:
1. Make sure you've pushed the latest code to GitHub
2. Check the build logs in Render dashboard
3. Verify `Root Directory` is set to `server`

### "Cannot find module" Errors

- Make sure `Root Directory` is set to `server`
- Check that `package.json` exists in the `server` directory
- Verify all dependencies are in `package.json`

### Database Connection Fails

1. Check `MONGODB_URI` is correct
2. In MongoDB Atlas:
   - Go to Network Access → Add IP Address → Add `0.0.0.0/0` (allows all IPs)
   - Go to Database Access → Verify your user credentials

### Server Crashes on Start

1. Check the logs in Render dashboard
2. Verify all environment variables are set
3. Test locally first: `cd server && npm run build && npm start`

### Port Issues

Render automatically sets the `PORT` environment variable. Your code should use:
```typescript
const port = env.PORT || 4000;
```

This is already configured in your `server/src/index.ts`.

## Updating Your Deployment

After making changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically detect the push and redeploy.

## Free Tier Limitations

Render's free tier:
- ✅ Spins down after 15 minutes of inactivity
- ✅ First request after spin-down takes ~30 seconds (cold start)
- ✅ 750 hours/month free (enough for always-on if you're the only user)
- ✅ Automatic HTTPS
- ✅ Custom domain support

**For production**, consider upgrading to a paid plan for:
- Always-on service (no spin-down)
- Faster cold starts
- More resources

## Next Steps

After successful deployment:

1. **Update Mobile App**:
   - Update `mobile/.env`:
     ```
     EXPO_PUBLIC_API_URL=https://silent-sos-server.onrender.com
     ```

2. **Test the API**:
   ```bash
   # Health check
   curl https://silent-sos-server.onrender.com/api/health
   
   # Register (example)
   curl -X POST https://silent-sos-server.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"displayName":"Test","email":"test@example.com","password":"1234","deviceId":"test-device"}'
   ```

3. **Monitor Logs**:
   - Go to Render dashboard → Your service → Logs
   - Watch for errors or issues

## Security Checklist

Before going to production:

- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Set specific `CLIENT_BASE_URL` instead of `*`
- [ ] Enable MongoDB Atlas IP whitelisting
- [ ] Use HTTPS (Render provides this automatically)
- [ ] Keep dependencies updated
- [ ] Monitor logs regularly

## Support

If you encounter issues:
1. Check Render build logs
2. Check Render runtime logs
3. Test locally first
4. Verify all environment variables are set correctly

---

**Your deployment URL will be**: `https://your-service-name.onrender.com`

Good luck! 🚀

