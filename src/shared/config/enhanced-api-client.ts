/**
 * Enhanced API Client with Enterprise-Grade Features
 * ================================================
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Request/Response interceptors
 * - Error handling and logging
 * - Performance monitoring
 * - Authentication management
 * - Network status monitoring
 * - Request cancellation
 * - Rate limiting protection
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface RetryConfig {
  attempts: number;
  delay: number;
  maxDelay: number;
  exponentialBase: number;
}

interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retry: RetryConfig;
  enableLogging: boolean;
  enableMonitoring: boolean;
}

interface RequestMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  url: string;
  method: string;
  status?: number;
  error?: string;
}

// =============================================================================
// ENHANCED API CLIENT CLASS
// =============================================================================

class EnhancedApiClient {
  private axiosInstance: AxiosInstance;
  private config: ApiClientConfig;
  private requestMetrics: Map<string, RequestMetrics> = new Map();
  private networkStatus: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.setupNetworkMonitoring();
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: true,
    });
  }

  private setupNetworkMonitoring(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.networkStatus = true;
        this.log('Network status: Online');
      });

      window.addEventListener('offline', () => {
        this.networkStatus = false;
        this.log('Network status: Offline');
      });
    }
  }

  // =============================================================================
  // INTERCEPTORS
  // =============================================================================

  private setupInterceptors(): void {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => this.handleRequest(config),
      (error) => this.handleRequestError(error)
    );

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => this.handleResponse(response),
      (error) => this.handleResponseError(error)
    );
  }

  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    // Check network status
    if (!this.networkStatus) {
      throw new Error('No internet connection');
    }

    // Add authentication token
    const token = this.getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    const requestId = this.generateRequestId();
    if (config.headers) {
      config.headers['X-Request-ID'] = requestId;
    }

    // Start metrics tracking
    if (this.config.enableMonitoring) {
      this.startRequestMetrics(requestId, config);
    }

    // Logging
    if (this.config.enableLogging) {
      this.log('Request:', {
        id: requestId,
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data
      });
    }

    return config;
  }

  private handleRequestError(error: AxiosError): Promise<never> {
    this.log('Request Error:', error.message);
    return Promise.reject(error);
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    const requestId = response.config.headers?.['X-Request-ID'] as string;

    // Complete metrics tracking
    if (this.config.enableMonitoring && requestId) {
      this.completeRequestMetrics(requestId, response.status);
    }

    // Logging
    if (this.config.enableLogging) {
      this.log('Response:', {
        id: requestId,
        status: response.status,
        data: response.data
      });
    }

    return response;
  }

  private async handleResponseError(error: AxiosError): Promise<any> {
    const requestId = error.config?.headers?.['X-Request-ID'] as string;

    // Complete metrics tracking with error
    if (this.config.enableMonitoring && requestId) {
      this.completeRequestMetrics(requestId, error.response?.status, error.message);
    }

    // Handle specific error types
    if (error.response?.status === 401) {
      await this.handleUnauthorized();
    } else if (error.response?.status === 429) {
      await this.handleRateLimit(error);
    }

    // Retry logic
    if (this.shouldRetry(error)) {
      return this.retryRequest(error);
    }

    // Logging
    if (this.config.enableLogging) {
      this.log('Response Error:', {
        id: requestId,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }

    return Promise.reject(error);
  }

  // =============================================================================
  // RETRY LOGIC
  // =============================================================================

  private shouldRetry(error: AxiosError): boolean {
    const { retry } = this.config;
    const retryCount = (error.config as any)?._retryCount ?? 0;

    // Don't retry if max attempts reached
    if (retryCount >= retry.attempts) {
      return false;
    }

    // Retry on network errors
    if (!error.response) {
      return true;
    }

    // Retry on specific status codes
    const retryStatusCodes = [408, 429, 500, 502, 503, 504];
    return retryStatusCodes.includes(error.response.status);
  }

  private async retryRequest(error: AxiosError): Promise<any> {
    const { retry } = this.config;
    const retryCount = ((error.config as any)?._retryCount ?? 0) + 1;
    
    // Calculate delay with exponential backoff
    const delay = Math.min(
      retry.delay * Math.pow(retry.exponentialBase, retryCount - 1),
      retry.maxDelay
    );

    this.log(`Retrying request (attempt ${retryCount}/${retry.attempts}) after ${delay}ms`);

    // Wait for delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // Add retry count to config
    (error.config as any)._retryCount = retryCount;

    // Retry the request
    return this.axiosInstance.request(error.config!);
  }

  // =============================================================================
  // ERROR HANDLERS
  // =============================================================================

  private async handleUnauthorized(): Promise<void> {
    this.log('Unauthorized access detected, clearing auth data');
    
    // Clear authentication data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Redirect to login (let the app handle this)
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  }

  private async handleRateLimit(error: AxiosError): Promise<void> {
    const retryAfter = error.response?.headers['retry-after'];
    const delay = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
    
    this.log(`Rate limited, waiting ${delay}ms before retry`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // =============================================================================
  // METRICS & MONITORING
  // =============================================================================

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startRequestMetrics(requestId: string, config: AxiosRequestConfig): void {
    this.requestMetrics.set(requestId, {
      startTime: Date.now(),
      url: config.url || '',
      method: config.method?.toUpperCase() || 'GET'
    });
  }

  private completeRequestMetrics(requestId: string, status?: number, error?: string): void {
    const metrics = this.requestMetrics.get(requestId);
    if (metrics) {
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      metrics.status = status;
      metrics.error = error;

      // Send metrics to monitoring service
      this.sendMetrics(metrics);
      
      // Clean up
      this.requestMetrics.delete(requestId);
    }
  }

  private sendMetrics(metrics: RequestMetrics): void {
    // Send to analytics/monitoring service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'api_request', {
        method: metrics.method,
        url: metrics.url,
        duration: metrics.duration,
        status: metrics.status,
        error: metrics.error
      });
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return null;
    }
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        this.log('Token expired, clearing auth data');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return null;
      }
      
      return token;
    } catch (error) {
      this.log('Invalid token format, clearing auth data');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return null;
    }
  }

  private log(message: string, data?: any): void {
    if (this.config.enableLogging) {
      const timestamp = new Date().toISOString();
      console.log(`[API Client ${timestamp}] ${message}`, data || '');
    }
  }

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put(url, data, config);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete(url, config);
  }

  public getMetrics(): RequestMetrics[] {
    return Array.from(this.requestMetrics.values());
  }

  public isOnline(): boolean {
    return this.networkStatus;
  }
}

// =============================================================================
// CONFIGURATION & EXPORT
// =============================================================================

const apiConfig: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  retry: {
    attempts: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3'),
    delay: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000'),
    maxDelay: 30000,
    exponentialBase: 2
  },
  enableLogging: process.env.NODE_ENV === 'development',
  enableMonitoring: process.env.NEXT_PUBLIC_MONITORING_ENABLED === 'true'
};

// Create and export API client instance
export const api = new EnhancedApiClient(apiConfig);

// Export types for use in other files
export type { ApiClientConfig, RequestMetrics };

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const healthUrl = process.env.NEXT_PUBLIC_HEALTH_CHECK_URL || `${apiConfig.baseURL}/health`;
    await api.get(healthUrl.replace('/api', ''));
    return true;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

export default api;
