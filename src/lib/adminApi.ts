import { api } from '@/shared/services/api';

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  revenue: number;
  growth: number;
  pendingApprovals: number;
}

export interface TopSellingProduct {
  product: {
    id: number;
    name: string;
    vendor: {
      name?: string;
      businessName?: string;
    };
  };
  totalSold: number;
  totalRevenue: number;
  rating: number;
}

export const adminStatsAPI = {
  getDashboardStats: async (): Promise<AdminStats> => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  },
};

export const adminProductAPI = {
  getTopSellingProducts: async (): Promise<TopSellingProduct[]> => {
    const response = await api.get('/api/admin/products/top-selling');
    return response.data;
  },
};
