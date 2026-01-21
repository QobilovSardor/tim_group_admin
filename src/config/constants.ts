// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  ENDPOINTS: {
    OUR_SERVICES: '/api/our-services',
    REVIEWS: '/api/reviews',
    DISTRIBUTORS: '/api/distributors',
    OUR_PROJECTS: '/api/our-projects',
  }
};

// Admin Routes
export const ROUTES = {
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
