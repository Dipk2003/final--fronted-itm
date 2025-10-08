import { API_CONFIG, apiRequest } from '@/config/api';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  totalVendors: number;
  verifiedVendors: number;
  kycApprovedVendors: number;
  pendingVendorApprovals: number;
  totalProducts: number;
  activeProducts: number;
  approvedProducts: number;
  inStockProducts: number;
  totalInquiries: number;
  totalQuotes: number;
  acceptedQuotes: number;
  pendingKycDocuments: number;
  approvedKycDocuments: number;
  openTickets: number;
  resolvedTickets: number;
}

export interface GrowthMetrics {
  newUsersThisMonth: number;
  newVendorsThisMonth: number;
  newProductsThisMonth: number;
  newInquiriesThisWeek: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageOrderValue: number;
}

class AdminAnalyticsApiService {
  
  async getDashboardStats(): Promise<DashboardStats> {
    return apiRequest<DashboardStats>('/api/admin/analytics/dashboard', {}, true);
  }

  async getGrowthMetrics(): Promise<GrowthMetrics> {
    return apiRequest<GrowthMetrics>('/api/admin/analytics/growth', {}, true);
  }

  async getRevenueMetrics(): Promise<RevenueMetrics> {
    return apiRequest<RevenueMetrics>('/api/admin/analytics/revenue', {}, true);
  }

  async getUserAnalytics(): Promise<any> {
    return apiRequest('/api/admin/analytics/users', {}, true);
  }

  async getVendorAnalytics(): Promise<any> {
    return apiRequest('/api/admin/analytics/vendors', {}, true);
  }

  async getProductAnalytics(): Promise<any> {
    return apiRequest('/api/admin/analytics/products', {}, true);
  }

  async getSystemHealth(): Promise<any> {
    return apiRequest('/api/admin/system/health', {}, true);
  }
}

export const adminAnalyticsApi = new AdminAnalyticsApiService();
