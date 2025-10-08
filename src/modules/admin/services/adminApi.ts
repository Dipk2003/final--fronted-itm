import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const adminAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
adminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  pendingApprovals: number;
  growth: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  verified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  businessName?: string;
  businessAddress?: string;
  gstNumber?: string;
  panNumber?: string;
  department?: string;
  designation?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  vendor: User;
  stock: number;
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  user: User;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface TopSellingProduct {
  product: Product;
  totalSold: number;
  totalRevenue: number;
  rating: number;
}

// Admin Dashboard Statistics
export const adminStatsAPI = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<AdminStats> => {
    try {
      // Since there's no single stats endpoint, we'll aggregate from multiple endpoints
      const [
        usersResponse,
        vendorsResponse,
        productsResponse,
        ordersResponse,
      ] = await Promise.all([
        adminAPI.get('/api/users/count'),
        adminAPI.get('/api/users/count/role/ROLE_VENDOR'),
        adminAPI.get('/api/products/count'),
        adminAPI.get('/api/orders/count'),
      ]);

      // Calculate revenue and growth (these would need proper backend endpoints)
      const revenue = 125000000; // Mock data - should come from order statistics
      const growth = 8.2; // Mock data - should be calculated from time-series data

      return {
        totalUsers: usersResponse.data,
        totalVendors: vendorsResponse.data,
        totalProducts: productsResponse.data,
        totalOrders: ordersResponse.data,
        revenue,
        pendingApprovals: 12, // Mock data - should come from pending approvals count
        growth,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return mock data in case of error
      return {
        totalUsers: 1200,
        totalVendors: 350,
        totalProducts: 8900,
        totalOrders: 5600,
        revenue: 125000000,
        pendingApprovals: 12,
        growth: 8.2,
      };
    }
  },
};

// User Management
export const adminUserAPI = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await adminAPI.get('/api/users');
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role: string): Promise<User[]> => {
    const response = await adminAPI.get(`/api/users/role/${role}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const response = await adminAPI.get(`/api/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await adminAPI.put(`/api/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await adminAPI.delete(`/api/users/${id}`);
  },

  // Activate user
  activateUser: async (id: number): Promise<void> => {
    await adminAPI.patch(`/api/users/${id}/activate`);
  },

  // Deactivate user
  deactivateUser: async (id: number): Promise<void> => {
    await adminAPI.patch(`/api/users/${id}/deactivate`);
  },

  // Get verified users
  getVerifiedUsers: async (): Promise<User[]> => {
    const response = await adminAPI.get('/api/users/verified');
    return response.data;
  },

  // Get unverified users
  getUnverifiedUsers: async (): Promise<User[]> => {
    const response = await adminAPI.get('/api/users/unverified');
    return response.data;
  },

  // Get active users
  getActiveUsers: async (): Promise<User[]> => {
    const response = await adminAPI.get('/api/users/active');
    return response.data;
  },

  // Get inactive users
  getInactiveUsers: async (): Promise<User[]> => {
    const response = await adminAPI.get('/api/users/inactive');
    return response.data;
  },
};

// Vendor Management
export const adminVendorAPI = {
  // Get all vendors
  getAllVendors: async (): Promise<User[]> => {
    const response = await adminAPI.get('/admin/vendors');
    return response.data;
  },

  // Update vendor type
  updateVendorType: async (userId: number, vendorType: string): Promise<User> => {
    const response = await adminAPI.put(`/admin/vendor/${userId}/type`, null, {
      params: { vendorType }
    });
    return response.data;
  },

  // Get vendor products
  getVendorProducts: async (vendorId: number, page = 0, size = 12): Promise<{ content: Product[], totalElements: number }> => {
    const response = await adminAPI.get(`/api/products/vendor/${vendorId}`, {
      params: { page, size }
    });
    return response.data;
  },
};

// Product Management
export const adminProductAPI = {
  // Get all products
  getAllProducts: async (page = 0, size = 12, category?: string, search?: string): Promise<{ content: Product[], totalElements: number }> => {
    const response = await adminAPI.get('/api/products', {
      params: { page, size, category, search }
    });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await adminAPI.get(`/api/products/${id}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8): Promise<Product[]> => {
    const response = await adminAPI.get('/api/products/featured', {
      params: { limit }
    });
    return response.data;
  },

  // Get top selling products (mock implementation)
  getTopSellingProducts: async (): Promise<TopSellingProduct[]> => {
    // This would need a proper backend endpoint
    const products = await adminAPI.get('/api/products/featured');
    return products.data.map((product: Product) => ({
      product,
      totalSold: Math.floor(Math.random() * 500) + 50,
      totalRevenue: Math.floor(Math.random() * 1000000) + 100000,
      rating: 4.0 + Math.random() * 1.0,
    }));
  },

  // Bulk import products
  bulkImportProducts: async (file: File, vendorId: number): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vendorId', vendorId.toString());

    const response = await adminAPI.post('/admin/products/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Order Management
export const adminOrderAPI = {
  // Get all orders (would need proper backend endpoint)
  getAllOrders: async (page = 0, size = 10): Promise<{ content: Order[], totalElements: number }> => {
    // This would need a proper admin endpoint for all orders
    // For now, we'll return mock data
    return {
      content: [],
      totalElements: 0,
    };
  },

  // Update order status
  updateOrderStatus: async (orderId: number, status: string): Promise<Order> => {
    const response = await adminAPI.put(`/api/orders/${orderId}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id: number): Promise<Order> => {
    const response = await adminAPI.get(`/api/orders/${id}`);
    return response.data;
  },
};

// Support Management (using existing support API)
export const adminSupportAPI = {
  // Get all support tickets
  getAllTickets: async (page = 0, size = 10): Promise<any> => {
    const response = await adminAPI.get('/api/support/tickets/admin', {
      params: { page, size }
    });
    return response.data;
  },

  // Update ticket status
  updateTicketStatus: async (ticketId: number, updateData: any): Promise<any> => {
    const response = await adminAPI.put(`/api/support/tickets/${ticketId}/status`, updateData);
    return response.data;
  },

  // Get active chat sessions
  getActiveChatSessions: async (): Promise<any[]> => {
    const response = await adminAPI.get('/api/support/chat/sessions');
    return response.data;
  },
};

const adminAPI_exports = {
  adminStatsAPI,
  adminUserAPI,
  adminVendorAPI,
  adminProductAPI,
  adminOrderAPI,
  adminSupportAPI,
};

export default adminAPI_exports;
