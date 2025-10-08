import axios from "axios";
import { handleApiError } from './errorHandler';

// Get the backend URL from environment variables
const getBackendUrl = () => {
  // For production, use the environment variable
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // For development, use environment variable or fallback to localhost
  return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
};

const BACKEND_URL = getBackendUrl();

console.log('🌐 Backend URL configured:', BACKEND_URL);
console.log('🔧 Environment:', process.env.NODE_ENV);

// Health check function - enhanced for integration
export const checkBackendHealth = async (): Promise<{healthy: boolean, message: string}> => {
  try {
    console.log('🔍 Checking backend health...');
    const response = await api.get('/health', { timeout: 5000 });
    console.log('✅ Backend is healthy:', response.data);
    return { healthy: true, message: 'Backend is running' };
  } catch (error: any) {
    console.log('❌ Backend health check failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      return { healthy: false, message: 'Backend server is not running on ' + BACKEND_URL };
    }
    return { healthy: false, message: 'Backend connection failed: ' + error.message };
  }
};

export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // for cookies later
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Vendor Products
export const getVendorProducts = (vendorId: number, page: number = 0, size: number = 12) => {
  return api.get(`/api/products/vendor/${vendorId}`, {
    params: { page, size }
  });
};

export const addVendorProduct = (vendorId: number, productData: any) => {
  return api.post(`/api/products`, productData);
};

export const updateVendorProduct = (productId: number, productData: any) => {
  return api.put(`/api/products/${productId}`, productData);
};

export const deleteVendorProduct = (productId: number) => {
  return api.delete(`/api/products/${productId}`);
};

// Vendor Orders
export const getVendorOrders = (vendorId: number, page: number = 0, size: number = 10) => {
  return api.get(`/api/orders/vendor/my-orders/paginated`, {
    params: { page, size }
  });
};

// Vendor Leads
export const getVendorLeads = (vendorId: number) => {
  return api.get(`/api/leads/vendor/${vendorId}`);
};

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    
    // Try both token keys for compatibility
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No token found for request');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error details for debugging
    if (error.response) {
      console.log('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.log('API Error: No response received', error.request);
    } else {
      console.log('API Error:', error.message);
    }
    
      // Handle auth errors for protected API calls
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Auth check failed for URL:', error.config?.url);
        console.log('Error details:', error.response?.data);
        console.log('Status:', error.response?.status);
        
        // Check if this is an actual API call that requires authentication
        const url = error.config?.url || '';
        
        // More specific check for API endpoints that require authentication
        const isProtectedApiCall = url.includes('/auth/profile') || 
                                 url.includes('/auth/refresh') ||
                                 url.includes('/auth/logout') ||
                                 url.includes('/api/orders') ||
                                 (url.includes('/api/products/vendor/my-products')) ||
                                 url.includes('/api/leads/vendor') ||
                                 (url.includes('/vendor/') && !url.includes('/auth/vendor/login') && !url.includes('/auth/vendor/register') && !url.includes('/auth/vendor/verify'));
        
        console.log('Is protected API call?', isProtectedApiCall, 'for URL:', url);
        
        const hasToken = localStorage.getItem('authToken') || localStorage.getItem('token');
        console.log('Has token:', !!hasToken);
        console.log('Token value:', hasToken ? hasToken.substring(0, 20) + '...' : 'None');
        
        // For now, let's disable automatic logout on 403 errors to debug the issue
        // Only logout on 401 (unauthorized) not 403 (forbidden)
        const isAuthFailure = error.response?.status === 401 && isProtectedApiCall;
        
        if (isAuthFailure) {
          console.log('🚨 Auth failure (401) detected - clearing auth data');
          console.log('Failed URL:', url);
          console.log('Response status:', error.response?.status);
          console.log('Response data:', error.response?.data);
          
          // Clear all auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          localStorage.removeItem('userRole');
          localStorage.removeItem('vendorId');
          localStorage.removeItem('userId');
          
          // Force reload to trigger auth context update
          console.log('Reloading page to update auth state');
          window.location.reload();
        } else {
          console.log('❌ Not treating as auth failure');
          console.log('Protected API call:', isProtectedApiCall);
          console.log('Has token:', !!hasToken);
          console.log('Status:', error.response?.status);
          if (error.response?.status === 403) {
            console.log('⚠️ 403 Forbidden - Token exists but server denying access. Check backend logs.');
          }
        }
      }
    return Promise.reject(error);
  }
);

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health', { timeout: 5000 });
    return true;
  } catch (error) {
    console.log('API health check failed:', error);
    return false;
  }
};

// Test authentication and find correct user info
export const testAuthAndGetUser = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return null;
    }
    
    console.log('Testing authentication with token:', token.substring(0, 20) + '...');
    
    // Try to get user profile
    const response = await api.get('/auth/profile');
    console.log('User profile response:', response.data);
    return response.data;
  } catch (error: any) {
    console.log('Auth test failed:', error.response?.status, error.response?.data);
    return null;
  }
};

// Excel Import API functions
export const excelAPI = {
  // Import products from Excel/CSV file
  importProducts: async (vendorId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(`/api/excel/import/${vendorId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Download import template
  downloadTemplate: async () => {
    return api.get('/api/excel/template', {
      responseType: 'blob',
    });
  }
};

// Find correct bulk import endpoint (legacy - kept for compatibility)
export const findBulkImportEndpoint = async (userId: string): Promise<string | null> => {
  // New endpoint is now standardized
  return `/api/excel/import/${userId}`;
};
