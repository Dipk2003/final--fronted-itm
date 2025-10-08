// API Constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/ws';

export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken') || localStorage.getItem('token')
    : null;
  
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const API_ENDPOINTS = {
  // Core/Auth endpoints
  CORE: {
    AUTH: '/api/auth',
  },
  // Auth endpoints (backward compatibility)
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register', 
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_OTP: '/api/auth/verify-otp',
  },
  
  // Shared endpoints
  SHARED: {
    HEALTH: '/api/health',
  },
  
  // Product endpoints
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  
  // Order endpoints
  ORDERS: '/api/orders',
  
  // User endpoints
  USERS: '/api/users',
  PROFILE: '/api/users/profile',
  
  // Buyer endpoints
  BUYER: {
    PRODUCTS: '/api/buyer/products',
    DASHBOARD: '/api/buyer/dashboard',
  },
  
  // Vendor endpoints
  VENDOR: {
    DASHBOARD: '/api/vendor/dashboard',
    PRODUCTS: '/api/vendor/products',
  },
  
  // Admin endpoints
  ADMIN: {
    USERS: '/api/admin/users',
    DASHBOARD: '/api/admin/dashboard',
  },
  
  // Additional endpoints
  HEALTH: '/api/health',
};
