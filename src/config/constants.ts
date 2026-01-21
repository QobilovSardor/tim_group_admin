// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
      CHANGE_PASSWORD: '/auth/change-password',
    },
    OUR_SERVICES: '/our-services',
    REVIEWS: '/reviews',
    DISTRIBUTORS: '/distributors',
    OUR_PROJECTS: '/our-projects',
  }
};

// Security Configuration
export const SECURITY_CONFIG = {
  TOKEN_KEYS: {
    ACCESS: 'tim_access_token',
    REFRESH: 'tim_refresh_token',
    USER: 'tim_user_data',
    REMEMBER_ME: 'tim_remember_me',
  },
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
  MAX_LOGIN_ATTEMPTS: 5,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  IDLE_THRESHOLD: 15 * 60 * 1000, // 15 minutes of inactivity
};

// Admin Routes
export const ROUTES = {
  LOGIN: '/login',
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',

    // Our Services
    SERVICES: '/admin/our-services',
    SERVICES_NEW: '/admin/our-services/new',
    SERVICES_EDIT: (id: string | number) => `/admin/our-services/${id}/edit`,

    // Reviews
    REVIEWS: '/admin/reviews',
    REVIEWS_NEW: '/admin/reviews/new',
    REVIEWS_EDIT: (id: string | number) => `/admin/reviews/${id}/edit`,

    // Distributors
    DISTRIBUTORS: '/admin/distributors',
    DISTRIBUTORS_NEW: '/admin/distributors/new',
    DISTRIBUTORS_EDIT: (id: string | number) => `/admin/distributors/${id}/edit`,

    // Projects
    PROJECTS: '/admin/our-projects',
    PROJECTS_NEW: '/admin/our-projects/new',
    PROJECTS_EDIT: (id: string | number) => `/admin/our-projects/${id}/edit`,
  }
};

// Helper function to build full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
