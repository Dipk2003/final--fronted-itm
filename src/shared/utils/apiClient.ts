/**
 * Simple and Robust API Client
 * ============================
 * 
 * A straightforward API client with error handling and fallback mechanisms
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/lib/api-config';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('authToken') || localStorage.getItem('token')
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error: AxiosError) => {
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'}`);
    
    // Handle 401/403 errors
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  if (error.response) {
    return {
      message: error.response.data?.message || error.response.data || 'An error occurred',
      status: error.response.status,
      data: error.response.data,
      timestamp: new Date().toISOString(),
    };
  } else if (error.request) {
    return {
      message: 'Network error. Please check your internet connection.',
      status: 0,
      data: null,
      timestamp: new Date().toISOString(),
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      data: null,
      timestamp: new Date().toISOString()
    };
  }
};

// Simple API wrapper
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get(url, config).then(response => response.data);
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post(url, data, config).then(response => response.data);
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put(url, data, config).then(response => response.data);
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete(url, config).then(response => response.data);
  },
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.patch(url, data, config).then(response => response.data);
  },

  // Utility methods
  handleError: handleApiError,
  
  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      await apiClient.get('/api/health');
      return true;
    } catch (error) {
      console.warn('❌ Health check failed:', error);
      return false;
    }
  },
};

// Health check utility
export const testConnection = async (): Promise<boolean> => {
  try {
    return await api.healthCheck();
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

// Export for different import styles
export default apiClient;
