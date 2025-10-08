// API Configuration for connecting to Spring Boot backend
export type ApiEndpointsConfig = typeof API_CONFIG.ENDPOINTS;

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  ENDPOINTS: {
    // Health check
    HEALTH: '/health',
    API_HEALTH: '/api/health',
    ACTUATOR_HEALTH: '/actuator/health',
    
    // Authentication endpoints
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout',
      PROFILE: '/api/auth/profile',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
      VERIFY_EMAIL: '/api/auth/verify-email',
      VERIFY_OTP: '/api/auth/verify-otp',
      // Role-specific auth endpoints
      ADMIN: {
        LOGIN: '/api/auth/admin/login',
        REGISTER: '/api/auth/admin/register'
      },
      VENDOR: {
        LOGIN: '/api/auth/vendor/login',
        REGISTER: '/api/auth/vendor/register'
      },
      BUYER: {
        LOGIN: '/api/auth/buyer/login',
        REGISTER: '/api/auth/register'
      },
      EMPLOYEE: {
        LOGIN: '/api/auth/employee/login',
        REGISTER: '/api/auth/employee/register'
      }
    },
    
    // Core API endpoints
    USERS: '/api/users',
    COMPANIES: '/api/companies',
    
    // Buyer Module endpoints
    BUYERS: {
      BASE: '/api/buyers',
      PROFILE: '/api/buyers/profile',
      ORDERS: '/api/buyers/orders',
      CART: '/api/buyers/cart',
      WISHLIST: '/api/buyers/wishlist',
      INQUIRIES: '/api/buyers/inquiries',
      QUOTES: '/api/buyers/quotes',
      REVIEWS: '/api/buyers/reviews'
    },
    
    // Vendor Module endpoints
    VENDORS: {
      BASE: '/api/vendors',
      PROFILE: '/api/vendors/profile',
      PRODUCTS: '/api/vendors/products',
      ORDERS: '/api/vendors/orders',
      ANALYTICS: '/api/vendors/analytics',
      LEADS: '/api/vendors/leads',
      DASHBOARD: '/api/vendors/dashboard'
    },
    
    // Product Management endpoints
    PRODUCTS: {
      BASE: '/api/products',
      SEARCH: '/api/products/search',
      CATEGORIES: '/api/products/categories',
      BY_VENDOR: '/api/products/vendor',
      BY_CATEGORY: '/api/products/category',
      FEATURED: '/api/products/featured',
      TRENDING: '/api/products/trending'
    },
    
    // Category Management endpoints
    CATEGORIES: {
      BASE: '/api/categories',
      HIERARCHICAL: '/api/categories/hierarchy',
      STATS: '/api/categories/stats',
      SUBCATEGORIES: '/api/categories/subcategories',
      MICROCATEGORIES: '/api/categories/microcategories'
    },
    
    // Data Entry API endpoints (Employee module)
    DATA_ENTRY: {
      CATEGORIES: '/api/dataentry/categories',
      SUBCATEGORIES: '/api/dataentry/subcategories',
      MICROCATEGORIES: '/api/dataentry/microcategories',
      PRODUCTS: '/api/dataentry/products',
      ANALYTICS: '/api/dataentry/analytics',
      CATEGORY_STATS: '/api/dataentry/categories/stats'
    },
    
    // Order Management endpoints
    ORDERS: {
      BASE: '/api/orders',
      BY_BUYER: '/api/orders/buyer',
      BY_VENDOR: '/api/orders/vendor',
      STATUS_UPDATE: '/api/orders/status',
      TRACKING: '/api/orders/tracking'
    },
    
    // Payment endpoints
    PAYMENTS: {
      BASE: '/api/payments',
      RAZORPAY: '/api/payments/razorpay',
      WEBHOOK: '/api/payments/webhook',
      SUBSCRIPTIONS: '/api/payments/subscriptions',
      INVOICES: '/api/payments/invoices'
    },
    
    // Support endpoints
    SUPPORT: {
      TICKETS: '/api/support/tickets',
      CHAT: '/api/support/chat',
      CHATBOT: '/api/support/chatbot',
      KNOWLEDGE_BASE: '/api/support/knowledge-base'
    },
    
    // Analytics endpoints
    ANALYTICS: {
      DASHBOARD: '/api/analytics/dashboard',
      ADMIN: '/api/analytics/admin',
      VENDOR: '/api/analytics/vendor',
      BUYER: '/api/analytics/buyer',
      DASHBOARD_ANALYTICS: '/api/analytics/dashboard-analytics',
      CATEGORY_STATS: '/api/analytics/category-stats'
    },
    
    // Admin endpoints
    ADMIN: {
      USERS: '/api/admin/users',
      VENDORS: '/api/admin/vendors',
      BUYERS: '/api/admin/buyers',
      PRODUCTS: '/api/admin/products',
      ORDERS: '/api/admin/orders',
      ANALYTICS: '/api/admin/analytics',
      CONTENT: '/api/admin/content',
      SETTINGS: '/api/admin/settings',
      KYC: '/api/admin/kyc',
      LEADS: '/api/admin/leads'
    },
    
    // File Upload endpoints
    FILES: {
      UPLOAD: '/api/files/upload',
      DELETE: '/api/files/delete',
      DOWNLOAD: '/api/files/download'
    },
    
    // Directory/Service Provider endpoints
    DIRECTORY: {
      PROVIDERS: '/api/directory/providers',
      SEARCH: '/api/directory/search',
      INQUIRIES: '/api/directory/inquiries'
    },
    
    // Location endpoints
    LOCATIONS: {
      CITIES: '/api/locations/cities',
      STATES: '/api/locations/states',
      COUNTRIES: '/api/locations/countries'
    },
    
    // Excel Import endpoints
    EXCEL: {
      IMPORT: '/api/excel/import',
      TEMPLATE: '/api/excel/template',
      STATUS: '/api/excel/status'
    }
  }
};

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, any>): string => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
};

// Common request headers
export const getHeaders = (includeAuth: boolean = false): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// API request helper with intelligent HTTPS/HTTP fallback
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = false
): Promise<T> => {
  const baseUrl = API_CONFIG.BASE_URL;
  const fullEndpoint = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(includeAuth),
      ...options.headers,
    },
    signal: controller.signal,
  };
  
  // Try HTTPS first, then fallback to HTTP
  const urlsToTry = [
    fullEndpoint, // Try configured URL first
    fullEndpoint.replace('https://', 'http://'), // Fallback to HTTP if HTTPS fails
  ];
  
  let lastError: Error | undefined;
  
  for (const url of urlsToTry) {
    try {
      console.log(`🌐 Attempting API call to: ${url}`);
      
      const response = await fetch(url, config);
      
      // Check if backend is returning 502 Bad Gateway
      if (response.status === 502) {
        console.warn(`⚠️ Backend returning 502 Bad Gateway from: ${url}`);
        throw new Error(`Backend service unavailable (502 Bad Gateway)`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} from ${url}`);
      }
      console.log(`\u2705 API call successful to: ${url}`);
      clearTimeout(timeoutId); // Clear timeout on successful response
      
      // Handle empty responses (like 204 No Content from DELETE operations)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined as T;
      }
      
      // Try to parse JSON, but handle empty responses gracefully
      const text = await response.text();
      if (!text) {
        return undefined as T;
      }
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.warn('Could not parse response as JSON:', text);
        return text as T;
      }
      
    } catch (error) {
      console.error(`❌ API call failed to ${url}:`, error);
      lastError = error as Error;
      continue; // Try next URL
    }
  }
  
  // If all URLs failed, throw the last error
  throw new Error(`All API endpoints failed. Last error: ${lastError?.message || 'Unknown error'}. Please check if your backend server is running.`);
};
