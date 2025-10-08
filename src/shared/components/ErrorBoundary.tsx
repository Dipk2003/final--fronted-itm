'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({ error, retry }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. This might be due to a temporary issue with our servers.
        </p>

        {isDevelopment && error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-medium text-red-800 mb-2">Error Details (Development):</p>
            <code className="text-xs text-red-700 whitespace-pre-wrap">
              {error.message}
            </code>
          </div>
        )}

        <button
          onClick={retry}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );
};

// Simple error fallback for specific components
export const SimpleErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({ error, retry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
    <p className="text-red-600 text-sm mb-3">Failed to load content</p>
    <button
      onClick={retry}
      className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Retry
    </button>
  </div>
);

// API Error fallback for components that interact with APIs
export const ApiErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({ error, retry }) => {
  const isNetworkError = error?.message?.includes('fetch') || error?.message?.includes('Network');
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-yellow-100 rounded-full">
        <AlertTriangle className="w-6 h-6 text-yellow-600" />
      </div>
      
      <h4 className="text-lg font-medium text-yellow-800 mb-2">
        {isNetworkError ? 'Connection Issue' : 'Service Temporarily Unavailable'}
      </h4>
      
      <p className="text-yellow-700 text-sm mb-4">
        {isNetworkError 
          ? 'Unable to connect to our servers. Please check your internet connection.'
          : 'Our service is temporarily unavailable. We\'re working to fix this.'
        }
      </p>
      
      <button
        onClick={retry}
        className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </button>
    </div>
  );
};

export default ErrorBoundary;
