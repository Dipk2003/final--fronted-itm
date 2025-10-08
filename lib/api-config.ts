// =============================================================================
// iTech Frontend - API Configuration
// =============================================================================
// Centralized API configuration for frontend-backend integration

// Environment-based API configuration
const API_CONFIG = {
  // Base URLs from environment variables - Updated for backend integration
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1',
  WS_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/ws',
  
  // Request timeout (30 seconds)
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Debug mode
  DEBUG: process.env.NEXT_PUBLIC_DEBUG_API === 'true',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication - Updated for backend integration
  AUTH: {
    LOGIN: '/auth/login',
    USER_LOGIN: '/auth/user/login',
    VENDOR_LOGIN: '/auth/vendor/login',
    ADMIN_LOGIN: '/auth/admin/login',
    REGISTER: '/auth/register',
    VENDOR_REGISTER: '/auth/vendor/register',
    ADMIN_REGISTER: '/auth/admin/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/verify-forgot-password-otp',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_OTP: '/auth/verify-otp',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    CHECK_EMAIL_ROLE: '/auth/check-email-role',
  },
  
  // User Management
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
  },
  
  // Buyer APIs
  BUYERS: {
    BASE: '/buyers',
    PROFILE: '/buyers/profile',
    DASHBOARD: '/buyers/dashboard',
    ORDERS: '/buyers/orders',
    WISHLIST: '/buyers/wishlist',
    CART: '/buyers/cart',
    INQUIRIES: '/buyers/inquiries',
    REVIEWS: '/buyers/reviews',
  },
  
  // Vendor APIs - Updated for backend integration
  VENDORS: {
    BASE: '/vendors',
    PROFILE: '/vendors/profile',
    DASHBOARD: '/vendors/dashboard',
    PRODUCTS: '/products/vendor/my-products',
    ORDERS: '/orders/vendor/my-orders',
    ANALYTICS: '/vendors/analytics',
    CREATE_PRODUCT: '/products',
    UPDATE_PRODUCT: (id: string) => `/products/${id}`,
    DELETE_PRODUCT: (id: string) => `/products/${id}`,
    BULK_IMPORT: '/vendors/products/bulk-import',
    INQUIRIES: '/inquiries/vendor',
    DASHBOARD_ANALYTICS: '/analytics/vendor/dashboard',
  },
  
  // Product Management - Updated for backend integration
  PRODUCTS: {
    BASE: '/products',
    SEARCH: '/products/search',
    CATEGORIES: '/categories',
    FEATURED: '/products/featured',
    BY_CATEGORY: (categoryId: string) => `/products/category/${categoryId}`,
    BY_ID: (id: string) => `/products/${id}`,
    REVIEWS: (id: string) => `/products/${id}/reviews`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    UPLOAD_IMAGES: (id: string) => `/products/${id}/images`,
  },
  
  // Categories
  CATEGORIES: {
    BASE: '/categories',
    SUB_CATEGORIES: (id: string) => `/categories/${id}/sub-categories`,
    MICRO_CATEGORIES: (id: string) => `/sub-categories/${id}/micro-categories`,
    HIERARCHY: '/categories/hierarchy',
  },
  
  // Orders
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
    TRACK: (orderNumber: string) => `/orders/track/${orderNumber}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
  
  // Cart & Checkout
  CART: {
    BASE: '/cart',
    ADD_ITEM: '/cart/add',
    UPDATE_ITEM: '/cart/update',
    REMOVE_ITEM: '/cart/remove',
    CLEAR: '/cart/clear',
  },
  
  // Inquiries & Quotes - Updated for backend integration
  INQUIRIES: {
    BASE: '/inquiries',
    BY_ID: (id: string) => `/inquiries/${id}`,
    RESPOND: (id: string) => `/inquiries/${id}/respond`,
    VENDOR_INQUIRIES: '/inquiries/vendor',
    BUYER_INQUIRIES: '/inquiries/buyer',
    CREATE: '/inquiries',
    UPDATE_STATUS: (id: string) => `/inquiries/${id}/status`,
  },
  
  // Payments
  PAYMENTS: {
    INITIATE: '/payments/initiate',
    VERIFY: '/payments/verify',
    RAZORPAY_CALLBACK: '/payments/razorpay/callback',
  },
  
  // Support
  SUPPORT: {
    TICKETS: '/support/tickets',
    CREATE_TICKET: '/support/tickets',
    CHAT: '/support/chat',
    CONTACT: '/support/contact',
  },
  
  // File Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    DOCUMENT: '/upload/document',
    AVATAR: '/upload/avatar',
  },
  
  // Admin APIs (if user is admin)
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    VENDORS: '/admin/vendors',
    BUYERS: '/admin/buyers',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    ANALYTICS: '/admin/analytics',
  },
  
  // Health & Status
  HEALTH: '/actuator/health',
  INFO: '/actuator/info',
} as const;

// Helper function to build complete URLs
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = endpoint.startsWith('/api') 
    ? API_CONFIG.BASE_URL 
    : API_CONFIG.API_BASE_URL;
  
  return `${baseUrl}${endpoint}`;
};

// Helper function to build WebSocket URLs
export const buildWsUrl = (path: string): string => {
  return `${API_CONFIG.WS_URL}${path}`;
};

// Request configuration
export const getRequestConfig = (options: {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  requiresAuth?: boolean;
} = {}) => {
  const { 
    method = 'GET', 
    headers = {}, 
    requiresAuth = true 
  } = options;
  
  const config: any = {
    method,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...headers,
    } as Record<string, string>,
    timeout: API_CONFIG.TIMEOUT,
  };
  
  // Add auth header if required
  if (requiresAuth) {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      : null;
    
    if (token) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
};

// Debug logging helper
export const logApiRequest = (endpoint: string, method: string, data?: any) => {
  if (API_CONFIG.DEBUG) {
    console.log(`🌐 API ${method}:`, buildApiUrl(endpoint));
    if (data) {
      console.log('📤 Request Data:', data);
    }
  }
};

export const logApiResponse = (endpoint: string, response: any, error?: any) => {
  if (API_CONFIG.DEBUG) {
    if (error) {
      console.error(`❌ API Error (${endpoint}):`, error);
    } else {
      console.log(`✅ API Success (${endpoint}):`, response);
    }
  }
};

// Export configuration
export default API_CONFIG;
