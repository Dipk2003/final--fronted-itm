import apiClient, { PaginatedResponse, getErrorMessage } from '@/lib/enhanced-api-client';
import toast from 'react-hot-toast';

// Order & Payment Types
export interface Order {
  id: number;
  orderNumber: string;
  buyerId: number;
  vendorId: number;
  buyerName: string;
  vendorName: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  finalAmount: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: Record<string, any>;
}

export interface CartItem {
  id?: number;
  productId: number;
  product?: {
    id: number;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    vendorId: number;
    vendorName: string;
    inStock: boolean;
    unit: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedAt?: string;
}

export interface Cart {
  id: number;
  buyerId: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  finalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id?: number;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  type?: 'shipping' | 'billing';
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  gateway: PaymentGateway;
  transactionId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // in days
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  maxProducts: number;
  maxOrders: number;
  prioritySupport: boolean;
  analyticsAccess: boolean;
}

export interface Subscription {
  id: number;
  vendorId: number;
  planId: number;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentId?: number;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned'
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'refunded';

export type PaymentMethod = 
  | 'credit_card' 
  | 'debit_card' 
  | 'net_banking' 
  | 'upi' 
  | 'wallet' 
  | 'cash_on_delivery';

export type PaymentGateway = 
  | 'razorpay' 
  | 'paytm' 
  | 'stripe' 
  | 'paypal';

export type SubscriptionStatus = 
  | 'active' 
  | 'expired' 
  | 'cancelled' 
  | 'suspended';

export interface CheckoutRequest {
  cartId: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  notes?: string;
  couponCode?: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

// Order & Payment Service
class OrderPaymentService {
  // ===================
  // CART MANAGEMENT
  // ===================

  async getCart(): Promise<Cart> {
    try {
      const response = await apiClient.get<Cart>('/api/buyers/cart');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch cart: ${message}`);
      throw error;
    }
  }

  async addToCart(productId: number, quantity: number = 1): Promise<Cart> {
    try {
      const response = await apiClient.post<Cart>('/api/buyers/cart/add', {
        productId,
        quantity
      });
      toast.success('Product added to cart!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to add to cart: ${message}`);
      throw error;
    }
  }

  async updateCartItem(itemId: number, quantity: number): Promise<Cart> {
    try {
      const response = await apiClient.put<Cart>('/api/buyers/cart/update', {
        itemId,
        quantity
      });
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update cart: ${message}`);
      throw error;
    }
  }

  async removeFromCart(itemId: number): Promise<Cart> {
    try {
      const response = await apiClient.delete<Cart>(`/api/buyers/cart/remove/${itemId}`);
      toast.success('Item removed from cart!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to remove item: ${message}`);
      throw error;
    }
  }

  async clearCart(): Promise<void> {
    try {
      await apiClient.delete('/api/buyers/cart/clear');
      toast.success('Cart cleared!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to clear cart: ${message}`);
      throw error;
    }
  }

  // ===================
  // WISHLIST MANAGEMENT
  // ===================

  async getWishlist(): Promise<{ items: any[] }> {
    try {
      const response = await apiClient.get<{ items: any[] }>('/api/buyers/wishlist');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch wishlist: ${message}`);
      return { items: [] };
    }
  }

  async addToWishlist(productId: number): Promise<void> {
    try {
      await apiClient.post('/api/buyers/wishlist/add', { productId });
      toast.success('Added to wishlist!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to add to wishlist: ${message}`);
      throw error;
    }
  }

  async removeFromWishlist(productId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/buyers/wishlist/remove/${productId}`);
      toast.success('Removed from wishlist!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to remove from wishlist: ${message}`);
      throw error;
    }
  }

  // ===================
  // ORDER MANAGEMENT
  // ===================

  async getOrders(page = 0, size = 10): Promise<PaginatedResponse<Order>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl('/api/orders', params);
      const response = await apiClient.get<PaginatedResponse<Order>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch orders: ${message}`);
      throw error;
    }
  }

  async getBuyerOrders(page = 0, size = 10): Promise<PaginatedResponse<Order>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl('/api/buyers/orders', params);
      const response = await apiClient.get<PaginatedResponse<Order>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch buyer orders: ${message}`);
      throw error;
    }
  }

  async getVendorOrders(page = 0, size = 10): Promise<PaginatedResponse<Order>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl('/api/orders/vendor/my-orders/paginated', params);
      const response = await apiClient.get<PaginatedResponse<Order>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch vendor orders: ${message}`);
      throw error;
    }
  }

  async getOrderById(orderId: number): Promise<Order> {
    try {
      const response = await apiClient.get<Order>(`/api/orders/${orderId}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch order: ${message}`);
      throw error;
    }
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    try {
      const response = await apiClient.put<Order>(`/api/orders/${orderId}/status`, {
        status
      });
      toast.success(`Order status updated to ${status}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update order status: ${message}`);
      throw error;
    }
  }

  async cancelOrder(orderId: number, reason?: string): Promise<Order> {
    try {
      const response = await apiClient.put<Order>(`/api/orders/${orderId}/cancel`, {
        reason
      });
      toast.success('Order cancelled successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to cancel order: ${message}`);
      throw error;
    }
  }

  async getOrderTracking(orderId: number): Promise<{
    trackingNumber: string;
    status: string;
    updates: Array<{
      status: string;
      timestamp: string;
      location?: string;
      description: string;
    }>;
  }> {
    try {
      const response = await apiClient.get(`/api/orders/${orderId}/tracking`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch tracking: ${message}`);
      throw error;
    }
  }

  // ===================
  // CHECKOUT & PAYMENT
  // ===================

  async createCheckout(checkoutData: CheckoutRequest): Promise<{
    order: Order;
    razorpayOrderId?: string;
    clientSecret?: string;
  }> {
    try {
      const response = await apiClient.post<{
        order: Order;
        razorpayOrderId?: string;
        clientSecret?: string;
      }>('/api/checkout/create', checkoutData);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Checkout failed: ${message}`);
      throw error;
    }
  }

  async confirmOrder(orderId: number, paymentDetails: {
    paymentId?: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySignature?: string;
  }): Promise<Order> {
    try {
      const response = await apiClient.post<Order>('/api/checkout/confirm', {
        orderId,
        ...paymentDetails
      });
      toast.success('Order placed successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Order confirmation failed: ${message}`);
      throw error;
    }
  }

  // ===================
  // PAYMENT MANAGEMENT
  // ===================

  async getPayments(page = 0, size = 10): Promise<PaginatedResponse<Payment>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl('/api/payments', params);
      const response = await apiClient.get<PaginatedResponse<Payment>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch payments: ${message}`);
      throw error;
    }
  }

  async getVendorPayments(vendorId: number): Promise<Payment[]> {
    try {
      const response = await apiClient.get<Payment[]>(`/api/payments/vendor/${vendorId}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch vendor payments: ${message}`);
      throw error;
    }
  }

  async createRazorpayOrder(amount: number, currency = 'INR'): Promise<{
    orderId: string;
    amount: number;
    currency: string;
  }> {
    try {
      const response = await apiClient.post<{
        orderId: string;
        amount: number;
        currency: string;
      }>('/api/payments/razorpay/create-order', {
        amount: amount * 100, // Convert to paise
        currency
      });
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Payment initialization failed: ${message}`);
      throw error;
    }
  }

  async verifyRazorpayPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ success: boolean; orderId?: number }> {
    try {
      const response = await apiClient.post<{ success: boolean; orderId?: number }>(
        '/api/payments/razorpay/verify-payment',
        paymentData
      );
      
      if (response.success) {
        toast.success('Payment verified successfully!');
      } else {
        toast.error('Payment verification failed!');
      }
      
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Payment verification failed: ${message}`);
      throw error;
    }
  }

  // ===================
  // SUBSCRIPTION MANAGEMENT
  // ===================

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await apiClient.get<SubscriptionPlan[]>('/api/payments/subscription-plans');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch subscription plans: ${message}`);
      return [];
    }
  }

  async getVendorSubscription(vendorId: number): Promise<Subscription | null> {
    try {
      const response = await apiClient.get<Subscription>(`/api/subscriptions/vendor/${vendorId}`);
      return response;
    } catch (error) {
      console.error('No active subscription found');
      return null;
    }
  }

  async subscribeToplan(planId: number): Promise<Subscription> {
    try {
      const response = await apiClient.post<Subscription>('/api/subscriptions', {
        planId
      });
      toast.success('Subscription activated successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Subscription failed: ${message}`);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/subscriptions/${subscriptionId}`);
      toast.success('Subscription cancelled successfully!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to cancel subscription: ${message}`);
      throw error;
    }
  }

  // ===================
  // UTILITY METHODS
  // ===================

  formatOrderNumber(order: Order): string {
    return `#${order.orderNumber || order.id.toString().padStart(6, '0')}`;
  }

  getOrderStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      shipped: '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444',
      returned: '#f97316',
      refunded: '#6b7280'
    };
    return colors[status] || '#6b7280';
  }

  getPaymentStatusColor(status: PaymentStatus): string {
    const colors: Record<PaymentStatus, string> = {
      pending: '#f59e0b',
      processing: '#8b5cf6',
      completed: '#10b981',
      failed: '#ef4444',
      cancelled: '#6b7280',
      refunded: '#f97316'
    };
    return colors[status] || '#6b7280';
  }

  calculateCartTotal(items: CartItem[]): {
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = 0; // Implement discount logic
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
    const total = subtotal - discount + tax + shipping;

    return {
      subtotal,
      discount,
      tax,
      shipping,
      total
    };
  }

  formatCurrency(amount: number, currency = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  isOrderCancellable(order: Order): boolean {
    return ['pending', 'confirmed'].includes(order.status);
  }

  isOrderReturnable(order: Order): boolean {
    return order.status === 'delivered' && 
           new Date(order.actualDelivery!) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }

  // ===================
  // RAZORPAY INTEGRATION
  // ===================

  initializeRazorpay(options: RazorpayOptions): void {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } else {
      toast.error('Payment gateway not available. Please try again.');
    }
  }

  async loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
}

// Export singleton instance
export const orderPaymentService = new OrderPaymentService();
export default orderPaymentService;