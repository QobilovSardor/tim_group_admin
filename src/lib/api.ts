import axios from 'axios';
import type { Service, Review, Distributor, Project } from './types';
import { API_CONFIG } from '@/config/constants';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (future use)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

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

export { createFormData };
export default api;
