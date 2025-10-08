import { api } from '@/lib/api';

export interface InquiryData {
  productId: string;
  vendorId?: string;
  productName: string;
  message: string;
  quantity: number;
  budget: number;
}

export interface Inquiry {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  product: {
    id: number;
    name: string;
    vendor: {
      id: number;
      name: string;
      email: string;
    };
  };
  message: string;
  isResolved: boolean;
  createdAt: string;
  updatedAt?: string;
}

export const inquiryApi = {
  // Create new inquiry
  createInquiry: async (inquiryData: InquiryData): Promise<Inquiry> => {
    const response = await api.post('/api/inquiries', {
      productId: inquiryData.productId,
      message: `${inquiryData.message}\n\nQuantity Required: ${inquiryData.quantity}\nBudget: ₹${inquiryData.budget}`
    });
    return response.data;
  },

  // Get user's inquiries
  getMyInquiries: async (page: number = 0, size: number = 10) => {
    const response = await api.get('/api/inquiries/my-inquiries', {
      params: { page, size }
    });
    return response.data;
  },

  // Get vendor's inquiries
  getVendorInquiries: async (page: number = 0, size: number = 10) => {
    const response = await api.get('/api/inquiries/vendor-inquiries', {
      params: { page, size }
    });
    return response.data;
  },

  // Get unresolved inquiries for vendor
  getUnresolvedInquiries: async () => {
    const response = await api.get('/api/inquiries/vendor-unresolved');
    return response.data;
  },

  // Mark inquiry as resolved
  markAsResolved: async (inquiryId: number): Promise<Inquiry> => {
    const response = await api.put(`/api/inquiries/${inquiryId}/resolve`);
    return response.data;
  },

  // Get inquiries for a specific product
  getProductInquiries: async (productId: number) => {
    const response = await api.get(`/api/inquiries/product/${productId}`);
    return response.data;
  },

  // Admin: Get all inquiries
  getAllInquiries: async () => {
    const response = await api.get('/api/inquiries');
    return response.data;
  }
};
