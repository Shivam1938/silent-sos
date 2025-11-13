import { apiClient } from './apiClient';

export const triggerSos = async ({ latitude, longitude, accuracy }) => {
  const response = await apiClient.post('/api/sos/trigger', {
    latitude,
    longitude,
    accuracy,
  });
  return response.data;
};

export const sendHeartbeat = async ({ eventId, latitude, longitude, accuracy }) => {
  await apiClient.post('/api/sos/heartbeat', {
    eventId,
    latitude,
    longitude,
    accuracy,
  });
};

export const cancelSos = async ({ eventId, reason }) => {
  await apiClient.post('/api/sos/cancel', {
    eventId,
    reason,
  });
};

