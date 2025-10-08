import { api } from './api';

export interface UserAddress {
  id: number;
  userId: number;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserDashboardData {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
  recentOrders: any[];
  wishlistCount: number;
  cartCount: number;
  notifications: any[];
}

export interface CreateAddressDto {
  type: 'HOME' | 'OFFICE' | 'OTHER';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto extends CreateAddressDto {
  id: number;
}

// User Management API functions
export const userAPI = {
  // Get all users (Admin only)
  getAllUsers: async (page: number = 0, size: number = 20): Promise<any> => {
    const response = await api.get(`/api/users?page=${page}&size=${size}`);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<any> => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  // Update current user profile
  updateProfile: async (data: any): Promise<any> => {
    const response = await api.put('/api/users/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<string> => {
    const response = await api.post('/api/users/change-password', data);
    return response.data;
  },

  // Get user dashboard data
  getDashboardData: async (): Promise<UserDashboardData> => {
    const response = await api.get('/api/users/dashboard');
    return response.data;
  },

  // Address Management
  addresses: {
    // Get all user addresses
    getAll: async (): Promise<UserAddress[]> => {
      const response = await api.get('/api/users/addresses');
      return response.data;
    },

    // Add new address
    create: async (data: CreateAddressDto): Promise<UserAddress> => {
      const response = await api.post('/api/users/addresses', data);
      return response.data;
    },

    // Get specific address
    getById: async (id: number): Promise<UserAddress> => {
      const response = await api.get(`/api/users/addresses/${id}`);
      return response.data;
    },

    // Update address
    update: async (id: number, data: Partial<CreateAddressDto>): Promise<UserAddress> => {
      const response = await api.put(`/api/users/addresses/${id}`, data);
      return response.data;
    },

    // Delete address
    delete: async (id: number): Promise<void> => {
      await api.delete(`/api/users/addresses/${id}`);
    }
  }
};