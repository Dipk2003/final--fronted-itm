// =============================================================================
// Integrated API Client - Frontend-Backend Integration
// =============================================================================
// Comprehensive API client matching backend endpoints

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_ENDPOINTS } from '@/lib/api-config';

// Types for API responses
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

interface ApiError {
  success: false;
  error: string;
  code?: string;
  timestamp?: string;
}

interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// API Client Class
class IntegratedApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
        return response;
      },
      (error: AxiosError) => {
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.status);
        
        // Handle 401/403 errors
        if (error.response?.status === 401) {
          this.handleAuthError();
        }

        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || localStorage.getItem('token');
    }
    return null;
  }

  private handleAuthError() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      // Redirect to user login page (most common case)
      window.location.href = '/auth/user/login';
    }
  }

  // =============================================================================
  // AUTHENTICATION METHODS
  // =============================================================================

  async login(credentials: { emailOrPhone: string; password: string; userType?: string }) {
    const endpoint = credentials.userType === 'vendor' ? API_ENDPOINTS.AUTH.VENDOR_LOGIN :
                    credentials.userType === 'admin' ? API_ENDPOINTS.AUTH.ADMIN_LOGIN :
                    API_ENDPOINTS.AUTH.USER_LOGIN;
    
    const response = await this.client.post(endpoint, credentials);
    
    // Store auth data if login successful
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userRole', response.data.user.role);
    }
    
    return response.data;
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    userType: 'buyer' | 'vendor' | 'admin';
    companyName?: string;
    gstNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) {
    const endpoint = userData.userType === 'vendor' ? API_ENDPOINTS.AUTH.VENDOR_REGISTER :
                    userData.userType === 'admin' ? API_ENDPOINTS.AUTH.ADMIN_REGISTER :
                    API_ENDPOINTS.AUTH.REGISTER;
    
    const response = await this.client.post(endpoint, userData);
    return response.data;
  }

  async verifyOtp(data: { emailOrPhone: string; otp: string }) {
    const response = await this.client.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
    
    // Store auth data if verification successful
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userRole', response.data.user.role);
    }
    
    return response.data;
  }

  async forgotPassword(email: string) {
    const response = await this.client.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  }

  async resetPassword(data: { email: string; otp: string; newPassword: string }) {
    const response = await this.client.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  }

  async getProfile() {
    const response = await this.client.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }

  async updateProfile(profileData: any) {
    const response = await this.client.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await this.client.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    });
    return response.data;
  }

  // =============================================================================
  // PRODUCT METHODS
  // =============================================================================

  async getProducts(params?: {
    page?: number;
    size?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }) {
    const response = await this.client.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
    return response.data;
  }

  async getProductById(id: string) {
    const response = await this.client.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  }

  async searchProducts(params: {
    q: string;
    category?: string;
    location?: string;
    page?: number;
    size?: number;
  }) {
    const response = await this.client.get(API_ENDPOINTS.PRODUCTS.SEARCH, { params });
    return response.data;
  }

  async getFeaturedProducts() {
    const response = await this.client.get(API_ENDPOINTS.PRODUCTS.FEATURED);
    return response.data;
  }

  // =============================================================================
  // VENDOR METHODS
  // =============================================================================

  async getVendorProducts(params?: {
    page?: number;
    size?: number;
    search?: string;
    category?: string;
  }) {
    const response = await this.client.get(API_ENDPOINTS.VENDORS.PRODUCTS, { params });
    return response.data;
  }

  async createProduct(productData: {
    name: string;
    description: string;
    price?: number;
    categoryId?: number;
    subCategoryId?: number;
    brand?: string;
    model?: string;
    sku?: string;
    stock?: number;
    minOrderQuantity?: number;
    unit?: string;
    specifications?: string;
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping?: boolean;
    shippingCharge?: number;
    tags?: string[];
  }) {
    const response = await this.client.post(API_ENDPOINTS.VENDORS.CREATE_PRODUCT, productData);
    return response.data;
  }

  async updateProduct(id: string, productData: any) {
    const response = await this.client.put(API_ENDPOINTS.VENDORS.UPDATE_PRODUCT(id), productData);
    return response.data;
  }

  async deleteProduct(id: string) {
    const response = await this.client.delete(API_ENDPOINTS.VENDORS.DELETE_PRODUCT(id));
    return response.data;
  }

  async uploadProductImages(id: string, images: File[]) {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    const response = await this.client.post(API_ENDPOINTS.PRODUCTS.UPLOAD_IMAGES(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getVendorOrders(params?: {
    page?: number;
    size?: number;
    status?: string;
  }) {
    const response = await this.client.get(API_ENDPOINTS.VENDORS.ORDERS, { params });
    return response.data;
  }

  async getVendorAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }) {
    const response = await this.client.get(API_ENDPOINTS.VENDORS.ANALYTICS, { params });
    return response.data;
  }

  async bulkImportProducts(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post(API_ENDPOINTS.VENDORS.BULK_IMPORT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // =============================================================================
  // INQUIRY METHODS
  // =============================================================================

  async getVendorInquiries(params?: {
    page?: number;
    size?: number;
    status?: string;
  }) {
    const response = await this.client.get(API_ENDPOINTS.INQUIRIES.VENDOR_INQUIRIES, { params });
    return response.data;
  }

  async getInquiryById(id: string) {
    const response = await this.client.get(API_ENDPOINTS.INQUIRIES.BY_ID(id));
    return response.data;
  }

  async respondToInquiry(id: string, response: string) {
    const responseData = await this.client.post(API_ENDPOINTS.INQUIRIES.RESPOND(id), {
      response
    });
    return responseData.data;
  }

  async createInquiry(inquiryData: {
    productId: string;
    subject: string;
    message: string;
    quantity?: number;
    budget?: number;
  }) {
    const response = await this.client.post(API_ENDPOINTS.INQUIRIES.CREATE, inquiryData);
    return response.data;
  }

  // =============================================================================
  // CATEGORY METHODS
  // =============================================================================

  async getCategories() {
    const response = await this.client.get(API_ENDPOINTS.CATEGORIES.BASE);
    return response.data;
  }

  async getCategoryHierarchy() {
    const response = await this.client.get(API_ENDPOINTS.CATEGORIES.HIERARCHY);
    return response.data;
  }

  async getSubCategories(categoryId: string) {
    const response = await this.client.get(API_ENDPOINTS.CATEGORIES.SUBCATEGORIES(categoryId));
    return response.data;
  }

  async getMicroCategories(subCategoryId: string) {
    const response = await this.client.get(API_ENDPOINTS.CATEGORIES.MICROCATEGORIES(subCategoryId));
    return response.data;
  }

  // =============================================================================
  // CART METHODS
  // =============================================================================

  async getCart() {
    const response = await this.client.get(API_ENDPOINTS.CART.BASE);
    return response.data;
  }

  async addToCart(productId: string, quantity: number) {
    const response = await this.client.post(API_ENDPOINTS.CART.ADD_ITEM, {
      productId,
      quantity
    });
    return response.data;
  }

  async updateCartItem(productId: string, quantity: number) {
    const response = await this.client.put(API_ENDPOINTS.CART.UPDATE_ITEM, {
      productId,
      quantity
    });
    return response.data;
  }

  async removeCartItem(productId: string) {
    const response = await this.client.delete(`${API_ENDPOINTS.CART.REMOVE_ITEM}/${productId}`);
    return response.data;
  }

  async clearCart() {
    const response = await this.client.delete(API_ENDPOINTS.CART.CLEAR);
    return response.data;
  }

  // =============================================================================
  // ORDER METHODS
  // =============================================================================

  async getOrders(params?: {
    page?: number;
    size?: number;
    status?: string;
  }) {
    const response = await this.client.get(API_ENDPOINTS.ORDERS.BASE, { params });
    return response.data;
  }

  async getOrderById(id: string) {
    const response = await this.client.get(API_ENDPOINTS.ORDERS.BY_ID(id));
    return response.data;
  }

  async createOrder(orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    shippingAddressId?: number;
    billingAddressId?: number;
    paymentMethod: 'ONLINE' | 'COD' | 'BANK_TRANSFER';
    notes?: string;
  }) {
    const response = await this.client.post(API_ENDPOINTS.ORDERS.BASE, orderData);
    return response.data;
  }

  async cancelOrder(id: string, reason: string) {
    const response = await this.client.post(API_ENDPOINTS.ORDERS.CANCEL(id), { reason });
    return response.data;
  }

  async trackOrder(orderNumber: string) {
    const response = await this.client.get(API_ENDPOINTS.ORDERS.TRACK(orderNumber));
    return response.data;
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  async checkHealth() {
    try {
      const response = await this.client.get('/health', { timeout: 5000 });
      return { healthy: true, message: 'Backend is running', data: response.data };
    } catch (error: any) {
      return { 
        healthy: false, 
        message: error.message || 'Backend connection failed',
        error: error.response?.data || error.message 
      };
    }
  }

  async uploadFile(file: File, type: 'image' | 'document' | 'avatar' = 'image') {
    const formData = new FormData();
    formData.append('file', file);

    const endpoint = type === 'image' ? API_ENDPOINTS.UPLOAD.IMAGE :
                    type === 'document' ? API_ENDPOINTS.UPLOAD.DOCUMENT :
                    API_ENDPOINTS.UPLOAD.AVATAR;

    const response = await this.client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // =============================================================================
  // ADMIN METHODS
  // =============================================================================

  async getAdminDashboard() {
    const response = await this.client.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  }

  async getAllUsers(params?: {
    page?: number;
    size?: number;
    role?: string;
    status?: string;
  }) {
    const response = await this.client.get(API_ENDPOINTS.ADMIN.USERS, { params });
    return response.data;
  }

  async getAllVendors(params?: {
    page?: number;
    size?: number;
    status?: string;
    verified?: boolean;
  }) {
    const response = await this.client.get(API_ENDPOINTS.ADMIN.VENDORS, { params });
    return response.data;
  }

  async verifyVendor(vendorId: string, verified: boolean, notes?: string) {
    const response = await this.client.put(`${API_ENDPOINTS.ADMIN.VENDORS}/${vendorId}/verify`, {
      verified,
      notes
    });
    return response.data;
  }
}

// Export singleton instance
const apiClient = new IntegratedApiClient();
export default apiClient;

// Export individual methods for convenience
export const {
  login,
  register,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  getProducts,
  getProductById,
  searchProducts,
  getFeaturedProducts,
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  getVendorOrders,
  getVendorAnalytics,
  bulkImportProducts,
  getVendorInquiries,
  getInquiryById,
  respondToInquiry,
  createInquiry,
  getCategories,
  getCategoryHierarchy,
  getSubCategories,
  getMicroCategories,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  trackOrder,
  checkHealth,
  uploadFile,
  getAdminDashboard,
  getAllUsers,
  getAllVendors,
  verifyVendor,
} = apiClient;

// Export types
export type { ApiResponse, ApiError, PaginatedResponse };
