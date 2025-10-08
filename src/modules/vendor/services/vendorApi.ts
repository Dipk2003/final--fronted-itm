import { api } from '@/shared/services/api';

export interface VendorRanking {
  id: number;
  vendorId: number;
  score: number;
  rank: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  avgRating: number;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExcelImportResponse {
  success: boolean;
  message: string;
  totalRows: number;
  successfulImports: number;
  failedImports: number;
  errors: string[];
  importedProducts: any[];
}

export interface VendorTaxProfile {
  id: number;
  vendorId: number;
  gstNumber: string;
  panNumber: string;
  companyName: string;
  address: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GstValidationResponse {
  valid: boolean;
  gstNumber: string;
  message: string;
  companyName?: string;
  address?: string;
  status?: string;
}

export interface PanValidationResponse {
  valid: boolean;
  panNumber: string;
  message: string;
  holderName?: string;
  category?: string;
  status?: string;
}

export interface VendorGstSelection {
  id: number;
  vendorId: number;
  gstNumber: string;
  gstRate: number;
  isSelected: boolean;
  createdAt: string;
}

export interface VendorTdsSelection {
  id: number;
  vendorId: number;
  panNumber: string;
  tdsRate: number;
  isSelected: boolean;
  createdAt: string;
}

export interface VendorGstSelectionDto {
  vendorId: number;
  gstNumber: string;
  selectedGstRates: number[];
  selectedTdsRates: number[];
}

export interface ImportTemplate {
  columns: string[];
  sampleData: any[];
  instructions: string[];
}

// Vendor API functions
export const vendorAPI = {
  // Get vendor ranking
  getVendorRanking: async (vendorId: number): Promise<VendorRanking> => {
    const response = await api.get(`/vendor/${vendorId}/ranking`);
    return response.data;
  },

  // GST validation and verification
  validateGstNumber: async (vendorId: number, gstNumber: string): Promise<GstValidationResponse> => {
    const response = await api.get(`/vendor/${vendorId}/gst/${gstNumber}/validate`);
    return response.data;
  },

  verifyGstNumber: async (vendorId: number, gstNumber: string): Promise<GstValidationResponse> => {
    const response = await api.get(`/vendor/${vendorId}/gst/${gstNumber}/verify`);
    return response.data;
  },

  getGstDetails: async (vendorId: number, gstNumber: string): Promise<GstValidationResponse> => {
    const response = await api.get(`/vendor/${vendorId}/gst/${gstNumber}/details`);
    return response.data;
  },

  // PAN validation and verification
  validatePanNumber: async (vendorId: number, panNumber: string): Promise<PanValidationResponse> => {
    const response = await api.get(`/vendor/${vendorId}/pan/${panNumber}/validate`);
    return response.data;
  },

  verifyPanNumber: async (vendorId: number, panNumber: string): Promise<PanValidationResponse> => {
    const response = await api.get(`/vendor/${vendorId}/pan/${panNumber}/verify`);
    return response.data;
  },

  getPanDetails: async (vendorId: number, panNumber: string): Promise<PanValidationResponse> => {
    const response = await api.get(`/vendor/${vendorId}/pan/${panNumber}/details`);
    return response.data;
  },

  // GST rates
  getAvailableGstRates: async (): Promise<{ gstRates: number[]; message: string }> => {
    const response = await api.get('/vendor/gst-rates');
    return response.data;
  },

  // Excel import - Updated to use new endpoint
  bulkImportProducts: async (vendorId: number, file: File): Promise<ExcelImportResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/api/excel/import/${vendorId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download import template
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await api.get('/api/excel/template', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Product image upload
  uploadProductImages: async (vendorId: number, productId: number, images: File[]): Promise<any> => {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });

    const response = await api.post(`/vendor/${vendorId}/products/${productId}/upload-images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Import template
  getImportTemplate: async (vendorId: number): Promise<ImportTemplate> => {
    const response = await api.get(`/vendor/vendors/${vendorId}/dashboard/import-template`);
    return response.data;
  },

  downloadTemplate: async (vendorId: number): Promise<Blob> => {
    const response = await api.get(`/vendor/vendors/${vendorId}/dashboard/download-template`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Tax selections
  saveVendorTaxSelections: async (vendorId: number, selections: VendorGstSelectionDto): Promise<any> => {
    const response = await api.post(`/vendor/${vendorId}/tax-selections`, selections);
    return response.data;
  },

  getVendorGstSelections: async (vendorId: number, gstNumber: string): Promise<VendorGstSelection[]> => {
    const response = await api.get(`/vendor/${vendorId}/gst/${gstNumber}/selections`);
    return response.data;
  },

  getVendorTdsSelections: async (vendorId: number, panNumber: string): Promise<VendorTdsSelection[]> => {
    const response = await api.get(`/vendor/${vendorId}/tds/${panNumber}/selections`);
    return response.data;
  },

  getSelectedGstRates: async (vendorId: number, gstNumber: string): Promise<VendorGstSelection[]> => {
    const response = await api.get(`/vendor/${vendorId}/gst/${gstNumber}/selected-rates`);
    return response.data;
  },

  getSelectedTdsRates: async (vendorId: number, panNumber: string): Promise<VendorTdsSelection[]> => {
    const response = await api.get(`/vendor/${vendorId}/tds/${panNumber}/selected-rates`);
    return response.data;
  },

  // Tax dashboard
  getVendorTaxDashboard: async (vendorId: number, gstNumber?: string, panNumber?: string): Promise<any> => {
    const params: any = {};
    if (gstNumber) params.gstNumber = gstNumber;
    if (panNumber) params.panNumber = panNumber;

    const response = await api.get(`/vendor/${vendorId}/tax-dashboard`, { params });
    return response.data;
  }
};
