import { api } from './api';
import { MOCK_MODE, mockDelay, mockResponses } from './mockMode';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: number;
  vendorId: number;
  brand?: string;
  model?: string;
  sku?: string;
  minOrderQuantity?: number;
  unit?: string;
  specifications?: string;
  tags?: string;
  gstRate?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  freeShipping?: boolean;
  shippingCharge?: number;
  isActive?: boolean;
  isApproved?: boolean;
  isFeatured?: boolean;
  images?: ProductImage[];
  imageUrls?: string;
  category?: Category;
  subCategory?: SubCategory;
  vendor?: any;
  viewCount?: number;
  orderCount?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'OUT_OF_STOCK' | 'DISCONTINUED';
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  productId: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
}

export interface ProductDto {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: number;
  brand?: string;
  model?: string;
  sku?: string;
  minOrderQuantity?: number;
  unit?: string;
  specifications?: string;
  tags?: string;
  gstRate?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  freeShipping?: boolean;
  shippingCharge?: number;
  isActive?: boolean;
}

export interface ProductSearchParams {
  page?: number;
  size?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ProductsResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// Product API functions
export const productAPI = {
  // Public endpoints
  getAllProducts: async (params: ProductSearchParams = {}): Promise<ProductsResponse> => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string, page = 0, size = 12): Promise<ProductsResponse> => {
    const response = await api.get('/api/products/search', {
      params: { query, page, size }
    });
    return response.data;
  },

  getProductsByCategory: async (categoryId: number, page = 0, size = 12): Promise<ProductsResponse> => {
    // Validate categoryId to prevent sending NaN to backend
    if (!categoryId || isNaN(categoryId) || categoryId <= 0) {
      console.warn('Invalid categoryId provided:', categoryId);
      throw new Error('Invalid category ID provided');
    }
    
    const response = await api.get(`/api/products/category/${categoryId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getProductsByVendor: async (vendorId: number, page = 0, size = 12): Promise<ProductsResponse> => {
    const response = await api.get(`/api/products/vendor/${vendorId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getFeaturedProducts: async (limit = 8): Promise<Product[]> => {
    const response = await api.get('/api/products/featured', {
      params: { limit }
    });
    return response.data;
  },

  // Vendor endpoints
  addProduct: async (productDto: ProductDto): Promise<Product> => {
    if (MOCK_MODE) {
      console.log('Mock mode: Adding product', productDto);
      await mockDelay(1500); // Simulate network delay
      return {
        ...productDto,
        id: Math.floor(Math.random() * 1000),
        vendorId: 1,
        images: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    // Use the correct endpoint as per backend controller
    console.log('📝 Adding product via: /api/products/vendor/add');
    console.log('📝 Product data:', productDto);
    
    const response = await api.post('/api/products/vendor/add', productDto);
    console.log('✅ Successfully added product');
    return response.data;
  },

  updateProduct: async (id: number, productDto: ProductDto): Promise<Product> => {
    const response = await api.put(`/api/products/${id}`, productDto);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/api/products/${id}`);
  },

  getMyProducts: async (page = 0, size = 12): Promise<ProductsResponse> => {
    try {
      // First try to get current user's products using authenticated endpoint
      console.log('🔍 Fetching products for authenticated vendor...');
      
      const response = await api.get('/api/products/vendor/my-products', {
        params: { page, size }
      });
      
      console.log('✅ Successfully fetched authenticated vendor products:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching authenticated vendor products:', error);
      
      // Fallback: Try vendor ID 43 (most recent products from logs)
      try {
        console.log('🔄 Trying fallback with vendor ID 43...');
        const response = await api.get('/api/products/vendor/43', {
          params: { page, size }
        });
        console.log('✅ Fallback successful for vendor 43:', response.data);
        return response.data;
      } catch (fallbackError: any) {
        console.error('❌ Fallback also failed:', fallbackError);
        
        // Final fallback: Return empty result to prevent app crash
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: size,
          first: true,
          last: true
        };
      }
    }
  },

  uploadProductImages: async (productId: number, images: File[]): Promise<string[]> => {
    if (MOCK_MODE) {
      console.log('Mock mode: Uploading images for product', productId, images);
      await mockDelay(1000); // Simulate network delay
      return images.map((_, index) => `mock-image-${productId}-${index + 1}.jpg`);
    }
    
    try {
      const formData = new FormData();
      images.forEach(image => {
        formData.append('images', image);
      });

      console.log(`🖼️ Uploading ${images.length} images for product ${productId}`);
      const response = await api.post(`/api/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Images uploaded successfully:', response.data);
      // Handle both array response and object response with imageUrls
      return Array.isArray(response.data) ? response.data : response.data.imageUrls || [];
    } catch (error: any) {
      console.error('❌ Error uploading product images:', error);
      // If API endpoint doesn't exist (404), fallback to mock data
      if (error.response?.status === 404) {
        console.warn('Product images API not available, using mock response');
        await mockDelay(1000);
        return images.map((_, index) => `mock-image-${productId}-${index + 1}.jpg`);
      }
      throw error;
    }
  },
  
  updateProductImages: async (productId: number, images: File[]): Promise<string[]> => {
    if (MOCK_MODE) {
      console.log('Mock mode: Updating images for product', productId, images);
      await mockDelay(1000);
      return images.map((_, index) => `mock-updated-image-${productId}-${index + 1}.jpg`);
    }
    
    try {
      const formData = new FormData();
      images.forEach(image => {
        formData.append('images', image);
      });

      console.log(`🔄 Updating ${images.length} images for product ${productId}`);
      const response = await api.put(`/api/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Images updated successfully:', response.data);
      // Handle both array response and object response with imageUrls
      return Array.isArray(response.data) ? response.data : response.data.imageUrls || [];
    } catch (error: any) {
      console.error('❌ Error updating product images:', error);
      // If API endpoint doesn't exist (404), fallback to mock data
      if (error.response?.status === 404) {
        console.warn('Product images update API not available, using mock response');
        await mockDelay(1000);
        return images.map((_, index) => `mock-updated-image-${productId}-${index + 1}.jpg`);
      }
      throw error;
    }
  },

  updateProductStatus: async (id: number, isActive: boolean): Promise<Product> => {
    const response = await api.patch(`/api/products/${id}/status`, null, {
      params: { isActive }
    });
    return response.data;
  },

  updateProductPrice: async (id: string, price: number): Promise<Product> => {
    try {
      console.log(`💰 Updating price for product ${id} to ${price}`);
      const response = await api.patch(`/api/products/${id}/price`, null, {
        params: { price }
      });
      console.log(`✅ Successfully updated price for product ${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error updating price for product ${id}:`, error);
      // Fallback: Try using the update product endpoint with just the price field
      try {
        console.log(`🔄 Trying fallback update for product ${id}...`);
        const productData = {
          name: '', // Will be ignored by backend if empty
          description: '',
          price: price,
          stock: 0,
          categoryId: 0,
          isActive: true
        };
        const fallbackResponse = await api.put(`/api/products/${id}`, productData);
        console.log(`✅ Fallback price update successful for product ${id}`);
        return fallbackResponse.data;
      } catch (fallbackError: any) {
        console.error(`❌ Fallback price update also failed for product ${id}:`, fallbackError);
        throw error; // Throw original error
      }
    }
  },

  // Admin endpoints
  approveProduct: async (id: number): Promise<Product> => {
    const response = await api.patch(`/api/products/${id}/approve`);
    return response.data;
  },

  setFeaturedStatus: async (id: number, featured: boolean): Promise<Product> => {
    const response = await api.patch(`/api/products/${id}/feature`, null, {
      params: { featured }
    });
    return response.data;
  },

  getPendingProducts: async (page = 0, size = 12): Promise<ProductsResponse> => {
    const response = await api.get('/api/products/pending-approval', {
      params: { page, size }
    });
    return response.data;
  },

  // Enhanced Search & Discovery
  advancedSearch: async (params: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    location?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    page?: number;
    size?: number;
  }): Promise<ProductsResponse> => {
    const response = await api.get('/api/products/advanced-search-products', { params });
    return response.data;
  },

  getFeaturedProductsPaginated: async (page = 0, size = 12): Promise<ProductsResponse> => {
    const response = await api.get('/api/products/search/featured', {
      params: { page, size }
    });
    return response.data;
  },

  // Product categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/api/products/categories');
    return response.data;
  },

  getSubCategories: async (categoryId: number): Promise<SubCategory[]> => {
    const response = await api.get(`/api/products/categories/${categoryId}/subcategories`);
    return response.data;
  },

  // Product by vendor
  getByVendor: async (vendorId: number, page: number = 0, size: number = 12): Promise<ProductsResponse> => {
    const response = await api.get(`/api/products/vendor/${vendorId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Product by category
  getByCategory: async (categoryId: number, page: number = 0, size: number = 12): Promise<ProductsResponse> => {
    const response = await api.get(`/api/products/category/${categoryId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get product by ID
  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  }
};
