import { api } from '@/shared/services/api';

export interface Order {
  id: number;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  totalAmount: number;
  shippingAmount: number;
  taxAmount: number;
  grandTotal: number;
  paymentMethod: string;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productDescription: string;
  quantity: number;
  price: number;
  totalPrice: number;
  vendor: {
    id: number;
    name: string;
    businessName: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface CheckoutData {
  paymentMethod: 'ONLINE' | 'COD';
  addressId?: number;
  shippingAddress?: ShippingAddress;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
}

class OrderApiService {
  // Create order
  async createOrder(checkoutData: CheckoutData): Promise<any> {
    const response = await api.post('/api/orders/create', checkoutData);
    return response.data;
  }

  // Verify payment
  async verifyPayment(paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<boolean> {
    const response = await api.post('/api/orders/verify-payment', paymentData);
    return response.data.success;
  }

  // Get user orders
  async getUserOrders(page: number = 0, size: number = 10): Promise<{
    content: Order[];
    totalElements: number;
    totalPages: number;
  }> {
    const response = await api.get('/api/orders/user', {
      params: { page, size }
    });
    return response.data;
  }

  // Get specific order
  async getOrder(orderId: number): Promise<Order> {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  }

  // Get order by number
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await api.get(`/api/orders/number/${orderNumber}`);
    return response.data;
  }

  // Cancel order
  async cancelOrder(orderId: number, reason: string): Promise<void> {
    await api.post(`/api/orders/${orderId}/cancel`, { reason });
  }

  // Get order stats for user
  async getOrderStats(): Promise<OrderStats> {
    const response = await api.get('/api/orders/stats');
    return response.data;
  }

  // Vendor specific APIs
  async getVendorOrders(page: number = 0, size: number = 10): Promise<{
    content: Order[];
    totalElements: number;
    totalPages: number;
  }> {
    const response = await api.get('/api/orders/vendor', {
      params: { page, size }
    });
    return response.data;
  }

  // Update order status (vendor/admin)
  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const response = await api.post(`/api/orders/${orderId}/status`, { status });
    return response.data;
  }

  // Admin APIs
  async getAllOrders(page: number = 0, size: number = 10): Promise<{
    content: Order[];
    totalElements: number;
    totalPages: number;
  }> {
    const response = await api.get('/api/orders/admin/all', {
      params: { page, size }
    });
    return response.data;
  }
}

export const orderApi = new OrderApiService();
