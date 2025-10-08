// =============================================================================
// API Configuration - Complete endpoint definitions
// =============================================================================
// This file contains all API endpoints used throughout the application

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // =============================================================================
  // AUTHENTICATION ENDPOINTS
  // =============================================================================
  AUTH: {
    // User authentication
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_OTP: '/api/auth/verify-otp',
    PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/change-password',
    
    // Vendor authentication
    VENDOR_LOGIN: '/api/auth/vendor/login',
    VENDOR_REGISTER: '/api/auth/vendor/register',
    
    // Admin authentication
    ADMIN_LOGIN: '/api/auth/admin/login',
    ADMIN_REGISTER: '/api/auth/admin/register',
    
    // User types
    USER_LOGIN: '/api/auth/buyer/login',
  },

  // =============================================================================
  // BUYER/USER ENDPOINTS
  // =============================================================================
  BUYER: {
    // Categories
    CATEGORIES: '/api/categories',
    
    // Products
    PRODUCTS: '/api/products',
    
    // Search
    SEARCH: '/api/search',
    
    // Cart
    CART: '/api/cart',
    
    // Wishlist
    WISHLIST: '/api/wishlist',
    
    // Orders
    ORDERS: '/api/orders',
    
    // Inquiries
    INQUIRIES: '/api/inquiries',
    
    // Quotes
    QUOTES: '/api/quotes',
  },

  // =============================================================================
  // VENDOR ENDPOINTS
  // =============================================================================
  VENDOR: {
    BASE: '/api/vendors',
    PRODUCTS: '/api/vendor/products',
    ORDERS: '/api/vendor/orders',
    ANALYTICS: '/api/vendor/analytics',
    PROFILE: '/api/vendor/profile',
    SETTINGS: '/api/vendor/settings',
  },

  // =============================================================================
  // ADMIN ENDPOINTS
  // =============================================================================
  ADMIN: {
    BASE: '/api/admin',
    DASHBOARD: '/api/admin/dashboard',
    USERS: '/api/admin/users',
    VENDORS: '/api/admin/vendors',
    PRODUCTS: '/api/admin/products',
    ORDERS: '/api/admin/orders',
    CATEGORIES: '/api/admin/categories',
    ANALYTICS: '/api/admin/analytics',
  },

  // =============================================================================
  // ANALYTICS ENDPOINTS
  // =============================================================================
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    ADMIN: '/api/admin/analytics',
    VENDOR: '/api/vendor/analytics',
  },

  // =============================================================================
  // SUPPORT ENDPOINTS
  // =============================================================================
  SUPPORT: {
    TICKETS: '/api/support/tickets',
    CHAT: '/api/support/chat',
    FAQ: '/api/support/faq',
  },

  // =============================================================================
  // PAYMENT ENDPOINTS
  // =============================================================================
  PAYMENT: {
    CREATE_ORDER: '/api/payment/create-order',
    VERIFY_PAYMENT: '/api/payment/verify',
    REFUND: '/api/payment/refund',
  },

  // =============================================================================
  // CORE ENDPOINTS
  // =============================================================================
  CORE: {
    HEALTH: '/api/health',
    STATUS: '/api/status',
  },

  // =============================================================================
  // PRODUCTS ENDPOINTS
  // =============================================================================
  PRODUCTS: {
    BASE: '/api/products',
    BY_ID: (id: string) => `/api/products/${id}`,
    SEARCH: '/api/products/search',
    FEATURED: '/api/products/featured',
    UPLOAD_IMAGES: (id: string) => `/api/products/${id}/images`,
  },

  // =============================================================================
  // VENDORS ENDPOINTS
  // =============================================================================
  VENDORS: {
    BASE: '/api/vendors',
    PRODUCTS: '/api/vendor/products',
    CREATE_PRODUCT: '/api/vendor/products',
    UPDATE_PRODUCT: (id: string) => `/api/vendor/products/${id}`,
    DELETE_PRODUCT: (id: string) => `/api/vendor/products/${id}`,
    BULK_IMPORT: '/api/vendor/products/bulk-import',
    ORDERS: '/api/vendor/orders',
    ANALYTICS: '/api/vendor/analytics',
    PROFILE: '/api/vendor/profile',
    SETTINGS: '/api/vendor/settings',
  },

  // =============================================================================
  // CATEGORIES ENDPOINTS
  // =============================================================================
  CATEGORIES: {
    BASE: '/api/categories',
    BY_ID: (id: string) => `/api/categories/${id}`,
    SUBCATEGORIES: (id: string) => `/api/categories/${id}/subcategories`,
    MICROCATEGORIES: (subCategoryId: string) => `/api/subcategories/${subCategoryId}/microcategories`,
    HIERARCHY: '/api/categories/hierarchy',
  },

  // =============================================================================
  // CART ENDPOINTS
  // =============================================================================
  CART: {
    BASE: '/api/cart',
    ADD_ITEM: '/api/cart/items',
    UPDATE_ITEM: '/api/cart/items',
    REMOVE_ITEM: '/api/cart/items',
    CLEAR: '/api/cart/clear',
  },

  // =============================================================================
  // ORDERS ENDPOINTS
  // =============================================================================
  ORDERS: {
    BASE: '/api/orders',
    BY_ID: (id: string) => `/api/orders/${id}`,
    CANCEL: (id: string) => `/api/orders/${id}/cancel`,
    TRACK: (orderNumber: string) => `/api/orders/track/${orderNumber}`,
  },

  // =============================================================================
  // UPLOAD ENDPOINTS
  // =============================================================================
  UPLOAD: {
    IMAGE: '/api/upload/image',
    DOCUMENT: '/api/upload/document',
    AVATAR: '/api/upload/avatar',
  },

  // =============================================================================
  // INQUIRIES ENDPOINTS
  // =============================================================================
  INQUIRIES: {
    BASE: '/api/inquiries',
    BY_ID: (id: string) => `/api/inquiries/${id}`,
    VENDOR_INQUIRIES: '/api/vendor/inquiries',
    CREATE: '/api/inquiries',
    UPDATE: (id: string) => `/api/inquiries/${id}`,
    DELETE: (id: string) => `/api/inquiries/${id}`,
    RESPOND: (id: string) => `/api/inquiries/${id}/respond`,
  },

  // =============================================================================
  // DATA ENTRY ENDPOINTS (for admin/data management)
  // =============================================================================
  DATA_ENTRY: {
    CATEGORIES: '/api/dataentry/categories',
    SUBCATEGORIES: '/api/dataentry/subcategories',
    MICROCATEGORIES: '/api/dataentry/microcategories',
    PRODUCTS: '/api/dataentry/products',
    ANALYTICS: '/api/dataentry/analytics',
    STATS: '/api/dataentry/categories/stats',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Get auth headers
export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken') || localStorage.getItem('token')
    : null;
  
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Build full URL
export const buildApiUrl = (endpoint: string): string => {
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  return `${API_BASE_URL}${endpoint}`;
};

// Get common headers
export const getCommonHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...getAuthHeaders(),
});

export default API_ENDPOINTS;
