# Silent SOS

Silent SOS is a hackathon-ready safety platform that combines a React Native mobile app with a Node.js backend. Users can configure trusted contacts, trigger an SOS (via in-app triple tap or a hardware pattern), and stream their live GPS coordinates to contacts through SMS alerts.

## Project Structure

- `server/` – Node.js + Express API backed by MongoDB and Twilio for messaging.
- `mobile/` – Expo-based React Native client for Android/iOS.

## Quick Start

### 1. Backend

```bash
cd server
npm install
cp env.sample .env   # update secrets
npm run dev
```

Services used:

- **MongoDB Atlas** (or any Mongo instance) for storing users, contacts, and SOS events.
- **Twilio** for SMS alerts.

### 2. Mobile App

```bash
cd mobile
npm install
# set EXPO_PUBLIC_API_URL in .env if the API is not on localhost
npm run android  # or npm run ios / npm run web
```

For Android emulators use `http://10.0.2.2:4000` as the API URL. Physical devices must reach your computer over the LAN.

## Key Flows

1. **Registration** – App registers a device ID with the backend and stores the auth token.
2. **Contacts** – CRUD operations for trusted contacts, synced with the backend.
3. **SOS Trigger** – Triple-tap button (hardware pattern hook-ready) sends an SOS, Twilio pushes SMS with a live Google Maps link, and periodic heartbeats update the location.
4. **Cancellation** – User can cancel an active SOS; updates propagate to contacts.

## Hackathon Tips

- Seed the database with demo contacts and Twilio numbers before presenting.
- Record a short screen capture of the trigger flow for backup during judging.
- Consider adding a web dashboard (Socket.IO hooks already exposed) if time permits.
- Hardware volume button detection requires a native module; run `expo prebuild` and integrate `react-native-volume-key-listener` post-demo if desired.

Good luck at the hackathon—ship fast and stay safe! 🛡️


cd server - npm run dev
cd mobile - npm run android

