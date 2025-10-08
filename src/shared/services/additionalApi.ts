import { api } from './api';

// Subscription Management
export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  features: string[];
  isActive: boolean;
  planType: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
}

export interface UserSubscription {
  id: number;
  userId: number;
  planId: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  plan: SubscriptionPlan;
}

// Reviews & Ratings
export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
  };
  product: {
    id: number;
    name: string;
  };
}

// File Management
export interface FileUpload {
  id: number;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  uploadedBy: number;
  createdAt: string;
}

// Notifications
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

// Content Management
export interface Banner {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: 'HERO' | 'SIDEBAR' | 'FOOTER';
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface ContentPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Health Check
export interface HealthStatus {
  status: 'UP' | 'DOWN';
  timestamp: string;
  details: {
    database: 'UP' | 'DOWN';
    redis: 'UP' | 'DOWN';
    diskSpace: 'UP' | 'DOWN';
    memory: 'UP' | 'DOWN';
  };
}

export interface DetailedHealthStatus extends HealthStatus {
  components: {
    [key: string]: {
      status: 'UP' | 'DOWN';
      details?: any;
    };
  };
  metrics: {
    responseTime: number;
    uptime: number;
    memoryUsage: number;
    diskUsage: number;
  };
}

// Additional API functions
export const additionalAPI = {
  // Subscription Management
  subscriptions: {
    // Get subscription plans (matches GET /api/subscriptions/plans)
    getPlans: async (): Promise<SubscriptionPlan[]> => {
      const response = await api.get('/api/subscriptions/plans');
      return response.data;
    },

    // Subscribe to plan (matches POST /api/subscriptions/subscribe)
    subscribe: async (planId: number, paymentMethod?: string): Promise<UserSubscription> => {
      const response = await api.post('/api/subscriptions/subscribe', {
        planId,
        paymentMethod
      });
      return response.data;
    },

    // Get user subscription
    getUserSubscription: async (): Promise<UserSubscription | null> => {
      try {
        const response = await api.get('/api/subscriptions/my-subscription');
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },

    // Cancel subscription
    cancel: async (subscriptionId: number): Promise<UserSubscription> => {
      const response = await api.patch(`/api/subscriptions/${subscriptionId}/cancel`);
      return response.data;
    }
  },

  // Reviews & Ratings
  reviews: {
    // Create review (matches POST /api/reviews)
    create: async (data: {
      productId: number;
      rating: number;
      title: string;
      comment: string;
    }): Promise<ProductReview> => {
      const response = await api.post('/api/reviews', data);
      return response.data;
    },

    // Get product reviews (matches GET /api/reviews/product/{productId})
    getByProduct: async (productId: number, page: number = 0, size: number = 10): Promise<{
      content: ProductReview[];
      totalElements: number;
      totalPages: number;
      averageRating: number;
      ratingDistribution: { [key: number]: number };
    }> => {
      const response = await api.get(`/api/reviews/product/${productId}`, {
        params: { page, size }
      });
      return response.data;
    },

    // Get user reviews
    getUserReviews: async (): Promise<ProductReview[]> => {
      const response = await api.get('/api/reviews/my-reviews');
      return response.data;
    },

    // Update review
    update: async (reviewId: number, data: {
      rating?: number;
      title?: string;
      comment?: string;
    }): Promise<ProductReview> => {
      const response = await api.put(`/api/reviews/${reviewId}`, data);
      return response.data;
    },

    // Delete review
    delete: async (reviewId: number): Promise<void> => {
      await api.delete(`/api/reviews/${reviewId}`);
    }
  },

  // File Management
  files: {
    // Upload file (matches POST /api/files/upload)
    upload: async (file: File, category?: string): Promise<FileUpload> => {
      const formData = new FormData();
      formData.append('file', file);
      if (category) {
        formData.append('category', category);
      }

      const response = await api.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    // Download file (matches GET /api/files/{id})
    download: async (fileId: number): Promise<Blob> => {
      const response = await api.get(`/api/files/${fileId}`, {
        responseType: 'blob'
      });
      return response.data;
    },

    // Get file info
    getInfo: async (fileId: number): Promise<FileUpload> => {
      const response = await api.get(`/api/files/${fileId}/info`);
      return response.data;
    },

    // Delete file
    delete: async (fileId: number): Promise<void> => {
      await api.delete(`/api/files/${fileId}`);
    }
  },

  // Notifications
  notifications: {
    // Get notifications (matches GET /api/notifications)
    getAll: async (page: number = 0, size: number = 20): Promise<{
      content: Notification[];
      totalElements: number;
      totalPages: number;
      unreadCount: number;
    }> => {
      const response = await api.get('/api/notifications', {
        params: { page, size }
      });
      return response.data;
    },

    // Mark as read (matches PUT /api/notifications/{id}/read)
    markAsRead: async (notificationId: number): Promise<Notification> => {
      const response = await api.put(`/api/notifications/${notificationId}/read`);
      return response.data;
    },

    // Mark all as read
    markAllAsRead: async (): Promise<void> => {
      await api.put('/api/notifications/mark-all-read');
    },

    // Delete notification
    delete: async (notificationId: number): Promise<void> => {
      await api.delete(`/api/notifications/${notificationId}`);
    },

    // Get unread count
    getUnreadCount: async (): Promise<number> => {
      const response = await api.get('/api/notifications/unread-count');
      return response.data;
    }
  },

  // Content Management
  content: {
    // Get active banners (matches GET /api/content/banners)
    getBanners: async (position?: string): Promise<Banner[]> => {
      const response = await api.get('/api/content/banners', {
        params: { position }
      });
      return response.data;
    },

    // Get content pages (matches GET /api/content/pages)
    getPages: async (): Promise<ContentPage[]> => {
      const response = await api.get('/api/content/pages');
      return response.data;
    },

    // Get page by slug
    getPageBySlug: async (slug: string): Promise<ContentPage> => {
      const response = await api.get(`/api/content/pages/${slug}`);
      return response.data;
    }
  },

  // Health & System
  health: {
    // Basic health check (matches GET /api/health)
    check: async (): Promise<HealthStatus> => {
      const response = await api.get('/api/health');
      return response.data;
    },

    // Detailed health check (matches GET /api/health/detailed)
    detailed: async (): Promise<DetailedHealthStatus> => {
      const response = await api.get('/api/health/detailed');
      return response.data;
    }
  },

  // Testing & Development
  testing: {
    // Test email sending (matches POST /api/test/email)
    testEmail: async (data: {
      to: string;
      subject: string;
      body: string;
    }): Promise<{
      success: boolean;
      message: string;
    }> => {
      const response = await api.post('/api/test/email', data);
      return response.data;
    },

    // Test SMS sending
    testSms: async (data: {
      to: string;
      message: string;
    }): Promise<{
      success: boolean;
      message: string;
    }> => {
      const response = await api.post('/api/test/sms', data);
      return response.data;
    },

    // Test push notification
    testPushNotification: async (data: {
      userId: number;
      title: string;
      message: string;
    }): Promise<{
      success: boolean;
      message: string;
    }> => {
      const response = await api.post('/api/test/push-notification', data);
      return response.data;
    }
  },

  // Admin Management
  admin: {
    // Get system settings
    getSettings: async (): Promise<{
      [key: string]: any;
    }> => {
      const response = await api.get('/api/admin/settings');
      return response.data;
    },

    // Update system settings
    updateSettings: async (settings: { [key: string]: any }): Promise<{
      success: boolean;
      message: string;
    }> => {
      const response = await api.put('/api/admin/settings', settings);
      return response.data;
    },

    // Get all users (Admin only)
    getAllUsers: async (page: number = 0, size: number = 20): Promise<{
      content: any[];
      totalElements: number;
      totalPages: number;
      number: number;
    }> => {
      const response = await api.get('/api/admin/users', {
        params: { page, size }
      });
      return response.data;
    },

    // Get all vendors (Admin only)
    getAllVendors: async (page: number = 0, size: number = 20): Promise<{
      content: any[];
      totalElements: number;
      totalPages: number;
      number: number;
    }> => {
      const response = await api.get('/api/admin/vendors', {
        params: { page, size }
      });
      return response.data;
    },

    // Approve/Reject vendor
    updateVendorStatus: async (vendorId: number, status: 'APPROVED' | 'REJECTED', remarks?: string): Promise<{
      success: boolean;
      message: string;
    }> => {
      const response = await api.patch(`/api/admin/vendors/${vendorId}/status`, {
        status,
        remarks
      });
      return response.data;
    }
  },

  // Bulk Operations
  bulk: {
    // Bulk update product status
    updateProductsStatus: async (productIds: number[], status: 'ACTIVE' | 'INACTIVE'): Promise<{
      success: boolean;
      updatedCount: number;
    }> => {
      const response = await api.patch('/api/bulk/products/status', {
        productIds,
        status
      });
      return response.data;
    },

    // Bulk delete products
    deleteProducts: async (productIds: number[]): Promise<{
      success: boolean;
      deletedCount: number;
    }> => {
      const response = await api.delete('/api/bulk/products', {
        data: { productIds }
      });
      return response.data;
    }
  },

  // Search & Discovery
  search: {
    // Global search
    globalSearch: async (query: string, filters?: {
      type?: 'products' | 'vendors' | 'users';
      limit?: number;
    }): Promise<{
      products: any[];
      vendors: any[];
      users: any[];
      totalResults: number;
    }> => {
      const response = await api.get('/api/search/global', {
        params: { query, ...filters }
      });
      return response.data;
    },

    // Search suggestions
    getSuggestions: async (query: string): Promise<string[]> => {
      const response = await api.get('/api/search/suggestions', {
        params: { query }
      });
      return response.data;
    }
  },

  // Reports & Export
  reports: {
    // Generate report
    generateReport: async (type: 'sales' | 'users' | 'products' | 'orders', filters?: {
      dateFrom?: string;
      dateTo?: string;
      format?: 'pdf' | 'excel' | 'csv';
    }): Promise<{
      reportId: string;
      downloadUrl: string;
    }> => {
      const response = await api.post(`/api/reports/generate/${type}`, filters);
      return response.data;
    },

    // Download report
    downloadReport: async (reportId: string): Promise<Blob> => {
      const response = await api.get(`/api/reports/download/${reportId}`, {
        responseType: 'blob'
      });
      return response.data;
    }
  }
};