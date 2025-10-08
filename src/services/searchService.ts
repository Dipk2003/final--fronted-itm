import { api } from '@/shared/services/api';

// Search Result Types
export interface SearchProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  subCategory?: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  vendor: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    location: string;
  };
  availability: 'in_stock' | 'out_of_stock' | 'low_stock';
  tags: string[];
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SearchVendor {
  id: string;
  name: string;
  companyName: string;
  description: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  location: {
    city: string;
    state: string;
    country: string;
  };
  categories: string[];
  totalProducts: number;
  establishedYear?: number;
  responseTime: string;
  tags: string[];
}

export interface SearchFilters {
  // Basic filters
  query?: string;
  category?: string;
  subCategory?: string;
  location?: string;
  
  // Price filters
  minPrice?: number;
  maxPrice?: number;
  
  // Rating filters
  minRating?: number;
  
  // Vendor filters
  vendorIds?: string[];
  verifiedVendorsOnly?: boolean;
  
  // Product filters
  brands?: string[];
  availability?: ('in_stock' | 'out_of_stock' | 'low_stock')[];
  tags?: string[];
  
  // Date filters
  dateFrom?: string;
  dateTo?: string;
  
  // Advanced filters
  attributes?: Record<string, any>;
  customFilters?: Record<string, any>;
}

export interface SearchSortOptions {
  field: 'relevance' | 'price' | 'rating' | 'popularity' | 'newest' | 'name' | 'distance';
  order: 'asc' | 'desc';
}

export interface SearchRequest {
  query?: string;
  filters?: SearchFilters;
  sort?: SearchSortOptions;
  page?: number;
  size?: number;
  includeAggregations?: boolean;
  searchType?: 'products' | 'vendors' | 'all';
}

export interface SearchAggregation {
  field: string;
  label: string;
  values: Array<{
    key: string;
    count: number;
    selected?: boolean;
  }>;
}

export interface SearchResponse<T> {
  results: T[];
  total: number;
  page: number;
  totalPages: number;
  took: number; // Search time in milliseconds
  aggregations: SearchAggregation[];
  suggestions: string[];
  corrections: string[];
}

export interface AutocompleteResult {
  text: string;
  type: 'product' | 'category' | 'brand' | 'vendor' | 'location';
  count?: number;
  metadata?: any;
}

export interface SearchSuggestion {
  text: string;
  highlighted: string;
  score: number;
  type: 'completion' | 'phrase' | 'term';
}

export interface SearchAnalytics {
  totalSearches: number;
  uniqueSearchers: number;
  averageResultsClicked: number;
  topQueries: Array<{
    query: string;
    count: number;
    averagePosition: number;
  }>;
  noResultQueries: Array<{
    query: string;
    count: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    searchCount: number;
    clickRate: number;
  }>;
  searchTrends: Array<{
    date: string;
    searches: number;
    clicks: number;
    conversions: number;
  }>;
  performanceMetrics: {
    averageSearchTime: number;
    averageResultsReturned: number;
    clickThroughRate: number;
    conversionRate: number;
  };
}

export interface SearchHistory {
  id: string;
  query: string;
  filters: SearchFilters;
  resultsCount: number;
  clickedResults: string[];
  searchedAt: string;
}

class SearchService {
  private baseUrl: string;
  private searchHistory: SearchHistory[] = [];
  
  constructor() {
    this.baseUrl = '/api/search';
    this.loadSearchHistory();
  }

  // Main search function
  async search<T = SearchProduct>(request: SearchRequest): Promise<SearchResponse<T>> {
    try {
      const response = await api.post(`${this.baseUrl}/query`, request);
      
      // Save to search history
      if (request.query) {
        this.addToSearchHistory({
          query: request.query,
          filters: request.filters || {},
          resultsCount: response.data.total
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error performing search:', error);
      throw new Error('Search failed');
    }
  }

  // Search products specifically
  async searchProducts(request: Omit<SearchRequest, 'searchType'>): Promise<SearchResponse<SearchProduct>> {
    return this.search<SearchProduct>({ ...request, searchType: 'products' });
  }

  // Search vendors specifically
  async searchVendors(request: Omit<SearchRequest, 'searchType'>): Promise<SearchResponse<SearchVendor>> {
    return this.search<SearchVendor>({ ...request, searchType: 'vendors' });
  }

  // Autocomplete suggestions
  async autocomplete(query: string, type?: string): Promise<AutocompleteResult[]> {
    try {
      const response = await api.get(`${this.baseUrl}/autocomplete`, {
        params: { query, type }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error);
      return [];
    }
  }

  // Get search suggestions
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    try {
      const response = await api.get(`${this.baseUrl}/suggest`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }

  // Get popular searches
  async getPopularSearches(limit: number = 10): Promise<string[]> {
    try {
      const response = await api.get(`${this.baseUrl}/popular`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting popular searches:', error);
      return [];
    }
  }

  // Get trending searches
  async getTrendingSearches(limit: number = 10): Promise<Array<{
    query: string;
    trendScore: number;
    changePercent: number;
  }>> {
    try {
      const response = await api.get(`${this.baseUrl}/trending`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting trending searches:', error);
      return [];
    }
  }

  // Advanced faceted search
  async facetedSearch(request: SearchRequest): Promise<SearchResponse<SearchProduct> & {
    facets: Record<string, SearchAggregation>;
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/faceted`, request);
      return response.data;
    } catch (error) {
      console.error('Error performing faceted search:', error);
      throw new Error('Faceted search failed');
    }
  }

  // Similar products search
  async findSimilarProducts(productId: string, limit: number = 10): Promise<SearchProduct[]> {
    try {
      const response = await api.get(`${this.baseUrl}/similar/${productId}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error finding similar products:', error);
      return [];
    }
  }

  // Search by image (if implemented)
  async searchByImage(imageFile: File): Promise<SearchResponse<SearchProduct>> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post(`${this.baseUrl}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error performing image search:', error);
      throw new Error('Image search failed');
    }
  }

  // Advanced query with natural language processing
  async naturalLanguageSearch(query: string): Promise<SearchResponse<SearchProduct>> {
    try {
      const response = await api.post(`${this.baseUrl}/nlp`, { query });
      return response.data;
    } catch (error) {
      console.error('Error performing NLP search:', error);
      throw new Error('Natural language search failed');
    }
  }

  // Get search analytics
  async getSearchAnalytics(dateRange?: { from: string; to: string }): Promise<SearchAnalytics> {
    try {
      const response = await api.get(`${this.baseUrl}/analytics`, {
        params: dateRange
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search analytics:', error);
      throw new Error('Failed to get search analytics');
    }
  }

  // Track search result click
  async trackClick(searchId: string, productId: string, position: number): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/track/click`, {
        searchId,
        productId,
        position
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  // Track search conversion
  async trackConversion(searchId: string, productId: string, conversionType: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/track/conversion`, {
        searchId,
        productId,
        conversionType
      });
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }

  // Get search filters for a category
  async getCategoryFilters(category: string): Promise<SearchAggregation[]> {
    try {
      const response = await api.get(`${this.baseUrl}/filters/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error getting category filters:', error);
      return [];
    }
  }

  // Create saved search
  async saveSearch(name: string, request: SearchRequest): Promise<{ id: string; name: string }> {
    try {
      const response = await api.post(`${this.baseUrl}/saved-searches`, {
        name,
        searchRequest: request
      });
      return response.data;
    } catch (error) {
      console.error('Error saving search:', error);
      throw new Error('Failed to save search');
    }
  }

  // Get saved searches
  async getSavedSearches(): Promise<Array<{
    id: string;
    name: string;
    searchRequest: SearchRequest;
    createdAt: string;
    resultsCount?: number;
  }>> {
    try {
      const response = await api.get(`${this.baseUrl}/saved-searches`);
      return response.data;
    } catch (error) {
      console.error('Error getting saved searches:', error);
      return [];
    }
  }

  // Delete saved search
  async deleteSavedSearch(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/saved-searches/${id}`);
    } catch (error) {
      console.error('Error deleting saved search:', error);
      throw new Error('Failed to delete saved search');
    }
  }

  // Local search history management
  private loadSearchHistory(): void {
    try {
      const stored = localStorage.getItem('searchHistory');
      if (stored) {
        this.searchHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
      this.searchHistory = [];
    }
  }

  private saveSearchHistory(): void {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  private addToSearchHistory(search: Omit<SearchHistory, 'id' | 'searchedAt' | 'clickedResults'>): void {
    const historyItem: SearchHistory = {
      id: Date.now().toString(),
      ...search,
      clickedResults: [],
      searchedAt: new Date().toISOString()
    };

    // Remove duplicates and add to front
    this.searchHistory = [
      historyItem,
      ...this.searchHistory.filter(h => h.query !== search.query).slice(0, 19)
    ];

    this.saveSearchHistory();
  }

  // Get local search history
  getSearchHistory(): SearchHistory[] {
    return this.searchHistory;
  }

  // Clear search history
  clearSearchHistory(): void {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  // Utility functions
  static buildSearchUrl(request: SearchRequest): string {
    const params = new URLSearchParams();
    
    if (request.query) params.set('q', request.query);
    if (request.filters?.category) params.set('category', request.filters.category);
    if (request.filters?.minPrice) params.set('min_price', request.filters.minPrice.toString());
    if (request.filters?.maxPrice) params.set('max_price', request.filters.maxPrice.toString());
    if (request.filters?.location) params.set('location', request.filters.location);
    if (request.sort?.field) params.set('sort', request.sort.field);
    if (request.sort?.order) params.set('order', request.sort.order);
    if (request.page) params.set('page', request.page.toString());
    
    return `/search?${params.toString()}`;
  }

  static parseSearchUrl(url: string): SearchRequest {
    const urlObj = new URL(url, window.location.origin);
    const params = urlObj.searchParams;
    
    return {
      query: params.get('q') || undefined,
      filters: {
        category: params.get('category') || undefined,
        minPrice: params.get('min_price') ? Number(params.get('min_price')) : undefined,
        maxPrice: params.get('max_price') ? Number(params.get('max_price')) : undefined,
        location: params.get('location') || undefined,
      },
      sort: {
        field: (params.get('sort') as any) || 'relevance',
        order: (params.get('order') as any) || 'desc'
      },
      page: params.get('page') ? Number(params.get('page')) : 1
    };
  }

  static highlightSearchText(text: string, query: string): string {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  static formatSearchResults(results: SearchProduct[]): SearchProduct[] {
    return results.map(product => ({
      ...product,
      price: Math.round(product.price * 100) / 100, // Round to 2 decimal places
      rating: Math.round(product.rating * 10) / 10,  // Round to 1 decimal place
    }));
  }

  // Search suggestions based on partial input
  async getSearchSuggestions(partialQuery: string): Promise<string[]> {
    try {
      const response = await api.get(`${this.baseUrl}/suggestions`, {
        params: { q: partialQuery }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }

  // Get category-specific suggestions
  async getCategorySuggestions(category: string, query?: string): Promise<string[]> {
    try {
      const response = await api.get(`${this.baseUrl}/category-suggestions`, {
        params: { category, query }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting category suggestions:', error);
      return [];
    }
  }

  // Export search results
  async exportSearchResults(request: SearchRequest, format: 'csv' | 'excel'): Promise<Blob> {
    try {
      const response = await api.post(`${this.baseUrl}/export`, {
        ...request,
        format
      }, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting search results:', error);
      throw new Error('Failed to export search results');
    }
  }
}

export const searchService = new SearchService();
export default searchService;
