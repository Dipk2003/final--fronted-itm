import { api } from '@/shared/services/api';
import { Category, CategoryFormData, PaginatedResponse } from '../types/employee';

// =============== CATEGORY OPERATIONS ===============

// Get all categories with hierarchy
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get('/api/dataentry/hierarchy/full');
  return response.data;
};

// Get categories with pagination
export const getCategoriesPaginated = async (
  page = 0, 
  size = 20, 
  level?: 'main' | 'sub' | 'micro',
  parentId?: string,
  search?: string
): Promise<PaginatedResponse<Category>> => {
  const response = await api.get('/api/dataentry/categories', {
    params: { page, size, search }
  });
  return response.data;
};

// Get category by ID
export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get(`/api/dataentry/categories/${id}`);
  return response.data;
};

// Create new category
export const createCategory = async (data: CategoryFormData): Promise<Category> => {
  const createData = {
    name: data.name,
    description: data.description || '',
    displayOrder: data.sortOrder,
    isActive: data.isActive,
    metaTitle: data.seoTitle || '',
    metaDescription: data.seoDescription || ''
  };
  const response = await api.post('/api/dataentry/categories', createData);
  return response.data;
};

// Update existing category
export const updateCategory = async (id: string, data: CategoryFormData): Promise<Category> => {
  const updateData = {
    name: data.name,
    description: data.description || '',
    displayOrder: data.sortOrder,
    isActive: data.isActive,
    metaTitle: data.seoTitle || '',
    metaDescription: data.seoDescription || '',
    slug: data.slug
  };
  const response = await api.put(`/api/dataentry/categories/${id}`, updateData);
  return response.data;
};

// Delete category
export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/api/dataentry/categories/${id}`);
};

// Get main categories only (same as getCategories for now)
export const getMainCategories = async (): Promise<Category[]> => {
  const response = await api.get('/api/dataentry/categories?size=1000');
  return response.data.content || response.data;
};

// =============== SUBCATEGORY OPERATIONS ===============

// Get subcategories by parent ID
export const getSubcategories = async (parentId: string): Promise<Category[]> => {
  const response = await api.get(`/api/dataentry/categories/${parentId}/subcategories`);
  return response.data;
};

// Create new subcategory
export const createSubcategory = async (data: CategoryFormData & { parentId: string }): Promise<Category> => {
  const createData = {
    name: data.name,
    description: data.description || '',
    displayOrder: data.sortOrder,
    isActive: data.isActive,
    categoryId: parseInt(data.parentId),
    metaTitle: data.seoTitle || '',
    metaDescription: data.seoDescription || ''
  };
  const response = await api.post('/api/dataentry/subcategories', createData);
  return response.data;
};

// Update subcategory
export const updateSubcategory = async (id: string, data: CategoryFormData & { parentId: string }): Promise<Category> => {
  const updateData = {
    name: data.name,
    description: data.description || '',
    displayOrder: data.sortOrder,
    isActive: data.isActive,
    categoryId: parseInt(data.parentId),
    metaTitle: data.seoTitle || '',
    metaDescription: data.seoDescription || '',
    slug: data.slug
  };
  const response = await api.put(`/api/dataentry/subcategories/${id}`, updateData);
  return response.data;
};

// Delete subcategory
export const deleteSubcategory = async (id: string): Promise<void> => {
  await api.delete(`/api/dataentry/subcategories/${id}`);
};

// =============== MICROCATEGORY OPERATIONS ===============

// Get micro categories by parent ID (subcategory)
export const getMicrocategories = async (parentId: string): Promise<Category[]> => {
  const response = await api.get(`/api/dataentry/subcategories/${parentId}/microcategories`);
  return response.data;
};

// Create new microcategory
export const createMicrocategory = async (data: CategoryFormData & { parentId: string }): Promise<Category> => {
  const createData = {
    name: data.name,
    description: data.description || '',
    displayOrder: data.sortOrder,
    isActive: data.isActive,
    subCategoryId: parseInt(data.parentId),
    metaTitle: data.seoTitle || '',
    metaDescription: data.seoDescription || ''
  };
  const response = await api.post('/api/dataentry/microcategories', createData);
  return response.data;
};

// Update microcategory
export const updateMicrocategory = async (id: string, data: CategoryFormData & { parentId: string }): Promise<Category> => {
  const updateData = {
    name: data.name,
    description: data.description || '',
    displayOrder: data.sortOrder,
    isActive: data.isActive,
    subCategoryId: parseInt(data.parentId),
    metaTitle: data.seoTitle || '',
    metaDescription: data.seoDescription || '',
    slug: data.slug
  };
  const response = await api.put(`/api/dataentry/microcategories/${id}`, updateData);
  return response.data;
};

// Delete microcategory
export const deleteMicrocategory = async (id: string): Promise<void> => {
  await api.delete(`/api/dataentry/microcategories/${id}`);
};

// =============== UTILITY FUNCTIONS ===============

// Toggle category status - implement by updating the category
export const toggleCategoryStatus = async (id: string): Promise<Category> => {
  // First get the category to know current status
  const category = await getCategoryById(id);
  const updateData = {
    name: category.name,
    description: category.description || '',
    displayOrder: category.sortOrder,
    isActive: !category.isActive,
    metaTitle: category.seoTitle || '',
    metaDescription: category.seoDescription || ''
  };
  const response = await api.put(`/api/dataentry/categories/${id}`, updateData);
  return response.data;
};

// Search categories (using existing get with search param)
export const searchCategories = async (query: string, level?: 'main' | 'sub' | 'micro'): Promise<Category[]> => {
  const response = await api.get('/api/dataentry/categories', {
    params: { search: query, size: 100 }
  });
  return response.data.content || response.data;
};

// Category statistics
export const getCategoryStats = async (): Promise<{
  totalMain: number;
  totalSub: number;
  totalMicro: number;
  activeCount: number;
  inactiveCount: number;
}> => {
  const response = await api.get('/api/dataentry/analytics/category-stats');
  
  // Transform the backend response to match frontend expectations
  const stats = response.data;
  return {
    totalMain: stats.reduce((sum: number, cat: any) => sum + 1, 0),
    totalSub: stats.reduce((sum: number, cat: any) => sum + cat.subCategoryCount, 0),
    totalMicro: stats.reduce((sum: number, cat: any) => sum + cat.microCategoryCount, 0),
    activeCount: stats.reduce((sum: number, cat: any) => sum + cat.activeProductCount, 0),
    inactiveCount: 0 // Calculate from dashboard analytics if needed
  };
};

// Bulk operations - these might not be implemented in backend yet
export const reorderCategories = async (categoryIds: string[]): Promise<void> => {
  // This would need to be implemented on backend
  console.warn('Reorder categories not implemented in backend yet');
};

export const bulkUpdateCategories = async (updates: { id: string; data: Partial<CategoryFormData> }[]): Promise<void> => {
  // This would need to be implemented on backend
  console.warn('Bulk update categories not implemented in backend yet');
};

export const bulkDeleteCategories = async (ids: string[]): Promise<void> => {
  // This would need to be implemented on backend
  console.warn('Bulk delete categories not implemented in backend yet');
};
