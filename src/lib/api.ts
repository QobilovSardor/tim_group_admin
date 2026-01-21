import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { AuthResponse, RefreshResponse, LoginCredentials } from '@/types/auth.types';
import { API_CONFIG, SECURITY_CONFIG, ROUTES } from '@/config/constants';
import { tokenManager } from './tokenManager';

// We'll keep the base api instance, but we need to re-add the business logic APIs
// because they were accidentally removed in the previous step.

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        // Redirect to login or clear data if no refresh token
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<RefreshResponse>(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken }
        );

        const { accessToken } = response.data;

        // Update tokens in storage (keeping existing refresh token and user)
        const currentRefresh = tokenManager.getRefreshToken() || '';
        const currentUser = tokenManager.getUser();
        const rememberMe = localStorage.getItem(SECURITY_CONFIG.TOKEN_KEYS.REMEMBER_ME) === 'true';

        tokenManager.setTokens(accessToken, currentRefresh, currentUser, rememberMe);

        processQueue(null, accessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(refreshError);
      }
    }

    const message = (error.response?.data as any)?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

import type { Service, Review, Distributor, Project } from './types';

// Services API
export const servicesApi = {
  getAll: () => api.get<Service[]>(API_CONFIG.ENDPOINTS.OUR_SERVICES),
  getById: (id: number) => api.get<Service>(`${API_CONFIG.ENDPOINTS.OUR_SERVICES}/${id}`),
  create: (data: FormData) => api.post<Service>(API_CONFIG.ENDPOINTS.OUR_SERVICES, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.put<Service>(`${API_CONFIG.ENDPOINTS.OUR_SERVICES}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`${API_CONFIG.ENDPOINTS.OUR_SERVICES}/${id}`),
};

// Reviews API
export const reviewsApi = {
  getAll: () => api.get<Review[]>(API_CONFIG.ENDPOINTS.REVIEWS),
  getById: (id: number) => api.get<Review>(`${API_CONFIG.ENDPOINTS.REVIEWS}/${id}`),
  create: (data: FormData) => api.post<Review>(API_CONFIG.ENDPOINTS.REVIEWS, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.put<Review>(`${API_CONFIG.ENDPOINTS.REVIEWS}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`${API_CONFIG.ENDPOINTS.REVIEWS}/${id}`),
};

// Distributors API
export const distributorsApi = {
  getAll: () => api.get<Distributor[]>(API_CONFIG.ENDPOINTS.DISTRIBUTORS),
  getById: (id: number) => api.get<Distributor>(`${API_CONFIG.ENDPOINTS.DISTRIBUTORS}/${id}`),
  create: (data: FormData) => api.post<Distributor>(API_CONFIG.ENDPOINTS.DISTRIBUTORS, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.put<Distributor>(`${API_CONFIG.ENDPOINTS.DISTRIBUTORS}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`${API_CONFIG.ENDPOINTS.DISTRIBUTORS}/${id}`),
};

// Projects API
export const projectsApi = {
  getAll: () => api.get<Project[]>(API_CONFIG.ENDPOINTS.OUR_PROJECTS),
  getById: (id: number) => api.get<Project>(`${API_CONFIG.ENDPOINTS.OUR_PROJECTS}/${id}`),
  create: (data: FormData) => api.post<Project>(API_CONFIG.ENDPOINTS.OUR_PROJECTS, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.put<Project>(`${API_CONFIG.ENDPOINTS.OUR_PROJECTS}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`${API_CONFIG.ENDPOINTS.OUR_PROJECTS}/${id}`),
};

// Helper function to create FormData
const createFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  return formData;
};

// Auth API
export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials),
  refresh: (refreshToken: string) =>
    api.post<RefreshResponse>(API_CONFIG.ENDPOINTS.AUTH.REFRESH, { refreshToken }),
  changePassword: (data: any) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, data),
};

export { createFormData };
export default api;
