import { api } from '@/shared/services/api';

// Types for vendor package system
export interface VendorPackagePlan {
  id: number;
  name: string;
  displayName: string;
  description: string;
  price: number;
  discountedPrice?: number;
  durationDays: number;
  durationType: string;
  planType: 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  badge?: string;
  color: string;
  icon?: string;
  
  // Core Features
  maxProducts?: number;
  maxLeads?: number;
  maxOrders?: number;
  maxQuotations?: number;
  maxProductImages?: number;
  
  // Premium Features
  featuredListing: boolean;
  prioritySupport: boolean;
  analyticsAccess: boolean;
  chatbotPriority: boolean;
  customBranding: boolean;
  bulkImportExport: boolean;
  apiAccess: boolean;
  multiLocationSupport: boolean;
  inventoryManagement: boolean;
  customerInsights: boolean;
  marketplaceIntegration: boolean;
  socialMediaIntegration: boolean;
  
  // Business Features
  gstCompliance: boolean;
  invoiceGeneration: boolean;
  paymentGateway: boolean;
  shippingIntegration: boolean;
  returnManagement: boolean;
  loyaltyProgram: boolean;
  
  // Technical Features
  searchRanking?: number;
  storageLimit?: number;
  bandwidthLimit?: number;
  apiCallLimit?: number;
  
  // Pricing & Offers
  setupFee?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
  trialDays?: number;
  offerText?: string;
  
  // Status
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
  
  // Additional Frontend Data
  features?: string[];
  benefits?: string[];
  limitations?: string[];
  isCurrentPlan?: boolean;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionStatus?: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  
  createdAt: string;
  updatedAt?: string;
}

export interface VendorPackagePurchase {
  planId: number;
  paymentMethod: 'RAZORPAY' | 'UPI' | 'NET_BANKING' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'WALLET' | 'EMI';
  transactionId?: string;
  couponCode?: string;
  discountAmount?: number;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPincode?: string;
  gstNumber?: string;
  generateInvoice?: boolean;
  installmentCount?: number;
  installmentAmount?: number;
  notes?: string;
}

export interface VendorPackageTransaction {
  id: number;
  transactionId: string;
  vendorPackage: VendorPackagePlan;
  amount: number;
  discountAmount?: number;
  taxAmount?: number;
  tax?: number;
  totalAmount: number;
  paymentMethod: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  paymentGatewayTransactionId?: string;
  couponCode?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPincode?: string;
  billingPeriod?: 'monthly' | 'yearly';
  gstNumber?: string;
  invoiceNumber?: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  paymentDate?: string;
  expiryDate?: string;
  failureReason?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  autoRenew?: boolean;
  createdAt: string;
}

export interface CurrentSubscription {
  subscription?: any;
  isActive: boolean;
  daysRemaining?: number;
  usageStats?: {
    productsUsed: number;
    leadsUsed: number;
    storageUsed: number;
    apiCallsUsed: number;
  };
  message?: string;
}

export interface PackageComparison {
  packages: any[];
  features: {
    features: Array<{
      feature: string;
      packages: Record<string, boolean>;
    }>;
  };
}

export interface DashboardSummary {
  currentSubscription: CurrentSubscription;
  popularPackages: VendorPackagePlan[];
  upgradeRecommendations: string[];
}

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
}

// Vendor Package API functions
export const vendorPackageAPI = {
  // Get all available packages
  getAllPackages: async (): Promise<VendorPackagePlan[]> => {
    const response = await api.get<ApiResponse<VendorPackagePlan[]>>('/api/vendor/packages/all');
    return response.data.data;
  },

  // Get popular packages
  getPopularPackages: async (): Promise<VendorPackagePlan[]> => {
    const response = await api.get<ApiResponse<VendorPackagePlan[]>>('/api/vendor/packages/popular');
    return response.data.data;
  },

  // Get packages by type
  getPackagesByType: async (planType: string): Promise<VendorPackagePlan[]> => {
    const response = await api.get<ApiResponse<VendorPackagePlan[]>>(`/api/vendor/packages/type/${planType}`);
    return response.data.data;
  },

  // Get package by ID
  getPackageById: async (packageId: number): Promise<VendorPackagePlan> => {
    const response = await api.get<ApiResponse<VendorPackagePlan>>(`/api/vendor/packages/${packageId}`);
    return response.data.data;
  },

  // Purchase a package
  purchasePackage: async (purchaseData: VendorPackagePurchase): Promise<ApiResponse<{
    transactionId: string;
    totalAmount: number;
    status: string;
    expiryDate: string;
  }>> => {
    const response = await api.post<ApiResponse<any>>('/api/vendor/packages/purchase', purchaseData);
    return response.data;
  },

  // Confirm payment (webhook)
  confirmPayment: async (paymentData: {
    transactionId: string;
    paymentGatewayTransactionId: string;
    [key: string]: any;
  }): Promise<void> => {
    await api.post('/api/vendor/packages/confirm-payment', paymentData);
  },

  // Get current subscription
  getCurrentSubscription: async (): Promise<CurrentSubscription> => {
    const response = await api.get<ApiResponse<CurrentSubscription>>('/api/vendor/packages/subscription/current');
    return response.data.data;
  },

  // Get transaction history
  getTransactionHistory: async (): Promise<VendorPackageTransaction[]> => {
    const response = await api.get<ApiResponse<VendorPackageTransaction[]>>('/api/vendor/packages/transactions/history');
    return response.data.data;
  },

  // Get package comparison
  getPackageComparison: async (): Promise<PackageComparison> => {
    const response = await api.get<ApiResponse<PackageComparison>>('/api/vendor/packages/comparison');
    return response.data.data;
  },

  // Check permissions
  checkPermission: async (action: string): Promise<ApiResponse<{ allowed: boolean; action: string; message: string }>> => {
    const response = await api.get<ApiResponse<any>>(`/api/vendor/packages/permissions/check/${action}`);
    return response.data;
  },

  // Get dashboard summary
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<ApiResponse<DashboardSummary>>('/api/vendor/packages/dashboard/summary');
    return response.data.data;
  }
};

// Helper functions for UI
export const packageHelpers = {
  // Format price with currency
  formatPrice: (price: number): string => {
    return `₹${price.toLocaleString('en-IN')}`;
  },

  // Get plan color class
  getPlanColorClass: (planType: string): string => {
    const colors = {
      SILVER: 'bg-gray-100 text-gray-800 border-gray-300',
      GOLD: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      PLATINUM: 'bg-purple-100 text-purple-800 border-purple-300',
      DIAMOND: 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return colors[planType as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  },

  // Get plan icon
  getPlanIcon: (planType: string): string => {
    const icons = {
      SILVER: '🥈',
      GOLD: '🥇',
      PLATINUM: '💎',
      DIAMOND: '💍'
    };
    return icons[planType as keyof typeof icons] || '📦';
  },

  // Calculate savings
  calculateSavings: (originalPrice: number, discountedPrice?: number): number => {
    if (!discountedPrice) return 0;
    return originalPrice - discountedPrice;
  },

  // Calculate savings percentage
  calculateSavingsPercentage: (originalPrice: number, discountedPrice?: number): number => {
    if (!discountedPrice) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  },

  // Check if package is recommended
  isRecommended: (pkg: VendorPackagePlan): boolean => {
    return pkg.isPopular || pkg.badge === 'POPULAR' || pkg.badge === 'RECOMMENDED';
  },

  // Get feature list for display
  getDisplayFeatures: (pkg: VendorPackagePlan): string[] => {
    const features: string[] = [];
    
    if (pkg.maxProducts) features.push(`${pkg.maxProducts} Products`);
    if (pkg.maxLeads) features.push(`${pkg.maxLeads} Leads`);
    if (pkg.featuredListing) features.push('Featured Listing');
    if (pkg.prioritySupport) features.push('Priority Support');
    if (pkg.analyticsAccess) features.push('Analytics Access');
    if (pkg.customBranding) features.push('Custom Branding');
    if (pkg.apiAccess) features.push('API Access');
    if (pkg.storageLimit) features.push(`${pkg.storageLimit}GB Storage`);
    
    return features;
  }
};
