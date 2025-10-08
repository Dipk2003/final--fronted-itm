import { api } from './api';
import { MOCK_MODE, mockResponses, mockDelay } from './mockMode';

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  category?: Category;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryDto {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface SubCategoryDto {
  name: string;
  description?: string;
  categoryId: number;
  isActive?: boolean;
}

// Category API functions
export const categoryAPI = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    if (MOCK_MODE) {
      console.log('Mock mode: Getting categories');
      await mockDelay(500);
      return mockResponses.categories.all;
    }
    
    try {
      const response = await api.get('/api/categories');
      return response.data;
    } catch (error: any) {
      // If API endpoint doesn't exist (404) or other errors, fallback to mock data
      if (error.response?.status === 404 || error.request) {
        console.warn('Categories API not available, using fallback data');
        return mockResponses.categories.all;
      }
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  // Create new category (Admin only)
  createCategory: async (categoryDto: CategoryDto): Promise<Category> => {
    const response = await api.post('/api/categories', categoryDto);
    return response.data;
  },

  // Update category (Admin only)
  updateCategory: async (id: number, categoryDto: CategoryDto): Promise<Category> => {
    const response = await api.put(`/api/categories/${id}`, categoryDto);
    return response.data;
  },

  // Delete category (Admin only)
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/api/categories/${id}`);
  },

  // Get subcategories by category ID
  getSubCategoriesByCategory: async (categoryId: number): Promise<SubCategory[]> => {
    const response = await api.get(`/api/subcategories/category/${categoryId}`);
    return response.data;
  },

  // Get all subcategories
  getAllSubCategories: async (): Promise<SubCategory[]> => {
    const response = await api.get('/api/subcategories');
    return response.data;
  },

  // Get subcategory by ID
  getSubCategoryById: async (id: number): Promise<SubCategory> => {
    const response = await api.get(`/api/subcategories/${id}`);
    return response.data;
  },

  // Create new subcategory (Admin only)
  createSubCategory: async (subCategoryDto: SubCategoryDto): Promise<SubCategory> => {
    const response = await api.post('/api/subcategories', subCategoryDto);
    return response.data;
  },

  // Update subcategory (Admin only)
  updateSubCategory: async (id: number, subCategoryDto: SubCategoryDto): Promise<SubCategory> => {
    const response = await api.put(`/api/subcategories/${id}`, subCategoryDto);
    return response.data;
  },

  // Delete subcategory (Admin only)
  deleteSubCategory: async (id: number): Promise<void> => {
    await api.delete(`/api/subcategories/${id}`);
  }
};
