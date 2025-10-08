import { api } from './api';

// Analytics API types
export interface DashboardAnalytics {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth: {
    users: number;
    vendors: number;
    orders: number;
    revenue: number;
  };
  topCategories: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export interface VendorAnalytics {
  vendorId: string;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  monthlyStats: {
    orders: number;
    revenue: number;
    newProducts: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    customerSatisfaction: number;
  };
}

export interface SystemMetrics {
  serverHealth: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  apiMetrics: {
    requestsPerMinute: number;
    errorRate: number;
    averageResponseTime: number;
  };
  databaseMetrics: {
    connectionCount: number;
    queryPerformance: number;
    storageUsage: number;
  };
}

// Analytics API service
export const analyticsApi = {
  // Dashboard analytics
  getDashboardAnalytics: (dateRange?: { start: string; end: string }) => 
    api.get('/api/analytics/dashboard', { params: dateRange }),
    
  // Vendor analytics
  getVendorAnalytics: (vendorId: string, dateRange?: { start: string; end: string }) => 
    api.get(`/api/analytics/vendors/${vendorId}`, { params: dateRange }),
    
  getAllVendorsAnalytics: (dateRange?: { start: string; end: string }) => 
    api.get('/api/analytics/vendors', { params: dateRange }),
    
  // User analytics
  getUserAnalytics: (dateRange?: { start: string; end: string }) => 
    api.get('/api/analytics/users', { params: dateRange }),
    
  getUserBehavior: (userId: string) => 
    api.get(`/api/analytics/users/${userId}/behavior`),
    
  // Product analytics
  getProductAnalytics: (productId?: string, dateRange?: { start: string; end: string }) => 
    api.get('/api/analytics/products', { params: { productId, ...dateRange } }),
    
  getTopProducts: (limit: number = 10, category?: string) => 
    api.get('/api/analytics/products/top', { params: { limit, category } }),
    
  getCategoryAnalytics: (category?: string) => 
    api.get('/api/analytics/categories', { params: { category } }),
    
  // Order analytics
  getOrderAnalytics: (dateRange?: { start: string; end: string }) => 
    api.get('/api/analytics/orders', { params: dateRange }),
    
  getOrderTrends: (period: 'daily' | 'weekly' | 'monthly') => 
    api.get('/api/analytics/orders/trends', { params: { period } }),
    
  // Revenue analytics
  getRevenueAnalytics: (dateRange?: { start: string; end: string }) => 
    api.get('/api/analytics/revenue', { params: dateRange }),
    
  getRevenueTrends: (period: 'daily' | 'weekly' | 'monthly') => 
    api.get('/api/analytics/revenue/trends', { params: { period } }),
    
  // System metrics
  getSystemMetrics: () => 
    api.get('/api/analytics/system'),
    
  getPerformanceMetrics: (period: 'hour' | 'day' | 'week' | 'month') => 
    api.get('/api/analytics/performance', { params: { period } }),
    
  // Geographic analytics
  getGeographicAnalytics: () => 
    api.get('/api/analytics/geographic'),
    
  getCityAnalytics: (city?: string) => 
    api.get('/api/analytics/cities', { params: { city } }),
    
  // Search analytics
  getSearchAnalytics: () => 
    api.get('/api/analytics/search'),
    
  getPopularSearches: (limit: number = 20) => 
    api.get('/api/analytics/search/popular', { params: { limit } }),
    
  // Custom reports
  generateReport: (reportType: string, params: any) => 
    api.post('/api/analytics/reports', { reportType, params }),
    
  getReports: () => 
    api.get('/api/analytics/reports'),
    
  downloadReport: (reportId: string) => 
    api.get(`/api/analytics/reports/${reportId}/download`, { responseType: 'blob' }),
};

export default analyticsApi;
