import 'dotenv/config';

export default {
  expo: {
    name: 'Silent SOS',
    slug: 'silent-sos',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'silentsos',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0f172a',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0f172a',
      },
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'ACCESS_BACKGROUND_LOCATION',
        'FOREGROUND_SERVICE',
        'RECEIVE_BOOT_COMPLETED',
        'VIBRATE',
        'INTERNET',
      ],
      package: 'com.silentsos.app',
      usesCleartextTraffic: false, // Only HTTPS
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/favicon.png',
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://silent-sos.onrender.com',
      // Project ID will be added automatically by EAS after running 'eas init'
      // Only include if you have a valid UUID project ID
      ...(process.env.EXPO_PROJECT_ID && 
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(process.env.EXPO_PROJECT_ID)
        ? {
            eas: {
              projectId: process.env.EXPO_PROJECT_ID,
            },
          }
        : {}),
    },
    updates: {
      ...(process.env.EXPO_PROJECT_ID && 
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(process.env.EXPO_PROJECT_ID)
        ? {
            url: `https://u.expo.dev/${process.env.EXPO_PROJECT_ID}`,
            fallbackToCacheTimeout: 0,
          }
        : {
            fallbackToCacheTimeout: 0,
          }),
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    plugins: [
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow Silent SOS to access your location so we can share it during an emergency.',
        },
      ],
      [
        'expo-task-manager',
        {
          preventBackgroundTermination: true,
          foregroundService: {
            notificationTitle: 'Silent SOS',
            notificationBody: 'Sharing your live location with trusted contacts.',
          },
        },
      ],
    ],
  },
};

