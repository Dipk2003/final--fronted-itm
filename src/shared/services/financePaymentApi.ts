import { api } from './api';

export interface PaymentOrder {
  id: number;
  orderId: number;
  amount: number;
  currency: string;
  paymentMethod: 'CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'COD';
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  paymentGateway: 'RAZORPAY' | 'PAYU' | 'STRIPE' | 'PAYPAL';
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  orderId: number;
  userId: number;
  vendorId: number;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
  order: {
    id: number;
    orderNumber: string;
    items: any[];
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  vendor: {
    id: number;
    companyName: string;
    gstNumber?: string;
  };
}

export interface CreatePaymentOrderDto {
  orderId: number;
  amount: number;
  currency?: string;
  paymentMethod: 'CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'COD';
  paymentGateway?: 'RAZORPAY' | 'PAYU' | 'STRIPE' | 'PAYPAL';
}

export interface PaymentVerificationDto {
  paymentId: string;
  orderId: string;
  signature: string;
}

export interface InvoiceFilters {
  status?: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dateFrom?: string;
  dateTo?: string;
  vendorId?: number;
  page?: number;
  size?: number;
}

// Finance & Payment API functions
export const financePaymentAPI = {
  // Payment Management
  payments: {
    // Create payment order
    createOrder: async (data: CreatePaymentOrderDto): Promise<PaymentOrder> => {
      const response = await api.post('/api/payments/create-order', data);
      return response.data;
    },

    // Verify payment
    verifyPayment: async (data: PaymentVerificationDto): Promise<{
      success: boolean;
      paymentStatus: string;
      transactionId: string;
    }> => {
      const response = await api.post('/api/payments/verify', data);
      return response.data;
    },

    // Get payment by ID
    getById: async (id: number): Promise<PaymentOrder> => {
      const response = await api.get(`/api/payments/${id}`);
      return response.data;
    },

    // Get payments by order
    getByOrder: async (orderId: number): Promise<PaymentOrder[]> => {
      const response = await api.get(`/api/payments/order/${orderId}`);
      return response.data;
    },

    // Get user payments
    getUserPayments: async (page: number = 0, size: number = 20): Promise<{
      content: PaymentOrder[];
      totalElements: number;
      totalPages: number;
      number: number;
    }> => {
      const response = await api.get('/api/payments/user', {
        params: { page, size }
      });
      return response.data;
    },

    // Refund payment
    refund: async (paymentId: number, amount?: number, reason?: string): Promise<{
      success: boolean;
      refundId: string;
      amount: number;
    }> => {
      const response = await api.post(`/api/payments/${paymentId}/refund`, {
        amount,
        reason
      });
      return response.data;
    },

    // Cancel payment
    cancel: async (paymentId: number, reason?: string): Promise<PaymentOrder> => {
      const response = await api.patch(`/api/payments/${paymentId}/cancel`, { reason });
      return response.data;
    }
  },

  // Invoice Management
  invoices: {
    // Get all invoices (with filters)
    getAll: async (filters?: InvoiceFilters): Promise<{
      content: Invoice[];
      totalElements: number;
      totalPages: number;
      number: number;
    }> => {
      const response = await api.get('/api/finance/invoices', { params: filters });
      return response.data;
    },

    // Get invoice by ID
    getById: async (id: number): Promise<Invoice> => {
      const response = await api.get(`/api/finance/invoices/${id}`);
      return response.data;
    },

    // Update invoice status
    updateStatus: async (id: number, status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'): Promise<Invoice> => {
      const response = await api.put(`/api/finance/invoices/${id}/status`, { status });
      return response.data;
    },

    // Generate invoice for order
    generateForOrder: async (orderId: number): Promise<Invoice> => {
      const response = await api.post(`/api/finance/invoices/generate/${orderId}`);
      return response.data;
    },

    // Download invoice PDF
    downloadPdf: async (id: number): Promise<Blob> => {
      const response = await api.get(`/api/finance/invoices/${id}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    },

    // Send invoice via email
    sendEmail: async (id: number, email?: string): Promise<{
      success: boolean;
      message: string;
    }> => {
      const response = await api.post(`/api/finance/invoices/${id}/send`, { email });
      return response.data;
    },

    // Mark invoice as paid
    markAsPaid: async (id: number, paidDate?: string, transactionId?: string): Promise<Invoice> => {
      const response = await api.patch(`/api/finance/invoices/${id}/paid`, {
        paidDate,
        transactionId
      });
      return response.data;
    }
  },

  // Financial Analytics
  analytics: {
    // Get payment analytics
    getPaymentStats: async (dateFrom?: string, dateTo?: string): Promise<{
      totalPayments: number;
      successfulPayments: number;
      failedPayments: number;
      totalAmount: number;
      averageAmount: number;
      paymentMethodBreakdown: {
        method: string;
        count: number;
        amount: number;
      }[];
    }> => {
      const response = await api.get('/api/finance/analytics/payments', {
        params: { dateFrom, dateTo }
      });
      return response.data;
    },

    // Get invoice analytics
    getInvoiceStats: async (dateFrom?: string, dateTo?: string): Promise<{
      totalInvoices: number;
      paidInvoices: number;
      overdueInvoices: number;
      totalAmount: number;
      paidAmount: number;
      overdueAmount: number;
    }> => {
      const response = await api.get('/api/finance/analytics/invoices', {
        params: { dateFrom, dateTo }
      });
      return response.data;
    },

    // Get vendor financial summary
    getVendorSummary: async (vendorId?: number): Promise<{
      totalRevenue: number;
      monthlyRevenue: number;
      pendingPayments: number;
      completedPayments: number;
      refundedAmount: number;
    }> => {
      const response = await api.get('/api/finance/analytics/vendor', {
        params: { vendorId }
      });
      return response.data;
    }
  }
};