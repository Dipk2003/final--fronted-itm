import { api } from './api';

export interface Inquiry {
  id: number;
  userId: number;
  productId: number;
  vendorId: number;
  subject: string;
  message: string;
  quantity: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'RESPONDED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrls?: string;
  };
  vendor: {
    id: number;
    companyName: string;
    contactEmail: string;
    contactPhone: string;
  };
  quotes: Quote[];
}

export interface Quote {
  id: number;
  inquiryId: number;
  vendorId: number;
  price: number;
  quantity: number;
  validUntil: string;
  terms: string;
  deliveryTime: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
  vendor: {
    id: number;
    companyName: string;
    contactEmail: string;
    contactPhone: string;
  };
}

export interface CreateInquiryDto {
  productId: number;
  subject: string;
  message: string;
  quantity: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CreateQuoteDto {
  inquiryId: number;
  price: number;
  quantity: number;
  validUntil: string;
  terms: string;
  deliveryTime: string;
}

export interface InquiryFilters {
  status?: 'PENDING' | 'RESPONDED' | 'CLOSED';
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
}

export interface QuoteFilters {
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
}

// Inquiry & Quote API functions
export const inquiryQuoteAPI = {
  // Inquiry Management
  inquiries: {
    // Create new inquiry
    create: async (data: CreateInquiryDto): Promise<Inquiry> => {
      const response = await api.post('/api/inquiries', data);
      return response.data;
    },

    // Get user inquiries
    getUserInquiries: async (filters?: InquiryFilters): Promise<{
      content: Inquiry[];
      totalElements: number;
      totalPages: number;
      number: number;
    }> => {
      const response = await api.get('/api/inquiries/user', { params: filters });
      return response.data;
    },

    // Get vendor inquiries
    getVendorInquiries: async (filters?: InquiryFilters): Promise<{
      content: Inquiry[];
      totalElements: number;
      totalPages: number;
      number: number;
    }> => {
      const response = await api.get('/api/inquiries/vendor', { params: filters });
      return response.data;
    },

    // Get inquiry by ID
    getById: async (id: number): Promise<Inquiry> => {
      const response = await api.get(`/api/inquiries/${id}`);
      return response.data;
    },

    // Update inquiry status
    updateStatus: async (id: number, status: 'PENDING' | 'RESPONDED' | 'CLOSED'): Promise<Inquiry> => {
      const response = await api.patch(`/api/inquiries/${id}/status`, { status });
      return response.data;
    },

    // Delete inquiry
    delete: async (id: number): Promise<void> => {
      await api.delete(`/api/inquiries/${id}`);
    },

    // Respond to inquiry (Vendor)
    respond: async (id: number, response: string): Promise<Inquiry> => {
      const apiResponse = await api.post(`/api/inquiries/${id}/respond`, { response });
      return apiResponse.data;
    }
  },

  // Quote Management
  quotes: {
    // Create new quote (Vendor only)
    create: async (data: CreateQuoteDto): Promise<Quote> => {
      const response = await api.post('/api/quotes', data);
      return response.data;
    },

    // Get quotes for specific inquiry
    getByInquiry: async (inquiryId: number): Promise<Quote[]> => {
      const response = await api.get(`/api/quotes/inquiry/${inquiryId}`);
      return response.data;
    },

    // Get vendor quotes
    getVendorQuotes: async (filters?: QuoteFilters): Promise<{
      content: Quote[];
      totalElements: number;
      totalPages: number;
      number: number;
    }> => {
      const response = await api.get('/api/quotes/vendor', { params: filters });
      return response.data;
    },

    // Get user quotes (quotes received by user)
    getUserQuotes: async (filters?: QuoteFilters): Promise<{
      content: Quote[];
      totalElements: number;
      totalPages: number;
      number: number;
    }> => {
      const response = await api.get('/api/quotes/user', { params: filters });
      return response.data;
    },

    // Update quote
    update: async (id: number, data: Partial<CreateQuoteDto>): Promise<Quote> => {
      const response = await api.put(`/api/quotes/${id}`, data);
      return response.data;
    },

    // Accept quote (User)
    accept: async (id: number): Promise<Quote> => {
      const response = await api.patch(`/api/quotes/${id}/accept`);
      return response.data;
    },

    // Reject quote (User)
    reject: async (id: number, reason?: string): Promise<Quote> => {
      const response = await api.patch(`/api/quotes/${id}/reject`, { reason });
      return response.data;
    },

    // Delete quote
    delete: async (id: number): Promise<void> => {
      await api.delete(`/api/quotes/${id}`);
    }
  },

  // Analytics
  analytics: {
    // Get inquiry analytics for vendor
    getVendorInquiryStats: async (): Promise<{
      totalInquiries: number;
      pendingInquiries: number;
      respondedInquiries: number;
      closedInquiries: number;
      conversionRate: number;
    }> => {
      const response = await api.get('/api/inquiries/vendor/analytics');
      return response.data;
    },

    // Get quote analytics for vendor
    getVendorQuoteStats: async (): Promise<{
      totalQuotes: number;
      pendingQuotes: number;
      acceptedQuotes: number;
      rejectedQuotes: number;
      acceptanceRate: number;
    }> => {
      const response = await api.get('/api/quotes/vendor/analytics');
      return response.data;
    }
  }
};