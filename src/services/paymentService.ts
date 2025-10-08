import { api } from '@/shared/services/api';
import { handleApiError, retryWithBackoff } from '@/shared/services/errorHandler';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOrder {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentOrderRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: Record<string, string>;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RefundRequest {
  paymentId: string;
  amount?: number; // If not provided, full refund
  reason?: string;
  notes?: Record<string, string>;
}

export interface RefundResponse {
  id: string;
  paymentId: string;
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  reason?: string;
  createdAt: string;
}

export interface TransactionHistory {
  id: string;
  type: 'payment' | 'refund' | 'settlement';
  orderId: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface PaymentAnalytics {
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
  refundRate: number;
  averageTransactionValue: number;
  monthlyTrends: Array<{
    month: string;
    transactions: number;
    amount: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    percentage: number;
  }>;
}

class PaymentService {
  private razorpayKeyId: string;
  
  constructor() {
    this.razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  }

  // Initialize Razorpay script
  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  // Create payment order
  async createPaymentOrder(request: CreatePaymentOrderRequest): Promise<PaymentOrder> {
    try {
      const response = await retryWithBackoff(() => 
        api.post('/api/payments/create-order', request)
      );
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error, {
        customMessage: 'Failed to create payment order. Please try again.'
      });
      throw new Error(apiError.message);
    }
  }

  // Process payment with Razorpay
  async processPayment(
    paymentOrder: PaymentOrder,
    customerInfo: {
      name: string;
      email: string;
      phone: string;
    },
    onSuccess: (response: any) => void,
    onFailure: (error: any) => void
  ): Promise<void> {
    const scriptLoaded = await this.loadRazorpayScript();
    
    if (!scriptLoaded) {
      throw new Error('Razorpay script failed to load');
    }

    const options = {
      key: this.razorpayKeyId,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      name: 'Indian Trade Mart',
      description: `Payment for Order #${paymentOrder.orderId}`,
      order_id: paymentOrder.razorpayOrderId,
      image: '/logo.png',
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.phone
      },
      notes: {
        orderId: paymentOrder.orderId,
        customerId: customerInfo.email
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: () => {
          onFailure({ reason: 'Payment cancelled by user' });
        }
      },
      handler: async (response: any) => {
        try {
          const verificationResult = await this.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          
          onSuccess({
            ...response,
            verification: verificationResult
          });
        } catch (error) {
          onFailure({ reason: 'Payment verification failed', error });
        }
      },
      error: (error: any) => {
        onFailure({ reason: 'Payment failed', error });
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  // Verify payment signature
  async verifyPayment(request: PaymentVerificationRequest): Promise<{ verified: boolean; paymentOrder: PaymentOrder }> {
    try {
      const response = await retryWithBackoff(() => 
        api.post('/api/payments/verify', request), 2 // Reduced retries for time-sensitive verification
      );
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error, {
        customMessage: 'Payment verification failed. Please contact support if payment was deducted.'
      });
      throw new Error(apiError.message);
    }
  }

  // Get payment status
  async getPaymentStatus(paymentOrderId: string): Promise<PaymentOrder> {
    try {
      const response = await api.get(`/api/payments/status/${paymentOrderId}`);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error, {
        customMessage: 'Failed to fetch payment status. Please try again.'
      });
      throw new Error(apiError.message);
    }
  }

  // Initiate refund
  async initiateRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      const response = await api.post('/api/payments/refund', request);
      return response.data;
    } catch (error) {
      console.error('Error initiating refund:', error);
      throw new Error('Failed to initiate refund');
    }
  }

  // Get refund status
  async getRefundStatus(refundId: string): Promise<RefundResponse> {
    try {
      const response = await api.get(`/api/payments/refund/${refundId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching refund status:', error);
      throw new Error('Failed to fetch refund status');
    }
  }

  // Get transaction history
  async getTransactionHistory(
    filters?: {
      orderId?: string;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
      type?: string;
    }
  ): Promise<TransactionHistory[]> {
    try {
      const response = await api.get('/api/payments/transactions', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw new Error('Failed to fetch transaction history');
    }
  }

  // Get payment analytics
  async getPaymentAnalytics(
    dateRange?: {
      startDate: string;
      endDate: string;
    }
  ): Promise<PaymentAnalytics> {
    try {
      const response = await api.get('/api/payments/analytics', { params: dateRange });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment analytics:', error);
      throw new Error('Failed to fetch payment analytics');
    }
  }

  // Webhook verification for Razorpay
  static verifyWebhookSignature(
    webhookBody: string,
    webhookSignature: string,
    webhookSecret: string
  ): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookBody)
      .digest('hex');
    
    return expectedSignature === webhookSignature;
  }

  // Format currency for display
  formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount / 100); // Razorpay amounts are in paise
  }

  // Get payment method icon
  getPaymentMethodIcon(method: string): string {
    const icons: Record<string, string> = {
      card: '💳',
      netbanking: '🏦',
      wallet: '👛',
      upi: '📱',
      emi: '📊'
    };
    return icons[method] || '💰';
  }

  // Validate payment amount
  validateAmount(amount: number): { valid: boolean; error?: string } {
    if (amount < 100) { // Minimum 1 INR
      return { valid: false, error: 'Minimum amount is ₹1' };
    }
    if (amount > 10000000) { // Maximum 1 Lakh INR
      return { valid: false, error: 'Maximum amount is ₹1,00,000' };
    }
    return { valid: true };
  }
}

export const paymentService = new PaymentService();
export default paymentService;
