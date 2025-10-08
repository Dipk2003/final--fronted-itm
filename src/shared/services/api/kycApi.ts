import { API_CONFIG, apiRequest } from '@/config/api';

export interface KycDocumentUpload {
  vendorId: number;
  documentType: 'PAN_CARD' | 'GST_CERTIFICATE' | 'BUSINESS_REGISTRATION' | 'BANK_STATEMENT';
  file: File;
}

export interface KycDocument {
  id: number;
  documentType: string;
  fileName: string;
  originalFileName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  rejectionReason?: string;
}

class KycApiService {
  
  async uploadDocument(data: KycDocumentUpload): Promise<any> {
    const formData = new FormData();
    formData.append('vendorId', data.vendorId.toString());
    formData.append('documentType', data.documentType);
    formData.append('file', data.file);

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/kyc/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    return response.json();
  }

  async getVendorDocuments(vendorId: number): Promise<KycDocument[]> {
    return apiRequest<KycDocument[]>(`/api/kyc/vendor/${vendorId}`, {}, true);
  }

  async getPendingDocuments(): Promise<KycDocument[]> {
    return apiRequest<KycDocument[]>('/api/kyc/pending', {}, true);
  }

  async approveDocument(documentId: number, reviewerId: number): Promise<any> {
    return apiRequest(`/api/kyc/approve/${documentId}`, {
      method: 'POST',
      body: JSON.stringify({ reviewerId }),
    }, true);
  }

  async rejectDocument(documentId: number, reviewerId: number, reason: string): Promise<any> {
    return apiRequest(`/api/kyc/reject/${documentId}`, {
      method: 'POST',
      body: JSON.stringify({ reviewerId, reason }),
    }, true);
  }
}

export const kycApi = new KycApiService();
