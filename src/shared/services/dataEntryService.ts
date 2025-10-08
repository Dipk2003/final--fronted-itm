import { API_CONFIG, apiRequest } from '@/config/api';

// Types for API responses
export interface Category {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  subCategoryCount: number;
  totalProductCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  categoryId: number;
  categoryName: string;
  microCategoryCount: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MicroCategory {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  subCategoryId: number;
  subCategoryName: string;
  categoryId: number;
  categoryName: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  brand: string;
  model: string;
  sku: string;
  stock: number;
  minOrderQuantity: number;
  unit: string;
  imageUrls: string;
  specifications: string;
  metaTitle: string;
  metaDescription: string;
  tags: string;
  isActive: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  microCategoryId: number;
  microCategoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  categoryId: number;
  categoryName: string;
  vendorId: number;
  vendorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardAnalytics {
  totalCategories: number;
  totalSubCategories: number;
  totalMicroCategories: number;
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  productsInStock: number;
  productsOutOfStock: number;
  totalVendors: number;
  lastUpdated: string;
  topCategories: CategoryStats[];
  recentProducts: ProductStats[];
}

export interface CategoryStats {
  categoryId: number;
  categoryName: string;
  subCategoryCount: number;
  microCategoryCount: number;
  productCount: number;
  activeProductCount: number;
  percentageOfTotal: number;
}

export interface ProductStats {
  productId: number;
  productName: string;
  categoryName: string;
  subCategoryName: string;
  microCategoryName: string;
  price: number;
  isActive: boolean;
  inStock: boolean;
  createdAt: string;
  vendorName: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateCategoryDto extends CreateCategoryDto {
  slug?: string;
}

export interface CreateSubCategoryDto {
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  categoryId: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateSubCategoryDto extends CreateSubCategoryDto {
  slug?: string;
}

export interface CreateMicroCategoryDto {
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  subCategoryId: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateMicroCategoryDto extends CreateMicroCategoryDto {
  slug?: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  brand: string;
  model: string;
  sku: string;
  stock: number;
  minOrderQuantity: number;
  unit: string;
  imageUrls?: string;
  specifications?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string;
  isActive: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  microCategoryId: number;
  vendorId: number;
}

export interface UpdateProductDto extends CreateProductDto {}

// Data Entry Service Class
export class DataEntryService {
  // Category operations
  static async getCategories(params?: {
    search?: string;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<Category>> {
return apiRequest<PagedResponse<Category>>(
      API_CONFIG.ENDPOINTS.CATEGORIES.BASE,
      {
        method: 'GET',
      }
    );
  }

  static async getAllCategories(search: string = '', pageable: { page: number; size: number }): Promise<PagedResponse<Category>> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());

    return apiRequest<PagedResponse<Category>>(
      `${API_CONFIG.ENDPOINTS.CATEGORIES}?${params.toString()}`,
      {
        method: 'GET',
      }
    );
  }

  static async getCategoryById(id: number): Promise<Category> {
    return apiRequest<Category>(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
  }

  static async createCategory(data: CreateCategoryDto): Promise<Category> {
    return apiRequest<Category>(
      API_CONFIG.ENDPOINTS.CATEGORIES.BASE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  static async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    return apiRequest<Category>(
      `${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static async deleteCategory(id: number): Promise<void> {
    return apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`,
      {
        method: 'DELETE',
      }
    );
  }

  // SubCategory operations
  static async getSubCategories(params?: {
    search?: string;
    categoryId?: number;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<SubCategory>> {
    return apiRequest<PagedResponse<SubCategory>>(
      API_CONFIG.ENDPOINTS.CATEGORIES.SUBCATEGORIES,
      {
        method: 'GET',
      }
    );
  }

  static async getSubCategoriesByCategory(categoryId: number): Promise<SubCategory[]> {
    return apiRequest<SubCategory[]>(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}/subcategories`);
  }

  static async createSubCategory(data: CreateSubCategoryDto): Promise<SubCategory> {
    return apiRequest<SubCategory>(
      API_CONFIG.ENDPOINTS.CATEGORIES.SUBCATEGORIES,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  static async updateSubCategory(id: number, data: UpdateSubCategoryDto): Promise<SubCategory> {
    return apiRequest<SubCategory>(
      `${API_CONFIG.ENDPOINTS.CATEGORIES.SUBCATEGORIES}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static async deleteSubCategory(id: number): Promise<void> {
    return apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.CATEGORIES.SUBCATEGORIES}/${id}`,
      {
        method: 'DELETE',
      }
    );
  }

  // MicroCategory operations
  static async getMicroCategories(params?: {
    search?: string;
    subCategoryId?: number;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<MicroCategory>> {
    return apiRequest<PagedResponse<MicroCategory>>(
      API_CONFIG.ENDPOINTS.CATEGORIES.MICROCATEGORIES,
      {
        method: 'GET',
      }
    );
  }

  static async getMicroCategoriesBySubCategory(subCategoryId: number): Promise<MicroCategory[]> {
    return apiRequest<MicroCategory[]>(`${API_CONFIG.ENDPOINTS.CATEGORIES.SUBCATEGORIES}/${subCategoryId}/microcategories`);
  }

  static async createMicroCategory(data: CreateMicroCategoryDto): Promise<MicroCategory> {
    return apiRequest<MicroCategory>(
      API_CONFIG.ENDPOINTS.CATEGORIES.MICROCATEGORIES,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  static async updateMicroCategory(id: number, data: UpdateMicroCategoryDto): Promise<MicroCategory> {
    return apiRequest<MicroCategory>(
      `${API_CONFIG.ENDPOINTS.CATEGORIES.MICROCATEGORIES}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static async deleteMicroCategory(id: number): Promise<void> {
    return apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.CATEGORIES.MICROCATEGORIES}/${id}`,
      {
        method: 'DELETE',
      }
    );
  }

  // Product operations
  static async getProducts(params?: {
    search?: string;
    categoryId?: number;
    subCategoryId?: number;
    microCategoryId?: number;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<Product>> {
    return apiRequest<PagedResponse<Product>>(
      API_CONFIG.ENDPOINTS.PRODUCTS.BASE,
      {
        method: 'GET',
      }
    );
  }

  static async getProductById(id: number): Promise<Product> {
    return apiRequest<Product>(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
  }

  static async createProduct(data: CreateProductDto): Promise<Product> {
    return apiRequest<Product>(
      API_CONFIG.ENDPOINTS.PRODUCTS.BASE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  static async updateProduct(id: number, data: UpdateProductDto): Promise<Product> {
    return apiRequest<Product>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static async deleteProduct(id: number): Promise<void> {
    return apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`,
      {
        method: 'DELETE',
      }
    );
  }

  // Analytics operations
  static async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    return apiRequest<DashboardAnalytics>(API_CONFIG.ENDPOINTS.ANALYTICS.DASHBOARD_ANALYTICS);
  }

  static async getCategoryStats(): Promise<CategoryStats[]> {
    return apiRequest<CategoryStats[]>(API_CONFIG.ENDPOINTS.ANALYTICS.CATEGORY_STATS);
  }
}
