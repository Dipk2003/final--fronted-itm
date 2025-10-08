import apiClient, { getErrorMessage } from '@/lib/enhanced-api-client';
import toast from 'react-hot-toast';

// Analytics Types
export interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  topSellingProducts: Product[];
  recentOrders: Order[];
  revenueGrowth: number;
  userGrowth: number;
  orderGrowth: number;
}

export interface VendorDashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  totalInquiries: number;
  responseRate: number;
  averageRating: number;
  totalViews: number;
  conversionRate: number;
  topProducts: Product[];
  recentOrders: Order[];
  monthlyRevenue: ChartData[];
  orderTrends: ChartData[];
}

export interface BuyerDashboardStats {
  totalOrders: number;
  totalSpent: number;
  savedItems: number;
  activeInquiries: number;
  completedOrders: number;
  pendingOrders: number;
  favoriteVendors: Vendor[];
  recentPurchases: Order[];
  spendingTrends: ChartData[];
  categoryPreferences: CategoryStat[];
}

export interface AdminAnalytics {
  userStats: UserStats;
  vendorStats: VendorStats;
  productStats: ProductStats;
  orderStats: OrderStats;
  revenueStats: RevenueStats;
  geographicStats: GeographicStats;
  performanceMetrics: PerformanceMetrics;
  trends: TrendData;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  newThisMonth: number;
  growth: number;
  retention: number;
  churnRate: number;
  byType: Record<string, number>;
  registrationTrends: ChartData[];
}

export interface VendorStats {
  total: number;
  active: number;
  pending: number;
  verified: number;
  suspended: number;
  newThisMonth: number;
  growth: number;
  averageRating: number;
  topPerforming: Vendor[];
  byBusinessType: Record<string, number>;
  verificationTrends: ChartData[];
}

export interface ProductStats {
  total: number;
  active: number;
  outOfStock: number;
  newThisMonth: number;
  topCategories: CategoryStat[];
  topBrands: BrandStat[];
  priceDistribution: PriceRangeStat[];
  mostViewed: Product[];
  inventoryTrends: ChartData[];
}

export interface OrderStats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  returned: number;
  averageOrderValue: number;
  conversionRate: number;
  fulfillmentRate: number;
  statusDistribution: Record<string, number>;
  orderTrends: ChartData[];
}

export interface RevenueStats {
  total: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
  averageOrderValue: number;
  totalTransactions: number;
  paymentMethodDistribution: Record<string, number>;
  monthlyRevenue: ChartData[];
  revenueByCategory: CategoryRevenueStat[];
}

export interface GeographicStats {
  topStates: LocationStat[];
  topCities: LocationStat[];
  ordersByLocation: LocationOrderStat[];
  revenueByLocation: LocationRevenueStat[];
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  serverResponseTime: number;
  errorRate: number;
  uptime: number;
  activeConnections: number;
  apiCalls: number;
  cacheHitRate: number;
}

export interface TrendData {
  userGrowth: ChartData[];
  vendorGrowth: ChartData[];
  orderGrowth: ChartData[];
  revenueGrowth: ChartData[];
  productGrowth: ChartData[];
}

export interface ChartData {
  label: string;
  value: number;
  date?: string;
  category?: string;
  percentage?: number;
}

export interface CategoryStat {
  id: number;
  name: string;
  count: number;
  percentage: number;
  growth: number;
  revenue?: number;
}

export interface BrandStat {
  id: number;
  name: string;
  productCount: number;
  orderCount: number;
  revenue: number;
  growth: number;
}

export interface PriceRangeStat {
  range: string;
  count: number;
  percentage: number;
}

export interface LocationStat {
  name: string;
  count: number;
  percentage: number;
}

export interface LocationOrderStat extends LocationStat {
  totalOrders: number;
  averageOrderValue: number;
}

export interface LocationRevenueStat extends LocationStat {
  totalRevenue: number;
  growth: number;
}

export interface CategoryRevenueStat {
  categoryId: number;
  categoryName: string;
  revenue: number;
  orderCount: number;
  growth: number;
  percentage: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  vendor: string;
  rating: number;
  orderCount?: number;
  viewCount?: number;
  revenue?: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  date: string;
}

export interface Vendor {
  id: number;
  name: string;
  rating: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  category?: string;
  vendor?: number;
  location?: string;
  status?: string;
  userType?: string;
}

// Analytics Service
class AnalyticsService {
  // ===================
  // DASHBOARD ANALYTICS
  // ===================

  async getDashboardStats(filters?: AnalyticsFilters): Promise<DashboardStats> {
    try {
      const url = apiClient.buildUrl('/api/analytics/dashboard', filters);
      const response = await apiClient.get<DashboardStats>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch dashboard stats: ${message}`);
      // Return empty stats as fallback
      return {
        totalUsers: 0,
        totalVendors: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        activeUsers: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        topSellingProducts: [],
        recentOrders: [],
        revenueGrowth: 0,
        userGrowth: 0,
        orderGrowth: 0
      };
    }
  }

  async getVendorDashboardStats(vendorId?: number, filters?: AnalyticsFilters): Promise<VendorDashboardStats> {
    try {
      const params = { vendorId, ...filters };
      const url = apiClient.buildUrl('/api/analytics/vendor', params);
      const response = await apiClient.get<VendorDashboardStats>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch vendor dashboard stats: ${message}`);
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalInquiries: 0,
        responseRate: 0,
        averageRating: 0,
        totalViews: 0,
        conversionRate: 0,
        topProducts: [],
        recentOrders: [],
        monthlyRevenue: [],
        orderTrends: []
      };
    }
  }

  async getBuyerDashboardStats(buyerId?: number, filters?: AnalyticsFilters): Promise<BuyerDashboardStats> {
    try {
      const params = { buyerId, ...filters };
      const url = apiClient.buildUrl('/api/analytics/buyer', params);
      const response = await apiClient.get<BuyerDashboardStats>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch buyer dashboard stats: ${message}`);
      return {
        totalOrders: 0,
        totalSpent: 0,
        savedItems: 0,
        activeInquiries: 0,
        completedOrders: 0,
        pendingOrders: 0,
        favoriteVendors: [],
        recentPurchases: [],
        spendingTrends: [],
        categoryPreferences: []
      };
    }
  }

  // ===================
  // ADMIN ANALYTICS
  // ===================

  async getAdminAnalytics(filters?: AnalyticsFilters): Promise<AdminAnalytics> {
    try {
      const url = apiClient.buildUrl('/api/analytics/admin', filters);
      const response = await apiClient.get<AdminAnalytics>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch admin analytics: ${message}`);
      throw error;
    }
  }

  async getUserStats(filters?: AnalyticsFilters): Promise<UserStats> {
    try {
      const url = apiClient.buildUrl('/api/analytics/users', filters);
      const response = await apiClient.get<UserStats>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch user stats: ${message}`);
      throw error;
    }
  }

  async getVendorStats(filters?: AnalyticsFilters): Promise<VendorStats> {
    try {
      const url = apiClient.buildUrl('/api/analytics/vendors', filters);
      const response = await apiClient.get<VendorStats>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch vendor stats: ${message}`);
      throw error;
    }
  }

  async getProductStats(filters?: AnalyticsFilters): Promise<ProductStats> {
    try {
      const url = apiClient.buildUrl('/api/analytics/products', filters);
      const response = await apiClient.get<ProductStats>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch product stats: ${message}`);
      throw error;
    }
  }

  async getOrderStats(filters?: AnalyticsFilters): Promise<OrderStats> {
    try {
      const url = apiClient.buildUrl('/api/analytics/orders', filters);
      const response = await apiClient.get<OrderStats>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch order stats: ${message}`);
      throw error;
    }
  }

  async getRevenueStats(filters?: AnalyticsFilters): Promise<RevenueStats> {
    try {
      const url = apiClient.buildUrl('/api/analytics/revenue', filters);
      const response = await apiClient.get<RevenueStats>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch revenue stats: ${message}`);
      throw error;
    }
  }

  // ===================
  // CATEGORY ANALYTICS
  // ===================

  async getCategoryStats(filters?: AnalyticsFilters): Promise<CategoryStat[]> {
    try {
      const url = apiClient.buildUrl('/api/analytics/category-stats', filters);
      const response = await apiClient.get<CategoryStat[]>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch category stats: ${message}`);
      return [];
    }
  }

  async getCategoryRevenue(filters?: AnalyticsFilters): Promise<CategoryRevenueStat[]> {
    try {
      const url = apiClient.buildUrl('/api/analytics/category-revenue', filters);
      const response = await apiClient.get<CategoryRevenueStat[]>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch category revenue: ${message}`);
      return [];
    }
  }

  // ===================
  // GEOGRAPHIC ANALYTICS
  // ===================

  async getGeographicStats(filters?: AnalyticsFilters): Promise<GeographicStats> {
    try {
      const url = apiClient.buildUrl('/api/analytics/geographic', filters);
      const response = await apiClient.get<GeographicStats>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch geographic stats: ${message}`);
      return {
        topStates: [],
        topCities: [],
        ordersByLocation: [],
        revenueByLocation: []
      };
    }
  }

  // ===================
  // PERFORMANCE ANALYTICS
  // ===================

  async getPerformanceMetrics(filters?: AnalyticsFilters): Promise<PerformanceMetrics> {
    try {
      const url = apiClient.buildUrl('/api/analytics/performance', filters);
      const response = await apiClient.get<PerformanceMetrics>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch performance metrics: ${message}`);
      return {
        pageLoadTime: 0,
        serverResponseTime: 0,
        errorRate: 0,
        uptime: 0,
        activeConnections: 0,
        apiCalls: 0,
        cacheHitRate: 0
      };
    }
  }

  // ===================
  // TREND ANALYTICS
  // ===================

  async getTrendData(type: 'user' | 'vendor' | 'order' | 'revenue' | 'product', filters?: AnalyticsFilters): Promise<ChartData[]> {
    try {
      const url = apiClient.buildUrl(`/api/analytics/trends/${type}`, filters);
      const response = await apiClient.get<ChartData[]>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch ${type} trend data: ${message}`);
      return [];
    }
  }

  async getAllTrends(filters?: AnalyticsFilters): Promise<TrendData> {
    try {
      const [userGrowth, vendorGrowth, orderGrowth, revenueGrowth, productGrowth] = await Promise.all([
        this.getTrendData('user', filters),
        this.getTrendData('vendor', filters),
        this.getTrendData('order', filters),
        this.getTrendData('revenue', filters),
        this.getTrendData('product', filters)
      ]);

      return {
        userGrowth,
        vendorGrowth,
        orderGrowth,
        revenueGrowth,
        productGrowth
      };
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch all trends: ${message}`);
      return {
        userGrowth: [],
        vendorGrowth: [],
        orderGrowth: [],
        revenueGrowth: [],
        productGrowth: []
      };
    }
  }

  // ===================
  // VENDOR ANALYTICS
  // ===================

  async getVendorAnalytics(vendorId?: number, filters?: AnalyticsFilters): Promise<{
    orders: ChartData[];
    revenue: ChartData[];
    products: ChartData[];
    inquiries: ChartData[];
    ratings: ChartData[];
  }> {
    try {
      const params = { vendorId, ...filters };
      const url = apiClient.buildUrl('/api/vendors/analytics', params);
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch vendor analytics: ${message}`);
      return {
        orders: [],
        revenue: [],
        products: [],
        inquiries: [],
        ratings: []
      };
    }
  }

  // ===================
  // CUSTOM REPORTS
  // ===================

  async generateCustomReport(reportConfig: {
    type: 'sales' | 'products' | 'users' | 'vendors' | 'performance';
    metrics: string[];
    filters: AnalyticsFilters;
    groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
    format?: 'json' | 'csv' | 'excel';
  }): Promise<any> {
    try {
      const response = await apiClient.post('/api/analytics/reports/custom', reportConfig);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to generate custom report: ${message}`);
      throw error;
    }
  }

  async exportReport(reportId: string, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/analytics/reports/${reportId}/export?format=${format}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to export report: ${message}`);
      throw error;
    }
  }

  // ===================
  // UTILITY METHODS
  // ===================

  formatCurrency(amount: number, currency = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatNumber(number: number): string {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
  }

  formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(1)}%`;
  }

  calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  getGrowthColor(growth: number): string {
    if (growth > 0) return '#10b981'; // green
    if (growth < 0) return '#ef4444'; // red
    return '#6b7280'; // gray
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: '#10b981',
      inactive: '#6b7280',
      pending: '#f59e0b',
      completed: '#10b981',
      cancelled: '#ef4444',
      processing: '#3b82f6',
      verified: '#10b981',
      rejected: '#ef4444'
    };
    return colors[status.toLowerCase()] || '#6b7280';
  }

  generateDateRange(period: 'day' | 'week' | 'month' | 'quarter' | 'year'): {
    startDate: string;
    endDate: string;
  } {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    let startDate: string;

    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'week':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate()).toISOString().split('T')[0];
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate()).toISOString().split('T')[0];
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate()).toISOString().split('T')[0];
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }

    return { startDate, endDate };
  }

  downloadCsv(data: any[], filename: string): void {
    if (!data || data.length === 0) {
      toast.error('No data to download');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        // Wrap in quotes if contains comma or newline
        return typeof value === 'string' && (value.includes(',') || value.includes('\n'))
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Report downloaded successfully!');
  }

  // ===================
  // REAL-TIME UPDATES
  // ===================

  private analyticsListeners = new Map<string, Function[]>();

  onAnalyticsUpdate(metric: string, callback: (data: any) => void): void {
    if (!this.analyticsListeners.has(metric)) {
      this.analyticsListeners.set(metric, []);
    }
    this.analyticsListeners.get(metric)!.push(callback);
  }

  offAnalyticsUpdate(metric: string, callback: (data: any) => void): void {
    const listeners = this.analyticsListeners.get(metric);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emitAnalyticsUpdate(metric: string, data: any): void {
    const listeners = this.analyticsListeners.get(metric);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in analytics listener for ${metric}:`, error);
        }
      });
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;