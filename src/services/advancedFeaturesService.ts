import apiClient, { getErrorMessage } from '@/lib/enhanced-api-client';
import toast from 'react-hot-toast';

// =====================
// SEARCH TYPES
// =====================

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'vendor' | 'keyword';
  count?: number;
  category?: string;
  image?: string;
  price?: number;
}

export interface SearchResult {
  id: number;
  type: 'product' | 'vendor' | 'category';
  title: string;
  description: string;
  image?: string;
  url: string;
  relevanceScore: number;
  category?: string;
  price?: number;
  rating?: number;
  vendor?: string;
  location?: string;
}

export interface SearchFilters {
  category?: string[];
  priceMin?: number;
  priceMax?: number;
  location?: string[];
  rating?: number;
  vendor?: number[];
  inStock?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  suggestions: SearchSuggestion[];
  facets: SearchFacets;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
  processingTime: number;
}

export interface SearchFacets {
  categories: { name: string; count: number; slug: string }[];
  priceRanges: { min: number; max: number; count: number }[];
  locations: { name: string; count: number }[];
  vendors: { id: number; name: string; count: number }[];
  ratings: { rating: number; count: number }[];
}

// =====================
// WISHLIST TYPES
// =====================

export interface WishlistItem {
  id: number;
  productId: number;
  userId: number;
  addedAt: string;
  notes?: string;
  notifyOnSale?: boolean;
  notifyOnAvailable?: boolean;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    vendor: string;
    category: string;
    inStock: boolean;
    rating?: number;
  };
}

export interface WishlistStats {
  totalItems: number;
  totalValue: number;
  itemsOnSale: number;
  itemsOutOfStock: number;
  categories: Record<string, number>;
}

// =====================
// REVIEWS TYPES
// =====================

export interface Review {
  id: number;
  productId: number;
  vendorId: number;
  userId: number;
  rating: number;
  title: string;
  comment: string;
  pros?: string;
  cons?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  reportCount: number;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    avatar?: string;
    isVerified: boolean;
  };
  vendor?: {
    id: number;
    name: string;
  };
  product?: {
    id: number;
    name: string;
    image?: string;
  };
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  verifiedPurchaseCount: number;
  recentReviews: Review[];
}

export interface ReviewFilter {
  productId?: number;
  vendorId?: number;
  userId?: number;
  rating?: number;
  isVerifiedPurchase?: boolean;
  status?: string;
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful';
  page?: number;
  limit?: number;
}

// =====================
// LEADS TYPES
// =====================

export interface Lead {
  id: number;
  productId?: number;
  vendorId: number;
  inquiryType: 'product_inquiry' | 'bulk_order' | 'custom_request' | 'partnership' | 'general';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  message: string;
  budget?: number;
  quantity?: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  source: 'website' | 'social' | 'referral' | 'advertisement' | 'direct';
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiating' | 'closed_won' | 'closed_lost';
  assignedTo?: number;
  expectedCloseDate?: string;
  actualValue?: number;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  product?: {
    id: number;
    name: string;
    image?: string;
  };
  vendor: {
    id: number;
    name: string;
    contactPerson: string;
  };
  assignee?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface LeadStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  averageValue: number;
  leadsBySource: Record<string, number>;
  leadsByStatus: Record<string, number>;
  monthlyTrends: { month: string; count: number; value: number }[];
}

export interface LeadFilter {
  vendorId?: number;
  productId?: number;
  status?: string;
  urgency?: string;
  source?: string;
  assignedTo?: number;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  sortBy?: 'newest' | 'oldest' | 'urgency' | 'value' | 'status';
  page?: number;
  limit?: number;
}

// =====================
// DIRECTORY TYPES
// =====================

export interface DirectoryEntry {
  id: number;
  type: 'vendor' | 'manufacturer' | 'distributor' | 'service_provider';
  name: string;
  slug: string;
  description: string;
  logo?: string;
  coverImage?: string;
  website?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  businessInfo: {
    establishedYear?: number;
    employeeCount?: string;
    annualTurnover?: string;
    gstNumber?: string;
    panNumber?: string;
    certifications?: string[];
  };
  categories: string[];
  products?: string[];
  services?: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isPremium: boolean;
  isActive: boolean;
  contactPerson: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  operatingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DirectoryFilter {
  type?: string[];
  categories?: string[];
  location?: {
    city?: string;
    state?: string;
    radius?: number;
    coordinates?: { lat: number; lng: number };
  };
  isVerified?: boolean;
  isPremium?: boolean;
  rating?: number;
  search?: string;
  tags?: string[];
  sortBy?: 'relevance' | 'rating' | 'newest' | 'alphabetical' | 'distance';
  page?: number;
  limit?: number;
}

export interface DirectoryStats {
  totalEntries: number;
  verifiedEntries: number;
  premiumEntries: number;
  entriesByType: Record<string, number>;
  entriesByCategory: Record<string, number>;
  entriesByLocation: Record<string, number>;
  averageRating: number;
}

// =====================
// ADVANCED FEATURES SERVICE
// =====================

class AdvancedFeaturesService {
  // =====================
  // SEARCH FUNCTIONALITY
  // =====================

  async search(query: string, filters?: SearchFilters): Promise<SearchResponse> {
    try {
      const params = { q: query, ...filters };
      const url = apiClient.buildUrl('/api/search', params);
      const response = await apiClient.get<SearchResponse>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Search failed: ${message}`);
      return {
        results: [],
        suggestions: [],
        facets: {
          categories: [],
          priceRanges: [],
          locations: [],
          vendors: [],
          ratings: []
        },
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
        query: query,
        processingTime: 0
      };
    }
  }

  async getSearchSuggestions(query: string, limit = 10): Promise<SearchSuggestion[]> {
    try {
      const url = apiClient.buildUrl('/api/search/suggestions', { q: query, limit });
      const response = await apiClient.get<SearchSuggestion[]>(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get search suggestions: ${message}`);
      return [];
    }
  }

  async saveSearchQuery(query: string, filters?: SearchFilters): Promise<void> {
    try {
      await apiClient.post('/api/search/save', { query, filters });
    } catch (error) {
      // Silently fail for analytics
      console.error('Failed to save search query:', getErrorMessage(error));
    }
  }

  async getPopularSearches(limit = 10): Promise<SearchSuggestion[]> {
    try {
      const response = await apiClient.get<SearchSuggestion[]>(`/api/search/popular?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Failed to get popular searches:', getErrorMessage(error));
      return [];
    }
  }

  // =====================
  // WISHLIST MANAGEMENT
  // =====================

  async getWishlist(page = 1, limit = 20): Promise<{
    items: WishlistItem[];
    stats: WishlistStats;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const url = apiClient.buildUrl('/api/wishlist', { page, limit });
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch wishlist: ${message}`);
      return {
        items: [],
        stats: {
          totalItems: 0,
          totalValue: 0,
          itemsOnSale: 0,
          itemsOutOfStock: 0,
          categories: {}
        },
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
      };
    }
  }

  async addToWishlist(productId: number, options?: {
    notes?: string;
    notifyOnSale?: boolean;
    notifyOnAvailable?: boolean;
  }): Promise<WishlistItem> {
    try {
      const response = await apiClient.post<WishlistItem>('/api/wishlist', {
        productId,
        ...options
      });
      
      toast.success('Item added to wishlist');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to add to wishlist: ${message}`);
      throw error;
    }
  }

  async removeFromWishlist(itemId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/wishlist/${itemId}`);
      toast.success('Item removed from wishlist');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to remove from wishlist: ${message}`);
      throw error;
    }
  }

  async updateWishlistItem(itemId: number, updates: Partial<WishlistItem>): Promise<WishlistItem> {
    try {
      const response = await apiClient.put<WishlistItem>(`/api/wishlist/${itemId}`, updates);
      toast.success('Wishlist item updated');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update wishlist item: ${message}`);
      throw error;
    }
  }

  async clearWishlist(): Promise<void> {
    try {
      await apiClient.delete('/api/wishlist/clear');
      toast.success('Wishlist cleared');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to clear wishlist: ${message}`);
      throw error;
    }
  }

  async shareWishlist(): Promise<{ shareUrl: string; shareCode: string }> {
    try {
      const response = await apiClient.post('/api/wishlist/share');
      toast.success('Wishlist shared successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to share wishlist: ${message}`);
      throw error;
    }
  }

  // =====================
  // REVIEWS & RATINGS
  // =====================

  async getReviews(filter?: ReviewFilter): Promise<{
    reviews: Review[];
    stats: ReviewStats;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const url = apiClient.buildUrl('/api/reviews', filter);
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch reviews: ${message}`);
      return {
        reviews: [],
        stats: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: {},
          verifiedPurchaseCount: 0,
          recentReviews: []
        },
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
      };
    }
  }

  async getReview(id: number): Promise<Review> {
    try {
      const response = await apiClient.get<Review>(`/api/reviews/${id}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch review: ${message}`);
      throw error;
    }
  }

  async createReview(review: {
    productId: number;
    vendorId: number;
    rating: number;
    title: string;
    comment: string;
    pros?: string;
    cons?: string;
    images?: File[];
  }): Promise<Review> {
    try {
      const formData = new FormData();
      
      Object.entries(review).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((file: File) => {
            formData.append('images', file);
          });
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await apiClient.post<Review>('/api/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Review submitted successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to create review: ${message}`);
      throw error;
    }
  }

  async updateReview(id: number, updates: Partial<Review>): Promise<Review> {
    try {
      const response = await apiClient.put<Review>(`/api/reviews/${id}`, updates);
      toast.success('Review updated successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update review: ${message}`);
      throw error;
    }
  }

  async deleteReview(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/reviews/${id}`);
      toast.success('Review deleted successfully');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete review: ${message}`);
      throw error;
    }
  }

  async markReviewHelpful(reviewId: number): Promise<void> {
    try {
      await apiClient.post(`/api/reviews/${reviewId}/helpful`);
      toast.success('Thank you for your feedback');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to mark review as helpful: ${message}`);
      throw error;
    }
  }

  async reportReview(reviewId: number, reason: string): Promise<void> {
    try {
      await apiClient.post(`/api/reviews/${reviewId}/report`, { reason });
      toast.success('Review reported successfully');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to report review: ${message}`);
      throw error;
    }
  }

  // =====================
  // LEADS MANAGEMENT
  // =====================

  async getLeads(filter?: LeadFilter): Promise<{
    leads: Lead[];
    stats: LeadStats;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const url = apiClient.buildUrl('/api/leads', filter);
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch leads: ${message}`);
      return {
        leads: [],
        stats: {
          totalLeads: 0,
          newLeads: 0,
          qualifiedLeads: 0,
          convertedLeads: 0,
          conversionRate: 0,
          averageValue: 0,
          leadsBySource: {},
          leadsByStatus: {},
          monthlyTrends: []
        },
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
      };
    }
  }

  async getLead(id: number): Promise<Lead> {
    try {
      const response = await apiClient.get<Lead>(`/api/leads/${id}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch lead: ${message}`);
      throw error;
    }
  }

  async createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'vendor' | 'product' | 'assignee'>): Promise<Lead> {
    try {
      const response = await apiClient.post<Lead>('/api/leads', lead);
      toast.success('Lead created successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to create lead: ${message}`);
      throw error;
    }
  }

  async updateLead(id: number, updates: Partial<Lead>): Promise<Lead> {
    try {
      const response = await apiClient.put<Lead>(`/api/leads/${id}`, updates);
      toast.success('Lead updated successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update lead: ${message}`);
      throw error;
    }
  }

  async deleteLead(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/leads/${id}`);
      toast.success('Lead deleted successfully');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete lead: ${message}`);
      throw error;
    }
  }

  async assignLead(leadId: number, assigneeId: number): Promise<Lead> {
    try {
      const response = await apiClient.put<Lead>(`/api/leads/${leadId}/assign`, {
        assignedTo: assigneeId
      });
      toast.success('Lead assigned successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to assign lead: ${message}`);
      throw error;
    }
  }

  async convertLead(leadId: number, conversionData: {
    actualValue: number;
    notes?: string;
  }): Promise<Lead> {
    try {
      const response = await apiClient.put<Lead>(`/api/leads/${leadId}/convert`, {
        status: 'closed_won',
        ...conversionData
      });
      toast.success('Lead converted successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to convert lead: ${message}`);
      throw error;
    }
  }

  // =====================
  // DIRECTORY SERVICES
  // =====================

  async getDirectoryEntries(filter?: DirectoryFilter): Promise<{
    entries: DirectoryEntry[];
    stats: DirectoryStats;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const url = apiClient.buildUrl('/api/directory', filter);
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch directory entries: ${message}`);
      return {
        entries: [],
        stats: {
          totalEntries: 0,
          verifiedEntries: 0,
          premiumEntries: 0,
          entriesByType: {},
          entriesByCategory: {},
          entriesByLocation: {},
          averageRating: 0
        },
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
      };
    }
  }

  async getDirectoryEntry(id: number): Promise<DirectoryEntry> {
    try {
      const response = await apiClient.get<DirectoryEntry>(`/api/directory/${id}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch directory entry: ${message}`);
      throw error;
    }
  }

  async createDirectoryEntry(entry: Omit<DirectoryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<DirectoryEntry> {
    try {
      const response = await apiClient.post<DirectoryEntry>('/api/directory', entry);
      toast.success('Directory entry created successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to create directory entry: ${message}`);
      throw error;
    }
  }

  async updateDirectoryEntry(id: number, updates: Partial<DirectoryEntry>): Promise<DirectoryEntry> {
    try {
      const response = await apiClient.put<DirectoryEntry>(`/api/directory/${id}`, updates);
      toast.success('Directory entry updated successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update directory entry: ${message}`);
      throw error;
    }
  }

  async deleteDirectoryEntry(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/directory/${id}`);
      toast.success('Directory entry deleted successfully');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete directory entry: ${message}`);
      throw error;
    }
  }

  async searchDirectory(query: string, filter?: DirectoryFilter): Promise<{
    entries: DirectoryEntry[];
    total: number;
    facets: {
      types: { name: string; count: number }[];
      categories: { name: string; count: number }[];
      locations: { name: string; count: number }[];
    };
  }> {
    try {
      const params = { q: query, ...filter };
      const url = apiClient.buildUrl('/api/directory/search', params);
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Directory search failed: ${message}`);
      return {
        entries: [],
        total: 0,
        facets: {
          types: [],
          categories: [],
          locations: []
        }
      };
    }
  }

  // =====================
  // UTILITY METHODS
  // =====================

  isProductInWishlist(productId: number, wishlistItems: WishlistItem[]): boolean {
    return wishlistItems.some(item => item.productId === productId);
  }

  formatRating(rating: number): string {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '⭐' : '') + '☆'.repeat(5 - Math.ceil(rating));
  }

  getReviewSentiment(review: Review): 'positive' | 'neutral' | 'negative' {
    if (review.rating >= 4) return 'positive';
    if (review.rating <= 2) return 'negative';
    return 'neutral';
  }

  getLeadPriorityColor(urgency: Lead['urgency']): string {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      urgent: '#dc2626'
    };
    return colors[urgency];
  }

  getLeadStatusColor(status: Lead['status']): string {
    const colors = {
      new: '#3b82f6',
      contacted: '#8b5cf6',
      qualified: '#06b6d4',
      proposal_sent: '#f59e0b',
      negotiating: '#f97316',
      closed_won: '#10b981',
      closed_lost: '#ef4444'
    };
    return colors[status];
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }

  debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    }) as T;
  }

  // Create debounced search function
  debouncedSearch = this.debounce(this.search.bind(this), 300);
  debouncedGetSuggestions = this.debounce(this.getSearchSuggestions.bind(this), 200);

  // =====================
  // LOCAL STORAGE HELPERS
  // =====================

  saveRecentSearch(query: string): void {
    try {
      const recent = this.getRecentSearches();
      const updated = [query, ...recent.filter(q => q !== query)].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  }

  getRecentSearches(): string[] {
    try {
      const recent = localStorage.getItem('recentSearches');
      return recent ? JSON.parse(recent) : [];
    } catch (error) {
      console.error('Failed to get recent searches:', error);
      return [];
    }
  }

  clearRecentSearches(): void {
    try {
      localStorage.removeItem('recentSearches');
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  }

  saveSearchFilters(filters: SearchFilters): void {
    try {
      localStorage.setItem('savedSearchFilters', JSON.stringify(filters));
    } catch (error) {
      console.error('Failed to save search filters:', error);
    }
  }

  getSavedSearchFilters(): SearchFilters | null {
    try {
      const saved = localStorage.getItem('savedSearchFilters');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to get saved search filters:', error);
      return null;
    }
  }
}

// Export singleton instance
export const advancedFeaturesService = new AdvancedFeaturesService();
export default advancedFeaturesService;