import React, { useEffect } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PerformanceConfig {
  sampleRate?: number;
  maxBufferSize?: number;
  flushInterval?: number;
  endpoint?: string;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private config: Required<PerformanceConfig>;
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor(config: PerformanceConfig = {}) {
    this.config = {
      sampleRate: config.sampleRate || 0.1, // 10% sampling
      maxBufferSize: config.maxBufferSize || 100,
      flushInterval: config.flushInterval || 30000, // 30 seconds
      endpoint: config.endpoint || '/api/metrics'
    };

    this.startFlushTimer();
    this.setupPerformanceObserver();
  }

  static getInstance(config?: PerformanceConfig): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(config);
    }
    return PerformanceMonitor.instance;
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private setupPerformanceObserver(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric(entry.name, entry.startTime);
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });

      // Observe layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          this.recordMetric('layoutShift', entry.value);
        });
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

      // Observe long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric('longTask', entry.duration);
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });

      // Observe resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.recordResourceTiming(entry as PerformanceResourceTiming);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }

  private recordResourceTiming(entry: PerformanceResourceTiming): void {
    const timing = {
      name: entry.name,
      duration: entry.duration,
      initiatorType: entry.initiatorType,
      transferSize: entry.transferSize,
      encodedBodySize: entry.encodedBodySize,
      decodedBodySize: entry.decodedBodySize
    };

    this.recordMetric('resourceTiming', entry.duration, timing);
  }

  recordMetric(
    name: string,
    value: number,
    metadata?: Record<string, any>
  ): void {
    // Apply sampling
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    };

    this.metrics.push(metric);

    if (this.metrics.length >= this.config.maxBufferSize) {
      this.flush();
    }
  }

  // Custom metric recording methods
  recordPageLoad(pageUrl: string): void {
    if (typeof window !== 'undefined') {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        this.recordMetric('pageLoad', navigationEntry.duration, {
          url: pageUrl,
          type: navigationEntry.type,
          redirectCount: navigationEntry.redirectCount,
          domInteractive: navigationEntry.domInteractive,
          domComplete: navigationEntry.domComplete
        });
      }
    }
  }

  recordApiCall(endpoint: string, duration: number, status: number): void {
    this.recordMetric('apiCall', duration, {
      endpoint,
      status
    });
  }

  recordComponentRender(componentName: string, duration: number): void {
    this.recordMetric('componentRender', duration, {
      component: componentName
    });
  }

  recordUserInteraction(type: string, duration: number): void {
    this.recordMetric('userInteraction', duration, {
      type
    });
  }

  private async flush(): Promise<void> {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metrics: metricsToSend,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Error flushing metrics:', error);
      // Re-add failed metrics to be sent in next batch
      this.metrics = [...metricsToSend, ...this.metrics]
        .slice(-this.config.maxBufferSize);
    }
  }

  // React hook for component performance monitoring
  measureComponentPerformance(componentName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordComponentRender(componentName, duration);
    };
  }

  // API call performance wrapper
  async measureApiCall<T>(
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    let status = 0;

    try {
      const result = await apiCall();
      status = 200; // Or extract actual status
      return result;
    } catch (error: any) {
      status = error.status || 500;
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      this.recordApiCall(endpoint, duration, status);
    }
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Hook for React components
export const usePerformanceMonitoring = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    return monitor.measureComponentPerformance(componentName);
  }, [componentName, monitor]);

  return {
    recordInteraction: (type: string, duration: number) => {
      monitor.recordUserInteraction(type, duration);
    }
  };
};

// Example usage:
/*
// Initialize in your app entry point
const performanceMonitor = PerformanceMonitor.getInstance({
  sampleRate: 0.1,
  maxBufferSize: 100,
  flushInterval: 30000,
  endpoint: '/api/metrics'
});

// In components:
const MyComponent = () => {
  const { recordInteraction } = usePerformanceMonitoring('MyComponent');

  const handleClick = async () => {
    const startTime = performance.now();
    await doSomething();
    recordInteraction('click', performance.now() - startTime);
  };

  return <button onClick={handleClick}>Click Me</button>;
};

// For API calls:
const data = await performanceMonitor.measureApiCall(
  '/api/data',
  () => fetchData()
);
*/

export default PerformanceMonitor;
