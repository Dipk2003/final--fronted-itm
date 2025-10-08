import { AxiosError } from 'axios';

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  status?: number;
}

export interface ErrorHandlerOptions {
  showNotification?: boolean;
  logToConsole?: boolean;
  retryable?: boolean;
  customMessage?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Handle API errors with enhanced context
  handleApiError(error: any, options: ErrorHandlerOptions = {}): ApiError {
    const {
      showNotification = true,
      logToConsole = true,
      retryable = false,
      customMessage
    } = options;

    let apiError: ApiError;

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      apiError = {
        code: this.getErrorCode(status),
        message: customMessage || this.getErrorMessage(status, data),
        details: data,
        status
      };

      if (logToConsole) {
        console.error('API Error Response:', {
          status,
          url: error.config?.url,
          method: error.config?.method,
          data: data,
          headers: error.config?.headers
        });
      }

    } else if (error.request) {
      // Network error - no response received
      apiError = {
        code: 'NETWORK_ERROR',
        message: customMessage || 'Network error. Please check your connection and try again.',
        details: error.request
      };

      if (logToConsole) {
        console.error('Network Error:', error.request);
      }

    } else {
      // Something else happened
      apiError = {
        code: 'UNKNOWN_ERROR',
        message: customMessage || error.message || 'An unexpected error occurred',
        details: error
      };

      if (logToConsole) {
        console.error('Unknown Error:', error);
      }
    }

    // Show notification if enabled
    if (showNotification && typeof window !== 'undefined') {
      this.showErrorNotification(apiError);
    }

    return apiError;
  }

  // Get error code based on HTTP status
  private getErrorCode(status: number): string {
    switch (status) {
      case 400: return 'BAD_REQUEST';
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      case 422: return 'VALIDATION_ERROR';
      case 429: return 'RATE_LIMIT_EXCEEDED';
      case 500: return 'INTERNAL_SERVER_ERROR';
      case 502: return 'BAD_GATEWAY';
      case 503: return 'SERVICE_UNAVAILABLE';
      case 504: return 'GATEWAY_TIMEOUT';
      default: return 'API_ERROR';
    }
  }

  // Get user-friendly error message
  private getErrorMessage(status: number, data: any): string {
    // Try to extract message from response data
    const serverMessage = data?.message || data?.error || data?.details;
    
    switch (status) {
      case 400:
        return serverMessage || 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return serverMessage || 'Please check your input and try again.';
      case 429:
        return 'Too many requests. Please wait a moment before trying again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Server is temporarily unavailable. Please try again later.';
      case 503:
        return 'Service is temporarily unavailable. Please try again later.';
      case 504:
        return 'Request timeout. Please try again later.';
      default:
        return serverMessage || `An error occurred (${status}). Please try again.`;
    }
  }

  // Show error notification (can be replaced with your notification system)
  private showErrorNotification(error: ApiError) {
    // For now, we'll use browser notification or fallback to console
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Error', {
        body: error.message,
        icon: '/error-icon.png'
      });
    } else {
      // Fallback to console or custom notification system
      console.warn('Error Notification:', error.message);
      
      // If you have a custom notification system (like toast), use it here
      // toast.error(error.message);
    }
  }

  // Handle validation errors specifically
  handleValidationError(error: any): { [key: string]: string[] } {
    const validationErrors: { [key: string]: string[] } = {};

    if (error.response?.data?.errors) {
      // Spring Boot style validation errors
      const errors = error.response.data.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          const field = err.field || 'general';
          if (!validationErrors[field]) {
            validationErrors[field] = [];
          }
          validationErrors[field].push(err.defaultMessage || err.message);
        });
      }
    } else if (error.response?.data?.fieldErrors) {
      // Alternative validation error format
      const fieldErrors = error.response.data.fieldErrors;
      Object.keys(fieldErrors).forEach(field => {
        validationErrors[field] = Array.isArray(fieldErrors[field]) 
          ? fieldErrors[field] 
          : [fieldErrors[field]];
      });
    }

    return validationErrors;
  }

  // Check if error is retryable
  isRetryable(error: ApiError): boolean {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return error.status ? retryableStatuses.includes(error.status) : false;
  }

  // Check if error requires authentication
  requiresAuthentication(error: ApiError): boolean {
    return error.status === 401;
  }

  // Check if error is a validation error
  isValidationError(error: ApiError): boolean {
    return error.status === 422 || error.code === 'VALIDATION_ERROR';
  }

  // Retry function with exponential backoff
  async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        const apiError = this.handleApiError(error, { showNotification: false });
        
        if (!this.isRetryable(apiError) || attempt === maxAttempts) {
          throw error;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

export const errorHandler = ErrorHandler.getInstance();

// Convenience functions
export const handleApiError = (error: any, options?: ErrorHandlerOptions): ApiError => {
  return errorHandler.handleApiError(error, options);
};

export const handleValidationError = (error: any): { [key: string]: string[] } => {
  return errorHandler.handleValidationError(error);
};

export const isRetryableError = (error: ApiError): boolean => {
  return errorHandler.isRetryable(error);
};

export const requiresAuth = (error: ApiError): boolean => {
  return errorHandler.requiresAuthentication(error);
};

export const retryWithBackoff = <T>(
  fn: () => Promise<T>,
  maxAttempts?: number,
  baseDelay?: number
): Promise<T> => {
  return errorHandler.retry(fn, maxAttempts, baseDelay);
};
