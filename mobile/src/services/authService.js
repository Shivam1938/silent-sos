import * as Application from 'expo-application';
import { apiClient } from './apiClient';

const resolveDeviceId = async () => {
  if (Application.androidId) {
    return Application.androidId;
  }
  try {
    const iosId = await Application.getIosIdForVendorAsync();
    if (iosId) {
      return iosId;
    }
  } catch (error) {
    console.warn('Failed to get iOS vendor ID', error);
  }
  return Application.installationId ?? `fallback-${Date.now()}`;
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

