import { jwtDecode } from 'jwt-decode';
import type { TokenPayload } from '@/types/auth.types';
import { SECURITY_CONFIG } from '@/config/constants';

export const tokenManager = {
  getAccessToken: () => localStorage.getItem(SECURITY_CONFIG.TOKEN_KEYS.ACCESS),
  getRefreshToken: () => localStorage.getItem(SECURITY_CONFIG.TOKEN_KEYS.REFRESH),
  getUser: () => {
    const userData = localStorage.getItem(SECURITY_CONFIG.TOKEN_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },

  setTokens: (access: string, refresh: string, user: any, rememberMe: boolean = false) => {
    localStorage.setItem(SECURITY_CONFIG.TOKEN_KEYS.ACCESS, access);
    localStorage.setItem(SECURITY_CONFIG.TOKEN_KEYS.REFRESH, refresh);
    localStorage.setItem(SECURITY_CONFIG.TOKEN_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(SECURITY_CONFIG.TOKEN_KEYS.REMEMBER_ME, String(rememberMe));
  },

  clearTokens: () => {
    localStorage.removeItem(SECURITY_CONFIG.TOKEN_KEYS.ACCESS);
    localStorage.removeItem(SECURITY_CONFIG.TOKEN_KEYS.REFRESH);
    localStorage.removeItem(SECURITY_CONFIG.TOKEN_KEYS.USER);
    // Note: we might keep REMEMBER_ME to remember preferences
  },

  decodeToken: (token: string): TokenPayload | null => {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  },

  getTokenExpiryTime: (token: string): number => {
    const decoded = tokenManager.decodeToken(token);
    return decoded ? decoded.exp * 1000 : 0;
  },

  isTokenExpired: (token: string): boolean => {
    const expiryTime = tokenManager.getTokenExpiryTime(token);
    return expiryTime < Date.now();
  },

  shouldRefreshToken: (token: string): boolean => {
    const expiryTime = tokenManager.getTokenExpiryTime(token);
    const buffer = SECURITY_CONFIG.TOKEN_EXPIRY_BUFFER;
    return expiryTime - Date.now() < buffer;
  }
};
