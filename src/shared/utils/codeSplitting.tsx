import React, { Suspense, lazy, ComponentType, Component } from 'react';
import { LoadingStates } from '../components/LoadingStates';

class ErrorBoundary extends Component<{ fallback?: React.ReactNode; children?: React.ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

interface LazyLoadConfig {
  fallback?: React.ReactNode;
  errorBoundary?: boolean;
  preload?: boolean;
  retry?: boolean;
  maxRetries?: number;
}

const defaultConfig: LazyLoadConfig = {
  fallback: <LoadingStates type="spinner" size="medium" />,
  errorBoundary: true,
  preload: false,
  retry: true,
  maxRetries: 3
};

export function lazyLoad<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  config: LazyLoadConfig = {}
): React.LazyExoticComponent<T> & { preload: () => void } {
  const finalConfig = { ...defaultConfig, ...config };
  let retryCount = 0;

  const loadComponent = async () => {
    try {
      return await factory();
    } catch (error) {
      if (finalConfig.retry && retryCount < (finalConfig.maxRetries || 3)) {
        retryCount++;
        return loadComponent();
      }
      throw error;
    }
  };

  const LazyComponent = lazy(loadComponent);

  const WrappedComponent = (props: React.ComponentProps<T>) => (
    <Suspense fallback={finalConfig.fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );

  // Add preload capability
  const preloadFunction = () => {
    factory().catch(console.error);
  };

  if (finalConfig.preload) {
    // Trigger preload immediately if configured
    preloadFunction();
  }

  // Attach preload function to component
  (WrappedComponent as any).preload = preloadFunction;

  return WrappedComponent as any;
}

// Route config helper
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<any>;
  preload?: boolean;
}

export const createRouteConfig = (
  path: string,
  importFunc: () => Promise<any>,
  preload = false
): RouteConfig => ({
  path,
  component: lazyLoad(importFunc, { preload }),
  preload
});

// Example route configurations
export const routes = {
  home: createRouteConfig(
    '/',
    () => import('../../app/page'),
    true // Preload home page
  ),
  products: createRouteConfig(
    '/products',
    () => import('../../app/products/page')
  ),
  cart: createRouteConfig(
    '/cart',
    () => import('../../app/cart/page')
  ),
  // Add more routes as needed
};

// Preload helper for route transitions
export const preloadRoute = (route: RouteConfig) => {
  if ((route.component as any).preload) {
    (route.component as any).preload();
  }
};

// Helper to preload routes based on user interaction
export const preloadOnHover = (route: RouteConfig) => {
  let timeout: NodeJS.Timeout;
  
  return {
    onMouseEnter: () => {
      timeout = setTimeout(() => preloadRoute(route), 100);
    },
    onMouseLeave: () => {
      clearTimeout(timeout);
    }
  };
};

// Component performance optimization utilities
export const withMemoization = <P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
) => {
  return React.memo(Component, propsAreEqual);
};

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Image optimization helper
export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lazy?: boolean;
  threshold?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  lazy = true,
  threshold = 0.1,
  placeholder,
  onLoad,
  onError,
  ...props
}) => {
  const [loaded, setLoaded] = React.useState(!lazy);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (!lazy || !window.IntersectionObserver) {
      return;
    }

    const currentRef = imgRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (imgRef.current) {
            imgRef.current.src = src;
            observer.unobserve(imgRef.current);
          }
        }
      },
      {
        threshold
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [src, lazy, threshold]);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    onError?.();
  };

  return (
    <div className={`optimized-image ${loaded ? 'loaded' : ''}`}>
      <img
        ref={imgRef}
        src={lazy ? placeholder : src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      <style jsx>{`
        .optimized-image {
          position: relative;
          overflow: hidden;
        }

        .optimized-image img {
          width: 100%;
          height: 100%;
          transition: opacity 0.3s ease;
        }

        .optimized-image:not(.loaded) img {
          opacity: 0;
        }

        .optimized-image.loaded img {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

// Example usage:
/*
// Lazy loaded component
const MyLazyComponent = lazyLoad(() => import('./MyComponent'), {
  preload: true,
  fallback: <CustomLoadingSpinner />
});

// Route configuration
const routes = {
  dashboard: createRouteConfig(
    '/dashboard',
    () => import('./DashboardPage'),
    true
  )
};

// Optimized image
<OptimizedImage
  src="/large-image.jpg"
  alt="Description"
  lazy
  placeholder="/placeholder.jpg"
  onLoad={() => console.log('Image loaded')}
/>

// Memoized component
const MemoizedComponent = withMemoization(MyComponent, (prev, next) => {
  return prev.id === next.id;
});

// Component with error boundary
const SafeComponent = withErrorBoundary(MyComponent, <ErrorFallback />);
*/
