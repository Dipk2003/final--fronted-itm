import { api } from '@/shared/utils/apiClient';
import { mockDirectoryApi } from './mockDirectoryApi';
import {
  ServiceProvider,
  DirectorySearchFilters,
  DirectorySearchResponse,
  ServiceCategory,
  DirectoryStats,
  QuoteRequest,
  ContactSupplierRequest,
  Location
} from '../types/directory';

// Use mock API when backend is not ready or in development mode
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_DIRECTORY === 'true' || process.env.NODE_ENV === 'development';

export class DirectoryApiService {
  
  /**
   * Search service providers with filters
   */
  async searchServiceProviders(filters: DirectorySearchFilters): Promise<DirectorySearchResponse> {
    if (USE_MOCK_API) {
      return mockDirectoryApi.searchServiceProviders(filters);
    }
    
    try {
      const response = await api.get<DirectorySearchResponse>('/api/directory/search', {
        params: filters
      });
      return response;
    } catch (error: any) {
      console.warn('Directory API not available, falling back to mock data');
      return mockDirectoryApi.searchServiceProviders(filters);
    }
  }

  /**
   * Get service provider by ID
   */
  async getServiceProvider(id: string): Promise<ServiceProvider> {
    if (USE_MOCK_API) {
      return mockDirectoryApi.getServiceProvider(id);
    }
    
    try {
      const response = await api.get<ServiceProvider>(`/api/directory/providers/${id}`);
      return response;
    } catch (error: any) {
      console.warn('Directory API not available, falling back to mock data');
      return mockDirectoryApi.getServiceProvider(id);
    }
  }

  /**
   * Get all service categories
   */
  async getServiceCategories(): Promise<ServiceCategory[]> {
    if (USE_MOCK_API) {
      return mockDirectoryApi.getServiceCategories();
    }
    
    try {
      const response = await api.get<ServiceCategory[]>('/api/directory/categories');
      return response;
    } catch (error: any) {
      console.warn('Directory API not available, falling back to mock data');
      return mockDirectoryApi.getServiceCategories();
    }
  }

  /**
   * Get locations with provider counts
   */
  async getLocations(): Promise<Location[]> {
    try {
      const response = await api.get<Location[]>('/api/directory/locations');
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get locations');
    }
  }

  /**
   * Get providers by location and category
   */
  async getProvidersByLocationAndCategory(city: string, category?: string): Promise<ServiceProvider[]> {
    try {
      const params: any = { city };
      if (category) params.category = category;
      
      const response = await api.get<ServiceProvider[]>('/api/directory/providers', {
        params
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get providers');
    }
  }

  /**
   * Get directory statistics
   */
  async getDirectoryStats(): Promise<DirectoryStats> {
    try {
      const response = await api.get<DirectoryStats>('/api/directory/stats');
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get directory stats');
    }
  }

  /**
   * Submit quote request
   */
  async submitQuoteRequest(quoteRequest: QuoteRequest): Promise<{ success: boolean; message: string }> {
    if (USE_MOCK_API) {
      return mockDirectoryApi.submitQuoteRequest(quoteRequest);
    }
    
    try {
      const response = await api.post<{ success: boolean; message: string }>('/api/directory/quote-request', quoteRequest);
      return response;
    } catch (error: any) {
      console.warn('Directory API not available, falling back to mock data');
      return mockDirectoryApi.submitQuoteRequest(quoteRequest);
    }
  }

  /**
   * Contact supplier
   */
  async contactSupplier(contactRequest: ContactSupplierRequest): Promise<{ success: boolean; message: string }> {
    if (USE_MOCK_API) {
      return mockDirectoryApi.contactSupplier(contactRequest);
    }
    
    try {
      const response = await api.post<{ success: boolean; message: string }>('/api/directory/contact-supplier', contactRequest);
      return response;
    } catch (error: any) {
      console.warn('Directory API not available, falling back to mock data');
      return mockDirectoryApi.contactSupplier(contactRequest);
    }
  }

  /**
   * Get featured service providers
   */
  async getFeaturedProviders(limit: number = 10): Promise<ServiceProvider[]> {
    if (USE_MOCK_API) {
      return mockDirectoryApi.getFeaturedProviders(limit);
    }
    
    try {
      const response = await api.get<ServiceProvider[]>(`/api/directory/featured?limit=${limit}`);
      return response;
    } catch (error: any) {
      console.warn('Directory API not available, falling back to mock data');
      return mockDirectoryApi.getFeaturedProviders(limit);
    }
  }

  /**
   * Get top rated providers by category
   */
  async getTopRatedProviders(category: string, limit: number = 5): Promise<ServiceProvider[]> {
    try {
      const response = await api.get<ServiceProvider[]>(`/api/directory/top-rated`, {
        params: { category, limit }
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get top rated providers');
    }
  }

  /**
   * Get providers by city
   */
  async getProvidersByCity(city: string, limit: number = 20): Promise<ServiceProvider[]> {
    try {
      const response = await api.get<ServiceProvider[]>(`/api/directory/city/${city}`, {
        params: { limit }
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get providers by city');
    }
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (USE_MOCK_API) {
      return mockDirectoryApi.getSearchSuggestions(query);
    }
    
    try {
      const response = await api.get<string[]>(`/api/directory/suggestions`, {
        params: { query }
      });
      return response;
    } catch (error: any) {
      console.warn('Directory API not available, falling back to mock data');
      return mockDirectoryApi.getSearchSuggestions(query);
    }
  }

  /**
   * Get popular searches
   */
  async getPopularSearches(): Promise<string[]> {
    if (USE_MOCK_API) {
      return mockDirectoryApi.getPopularSearches();
    }
    
    try {
      const response = await api.get<string[]>('/api/directory/popular-searches');
      return response;
    } catch (error: any) {
      console.warn('Directory API not available, falling back to mock data');
      return mockDirectoryApi.getPopularSearches();
    }
  }
}

// Export singleton instance
export const directoryApi = new DirectoryApiService();
