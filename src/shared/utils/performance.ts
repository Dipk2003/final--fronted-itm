/**
 * 🚀 Performance Optimization Utilities
 * 
 * Tools for lazy loading, caching, and performance monitoring
 */

import React, { lazy, ComponentType, useEffect, createElement, LazyExoticComponent } from 'react';

// 📦 Lazy Loading Utilities
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): LazyExoticComponent<T> {
  return lazy(importFunc);
}

// 🎯 Common lazy-loaded components
export const LazyComponents = {
  // Auth components (commented out until components exist)
  // Login: createLazyComponent(() => import('@/components/auth/Login')),
  // Register: createLazyComponent(() => import('@/components/auth/Register')),
  
  // Dashboard components (commented out until components exist)
  // AdminDashboard: createLazyComponent(() => import('@/components/dashboard/admin/AdminDashboard')),
  // UserDashboard: createLazyComponent(() => import('@/components/dashboard/UserDashboard')),
  
  // Product components (commented out until components exist)
  // ProductDetails: createLazyComponent(() => import('@/components/vendor/ProductDetails')),
  // ProductList: createLazyComponent(() => import('@/components/vendor/ProductList')),
  
  // Cart components (commented out until components exist)
  // Cart: createLazyComponent(() => import('@/components/Cart/Cart')),
  
  // Chat components
  ChatWindow: createLazyComponent(() => import('@/components/chat/ChatWindow')),
  // ChatList: createLazyComponent(() => import('@/components/chat/ChatList')),
};

// 💾 Simple Cache Implementation
class SimpleCache {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();
  
  set(key: string, data: unknown, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

export const cache = new SimpleCache();

// 📊 Performance Monitoring
class PerformanceMonitor {
  private metrics: { [key: string]: number[] } = {};
  
  startTimer(name: string): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      return duration;
    };
  }
  
  recordMetric(name: string, value: number): void {
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    this.metrics[name].push(value);
    
    // Keep only last 100 measurements
    if (this.metrics[name].length > 100) {
      this.metrics[name] = this.metrics[name].slice(-100);
    }
  }
  
  getAverageMetric(name: string): number {
    const values = this.metrics[name];
    if (!values || values.length === 0) return 0;
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  getAllMetrics(): { [key: string]: { average: number; count: number } } {
    const result: { [key: string]: { average: number; count: number } } = {};
    
    Object.keys(this.metrics).forEach(key => {
      const values = this.metrics[key];
      result[key] = {
        average: this.getAverageMetric(key),
        count: values.length
      };
    });
    
    return result;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// 🎪 Debounce utility
export function debounce<T extends (...args: unknown[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// ⏱️ Throttle utility  
export function throttle<T extends (...args: unknown[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 📱 Image lazy loading utility
export function createImageLoader() {
  const imageCache = new Set<string>();
  
  return {
    loadImage: (src: string): Promise<void> => {
      if (imageCache.has(src)) {
        return Promise.resolve();
      }
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          imageCache.add(src);
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });
    },
    
    preloadImages: (srcs: string[]): Promise<void[]> => {
      return Promise.all(srcs.map(src => this.loadImage(src)));
    }
  };
}

// 🔄 API Response Cache with React Query style
export function createQueryCache<TData, TKey = string>(
  fetchFn: (key: TKey) => Promise<TData>,
  options: {
    staleTime?: number;
    cacheTime?: number;
  } = {}
) {
  const { staleTime = 5 * 60 * 1000, cacheTime = 10 * 60 * 1000 } = options;
  
  return {
    fetch: async (key: TKey): Promise<TData> => {
      const cacheKey = typeof key === 'string' ? key : JSON.stringify(key);
      
      // Check cache first
      const cached = cache.get<TData>(cacheKey);
      if (cached) {
        return cached;
      }
      
      // Fetch fresh data
      const data = await fetchFn(key);
      cache.set(cacheKey, data, cacheTime);
      
      return data;
    },
    
    invalidate: (key: TKey): void => {
      const cacheKey = typeof key === 'string' ? key : JSON.stringify(key);
      cache.delete(cacheKey);
    },
    
    prefetch: async (key: TKey): Promise<void> => {
      await this.fetch(key);
    }
  };
}

// 📈 Bundle size analyzer
export function analyzeBundleSize() {
  if (typeof window !== 'undefined') {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const totalSize = scripts.reduce((size, script) => {
      // This is a rough estimation
      return size + (script.getAttribute('src')?.length || 0);
    }, 0);
    
    console.log('📊 Estimated bundle size:', `${(totalSize / 1024).toFixed(2)} KB`);
    console.log('📦 Script files:', scripts.length);
  }
}

// 🎭 Component Performance Wrapper
export function withPerformanceLogging<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string
): ComponentType<P> {
  const PerformanceWrapper = (props: P) => {
    const endTimer = performanceMonitor.startTimer(`${componentName}_render`);
    
    // Record render time after component mounts
    useEffect(() => {
      endTimer();
    }, [endTimer]);
    
    return createElement(WrappedComponent, props);
  };

  PerformanceWrapper.displayName = `withPerformanceLogging(${componentName})`;
  return PerformanceWrapper;
}

// 📊 Performance reporting
export function generatePerformanceReport() {
  const metrics = performanceMonitor.getAllMetrics();
  const report = {
    timestamp: new Date().toISOString(),
    metrics,
    recommendations: [] as string[]
  };
  
  // Add recommendations based on metrics
  Object.keys(metrics).forEach(key => {
    const metric = metrics[key];
    if (key.includes('render') && metric.average > 100) {
      report.recommendations.push(`${key} is slow (${metric.average.toFixed(2)}ms avg)`);
    }
  });
  
  return report;
}

export interface PerformanceUtils {
  LazyComponents: typeof LazyComponents;
  cache: typeof cache;
  performanceMonitor: typeof performanceMonitor;
  debounce: typeof debounce;
  throttle: typeof throttle;
  createImageLoader: typeof createImageLoader;
  createQueryCache: typeof createQueryCache;
  withPerformanceLogging: typeof withPerformanceLogging;
  generatePerformanceReport: typeof generatePerformanceReport;
}

const performanceUtils: PerformanceUtils = {
  LazyComponents,
  cache,
  performanceMonitor,
  debounce,
  throttle,
  createImageLoader,
  createQueryCache,
  withPerformanceLogging,
  generatePerformanceReport
};

export default performanceUtils;
