import apiClient, { PaginatedResponse, getErrorMessage } from '@/lib/enhanced-api-client';
import toast from 'react-hot-toast';

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  subCategory?: string;
  microCategory?: string;
  vendorId: number;
  vendorName?: string;
  images: string[];
  videos?: string[];
  specifications?: Record<string, any>;
  inStock: boolean;
  stockQuantity?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  unit: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  viewCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  location?: string;
  deliveryTime?: string;
  warranty?: string;
  returnPolicy?: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  subCategory?: string;
  microCategory?: string;
  images?: string[];
  videos?: string[];
  specifications?: Record<string, any>;
  stockQuantity?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  unit: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
  deliveryTime?: string;
  warranty?: string;
  returnPolicy?: string;
}

export interface ProductSearchFilters {
  query?: string;
  category?: string;
  subCategory?: string;
  microCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  city?: string;
  vendorId?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  sortBy?: 'price' | 'name' | 'createdAt' | 'rating' | 'viewCount';
  sortDir?: 'asc' | 'desc';
}

export interface ProductVideo {
  id: number;
  productId: number;
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number;
  createdAt: string;
}

// Product Management Service
class ProductService {
  // ===================
  // PRODUCT CRUD
  // ===================

  async getProducts(filters: ProductSearchFilters & { page?: number; size?: number } = {}): Promise<PaginatedResponse<Product>> {
    try {
      const { page = 0, size = 12, ...searchFilters } = filters;
      const params = {
        page,
        size,
        ...searchFilters
      };

      const url = apiClient.buildUrl('/api/products', params);
      const response = await apiClient.get<PaginatedResponse<Product>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch products: ${message}`);
      throw error;
    }
  }

  async getProductById(productId: number): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(`/api/products/${productId}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch product: ${message}`);
      throw error;
    }
  }

  async createProduct(productData: ProductCreateRequest): Promise<Product> {
    try {
      const response = await apiClient.post<Product>('/api/products', productData);
      toast.success('Product created successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to create product: ${message}`);
      throw error;
    }
  }

  async updateProduct(productId: number, productData: Partial<ProductCreateRequest>): Promise<Product> {
    try {
      const response = await apiClient.put<Product>(`/api/products/${productId}`, productData);
      toast.success('Product updated successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update product: ${message}`);
      throw error;
    }
  }

  async deleteProduct(productId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/products/${productId}`);
      toast.success('Product deleted successfully!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete product: ${message}`);
      throw error;
    }
  }

  // ===================
  // PRODUCT SEARCH & FILTERING
  // ===================

  async searchProducts(filters: ProductSearchFilters & { page?: number; size?: number }): Promise<PaginatedResponse<Product>> {
    try {
      const { query, page = 0, size = 12, ...otherFilters } = filters;
      const params = {
        query: query || '',
        page,
        size,
        ...otherFilters
      };

      const url = apiClient.buildUrl('/api/products/search', params);
      const response = await apiClient.get<PaginatedResponse<Product>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Search failed: ${message}`);
      throw error;
    }
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(`/api/products/search/suggestions?query=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      console.error('Failed to get search suggestions:', error);
      return [];
    }
  }

  async getProductsByCategory(categoryId: number, page = 0, size = 12): Promise<PaginatedResponse<Product>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl(`/api/products/category/${categoryId}`, params);
      const response = await apiClient.get<PaginatedResponse<Product>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch products by category: ${message}`);
      throw error;
    }
  }

  async getProductsByVendor(vendorId: number, page = 0, size = 12): Promise<PaginatedResponse<Product>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl(`/api/products/vendor/${vendorId}`, params);
      const response = await apiClient.get<PaginatedResponse<Product>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch vendor products: ${message}`);
      throw error;
    }
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>(`/api/products/featured?limit=${limit}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch featured products: ${message}`);
      return [];
    }
  }

  async getFilteredProducts(filters: {
    category?: string;
    subCategory?: string;
    microCategory?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }): Promise<Product[]> {
    try {
      const url = apiClient.buildUrl('/api/products/categories', filters);
      const response = await apiClient.get<Product[]>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch filtered products: ${message}`);
      throw error;
    }
  }

  // ===================
  // VENDOR PRODUCT MANAGEMENT
  // ===================

  async getVendorProducts(vendorId: number, page = 0, size = 12): Promise<PaginatedResponse<Product>> {
    try {
      const params = { page, size };
      const url = apiClient.buildUrl('/api/vendor/products', params);
      const response = await apiClient.get<PaginatedResponse<Product>>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch vendor products: ${message}`);
      throw error;
    }
  }

  async addVendorProduct(productData: ProductCreateRequest): Promise<Product> {
    try {
      const response = await apiClient.post<Product>('/api/products', productData);
      toast.success('Product added successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to add product: ${message}`);
      throw error;
    }
  }

  async updateVendorProduct(productId: number, productData: Partial<ProductCreateRequest>): Promise<Product> {
    try {
      const response = await apiClient.put<Product>(`/api/products/${productId}`, productData);
      toast.success('Product updated successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update product: ${message}`);
      throw error;
    }
  }

  async deleteVendorProduct(productId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/products/${productId}`);
      toast.success('Product deleted successfully!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete product: ${message}`);
      throw error;
    }
  }

  // ===================
  // PRODUCT VIDEOS
  // ===================

  async getProductVideos(productId: number): Promise<ProductVideo[]> {
    try {
      const response = await apiClient.get<ProductVideo[]>(`/api/products/${productId}/videos`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch product videos: ${message}`);
      return [];
    }
  }

  async addProductVideo(productId: number, videoData: {
    videoUrl: string;
    thumbnailUrl?: string;
    title?: string;
    description?: string;
  }): Promise<ProductVideo> {
    try {
      const response = await apiClient.post<ProductVideo>(`/api/products/${productId}/videos`, videoData);
      toast.success('Video added successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to add video: ${message}`);
      throw error;
    }
  }

  async deleteProductVideo(productId: number, videoId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/products/${productId}/videos/${videoId}`);
      toast.success('Video deleted successfully!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete video: ${message}`);
      throw error;
    }
  }

  // ===================
  // DATA ENTRY OPERATIONS
  // ===================

  async addDataEntryProduct(productData: ProductCreateRequest): Promise<Product> {
    try {
      const response = await apiClient.post<Product>('/api/products/data-entry', productData);
      toast.success('Product added via data entry successfully!');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to add product via data entry: ${message}`);
      throw error;
    }
  }

  // ===================
  // UTILITY METHODS
  // ===================

  async incrementViewCount(productId: number): Promise<void> {
    try {
      await apiClient.post(`/api/products/${productId}/view`);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  }

  formatPrice(price: number, currency = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
    }).format(price);
  }

  calculateDiscount(originalPrice: number, discountPrice?: number): {
    discount: number;
    percentage: number;
  } {
    if (!discountPrice || discountPrice >= originalPrice) {
      return { discount: 0, percentage: 0 };
    }

    const discount = originalPrice - discountPrice;
    const percentage = Math.round((discount / originalPrice) * 100);
    
    return { discount, percentage };
  }

  isProductInStock(product: Product): boolean {
    return product.inStock && (product.stockQuantity === undefined || product.stockQuantity > 0);
  }

  getProductImageUrl(product: Product, index = 0): string {
    if (product.images && product.images.length > index) {
      return product.images[index];
    }
    return '/images/placeholder-product.jpg';
  }

  generateProductSlug(productName: string, productId: number): string {
    const slug = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${slug}-${productId}`;
  }

  // ===================
  // BATCH OPERATIONS
  // ===================

  async bulkUpdateProducts(updates: Array<{ id: number; data: Partial<ProductCreateRequest> }>): Promise<Product[]> {
    try {
      const response = await apiClient.put<Product[]>('/api/products/bulk-update', { updates });
      toast.success(`${updates.length} products updated successfully!`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Bulk update failed: ${message}`);
      throw error;
    }
  }

  async bulkDeleteProducts(productIds: number[]): Promise<void> {
    try {
      await apiClient.delete('/api/products/bulk-delete', {
        data: { productIds }
      });
      toast.success(`${productIds.length} products deleted successfully!`);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Bulk delete failed: ${message}`);
      throw error;
    }
  }
}

// Export singleton instance
export const productService = new ProductService();
export default productService;