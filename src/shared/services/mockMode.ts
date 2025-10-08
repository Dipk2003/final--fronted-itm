// Mock Mode Configuration - DISABLED FOR PRODUCTION
export const MOCK_MODE = false; // Force disable mock mode

console.log('🎭 Mock Mode:', MOCK_MODE ? 'ENABLED' : 'DISABLED');

// Mock delay simulation
export const mockDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock responses for development
export const mockResponses = {
  // Product responses
  products: {
    featured: {
      content: [
        {
          id: 1,
          name: 'Premium Steel Pipes',
          description: 'High-quality steel pipes for industrial use',
          price: 2500,
          categoryId: 1,
          subCategoryId: 1,
          vendorId: 1,
          images: ['/api/placeholder/300/200'],
          attributes: [],
          variants: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Industrial Machinery Parts',
          description: 'Precision-engineered machinery components',
          price: 15000,
          categoryId: 2,
          subCategoryId: 2,
          vendorId: 2,
          images: ['/api/placeholder/300/200'],
          attributes: [],
          variants: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      totalElements: 50,
      totalPages: 5,
      currentPage: 0,
      pageSize: 12,
      hasNext: true,
      hasPrevious: false
    },
    search: {
      products: [],
      total: 0,
      page: 0,
      size: 12
    }
  },

  // Category responses
  categories: {
    all: [
      {
        id: 1,
        name: 'Industrial Equipment',
        description: 'Heavy machinery and industrial equipment',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Raw Materials',
        description: 'Raw materials for manufacturing',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Electronics',
        description: 'Electronic components and devices',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  },

  // User responses
  users: {
    profile: {
      id: 1,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '9876543210',
      userType: 'BUYER',
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },

  // Order responses
  orders: {
    list: [],
    single: {
      id: 1,
      userId: 1,
      vendorId: 1,
      status: 'PENDING',
      totalAmount: 25000,
      items: [],
      shippingAddress: {} as any,
      billingAddress: {} as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },

  // Cart responses
  cart: {
    items: [],
    totalAmount: 0,
    totalItems: 0
  },

  // Wishlist responses
  wishlist: {
    items: []
  },

  // Inquiry responses
  inquiries: {
    list: [],
    single: {
      id: 1,
      buyerId: 1,
      productId: 1,
      vendorId: 1,
      message: 'I am interested in this product',
      quantity: 10,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    }
  },

  // Analytics responses
  analytics: {
    dashboard: {
      totalUsers: 1250,
      totalVendors: 85,
      totalProducts: 2340,
      totalOrders: 456,
      totalRevenue: 12500000,
      recentOrders: [],
      topProducts: [],
      salesTrends: []
    },
    vendor: {
      totalProducts: 25,
      totalOrders: 12,
      totalRevenue: 125000,
      monthlyRevenue: 25000,
      pendingOrders: 3,
      completedOrders: 9,
      averageOrderValue: 10416.67,
      topProducts: []
    }
  },

  // Support responses
  support: {
    tickets: [],
    ticket: {
      id: 1,
      userId: 1,
      subject: 'Product inquiry',
      description: 'Need help with product selection',
      status: 'OPEN',
      priority: 'MEDIUM',
      category: 'Product',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },

  // Chat responses
  chat: {
    conversations: [],
    messages: [],
    partners: []
  }
};

// Mock API function wrapper
export const mockAPI = <T>(response: T, delay: number = 800): Promise<{ data: T }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: response });
    }, delay);
  });
};

// Error simulation
export const mockError = (message: string = 'Mock API Error', status: number = 500): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error(message) as any;
      error.response = {
        status,
        data: { message, error: message }
      };
      reject(error);
    }, 500);
  });
};

// Random success/failure for testing
export const randomMockResponse = <T>(
  successResponse: T,
  errorMessage: string = 'Random mock error',
  successRate: number = 0.8
): Promise<{ data: T }> => {
  if (Math.random() < successRate) {
    return mockAPI(successResponse);
  } else {
    return mockError(errorMessage);
  }
};

// Mock pagination helper
export const mockPagination = <T>(
  items: T[],
  page: number = 0,
  size: number = 12
) => {
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    content: paginatedItems,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
    currentPage: page,
    pageSize: size,
    hasNext: endIndex < items.length,
    hasPrevious: page > 0
  };
};

// Development utilities
export const MockUtils = {
  // Generate random ID
  generateId: (): number => Math.floor(Math.random() * 10000) + 1,

  // Generate random date
  generateDate: (daysAgo: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  },

  // Generate random price
  generatePrice: (min: number = 100, max: number = 100000): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Generate random status
  generateStatus: <T>(statuses: T[]): T => {
    return statuses[Math.floor(Math.random() * statuses.length)];
  },

  // Log mock response
  logMockResponse: (endpoint: string, response: any): void => {
    if (MOCK_MODE) {
      console.log(`🎭 Mock Response for ${endpoint}:`, response);
    }
  }
};

export interface MockServices {
  MOCK_MODE: boolean;
  mockDelay: typeof mockDelay;
  mockResponses: typeof mockResponses;
  mockAPI: typeof mockAPI;
  mockError: typeof mockError;
  randomMockResponse: typeof randomMockResponse;
  mockPagination: typeof mockPagination;
  MockUtils: typeof MockUtils;
}

const mockServices: MockServices = {
  MOCK_MODE,
  mockDelay,
  mockResponses,
  mockAPI,
  mockError,
  randomMockResponse,
  mockPagination,
  MockUtils
};

export default mockServices;
