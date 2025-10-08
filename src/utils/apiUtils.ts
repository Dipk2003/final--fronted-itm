// API utilities for error handling, loading states, and common operations

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

// Error types for better error handling
export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class ApiError extends Error {
  type: ApiErrorType;
  statusCode: number;
  details?: any;

  constructor(message: string, type: ApiErrorType, statusCode: number, details?: any) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Get auth token from storage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Enhanced fetch wrapper with error handling
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: getAuthHeaders(),
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    // Handle different status codes
    if (response.status === 401) {
      // Clear auth token and redirect to login
      localStorage.removeItem('authToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/user/login';
      }
      throw new ApiError('Authentication required', ApiErrorType.AUTHENTICATION_ERROR, 401);
    }

    if (response.status === 403) {
      throw new ApiError('Access forbidden', ApiErrorType.AUTHORIZATION_ERROR, 403);
    }

    if (response.status === 404) {
      throw new ApiError('Resource not found', ApiErrorType.NOT_FOUND, 404);
    }

    if (response.status >= 500) {
      throw new ApiError('Server error', ApiErrorType.SERVER_ERROR, response.status);
    }

    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP ${response.status}`;
      throw new ApiError(errorMessage, ApiErrorType.VALIDATION_ERROR, response.status, data);
    }

    return {
      success: true,
      data,
      statusCode: response.status
    };

  } catch (error) {
    console.error('API Request Error:', error);

    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        statusCode: error.statusCode
      };
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        success: false,
        error: 'Network error. Please check your internet connection.',
        statusCode: 0
      };
    }

    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return {
        success: false,
        error: 'Request timeout. Please try again.',
        statusCode: 408
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
      statusCode: 500
    };
  }
};

// Specific HTTP methods
export const apiGet = <T = any>(endpoint: string): Promise<ApiResponse<T>> =>
  apiRequest<T>(endpoint);

export const apiPost = <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> =>
  apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  });

export const apiPut = <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> =>
  apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  });

export const apiPatch = <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> =>
  apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined
  });

export const apiDelete = <T = any>(endpoint: string): Promise<ApiResponse<T>> =>
  apiRequest<T>(endpoint, { method: 'DELETE' });

// File upload utility
export const apiUpload = async <T = any>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<ApiResponse<T>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    });
  }

  const token = getAuthToken();
  return apiRequest<T>(endpoint, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData
  });
};

// Retry utility for failed requests
export const withRetry = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> => {
  let lastError: ApiResponse<T>;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await apiCall();
      if (result.success) {
        return result;
      }
      lastError = result;
    } catch (error) {
      lastError = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: 500
      };
    }

    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  return lastError!;
};

// Hook for managing loading states
export const useLoadingState = (initialState: Record<string, boolean> = {}) => {
  const [loading, setLoading] = React.useState<LoadingState>(initialState);

  const setLoadingState = (key: string, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }));
  };

  const isLoading = (key: string) => Boolean(loading[key]);

  const withLoading = async <T>(key: string, apiCall: () => Promise<T>): Promise<T> => {
    setLoadingState(key, true);
    try {
      return await apiCall();
    } finally {
      setLoadingState(key, false);
    }
  };

  return { loading, setLoadingState, isLoading, withLoading };
};

// Hook for managing error states
export const useErrorState = (initialState: Record<string, string | null> = {}) => {
  const [errors, setErrors] = React.useState<ErrorState>(initialState);

  const setError = (key: string, error: string | null) => {
    setErrors(prev => ({ ...prev, [key]: error }));
  };

  const clearError = (key: string) => {
    setError(key, null);
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const getError = (key: string) => errors[key];

  return { errors, setError, clearError, clearAllErrors, getError };
};

// Combined hook for API operations
export const useApiState = (initialLoading: Record<string, boolean> = {}, initialErrors: Record<string, string | null> = {}) => {
  const { loading, setLoadingState, isLoading, withLoading } = useLoadingState(initialLoading);
  const { errors, setError, clearError, clearAllErrors, getError } = useErrorState(initialErrors);

  const withApiCall = async <T>(
    key: string,
    apiCall: () => Promise<ApiResponse<T>>,
    onSuccess?: (data: T) => void,
    onError?: (error: string) => void
  ): Promise<T | null> => {
    clearError(key);
    setLoadingState(key, true);

    try {
      const result = await apiCall();
      
      if (result.success && result.data) {
        onSuccess?.(result.data);
        return result.data;
      } else {
        const errorMessage = result.error || 'An error occurred';
        setError(key, errorMessage);
        onError?.(errorMessage);
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(key, errorMessage);
      onError?.(errorMessage);
      return null;
    } finally {
      setLoadingState(key, false);
    }
  };

  return {
    loading,
    errors,
    isLoading,
    getError,
    setError,
    clearError,
    clearAllErrors,
    withApiCall
  };
};

// Debounce utility for search/input operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Cache utility for API responses
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache();

// Cached API request wrapper
export const cachedApiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  ttl?: number
): Promise<ApiResponse<T>> => {
  const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
  const cachedData = apiCache.get(cacheKey);

  if (cachedData) {
    return {
      success: true,
      data: cachedData
    };
  }

  const response = await apiRequest<T>(endpoint, options);
  
  if (response.success && response.data) {
    apiCache.set(cacheKey, response.data, ttl);
  }

  return response;
};

// Error boundary helper for React components
export const handleComponentError = (error: Error, errorInfo: any) => {
  console.error('Component Error:', error, errorInfo);
  
  // You can send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Send to logging service like Sentry, LogRocket, etc.
  }
};

// Format error messages for user display
export const formatErrorMessage = (error: string | ApiError): string => {
  if (error instanceof ApiError) {
    switch (error.type) {
      case ApiErrorType.NETWORK_ERROR:
        return 'Network error. Please check your internet connection and try again.';
      case ApiErrorType.AUTHENTICATION_ERROR:
        return 'Please log in to continue.';
      case ApiErrorType.AUTHORIZATION_ERROR:
        return 'You do not have permission to perform this action.';
      case ApiErrorType.NOT_FOUND:
        return 'The requested resource was not found.';
      case ApiErrorType.SERVER_ERROR:
        return 'Server error. Please try again later.';
      case ApiErrorType.TIMEOUT_ERROR:
        return 'Request timeout. Please try again.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  }

  return typeof error === 'string' ? error : 'An unexpected error occurred.';
};