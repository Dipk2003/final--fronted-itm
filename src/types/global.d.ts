// Global types for development
declare global {
  interface Window {
    performanceMonitor?: any;
  }
}

// Common type definitions to reduce any usage
export type ApiResponse<T = any> = {
  data: T;
  message?: string;
  status: number;
  success: boolean;
};

export type ApiError = {
  message: string;
  status: number;
  code?: string;
};

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type PaginationParams = {
  page: number;
  size: number;
  sort?: string;
  order?: 'asc' | 'desc';
};

export type FilterParams = {
  [key: string]: string | number | boolean | undefined;
};

// Fix for common component props
export type ComponentWithChildren = {
  children: React.ReactNode;
};

export type ClassName = {
  className?: string;
};

// Export empty to make this a module
export {};
