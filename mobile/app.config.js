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
      ],
      package: 'com.silentsos.app',
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/favicon.png',
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000',
      eas: {
        projectId: '00000000-0000-0000-0000-000000000000',
      },
    },
    updates: {
      url: 'https://u.expo.dev/00000000-0000-0000-0000-000000000000',
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

