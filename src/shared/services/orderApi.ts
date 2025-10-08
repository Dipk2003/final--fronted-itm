import { api } from './api';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  totalPrice: number;
  product: {
    id: number;
    name: string;
    description: string;
    imageUrls?: string;
    vendor: {
      id: number;
      companyName: string;
    };
  };
}

export interface Order {
  id: number;
  userId: number;
  vendorId: number;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  totalAmount: number;
  shippingAmount: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  billingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  vendor: {
    id: number;
    companyName: string;
    contactEmail: string;
    contactPhone: string;
  };
}

export interface CreateOrderDto {
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  shippingAddressId: number;
  billingAddressId: number;
  paymentMethod: 'COD' | 'ONLINE' | 'BANK_TRANSFER';
  notes?: string;
}

export interface OrderFilters {
  status?: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  dateFrom?: string;
  dateTo?: string;
  vendorId?: number;
  page?: number;
  size?: number;
}

export interface OrderStatusUpdate {
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

// Order Management API functions
export const orderAPI = {
  // Create order from cart
  createFromCart: async (data: {
    shippingAddressId: number;
    billingAddressId: number;
    paymentMethod: 'COD' | 'ONLINE' | 'BANK_TRANSFER';
    notes?: string;
  }): Promise<Order> => {
    const response = await api.post('/api/orders/create', data);
    return response.data;
  },

  // Create order directly
  create: async (data: CreateOrderDto): Promise<Order> => {
    const response = await api.post('/api/orders/create-direct', data);
    return response.data;
  },

  // Get user orders
  getMyOrders: async (filters?: OrderFilters): Promise<{
    content: Order[];
    totalElements: number;
    totalPages: number;
    number: number;
  }> => {
    const response = await api.get('/api/orders/my-orders', { params: filters });
    return response.data;
  },

  // Get vendor orders
  getVendorOrders: async (filters?: OrderFilters): Promise<{
    content: Order[];
    totalElements: number;
    totalPages: number;
    number: number;
  }> => {
    const response = await api.get('/api/orders/vendor', { params: filters });
    return response.data;
  },

  // Get all orders (Admin only)
  getAllOrders: async (filters?: OrderFilters): Promise<{
    content: Order[];
    totalElements: number;
    totalPages: number;
    number: number;
  }> => {
    const response = await api.get('/api/orders/admin', { params: filters });
    return response.data;
  },

  // Get order by ID
  getById: async (id: number): Promise<Order> => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  // Update order status (Vendor/Admin)
  updateStatus: async (id: number, data: OrderStatusUpdate): Promise<Order> => {
    const response = await api.patch(`/api/orders/${id}/status`, data);
    return response.data;
  },

  // Cancel order
  cancel: async (id: number, reason?: string): Promise<Order> => {
    const response = await api.patch(`/api/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Get order tracking
  getTracking: async (orderNumber: string): Promise<{
    orderNumber: string;
    status: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    trackingHistory: {
      status: string;
      description: string;
      timestamp: string;
      location?: string;
    }[];
  }> => {
    const response = await api.get(`/api/orders/tracking/${orderNumber}`);
    return response.data;
  },

  // Generate invoice
  generateInvoice: async (id: number): Promise<{
    invoiceUrl: string;
    invoiceNumber: string;
  }> => {
    const response = await api.post(`/api/orders/${id}/invoice`);
    return response.data;
  },

  // Download invoice
  downloadInvoice: async (id: number): Promise<Blob> => {
    const response = await api.get(`/api/orders/${id}/invoice/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Analytics
  analytics: {
    // Get user order analytics
    getUserStats: async (): Promise<{
      totalOrders: number;
      pendingOrders: number;
      completedOrders: number;
      cancelledOrders: number;
      totalSpent: number;
      averageOrderValue: number;
    }> => {
      const response = await api.get('/api/orders/user/analytics');
      return response.data;
    },

    // Get vendor order analytics
    getVendorStats: async (): Promise<{
      totalOrders: number;
      pendingOrders: number;
      completedOrders: number;
      cancelledOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      monthlyRevenue: number[];
    }> => {
      const response = await api.get('/api/orders/vendor/analytics');
      return response.data;
    }
  }
};