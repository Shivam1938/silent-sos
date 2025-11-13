import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { triggerSos, sendHeartbeat, cancelSos } from '../services/sosService';

const SosContext = createContext({
  activeEvent: null,
  isSending: false,
  lastError: null,
  startSos: async () => {},
  cancelActiveSos: async (_reason) => {},
});

const ensurePermissionsAsync = async () => {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== Location.PermissionStatus.GRANTED) {
    throw new Error('Location permission is required to send SOS.');
  }
  const background = await Location.requestBackgroundPermissionsAsync();
  if (background.status !== Location.PermissionStatus.GRANTED) {
    console.warn('Background location permission not granted. Live tracking may pause in background.');
  }
};

export const SosProvider = ({ children }) => {
  const [activeEvent, setActiveEvent] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [lastError, setLastError] = useState(null);
  const watcherRef = useRef(null);

  const stopWatcher = useCallback(async () => {
    if (watcherRef.current) {
      try {
        await watcherRef.current.remove();
      } catch (error) {
        console.warn('Failed to stop location watcher', error);
      }
      watcherRef.current = null;
    }
  }, []);

  const startSos = useCallback(async () => {
    if (activeEvent) {
      console.warn('SOS already active');
      return activeEvent;
    }
    setIsSending(true);
    setLastError(null);
    try {
      await ensurePermissionsAsync();
      await stopWatcher();
      // Get accurate location with timeout
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeout: 15000, // 15 seconds timeout
        mayShowUserSettingsDialog: true,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const { eventId } = await triggerSos({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });

      setActiveEvent({
        id: eventId,
        startedAt: Date.now(),
        lastUpdate: Date.now(),
        lastLocation: position.coords,
      });

      // Start location tracking with better settings for physical devices
      watcherRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 5, // Update every 5 meters
          mayShowUserSettingsDialog: false,
        },
        async (update) => {
          setActiveEvent((prev) =>
            prev
              ? {
                  ...prev,
                  lastUpdate: Date.now(),
                  lastLocation: update.coords,
                }
              : prev
          );

          try {
            await sendHeartbeat({
              eventId,
              latitude: update.coords.latitude,
              longitude: update.coords.longitude,
              accuracy: update.coords.accuracy,
            });
          } catch (error) {
            console.warn('Failed to send SOS heartbeat', error);
            setLastError(error);
          }
        }
      );
    } catch (error) {
      setLastError(error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    } finally {
      setIsSending(false);
    }
  }, [activeEvent, stopWatcher]);

  const cancelActiveSos = useCallback(
    async (reason = 'user_cancelled') => {
      if (!activeEvent) {
        return;
      }
      setIsSending(true);
      try {
        await cancelSos({
          eventId: activeEvent.id,
          reason,
        });
        await stopWatcher();
        setActiveEvent(null);
        setLastError(null);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        setLastError(error);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [activeEvent, stopWatcher]
  );

  useEffect(() => {
    return () => {
      void stopWatcher();
    };
  }, [stopWatcher]);

  const value = useMemo(
    () => ({
      activeEvent,
      isSending,
      lastError,
      startSos,
      cancelActiveSos,
      isActive: Boolean(activeEvent),
    }),
    [activeEvent, isSending, lastError, startSos, cancelActiveSos]
  );

  return <SosContext.Provider value={value}>{children}</SosContext.Provider>;
};

export const useSos = () => React.useContext(SosContext);

