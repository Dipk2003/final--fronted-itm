import apiClient, { PaginatedResponse, getErrorMessage } from '@/lib/enhanced-api-client';
import toast from 'react-hot-toast';

// User & Vendor Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
  profileImageUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  kycStatus?: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: number;
  vendorName: string;
  email: string;
  phone: string;
  businessType: VendorBusinessType;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  isVerified: boolean;
  kycApproved: boolean;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  totalOrders: number;
  businessAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactPerson: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  documents: VendorDocument[];
  subscription?: {
    planId: number;
    planName: string;
    expiryDate: string;
    isActive: boolean;
  };
  deliveryAvailable: boolean;
  installationService: boolean;
  supportedPaymentMethods: PaymentMethod[];
  workingHours: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  createdAt: string;
  updatedAt: string;
  kycSubmittedAt?: string;
  kycApprovedAt?: string;
}

export interface VendorDocument {
  id: number;
  vendorId: number;
  documentType: DocumentType;
  documentUrl: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  comments?: string;
}

export interface Company {
  id: number;
  name: string;
  description?: string;
  website?: string;
  email: string;
  phone: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  industry: string;
  employeeCount: number;
  establishedYear: number;
  logo?: string;
  isVerified: boolean;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface KycDocument {
  id: number;
  userId: number;
  documentType: KycDocumentType;
  documentNumber: string;
  documentUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface Address {
  id: number;
  userId: number;
  type: 'shipping' | 'billing';
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type VendorBusinessType = 
  | 'manufacturer'
  | 'distributor'
  | 'wholesaler'
  | 'retailer'
  | 'service_provider'
  | 'trader';

export type VerificationStatus = 
  | 'pending'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'suspended';

export type DocumentType = 
  | 'business_license'
  | 'tax_certificate'
  | 'bank_statement'
  | 'identity_proof'
  | 'address_proof'
  | 'gst_certificate'
  | 'trade_license';

export type KycDocumentType = 
  | 'aadhar'
  | 'pan'
  | 'passport'
  | 'driving_license'
  | 'voter_id';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'net_banking'
  | 'upi'
  | 'wallet'
  | 'cash_on_delivery';

export interface VendorCreateRequest {
  vendorName: string;
  email: string;
  phone: string;
  businessType: VendorBusinessType;
  businessAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactPerson: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  deliveryAvailable?: boolean;
  installationService?: boolean;
}

export interface VendorUpdateRequest extends Partial<VendorCreateRequest> {
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  workingHours?: Vendor['workingHours'];
  supportedPaymentMethods?: PaymentMethod[];
}

// User & Vendor Management Service
class UserVendorService {
  // ===================
  // USER MANAGEMENT
  // ===================

  async getUsers(page = 0, size = 20, role?: string): Promise<PaginatedResponse<User>> {
    try {
      const params: any = { page, size };
      if (role) params.role = role;
      
      const url = apiClient.buildUrl('/api/users', params);
      const response = await apiClient.get<PaginatedResponse<User>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch users: ${message}`);
      throw error;
    }
  }

  async getUserById(userId: number): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/api/users/${userId}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch user: ${message}`);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/api/users/email/${encodeURIComponent(email)}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch user by email: ${message}`);
      throw error;
    }
  }

  async getUserByPhone(phone: string): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/api/users/phone/${encodeURIComponent(phone)}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch user by phone: ${message}`);
      throw error;
    }
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/api/users/${userId}`, userData);
      toast.success('User updated successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update user: ${message}`);
      throw error;
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/users/${userId}`);
      toast.success('User deleted successfully!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete user: ${message}`);
      throw error;
    }
  }

  async getVerifiedUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/api/users/verified');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch verified users: ${message}`);
      return [];
    }
  }

  async getUnverifiedUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/api/users/unverified');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch unverified users: ${message}`);
      return [];
    }
  }

  // ===================
  // VENDOR MANAGEMENT
  // ===================

  async getVendors(filters: {
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'asc' | 'desc';
    vendorName?: string;
    businessType?: VendorBusinessType;
    verificationStatus?: VerificationStatus;
    isActive?: boolean;
    isVerified?: boolean;
    kycApproved?: boolean;
    minRating?: number;
    deliveryAvailable?: boolean;
    installationService?: boolean;
  } = {}): Promise<PaginatedResponse<Vendor>> {
    try {
      const {
        page = 0,
        size = 20,
        sort = 'vendorName',
        direction = 'asc',
        ...filterParams
      } = filters;

      const params = {
        page,
        size,
        sort,
        direction,
        ...filterParams
      };

      const url = apiClient.buildUrl('/api/v1/vendors/filter', params);
      const response = await apiClient.get<PaginatedResponse<Vendor>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch vendors: ${message}`);
      throw error;
    }
  }

  async searchVendors(searchTerm: string, page = 0, size = 20): Promise<PaginatedResponse<Vendor>> {
    try {
      const params = {
        searchTerm,
        page,
        size,
        sort: 'vendorName',
        direction: 'asc'
      };

      const url = apiClient.buildUrl('/api/v1/vendors/search', params);
      const response = await apiClient.get<PaginatedResponse<Vendor>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Vendor search failed: ${message}`);
      throw error;
    }
  }

  async getVendorById(vendorId: number): Promise<Vendor> {
    try {
      const response = await apiClient.get<Vendor>(`/api/v1/vendors/${vendorId}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch vendor: ${message}`);
      throw error;
    }
  }

  async createVendor(vendorData: VendorCreateRequest): Promise<Vendor> {
    try {
      const response = await apiClient.post<Vendor>('/api/v1/vendors', vendorData);
      toast.success('Vendor created successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to create vendor: ${message}`);
      throw error;
    }
  }

  async updateVendor(vendorId: number, vendorData: VendorUpdateRequest): Promise<Vendor> {
    try {
      const response = await apiClient.put<Vendor>(`/api/v1/vendors/${vendorId}`, vendorData);
      toast.success('Vendor updated successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update vendor: ${message}`);
      throw error;
    }
  }

  async deleteVendor(vendorId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/vendors/${vendorId}`);
      toast.success('Vendor deleted successfully!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete vendor: ${message}`);
      throw error;
    }
  }

  // ===================
  // VENDOR VERIFICATION & KYC
  // ===================

  async verifyVendor(verificationData: {
    vendorId: number;
    verificationStatus: VerificationStatus;
    comments?: string;
  }): Promise<Vendor> {
    try {
      const response = await apiClient.post<Vendor>('/api/v1/vendors/verify', verificationData);
      toast.success('Vendor verification updated!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Vendor verification failed: ${message}`);
      throw error;
    }
  }

  async submitVendorKyc(vendorId: number, documentUrls: string[]): Promise<Vendor> {
    try {
      const response = await apiClient.post<Vendor>(`/api/v1/vendors/${vendorId}/kyc`, documentUrls);
      toast.success('KYC documents submitted successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`KYC submission failed: ${message}`);
      throw error;
    }
  }

  async getPendingKycVendors(page = 0, size = 20): Promise<PaginatedResponse<Vendor>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl('/api/v1/vendors/kyc/pending', params);
      const response = await apiClient.get<PaginatedResponse<Vendor>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch pending KYC vendors: ${message}`);
      throw error;
    }
  }

  async getPendingApprovalVendors(page = 0, size = 20): Promise<PaginatedResponse<Vendor>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl('/api/v1/vendors/approval/pending', params);
      const response = await apiClient.get<PaginatedResponse<Vendor>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch pending approval vendors: ${message}`);
      throw error;
    }
  }

  async getVendorsByStatus(status: VerificationStatus, page = 0, size = 20): Promise<PaginatedResponse<Vendor>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl(`/api/v1/vendors/status/${status}`, params);
      const response = await apiClient.get<PaginatedResponse<Vendor>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch vendors by status: ${message}`);
      throw error;
    }
  }

  // ===================
  // VENDOR STATUS MANAGEMENT
  // ===================

  async updateVendorStatus(vendorId: number, status: VerificationStatus): Promise<Vendor> {
    try {
      const response = await apiClient.patch<Vendor>(`/api/v1/vendors/${vendorId}/status?status=${status}`);
      toast.success(`Vendor status updated to ${status}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update vendor status: ${message}`);
      throw error;
    }
  }

  async activateVendor(vendorId: number): Promise<Vendor> {
    try {
      const response = await apiClient.post<Vendor>(`/api/v1/vendors/${vendorId}/activate`);
      toast.success('Vendor activated successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to activate vendor: ${message}`);
      throw error;
    }
  }

  async deactivateVendor(vendorId: number): Promise<Vendor> {
    try {
      const response = await apiClient.post<Vendor>(`/api/v1/vendors/${vendorId}/deactivate`);
      toast.success('Vendor deactivated successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to deactivate vendor: ${message}`);
      throw error;
    }
  }

  async suspendVendor(vendorId: number, reason: string): Promise<Vendor> {
    try {
      const response = await apiClient.post<Vendor>(`/api/v1/vendors/${vendorId}/suspend?reason=${encodeURIComponent(reason)}`);
      toast.success('Vendor suspended successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to suspend vendor: ${message}`);
      throw error;
    }
  }

  // ===================
  // COMPANY MANAGEMENT
  // ===================

  async getCompanies(page = 0, size = 20): Promise<PaginatedResponse<Company>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl('/api/companies', params);
      const response = await apiClient.get<PaginatedResponse<Company>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch companies: ${message}`);
      throw error;
    }
  }

  async getCompanyById(companyId: number): Promise<Company> {
    try {
      const response = await apiClient.get<Company>(`/api/companies/${companyId}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch company: ${message}`);
      throw error;
    }
  }

  async getUserCompanies(userId: number): Promise<Company[]> {
    try {
      const response = await apiClient.get<Company[]>(`/api/companies/user/${userId}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch user companies: ${message}`);
      return [];
    }
  }

  async createCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>): Promise<Company> {
    try {
      const response = await apiClient.post<Company>('/api/companies', companyData);
      toast.success('Company created successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to create company: ${message}`);
      throw error;
    }
  }

  async updateCompany(companyId: number, companyData: Partial<Company>): Promise<Company> {
    try {
      const response = await apiClient.put<Company>(`/api/companies/${companyId}`, companyData);
      toast.success('Company updated successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update company: ${message}`);
      throw error;
    }
  }

  async deleteCompany(companyId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/companies/${companyId}`);
      toast.success('Company deleted successfully!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete company: ${message}`);
      throw error;
    }
  }

  // ===================
  // ADDRESS MANAGEMENT
  // ===================

  async getUserAddresses(userId: number): Promise<Address[]> {
    try {
      const response = await apiClient.get<Address[]>(`/api/users/${userId}/addresses`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch user addresses: ${message}`);
      return [];
    }
  }

  async addUserAddress(userId: number, addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    try {
      const response = await apiClient.post<Address>(`/api/users/${userId}/addresses`, addressData);
      toast.success('Address added successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to add address: ${message}`);
      throw error;
    }
  }

  async updateUserAddress(userId: number, addressId: number, addressData: Partial<Address>): Promise<Address> {
    try {
      const response = await apiClient.put<Address>(`/api/users/${userId}/addresses/${addressId}`, addressData);
      toast.success('Address updated successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update address: ${message}`);
      throw error;
    }
  }

  async deleteUserAddress(userId: number, addressId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/users/${userId}/addresses/${addressId}`);
      toast.success('Address deleted successfully!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete address: ${message}`);
      throw error;
    }
  }

  // ===================
  // KYC DOCUMENT MANAGEMENT
  // ===================

  async getKycDocuments(userId?: number): Promise<KycDocument[]> {
    try {
      const url = userId ? `/api/kyc/documents?userId=${userId}` : '/api/kyc/documents';
      const response = await apiClient.get<KycDocument[]>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch KYC documents: ${message}`);
      return [];
    }
  }

  async uploadKycDocument(documentData: {
    userId: number;
    documentType: KycDocumentType;
    documentNumber: string;
    documentUrl: string;
  }): Promise<KycDocument> {
    try {
      const response = await apiClient.post<KycDocument>('/api/kyc/documents', documentData);
      toast.success('KYC document uploaded successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to upload KYC document: ${message}`);
      throw error;
    }
  }

  async updateKycDocument(documentId: number, documentData: Partial<KycDocument>): Promise<KycDocument> {
    try {
      const response = await apiClient.put<KycDocument>(`/api/kyc/documents/${documentId}`, documentData);
      toast.success('KYC document updated successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update KYC document: ${message}`);
      throw error;
    }
  }

  async deleteKycDocument(documentId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/kyc/documents/${documentId}`);
      toast.success('KYC document deleted successfully!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete KYC document: ${message}`);
      throw error;
    }
  }

  // ===================
  // PAN VERIFICATION
  // ===================

  async verifyPan(panNumber: string): Promise<{
    isValid: boolean;
    name?: string;
    message: string;
  }> {
    try {
      const response = await apiClient.post<{
        isValid: boolean;
        name?: string;
        message: string;
      }>('/api/verification/pan', { panNumber });
      
      if (response.isValid) {
        toast.success('PAN verified successfully!');
      } else {
        toast.error('PAN verification failed!');
      }
      
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`PAN verification failed: ${message}`);
      throw error;
    }
  }

  async getPanVerificationStatus(verificationId: number): Promise<{
    id: number;
    panNumber: string;
    status: 'pending' | 'verified' | 'failed';
    name?: string;
    verifiedAt?: string;
    error?: string;
  }> {
    try {
      const response = await apiClient.get(`/api/verification/pan/${verificationId}/status`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get PAN verification status: ${message}`);
      throw error;
    }
  }

  // ===================
  // UTILITY METHODS
  // ===================

  getVerificationStatusColor(status: VerificationStatus): string {
    const colors: Record<VerificationStatus, string> = {
      pending: '#f59e0b',
      under_review: '#8b5cf6',
      verified: '#10b981',
      rejected: '#ef4444',
      suspended: '#6b7280'
    };
    return colors[status] || '#6b7280';
  }

  getBusinessTypeLabel(type: VendorBusinessType): string {
    const labels: Record<VendorBusinessType, string> = {
      manufacturer: 'Manufacturer',
      distributor: 'Distributor',
      wholesaler: 'Wholesaler',
      retailer: 'Retailer',
      service_provider: 'Service Provider',
      trader: 'Trader'
    };
    return labels[type] || type;
  }

  formatVendorRating(rating: number): string {
    return `${rating.toFixed(1)} ★`;
  }

  isVendorActive(vendor: Vendor): boolean {
    return vendor.isActive && vendor.verificationStatus === 'verified';
  }

  canVendorReceiveOrders(vendor: Vendor): boolean {
    return this.isVendorActive(vendor) && vendor.kycApproved;
  }

  getVendorStatusText(vendor: Vendor): string {
    if (!vendor.isActive) return 'Inactive';
    if (vendor.verificationStatus === 'suspended') return 'Suspended';
    if (vendor.verificationStatus === 'pending') return 'Pending Verification';
    if (vendor.verificationStatus === 'under_review') return 'Under Review';
    if (vendor.verificationStatus === 'rejected') return 'Rejected';
    if (!vendor.kycApproved) return 'KYC Pending';
    return 'Active';
  }
}

// Export singleton instance
export const userVendorService = new UserVendorService();
export default userVendorService;