import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);
const TOKEN_KEY = 'sivakasi_admin_token';
const USER_KEY = 'sivakasi_admin_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentToken = localStorage.getItem(TOKEN_KEY);
      if (currentToken) {
        try {
          const user = await authService.verifyToken();
          if (user) {
            setAdminUser(user);
          } else {
            // invalid session
            logout();
          }
        } catch {
          // Keep current user or logout
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password, rememberMe = false) => {
    setIsLoading(true);
    try {
      const res = await authService.login(username, password, rememberMe);
      const accessToken = res.access_token;
      const user = res.user;

      setToken(accessToken);
      setAdminUser(user);

      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Login failed. Please verify credentials.';
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        adminUser,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
