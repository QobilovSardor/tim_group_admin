import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import type { User, LoginCredentials } from '@/types/auth.types';
import { authApi } from '@/lib/api';
import { tokenManager } from '@/lib/tokenManager';
import { toast } from 'sonner';
import { ROUTES } from '@/config/constants';


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(tokenManager.getUser());
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!tokenManager.getAccessToken());
  const navigate = useNavigate();

  const logout = useCallback(() => {
    tokenManager.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate(ROUTES.LOGIN);
  }, [navigate]);


  const checkAuth = useCallback(() => {
    const token = tokenManager.getAccessToken();
    const userData = tokenManager.getUser();

    if (token && userData) {
      if (tokenManager.isTokenExpired(token)) {
        // Interceptor will handle refresh on next request, but we can proactively check
        const refresh = tokenManager.getRefreshToken();
        if (!refresh) {
          logout();
        }
      } else {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, [logout]);

  const login = async (credentials: LoginCredentials, rememberMe: boolean) => {
    try {
      const response = await authApi.login(credentials);
      const { accessToken, refreshToken, user: userData } = response.data;

      tokenManager.setTokens(accessToken, refreshToken, userData, rememberMe);
      setUser(userData);
      setIsAuthenticated(true);

      toast.success('Login successful');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
