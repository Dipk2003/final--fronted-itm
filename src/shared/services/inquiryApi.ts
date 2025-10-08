import { api } from './api';

export interface Inquiry {
  id?: number;
  user: any;
  product: any;
  message: string;
  isResolved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Quote {
  id?: number;
  vendor: any;
  inquiry: any;
  response: string;
  isAccepted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const inquiryApi = {
  // Create a new inquiry
  createInquiry: async (inquiry: Partial<Inquiry>) => {
    const response = await api.post('/api/inquiries', inquiry);
    return response.data;
  },

  // Get all inquiries
  getAllInquiries: async () => {
    const response = await api.get('/api/inquiries');
    return response.data;
  },

  // Create a quote response
  createQuote: async (quote: Partial<Quote>) => {
    const response = await api.post('/api/quotes', quote);
    return response.data;
  },

  // Get all quotes
  getAllQuotes: async () => {
    const response = await api.get('/api/quotes');
    return response.data;
  },

  // Get inquiries by user
  getUserInquiries: async (userId: number) => {
    const response = await api.get(`/api/inquiries?userId=${userId}`);
    return response.data;
  },

  // Get quotes by vendor
  getVendorQuotes: async (vendorId: number) => {
    const response = await api.get(`/api/quotes?vendorId=${vendorId}`);
    return response.data;
  }
};
