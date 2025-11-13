import axios from 'axios';
import Constants from 'expo-constants';

// Get API URL from config, with fallback
const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || 
  Constants.manifest2?.extra?.expoClient?.apiUrl || 
  'https://silent-sos.onrender.com'; // Fallback to your deployed backend

// Debug log (only in development)
if (__DEV__) {
  console.log('[API Client] Base URL:', API_BASE_URL);
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30 seconds for slow networks
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log('[API Request]', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('[API Response]', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // Enhanced error logging
    if (error.code === 'ECONNABORTED') {
      console.error('[API ERROR] Request timeout - Server took too long to respond');
      console.error('[API ERROR] URL:', error.config?.url);
      error.userMessage = 'Server response timeout. Please check your internet connection and try again.';
    } else if (error.message === 'Network Error' || !error.response) {
      console.error('[API ERROR] Network Error - Cannot reach server');
      console.error('[API ERROR] Base URL:', error.config?.baseURL);
      console.error('[API ERROR] Full URL:', error.config?.baseURL + error.config?.url);
      error.userMessage = 'Cannot connect to server. Please check:\n\n1. Internet connection\n2. Server is running\n3. Try again in a moment';
    } else if (error.response) {
      console.error('[API ERROR]', error.response.status, error.response.data);
      error.userMessage = error.response.data?.message || `Server error (${error.response.status})`;
    } else {
      console.error('[API ERROR]', error.message);
      error.userMessage = error.message || 'Unknown error occurred';
    }
    return Promise.reject(error);
  }
);

