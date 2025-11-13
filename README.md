# Silent SOS 🚨

A comprehensive emergency alert system that allows users to silently trigger SOS alerts and share their live location with trusted contacts via SMS. Built with React Native (Expo) for the mobile app and Node.js/TypeScript for the backend.

## Overview

Silent SOS is designed for emergency situations where users need to quickly alert their trusted contacts without making noise or drawing attention. The app features a simple triple-tap activation mechanism, automatic location tracking, and instant SMS notifications with live Google Maps links.

## Features

### Core Functionality

- **Triple-Tap SOS Trigger**: Quick and easy activation by tapping the SOS button three times within 1.8 seconds
- **Live Location Tracking**: Continuous GPS tracking that sends periodic location updates to trusted contacts
- **SMS Alerts**: Instant SMS notifications via Twilio with formatted messages containing:
  - Emergency alert indicator
  - Current GPS coordinates
  - Direct Google Maps link for one-tap navigation
- **Trusted Contacts Management**: Add, view, and remove trusted contacts who will receive SOS alerts
- **User Authentication**: Secure registration and login system with JWT tokens
- **Real-time Updates**: Socket.IO integration for real-time event updates (ready for web dashboard)
- **SOS Cancellation**: Ability to cancel active SOS alerts when situation is resolved
- **Background Location Tracking**: Continues tracking location even when app is in background
- **Pattern Recognition**: Custom hook for pattern-based activation (extensible for hardware buttons)

### Mobile App Features

- Dark-themed, modern UI with smooth animations
- Haptic feedback on button interactions
- Status indicators for active SOS events
- Last update timestamp tracking
- Error handling with user-friendly messages
- Persistent authentication using AsyncStorage
- Automatic location permissions handling

### Backend Features

- RESTful API with Express.js
- MongoDB database for storing users, contacts, and SOS events
- JWT-based authentication with secure password hashing (bcrypt)
- Environment-based configuration with validation (Zod)
- Error handling middleware
- Request logging
- Health check endpoint
- CORS support for mobile clients

## Tech Stack

### Mobile App
- **React Native** (`~0.81.5`) - Cross-platform mobile framework
- **Expo** (`~54.0.23`) - Development platform and tooling
- **React Navigation** (`^7.1.19`) - Navigation library
- **Expo Location** (`~19.0.7`) - GPS and location services
- **Expo Background Fetch** (`~14.0.7`) - Background task execution
- **Expo Task Manager** (`~14.0.8`) - Background task management
- **Expo Haptics** (`~15.0.7`) - Vibration feedback
- **AsyncStorage** (`2.2.0`) - Local data persistence
- **Axios** (`^1.13.2`) - HTTP client
- **React Context API** - State management for auth and SOS

### Backend Server
- **Node.js** - Runtime environment
- **Express.js** (`^4.19.2`) - Web framework
- **TypeScript** (`^5.5.3`) - Type-safe JavaScript
- **MongoDB** with **Mongoose** (`^8.5.0`) - Database and ODM
- **Twilio** (`^4.22.1`) - SMS messaging service
- **Socket.IO** (`^4.7.5`) - Real-time communication
- **JWT** (`^9.0.2`) - Authentication tokens
- **bcryptjs** (`^2.4.3`) - Password hashing
- **Zod** (`^3.23.8`) - Schema validation
- **Morgan** (`^1.10.0`) - HTTP request logger
- **CORS** (`^2.8.5`) - Cross-origin resource sharing

## Project Structure

```
silent sos/
├── mobile/                    # React Native Expo app
│   ├── src/
│   │   ├── components/        # Reusable components (SosButton)
│   │   ├── context/           # React Context providers (Auth, SOS)
│   │   ├── hooks/             # Custom hooks (usePatternActivator)
│   │   ├── navigation/        # Navigation setup
│   │   ├── screens/           # App screens (Home, Contacts, Login, Register)
│   │   ├── services/          # API service functions
│   │   ├── storage/           # Local storage utilities
│   │   └── utils/             # Helper functions
│   ├── assets/                # Images and icons
│   ├── app.config.js          # Expo configuration
│   └── package.json
│
└── server/                    # Node.js/TypeScript backend
    ├── src/
    │   ├── config/            # Database and environment config
    │   ├── controllers/       # Route controllers (auth, contacts, sos)
    │   ├── middlewares/       # Express middlewares (auth, error handling)
    │   ├── models/            # Mongoose models (User, Contact, SosEvent)
    │   ├── routes/            # API route definitions
    │   ├── services/          # Business logic (auth, notifications, Twilio)
    │   ├── types/             # TypeScript type definitions
    │   ├── utils/             # Utility functions
    │   ├── app.ts             # Express app setup
    │   └── index.ts           # Server entry point
    └── package.json
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database (local or MongoDB Atlas)
- Twilio account with phone number
- Expo CLI (install with `npm install -g expo-cli`)
- For mobile development: Android Studio (for Android) or Xcode (for iOS)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/silent-sos
JWT_SECRET=your-super-secret-jwt-key-min-16-chars
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_FROM_NUMBER=+1234567890
CLIENT_BASE_URL=http://localhost:4000
```

4. Update the MongoDB URI with your connection string (use MongoDB Atlas connection string for cloud database)

5. Get Twilio credentials:
   - Sign up at [Twilio](https://www.twilio.com)
   - Get your Account SID and Auth Token from the dashboard
   - Get a phone number from Twilio (for sending SMS)

6. Update `JWT_SECRET` with a strong random string (minimum 16 characters)

7. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:4000` (or the PORT specified in .env)

### Mobile App Setup

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `mobile` directory:
```env
EXPO_PUBLIC_API_URL=http://localhost:4000
```

**Important Notes:**
- For **Android Emulator**: Use `http://10.0.2.2:4000` instead of localhost
- For **Physical Device**: Use your computer's local IP address (e.g., `http://192.168.1.100:4000`)
  - Find your IP: `ipconfig` on Windows, `ifconfig` on Mac/Linux
- For **iOS Simulator**: `http://localhost:4000` should work

4. Start the Expo development server:
```bash
npm start
```

5. Run on your preferred platform:
```bash
npm run android    # For Android
npm run ios        # For iOS
npm run web        # For web browser
```

Or scan the QR code with Expo Go app on your phone.

## Usage Guide

### First Time Setup

1. `cd server` → `npm run dev`
2. `cd mobile` → `npm run android`

1. **Register an Account**
   - Open the app and tap on "Register"
   - Enter your display name, email, and password
   - Tap "Register" to create your account

2. **Add Trusted Contacts**
   - Navigate to the "Contacts" tab
   - Fill in the contact form:
     - Name (required)
     - Phone number with country code (required, e.g., +91 99999 99999)
     - Relationship (optional)
   - Tap "Add contact"
   - Repeat for all trusted contacts
   - **Recommendation**: Add at least 2-3 trusted contacts

### Triggering an SOS

1. **Using the App Button**:
   - Go to the Home screen
   - Quickly tap the red SOS button **three times** within 1.8 seconds
   - The button will turn dark green, indicating SOS is active
   - Your contacts will receive SMS alerts immediately

2. **During Active SOS**:
   - The app continuously tracks your location
   - Updates are sent to the server periodically
   - You can see the last update time on the screen
   - Tap "Cancel SOS" when the situation is resolved

### What Happens When SOS is Triggered?

1. App captures current GPS location
2. Creates an SOS event in the database
3. Sends SMS to all trusted contacts via Twilio
4. SMS includes:
   - Emergency alert message
   - Current coordinates
   - Google Maps link (one-tap navigation)
5. Background tracking continues to send location updates
6. Contacts receive real-time location information

### Managing Contacts

- **Add Contact**: Go to Contacts screen → Fill form → Tap "Add contact"
- **Remove Contact**: Tap "Remove" next to any contact → Confirm deletion
- Contacts are synced with the backend and persist across app sessions

### Canceling an SOS

- When SOS is active, you'll see a "Cancel SOS" button
- Tap it and confirm to cancel the active alert
- All tracking stops immediately
- Contacts can be notified of cancellation (optional feature)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (optional)

### Contacts
- `GET /api/contacts` - Get all contacts (authenticated)
- `POST /api/contacts` - Add new contact (authenticated)
- `DELETE /api/contacts/:id` - Remove contact (authenticated)

### SOS
- `POST /api/sos/trigger` - Trigger SOS event (authenticated)
- `POST /api/sos/heartbeat` - Send location update (authenticated)
- `POST /api/sos/cancel` - Cancel active SOS (authenticated)

### Health
- `GET /api/health` - Health check endpoint

## Environment Variables

### Server (.env)
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio authentication token
- `TWILIO_FROM_NUMBER` - Twilio phone number for SMS
- `CLIENT_BASE_URL` - Base URL for CORS configuration

### Mobile (.env)
- `EXPO_PUBLIC_API_URL` - Backend API URL

## Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication system
- **Environment Variables**: Sensitive data stored in .env files
- **Input Validation**: Zod schema validation on backend
- **CORS Configuration**: Controlled cross-origin access
- **Secure HTTP**: HTTPS recommended for production

## Database Schema

### User Model
- `displayName` - User's display name
- `email` - Unique email address
- `password` - Hashed password
- `deviceId` - Device identifier
- `createdAt` - Account creation timestamp

### Contact Model
- `name` - Contact's name
- `phoneNumber` - Phone number with country code
- `relationship` - Optional relationship info
- `user` - Reference to User
- `createdAt` - Creation timestamp

### SOS Event Model
- `user` - Reference to User
- `status` - Event status (active/cancelled)
- `locations` - Array of location updates with timestamps
- `lastLocation` - Most recent location
- `lastUpdate` - Last update timestamp
- `cancelledReason` - Reason for cancellation (if applicable)
- `cancelledAt` - Cancellation timestamp
- `createdAt` - Event creation timestamp

## Troubleshooting

### Mobile App Issues

**Location permissions not working:**
- Ensure location permissions are granted in device settings
- For Android: Check app permissions in Settings → Apps → Silent SOS
- For iOS: Settings → Privacy → Location Services → Silent SOS

**Cannot connect to backend:**
- Verify `EXPO_PUBLIC_API_URL` is correct in `.env`
- For emulator: Use `http://10.0.2.2:4000`
- For physical device: Use your computer's local IP
- Ensure backend server is running
- Check firewall settings

**SOS button not working:**
- Make sure you're tapping quickly (within 1.8 seconds)
- Ensure location services are enabled
- Check network connection

### Backend Issues

**Database connection failed:**
- Verify MongoDB is running (if local)
- Check `MONGODB_URI` in `.env`
- For Atlas: Ensure IP is whitelisted and credentials are correct

**Twilio SMS not sending:**
- Verify Twilio credentials in `.env`
- Check Twilio account balance
- Ensure phone number format includes country code (e.g., +91)
- Verify Twilio phone number is verified

**JWT errors:**
- Ensure `JWT_SECRET` is at least 16 characters
- Clear app storage and re-login if tokens are corrupted

## Development

### Running in Development Mode

**Backend:**
```bash
cd server
npm run dev    # Runs with tsx watch for hot reload
```

**Mobile:**
```bash
cd mobile
npm start      # Starts Expo dev server
```

### Building for Production

**Backend:**
```bash
cd server
npm run build  # Compiles TypeScript to JavaScript
npm start      # Runs compiled code
```

**Mobile:**
```bash
cd mobile
expo build:android    # Build Android APK
expo build:ios        # Build iOS IPA
```

## Future Enhancements

- Hardware button integration (volume keys)
- Web dashboard for monitoring SOS events
- Push notifications (in addition to SMS)
- Audio recording during SOS
- Photo capture on trigger
- Multiple SOS modes (silent, loud, etc.)
- Emergency service integration (911, etc.)
- SOS history and analytics
- Contact groups/categories

## Contributing

This is a project built for hackathons and learning. Feel free to fork, modify, and extend as needed!

## License

This project is open source and available for educational purposes.

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the code comments for implementation details
- Ensure all dependencies are correctly installed

---

**Stay Safe! 🛡️**

Built with ❤️ for emergency situations. Remember to test the app thoroughly before relying on it in real emergencies.
