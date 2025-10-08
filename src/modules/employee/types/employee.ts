// Employee Module Types

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  level: 'main' | 'sub' | 'micro';
  isActive: boolean;
  sortOrder: number; // Maps to displayOrder in backend
  icon?: string;
  image?: string;
  seoTitle?: string; // Maps to metaTitle in backend
  seoDescription?: string; // Maps to metaDescription in backend
  createdAt: string;
  updatedAt: string;
  subcategories?: Category[];
  // Backend specific fields
  displayOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  subCategoryCount?: number;
  totalProductCount?: number;
  categoryId?: number;
  categoryName?: string;
  microCategoryCount?: number;
  productCount?: number;
  subCategoryId?: number;
  subCategoryName?: string;
}

export interface State {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  cities?: City[];
}

export interface City {
  id: string;
  name: string;
  stateId: string;
  stateName?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  level: 'main' | 'sub' | 'micro';
  isActive: boolean;
  sortOrder: number;
  icon?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface LocationFormData {
  name: string;
  code?: string;
  stateId?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface DataManagementStats {
  totalCategories: number;
  totalSubcategories: number;
  totalMicrocategories: number;
  totalStates: number;
  totalCities: number;
  activeCategories: number;
  inactiveCategories: number;
  activeLocations: number;
  inactiveLocations: number;
}

export interface EmployeePermissions {
  canCreateCategories: boolean;
  canUpdateCategories: boolean;
  canDeleteCategories: boolean;
  canCreateLocations: boolean;
  canUpdateLocations: boolean;
  canDeleteLocations: boolean;
  canViewAnalytics: boolean;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'senior_employee' | 'manager';
  permissions: EmployeePermissions;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
