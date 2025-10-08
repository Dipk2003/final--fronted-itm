import { api } from '@/shared/services/api';

export interface DashboardAnalytics {
  totalUsers: number;
  totalVendors: number;
  verifiedVendors: number;
  totalProducts: number;
  activeProducts: number;
  approvedProducts: number;
  totalOrders: number;
  totalInquiries: number;
  resolvedInquiries: number;
  totalReviews: number;
  approvedReviews: number;
}

export interface VendorAnalytics {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalReviews: number;
}

export interface SystemMetrics {
  totalMemory: number;
  freeMemory: number;
  usedMemory: number;
  availableProcessors: number;
}

export const analyticsApi = {
  // Legacy methods (for backward compatibility)
  getDashboardAnalytics: async (): Promise<DashboardAnalytics> => {
    const response = await api.get('/api/analytics/dashboard');
    return response.data;
  },

  getVendorAnalytics: async (vendorId: number): Promise<VendorAnalytics> => {
    const response = await api.get(`/api/analytics/vendor/${vendorId}`);
    return response.data;
  },

  getSystemMetrics: async (): Promise<SystemMetrics> => {
    const response = await api.get('/api/analytics/system-metrics');
    return response.data;
  },

  // Enhanced Analytics API matching backend endpoints
  vendor: {
    // Get vendor dashboard overview (matches GET /api/vendor-analytics/overview)
    getOverview: async (): Promise<any> => {
      const response = await api.get('/api/vendor-analytics/overview');
      return response.data;
    },

    // Get product analytics (matches GET /api/vendor-analytics/products)
    getProductAnalytics: async (): Promise<any> => {
      const response = await api.get('/api/vendor-analytics/products');
      return response.data;
    },

    // Get sales analytics
    getSalesAnalytics: async (dateFrom?: string, dateTo?: string): Promise<any> => {
      const response = await api.get('/api/vendor-analytics/sales', {
        params: { dateFrom, dateTo }
      });
      return response.data;
    }
  },

  admin: {
    // Get admin dashboard overview (matches GET /api/admin-analytics/overview)
    getOverview: async (): Promise<any> => {
      const response = await api.get('/api/admin-analytics/overview');
      return response.data;
    },

    // Get user analytics
    getUserAnalytics: async (dateFrom?: string, dateTo?: string): Promise<any> => {
      const response = await api.get('/api/admin-analytics/users', {
        params: { dateFrom, dateTo }
      });
      return response.data;
    },

    // Get vendor analytics
    getVendorAnalytics: async (): Promise<any> => {
      const response = await api.get('/api/admin-analytics/vendors');
      return response.data;
    },

    // Get product analytics
    getProductAnalytics: async (): Promise<any> => {
      const response = await api.get('/api/admin-analytics/products');
      return response.data;
    }
  },

  cto: {
    // Get CTO dashboard metrics (matches GET /api/cto-dashboard/metrics)
    getMetrics: async (): Promise<any> => {
      const response = await api.get('/api/cto-dashboard/metrics');
      return response.data;
    },

    // Get performance metrics
    getPerformanceMetrics: async (timeRange?: string): Promise<any> => {
      const response = await api.get('/api/cto-dashboard/performance', {
        params: { timeRange }
      });
      return response.data;
    },

    // Get system health
    getSystemHealth: async (): Promise<any> => {
      const response = await api.get('/api/cto-dashboard/health');
      return response.data;
    },

    // Get security metrics
    getSecurityMetrics: async (): Promise<any> => {
      const response = await api.get('/api/cto-dashboard/security');
      return response.data;
    },

    // Get infrastructure metrics
    getInfrastructureMetrics: async (): Promise<any> => {
      const response = await api.get('/api/cto-dashboard/infrastructure');
      return response.data;
    }
  },

  // Utility functions
  formatMemorySize: (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    const gb = mb / 1024;
    
    if (gb > 1) {
      return `${gb.toFixed(2)} GB`;
    } else {
      return `${mb.toFixed(2)} MB`;
    }
  },

  getMemoryUsagePercentage: (metrics: SystemMetrics): number => {
    return (metrics.usedMemory / metrics.totalMemory) * 100;
  }
};
