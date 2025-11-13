import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@silent-sos/auth-state';

export const persistAuthState = async (authState) => {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authState));
};

export const loadAuthState = async () => {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to parse stored auth state', error);
    return null;
  }
};

export const clearAuthState = async () => {
  await AsyncStorage.removeItem(AUTH_KEY);
};

