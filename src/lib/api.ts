// Re-export the main API client for consistent imports across the application
export { api } from '@/shared/services/api';
export { api as apiClient } from '@/shared/utils/apiClient';

// Re-export vendor-specific API functions from shared/services/api
export { 
  checkBackendHealth, 
  checkApiHealth, 
  testAuthAndGetUser, 
  excelAPI,
  getVendorProducts,
  addVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  getVendorOrders,
  getVendorLeads,
  findBulkImportEndpoint
} from '@/shared/services/api';

// Re-export utilities
export { handleApiError } from '@/shared/utils/apiClient';
