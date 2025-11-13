# Free Expo Deployment Guide 🚀

This guide will help you deploy your Silent SOS app using Expo's free tier.

## Prerequisites

1. **Expo Account**: Sign up for free at [expo.dev](https://expo.dev)
2. **Expo CLI**: Install globally (if not already installed)
   ```bash
   npm install -g eas-cli
   ```

## Step 1: Login to Expo

```bash
cd mobile
npx expo login
```

Enter your Expo account credentials.

## Step 2: Initialize EAS (Expo Application Services)

```bash
npx eas init
```

This will:
- Link your project to your Expo account
- Create a project ID (you'll see it in the output)
- Set up EAS configuration

## Step 3: Get Your Project ID

After running `eas init`, you'll get a project ID. Copy it and add it to your `.env` file:

1. Create or update `.env` file in the `mobile` directory:
```env
EXPO_PUBLIC_API_URL=https://your-backend-url.com
EXPO_PROJECT_ID=your-project-id-here
```

**Important**: Replace `your-backend-url.com` with your deployed backend URL (or keep localhost for development).

## Step 4: Update app.config.js

The project ID will be automatically used from your `.env` file. If you prefer to hardcode it, you can update `app.config.js` directly.

## Step 5: Build Your App (Free Tier)

### For Android APK (Free - Internal Distribution)

```bash
npx eas build --platform android --profile preview
```

This will:
- Build an APK file
- Upload it to Expo servers
- Give you a download link

**Free Tier Limits**:
- ✅ Unlimited preview builds (internal distribution)
- ✅ 30 builds per month for production
- ✅ Builds run on Expo's servers (no local setup needed)

### For iOS (Requires Apple Developer Account - $99/year)

iOS builds require an Apple Developer account. For free testing, you can use:
- iOS Simulator builds (free)
- Expo Go app (free, but limited features)

## Step 6: Install and Test

1. Download the APK from the build link
2. Install on your Android device
3. Test the app functionality

## Step 7: Publish Updates (OTA - Over The Air)

After making code changes, you can push updates without rebuilding:

```bash
npx expo publish
```

Or with EAS:

```bash
npx eas update --branch production --message "Update description"
```

**Free Tier**: Unlimited OTA updates! 🎉

## Alternative: Use Expo Go (Completely Free)

For development and testing, you can use Expo Go:

```bash
npx expo start
```

Then scan the QR code with:
- **Android**: Expo Go app from Play Store
- **iOS**: Camera app (opens in Expo Go)

**Limitations of Expo Go**:
- Some native modules may not work
- Background location tracking may be limited
- Not suitable for production deployment

## Deployment Options Summary

### Option 1: Expo Go (Free, Development Only)
- ✅ Completely free
- ✅ Instant updates
- ❌ Limited native features
- ❌ Not for production

### Option 2: EAS Build Preview (Free Tier)
- ✅ Free preview builds
- ✅ Full native features
- ✅ APK download
- ✅ 30 production builds/month
- ✅ Unlimited OTA updates

### Option 3: EAS Build Production (Free Tier)
- ✅ Production-ready builds
- ✅ App Store/Play Store ready
- ⚠️ 30 builds/month limit
- ⚠️ iOS requires Apple Developer account ($99/year)

## Environment Variables

Make sure your `.env` file has:

```env
EXPO_PUBLIC_API_URL=https://your-deployed-backend.com
EXPO_PROJECT_ID=your-expo-project-id
```

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `app.config.js` is valid
- Check Expo status: https://status.expo.dev

### Can't Login
- Make sure you have an Expo account
- Try: `npx expo logout` then `npx expo login` again

### Project ID Not Found
- Run `npx eas init` again
- Check your `.env` file has `EXPO_PROJECT_ID`

## Next Steps

1. **Deploy Backend**: Make sure your backend is deployed (e.g., Heroku, Railway, Render)
2. **Update API URL**: Set `EXPO_PUBLIC_API_URL` to your production backend
3. **Build Production APK**: Use `npx eas build --platform android --profile production`
4. **Distribute**: Share the APK or publish to Play Store

## Free Tier Limits

- ✅ Unlimited preview builds
- ✅ 30 production builds per month
- ✅ Unlimited OTA updates
- ✅ Free hosting for Expo Go
- ⚠️ Builds may take 10-20 minutes
- ⚠️ No priority support

## Need More?

- Expo Docs: https://docs.expo.dev
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Community: https://forums.expo.dev

---

**Happy Deploying! 🚀**

