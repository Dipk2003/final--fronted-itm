// Re-export product APIs from shared services
export * from '@/shared/services/productApi';
export { api as productAPI } from '@/shared/services/api';

// Re-export types
export type { ProductDto } from '@/shared/types/index';
