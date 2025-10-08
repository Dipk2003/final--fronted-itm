/**
 * Unified API Client for iTech Frontend-Backend Integration
 * Handles all API communication with the Spring Boot backend
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
const API_FALLBACK_URL = process.env.NEXT_PUBLIC_API_FALLBACK_BASE_URL || 'http://127.0.0.1:8080/api';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

// Create axios instances
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('authToken') || localStorage.getItem('token')
        : null;
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Log requests in development
      if (process.env.NEXT_PUBLIC_DEBUG_API === 'true') {
        console.log('🔄 API Request:', {
          method: config.method?.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          data: config.data,
          headers: config.headers
        });
      }
      
      return config;
    },
    (error) => {
      console.error('❌ API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for unified error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log responses in development
      if (process.env.NEXT_PUBLIC_DEBUG_API === 'true') {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data
        });
      }
      return response;
    },
    (error) => {
      // Handle common error scenarios
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            // Unauthorized - clear token and redirect to login
            if (typeof window !== 'undefined') {
              localStorage.removeItem('authToken');
              localStorage.removeItem('token');
              // Only redirect if we're not already on auth pages
              if (!window.location.pathname.includes('/auth')) {
                window.location.href = '/auth/login';
              }
            }
            break;
          case 403:
            console.error('❌ Access forbidden:', data.message || 'Insufficient permissions');
            break;
          case 404:
            console.error('❌ Resource not found:', error.config.url);
            break;
          case 500:
            console.error('❌ Server error:', data.message || 'Internal server error');
            break;
        }
        
        // Return formatted error
        return Promise.reject({
          status,
          message: data.message || data.error || `HTTP ${status} Error`,
          details: data
        });
      } else if (error.request) {
        // Network error
        console.error('❌ Network Error:', error.message);
        return Promise.reject({
          status: 0,
          message: 'Network error - Unable to connect to server',
          details: error.message
        });
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// Primary and fallback API instances
const primaryApi = createApiInstance(API_BASE_URL);
const fallbackApi = createApiInstance(API_FALLBACK_URL);

/**
 * Unified API client with automatic fallback
 */
class UnifiedApiClient {
  
  /**
   * Make API request with automatic fallback
   */
  private async makeRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const apis = [primaryApi, fallbackApi];
    let lastError: any;

    for (const api of apis) {
      try {
        const response = await api.request({
          method,
          url: endpoint,
          data,
          ...config
        });
        
        return response.data;
      } catch (error: any) {
        console.warn(`API request failed for ${api.defaults.baseURL}, trying next...`);
        lastError = error;
        continue;
      }
    }

    // All APIs failed
    throw lastError;
  }

  // HTTP Methods
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('get', endpoint, undefined, config);
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('post', endpoint, data, config);
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('put', endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('delete', endpoint, undefined, config);
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('patch', endpoint, data, config);
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T>(
    endpoint: string,
    file: File | FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    return this.makeRequest<T>('post', endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      }
    });
  }

  /**
   * Health check for backend connectivity
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.get<any>('/health');
      return {
        status: 'healthy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Health check failed:', error);
      throw {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error
      };
    }
  }

  /**
   * Get current API base URL being used
   */
  getCurrentApiUrl(): string {
    return API_BASE_URL;
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<{
    primary: boolean;
    fallback: boolean;
    activeUrl: string;
  }> {
    const results = {
      primary: false,
      fallback: false,
      activeUrl: ''
    };

    // Test primary API
    try {
      await primaryApi.get('/health');
      results.primary = true;
      results.activeUrl = API_BASE_URL;
    } catch (error) {
      console.warn('Primary API connection failed');
    }

    // Test fallback API
    try {
      await fallbackApi.get('/health');
      results.fallback = true;
      if (!results.activeUrl) {
        results.activeUrl = API_FALLBACK_URL;
      }
    } catch (error) {
      console.warn('Fallback API connection failed');
    }

    return results;
  }
}

// Export singleton instance
export const apiClient = new UnifiedApiClient();
export default apiClient;

// Export types for TypeScript support
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// Common API endpoint constants based on backend API documentation
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Users
  USERS: {
    PROFILE: '/users/profile',
    AVATAR: '/users/avatar',
    CHANGE_PASSWORD: '/users/change-password',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAILS: '/products',
    FEATURED: '/products/featured',
    SEARCH: '/products/search',
    CREATE: '/products',
    UPDATE: '/products',
    DELETE: '/products',
    UPLOAD_IMAGES: '/products',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    HIERARCHY: '/categories/hierarchy',
    SUBCATEGORIES: '/categories',
    MICROCATEGORIES: '/subcategories',
  },

  // Cart & Wishlist
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },

  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist',
    REMOVE: '/wishlist',
    COUNT: '/wishlist/count',
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    DETAILS: '/orders',
    CREATE: '/orders',
    UPDATE_STATUS: '/orders',
    TRACK: '/orders',
    CANCEL: '/orders',
  },

  // Vendor specific
  VENDORS: {
    DASHBOARD: '/vendors/dashboard',
    PRODUCTS: '/vendors/products',
    ORDERS: '/vendors/orders',
    ANALYTICS: '/vendors/analytics',
    BULK_IMPORT: '/vendors/products/bulk-import',
  },

  // Admin specific
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    VENDORS: '/admin/vendors',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    ANALYTICS: '/admin/analytics',
  },

  // Support
  SUPPORT: {
    TICKETS: '/support/tickets',
    CREATE_TICKET: '/support/tickets',
    REPLY: '/support/tickets',
  },

  // Chat
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: '/chat/conversations',
    SEND: '/chat/conversations',
  },

  // Payments
  PAYMENTS: {
    CREATE_ORDER: '/payments/create-order',
    VERIFY: '/payments/verify',
    DETAILS: '/payments',
  },

  // Inquiries & Quotes
  INQUIRIES: {
    LIST: '/inquiries',
    CREATE: '/inquiries',
    DETAILS: '/inquiries',
    RESPOND: '/inquiries',
  },

  QUOTES: {
    LIST: '/quotes',
    CREATE: '/quotes',
    ACCEPT: '/quotes',
    REJECT: '/quotes',
  },

  // Health & General
  HEALTH: '/health',
  CONTACT: '/contact',
};
