import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { registerDevice, loginDevice } from '../services/authService';
import { setAuthToken } from '../services/apiClient';
import { clearAuthState, loadAuthState, persistAuthState } from '../storage/authStorage';

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  authError: null,
  register: async (_payload) => {},
  login: async (_payload) => {},
  signOut: () => {},
  resetError: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      setAuthError(null);
      try {
        const stored = await loadAuthState();
        if (stored?.token) {
          setToken(stored.token);
          setUser(stored.user ?? null);
          setAuthToken(stored.token);
        }
      } finally {
        setIsLoading(false);
      }
    };
    void bootstrap();
  }, []);

  const register = useCallback(async ({ displayName, pin }) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const { token: nextToken, user: nextUser } = await registerDevice({ displayName, pin });
      setToken(nextToken);
      setUser(nextUser);
      setAuthToken(nextToken);
      await persistAuthState({ token: nextToken, user: nextUser });
      return nextUser;
    } catch (error) {
      setAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async ({ pin }) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const { token: nextToken, user: nextUser } = await loginDevice({ pin });
      setToken(nextToken);
      setUser(nextUser);
      setAuthToken(nextToken);
      await persistAuthState({ token: nextToken, user: nextUser });
      return nextUser;
    } catch (error) {
      setAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    setAuthError(null);
    await clearAuthState();
  }, []);

  const resetError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      authError,
      register,
      login,
      signOut,
      resetError,
      isAuthenticated: Boolean(token),
    }),
    [user, token, isLoading, authError, register, login, signOut, resetError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);

