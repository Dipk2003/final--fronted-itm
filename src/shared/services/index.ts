// Main API exports - All backend endpoints integrated
export { api } from './api';

// Authentication & Authorization (using core module instead)
// export { authAPI } from './auth';
// export type { JwtResponse, LoginCredentials, RegisterData, User, VerifyOtpRequest } from './auth';

// User Management
export { userAPI } from './userApi';
export type { CreateAddressDto, UpdateAddressDto, UserAddress, UserDashboardData } from './userApi';

// Vendor Management
export { vendorManagementAPI } from './vendorManagementApi';
export type { CreateGstNumberDto, GstNumber, KycDocument, VendorDashboardData, VendorProfile } from './vendorManagementApi';

// Product Management
export { productAPI } from './productApi';
export type { Category, Product, ProductDto, ProductImage, ProductSearchParams, ProductsResponse, SubCategory } from './productApi';

// Cart & Wishlist
// export { cartWishlistAPI } from './cartWishlistApi';
// export type { AddToCartDto, Cart, CartItem, UpdateCartItemDto, WishlistItem } from './cartWishlistApi';

// Inquiry & Quote System
export { inquiryQuoteAPI } from './inquiryQuoteApi';
export { inquiryQuoteAPI as quoteAPI } from './inquiryQuoteApi';
export type { CreateInquiryDto, CreateQuoteDto, Inquiry, InquiryFilters, Quote, QuoteFilters } from './inquiryQuoteApi';

// Order Management
export { orderAPI } from './orderApi';
export type { CreateOrderDto, Order, OrderFilters, OrderItem, OrderStatusUpdate } from './orderApi';

// Chat & Communication
export { chatAPI, chatbotAPI } from './chatApi';
export type { ChatMessage, ChatbotMessage, ChatbotSession, Conversation, CreateConversationDto, SendMessageDto } from './chatApi';

// Enhanced Chatbot API
export { chatbotAPI as enhancedChatbotAPI } from './chatbotApi';
export type { 
  ChatbotRequest, 
  ChatbotResponse, 
  VendorRecommendation, 
  LeadRecommendation 
} from './chatbotApi';

// Support System
export { liveChatAPI, supportAPI } from './supportApi';
export type { CreateTicketData, LiveChatSession, ChatMessage as SupportChatMessage, SupportTicket } from './supportApi';

// Finance & Payment
export { financePaymentAPI } from './financePaymentApi';
export type { CreatePaymentOrderDto, Invoice, InvoiceFilters, PaymentOrder, PaymentVerificationDto } from './financePaymentApi';

// Analytics & Dashboards
export { analyticsApi } from './analyticsApi';
export type { DashboardAnalytics, SystemMetrics, VendorAnalytics } from './analyticsApi';

// Additional Services
export { additionalAPI } from './additionalApi';
export type {
    Banner,
    ContentPage,
    DetailedHealthStatus,
    FileUpload,
    HealthStatus,
    Notification,
    ProductReview,
    SubscriptionPlan,
    UserSubscription
} from './additionalApi';

// Legacy exports (for backward compatibility)
export { clientAPI as clientApi } from './clientApi';
export { default as vendorAPI } from './vendorApi';
export type { Vendor } from './vendorApi';

// Utility functions
export const APIUtils = {
  // Format API errors
  formatError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Check if error is network related
  isNetworkError: (error: any): boolean => {
    return !error.response && error.request;
  },

  // Check if error is server error (5xx)
  isServerError: (error: any): boolean => {
    return error.response?.status >= 500;
  },

  // Check if error is client error (4xx)
  isClientError: (error: any): boolean => {
    return error.response?.status >= 400 && error.response?.status < 500;
  },

  // Check if user is unauthorized
  isUnauthorized: (error: any): boolean => {
    return error.response?.status === 401;
  },

  // Check if user is forbidden
  isForbidden: (error: any): boolean => {
    return error.response?.status === 403;
  },

  // Check if resource not found
  isNotFound: (error: any): boolean => {
    return error.response?.status === 404;
  }
};

// API Status constants
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;