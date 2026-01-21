export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  success: boolean;
  accessToken: string;
}

export interface LoginCredentials {
  username: string;
  password?: string; // Optional for some flows, but usually required
}

export interface TokenPayload {
  id: number;
  username: string;
  role: UserRole;
  iat: number;
  exp: number;
}
