import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

// Types for enhanced API client
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  status: number;
  errors?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface RequestRetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition?: (error: AxiosError) => boolean;
}

// Enhanced API Client Class
class EnhancedApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private tokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.baseURL = this.getBaseURL();
    this.client = this.createAxiosInstance();
    this.setupInterceptors();
  }

  private getBaseURL(): string {
    if (typeof window === 'undefined') {
      // Server-side rendering
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    }
    
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL || 
           process.env.NEXT_PUBLIC_BASE_URL || 
           'http://localhost:8080';
  }

  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return this.client(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshAuthToken(refreshToken);
              const { token } = response;
              
              this.setToken(token);
              this.processQueue(null, token);
              
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return this.handleError(error);
      }
    );
  }

  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private handleAuthFailure(): void {
    this.clearAuthData();
    toast.error('Session expired. Please login again.');
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  private async refreshAuthToken(refreshToken: string): Promise<{ token: string }> {
    const response = await axios.post(`${this.baseURL}/auth/refresh`, {
      refreshToken
    });
    return response.data;
  }

  private handleError(error: AxiosError): Promise<never> {
    console.error('❌ API Error:', error);
    
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || error.message;
      
      switch (status) {
        case 400:
          toast.error(`Bad Request: ${message}`);
          break;
        case 401:
          toast.error('Unauthorized access');
          break;
        case 403:
          toast.error('Access forbidden');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(`Error: ${message}`);
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }

  // Token management
  public getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  public setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
  }

  public getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.refreshTokenKey);
  }

  public setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.refreshTokenKey, token);
  }

  public clearAuthData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
  }

  // HTTP Methods with enhanced error handling and retry logic
  public async get<T = any>(
    url: string, 
    config?: AxiosRequestConfig,
    retryConfig?: RequestRetryConfig
  ): Promise<T> {
    return this.executeRequest(() => this.client.get<T>(url, config), retryConfig);
  }

  public async post<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig,
    retryConfig?: RequestRetryConfig
  ): Promise<T> {
    return this.executeRequest(() => this.client.post<T>(url, data, config), retryConfig);
  }

  public async put<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig,
    retryConfig?: RequestRetryConfig
  ): Promise<T> {
    return this.executeRequest(() => this.client.put<T>(url, data, config), retryConfig);
  }

  public async patch<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig,
    retryConfig?: RequestRetryConfig
  ): Promise<T> {
    return this.executeRequest(() => this.client.patch<T>(url, data, config), retryConfig);
  }

  public async delete<T = any>(
    url: string, 
    config?: AxiosRequestConfig,
    retryConfig?: RequestRetryConfig
  ): Promise<T> {
    return this.executeRequest(() => this.client.delete<T>(url, config), retryConfig);
  }

  // File upload with progress tracking
  public async uploadFile<T = any>(
    url: string,
    file: File | FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response = await this.client.post<T>(url, formData, config);
    return response.data;
  }

  // Execute request with retry logic
  private async executeRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retryConfig?: RequestRetryConfig
  ): Promise<T> {
    const defaultRetryConfig: RequestRetryConfig = {
      retries: 3,
      retryDelay: 1000,
      retryCondition: (error: AxiosError) => {
        return !error.response || error.response.status >= 500;
      },
    };

    const config = { ...defaultRetryConfig, ...retryConfig };
    let lastError: AxiosError;

    for (let attempt = 0; attempt <= config.retries; attempt++) {
      try {
        const response = await requestFn();
        return response.data;
      } catch (error) {
        lastError = error as AxiosError;
        
        if (attempt === config.retries || !config.retryCondition!(lastError)) {
          throw lastError;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, config.retryDelay * (attempt + 1)));
        console.log(`🔄 Retrying request... (${attempt + 1}/${config.retries})`);
      }
    }

    throw lastError!;
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health', { timeout: 5000 });
      return true;
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
      return false;
    }
  }

  // Utility methods
  public buildUrl(endpoint: string, params?: Record<string, any>): string {
    let url = endpoint;
    
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return url;
  }

  public getBaseUrl(): string {
    return this.baseURL;
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new EnhancedApiClient();
export default apiClient;

// Export helper functions
export const isApiError = (error: any): error is AxiosError => {
  return error?.isAxiosError === true;
};

export const getErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return (error.response?.data as any)?.message || error.message || 'An error occurred';
  }
  return error?.message || 'An unexpected error occurred';
};

export const getErrorStatus = (error: any): number | null => {
  if (isApiError(error)) {
    return error.response?.status || null;
  }
  return null;
};