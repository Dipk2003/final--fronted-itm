import { api } from './api';

export interface VendorProfile {
  id: number;
  userId: number;
  companyName: string;
  businessType: string;
  gstNumber?: string;
  panNumber?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  description?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorDashboardData {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalInquiries: number;
  pendingInquiries: number;
  recentOrders: any[];
  recentInquiries: any[];
  topProducts: any[];
}

export interface GstNumber {
  id: number;
  vendorId: number;
  gstNumber: string;
  companyName: string;
  address: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGstNumberDto {
  gstNumber: string;
  companyName: string;
  address: string;
}

export interface KycDocument {
  id: number;
  vendorId: number;
  documentType: 'PAN' | 'GST' | 'AADHAR' | 'BANK_STATEMENT' | 'OTHER';
  documentUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks?: string;
  uploadedAt: string;
  reviewedAt?: string;
}

// Vendor Management API functions
export const vendorManagementAPI = {
  // Get vendor profile
  getProfile: async (): Promise<VendorProfile> => {
    const response = await api.get('/api/vendors/profile');
    return response.data;
  },

  // Update vendor profile
  updateProfile: async (data: Partial<VendorProfile>): Promise<VendorProfile> => {
    const response = await api.put('/api/vendors/profile', data);
    return response.data;
  },

  // Get vendor dashboard data
  getDashboardData: async (): Promise<VendorDashboardData> => {
    const response = await api.get('/api/vendors/dashboard');
    return response.data;
  },

  // KYC Management
  kyc: {
    // Upload KYC documents
    uploadDocument: async (formData: FormData): Promise<KycDocument> => {
      const response = await api.post('/api/kyc/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    // Get KYC documents
    getDocuments: async (): Promise<KycDocument[]> => {
      const response = await api.get('/api/kyc/documents');
      return response.data;
    }
  },

  // GST & Tax Management
  gst: {
    // Get all GST numbers
    getAll: async (): Promise<GstNumber[]> => {
      const response = await api.get('/api/vendors/gst-numbers');
      return response.data;
    },

    // Add new GST number
    create: async (data: CreateGstNumberDto): Promise<GstNumber> => {
      const response = await api.post('/api/vendors/gst-numbers', data);
      return response.data;
    },

    // Update GST number
    update: async (id: number, data: Partial<CreateGstNumberDto>): Promise<GstNumber> => {
      const response = await api.put(`/api/vendors/gst-numbers/${id}`, data);
      return response.data;
    },

    // Delete GST number
    delete: async (id: number): Promise<void> => {
      await api.delete(`/api/vendors/gst-numbers/${id}`);
    }
  }
};