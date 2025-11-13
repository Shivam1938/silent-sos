import * as Application from 'expo-application';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './apiClient';

const DEVICE_ID_KEY = '@silent_sos_device_id';

const resolveDeviceId = async () => {
  try {
    // Try to get stored device ID first
    const storedId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (storedId) {
      return storedId;
    }

    // Generate new device ID
    let deviceId = null;

    if (Platform.OS === 'android') {
      // For Android, use androidId (available synchronously)
      deviceId = Application.androidId;
    } else if (Platform.OS === 'ios') {
      // For iOS, try to get vendor ID
      try {
        deviceId = await Application.getIosIdForVendorAsync();
      } catch (error) {
        console.warn('Failed to get iOS vendor ID', error);
      }
    }

    // Fallback to installation ID or generate new one
    if (!deviceId) {
      deviceId = Application.installationId;
    }

    // Final fallback - generate UUID-like ID
    if (!deviceId) {
      deviceId = `device-${Platform.OS}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }

    // Store it for future use
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    return deviceId;
  } catch (error) {
    console.error('Error resolving device ID:', error);
    // Emergency fallback
    return `fallback-${Platform.OS}-${Date.now()}`;
  }
};

export const registerDevice = async ({ displayName, pin }) => {
  const deviceId = await resolveDeviceId();
  const response = await apiClient.post('/api/auth/register', {
    deviceId,
    displayName,
    pin,
  });
  return response.data;
};

export const loginDevice = async ({ pin }) => {
  const deviceId = await resolveDeviceId();
  const response = await apiClient.post('/api/auth/login', {
    deviceId,
    pin,
  });
  return response.data;
};

