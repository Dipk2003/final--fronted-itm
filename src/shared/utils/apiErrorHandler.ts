import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: unknown;
  timestamp: string;
}

export class ApiErrorHandler {
  private static readonly ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error occurred. Please check your connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    UNAUTHORIZED: 'Your session has expired. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Invalid data provided.',
    DEFAULT: 'An unexpected error occurred.'
  };

  private static readonly ERROR_CODES = {
    NETWORK_ERROR: 'ERR_NETWORK',
    TIMEOUT: 'ERR_TIMEOUT',
    AUTH_EXPIRED: 'ERR_AUTH_EXPIRED',
    VALIDATION_FAILED: 'ERR_VALIDATION',
    SERVER_ERROR: 'ERR_SERVER'
  };

  static handleError(error: AxiosError): ApiError {
    if (!error.response) {
      // Network error or timeout
      return this.createApiError(
        error.code === 'ECONNABORTED' 
          ? this.ERROR_MESSAGES.TIMEOUT 
          : this.ERROR_MESSAGES.NETWORK_ERROR,
        error.code === 'ECONNABORTED' 
          ? this.ERROR_CODES.TIMEOUT 
          : this.ERROR_CODES.NETWORK_ERROR,
        0,
        error
      );
    }

    const status = error.response.status;
    const data = error.response.data as any;

    switch (status) {
      case 400:
        return this.createApiError(
          data.message || this.ERROR_MESSAGES.VALIDATION_ERROR,
          this.ERROR_CODES.VALIDATION_FAILED,
          status,
          data
        );

      case 401:
        return this.createApiError(
          this.ERROR_MESSAGES.UNAUTHORIZED,
          this.ERROR_CODES.AUTH_EXPIRED,
          status,
          data
        );

      case 403:
        return this.createApiError(
          this.ERROR_MESSAGES.FORBIDDEN,
          'ERR_FORBIDDEN',
          status,
          data
        );

      case 404:
        return this.createApiError(
          this.ERROR_MESSAGES.NOT_FOUND,
          'ERR_NOT_FOUND',
          status,
          data
        );

      case 500:
      case 502:
      case 503:
      case 504:
        return this.createApiError(
          this.ERROR_MESSAGES.SERVER_ERROR,
          this.ERROR_CODES.SERVER_ERROR,
          status,
          data
        );

      default:
        return this.createApiError(
          this.ERROR_MESSAGES.DEFAULT,
          'ERR_UNKNOWN',
          status,
          data
        );
    }
  }

  private static createApiError(
    message: string,
    code: string,
    status: number,
    details?: unknown
  ): ApiError {
    return {
      message,
      code,
      status,
      details,
      timestamp: new Date().toISOString()
    };
  }

  static isAuthError(error: ApiError): boolean {
    return error.status === 401 || error.code === this.ERROR_CODES.AUTH_EXPIRED;
  }

  static isNetworkError(error: ApiError): boolean {
    return error.code === this.ERROR_CODES.NETWORK_ERROR;
  }

  static isServerError(error: ApiError): boolean {
    return error.status >= 500 && error.status <= 599;
  }

  static isValidationError(error: ApiError): boolean {
    return error.code === this.ERROR_CODES.VALIDATION_FAILED;
  }

  static getErrorMessage(error: ApiError): string {
    if (this.isValidationError(error) && error.details) {
      // Handle validation errors with multiple field errors
      const details = error.details as Record<string, string>;
      return Object.values(details).join('. ');
    }
    return error.message;
  }

  static shouldRetry(error: ApiError): boolean {
    return (
      this.isNetworkError(error) ||
      this.isServerError(error) ||
      error.code === this.ERROR_CODES.TIMEOUT
    );
  }
}

export class RetryStrategy {
  private maxRetries: number;
  private baseDelay: number;
  private maxDelay: number;

  constructor(
    maxRetries: number = 3,
    baseDelay: number = 1000,
    maxDelay: number = 10000
  ) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
  }

  async retry<T>(
    operation: () => Promise<T>,
    shouldRetry: (error: any) => boolean = () => true
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === this.maxRetries || !shouldRetry(error)) {
          throw error;
        }
        
        await this.delay(attempt);
      }
    }

    throw lastError;
  }

  private async delay(attempt: number): Promise<void> {
    const delay = Math.min(
      this.baseDelay * Math.pow(2, attempt),
      this.maxDelay
    );
    
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Example usage:
/*
const retryStrategy = new RetryStrategy(3, 1000, 10000);

try {
  const result = await retryStrategy.retry(
    async () => {
      // Your API call here
      return await api.getData();
    },
    (error) => ApiErrorHandler.shouldRetry(error)
  );
} catch (error) {
  const apiError = ApiErrorHandler.handleError(error);
  console.error(ApiErrorHandler.getErrorMessage(apiError));
}
*/
