import { api } from '@/shared/services/api';
import { handleApiError, retryWithBackoff } from '@/shared/services/errorHandler';

// Recommendation Types
export interface ProductRecommendation {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  vendor: {
    id: string;
    name: string;
    verified: boolean;
    rating: number;
  };
  rating: number;
  reviewCount: number;
  recommendationScore: number;
  recommendationReason: string;
  similarityScore: number;
  tags: string[];
}

export interface VendorRecommendation {
  id: string;
  name: string;
  companyName: string;
  description: string;
  profileImage?: string;
  location: {
    city: string;
    state: string;
  };
  categories: string[];
  rating: number;
  reviewCount: number;
  totalProducts: number;
  verified: boolean;
  recommendationScore: number;
  matchReason: string;
  compatibility: {
    categoryMatch: number;
    locationMatch: number;
    priceMatch: number;
    qualityMatch: number;
  };
}

export interface PriceOptimization {
  productId: string;
  currentPrice: number;
  suggestedPrice: number;
  priceChange: number;
  priceChangePercent: number;
  confidence: number;
  factors: {
    marketDemand: number;
    competitorPricing: number;
    seasonality: number;
    inventory: number;
    historicalSales: number;
  };
  reasoning: string;
  expectedImpact: {
    salesVolume: number;
    revenue: number;
    profitability: number;
  };
}

export interface UserProfile {
  id: string;
  role: 'buyer' | 'vendor';
  preferences: {
    categories: string[];
    priceRange: { min: number; max: number };
    brands: string[];
    locations: string[];
    features: string[];
  };
  behavior: {
    searchHistory: string[];
    viewHistory: string[];
    purchaseHistory: string[];
    interactions: string[];
  };
  demographics: {
    businessSize?: string;
    industry?: string;
    location?: string;
    experience?: string;
  };
}

export interface SmartInsights {
  type: 'trend' | 'opportunity' | 'optimization' | 'alert';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data: any;
  actionItems: string[];
  expectedBenefit: string;
  timeframe: string;
}

export interface MLModelMetrics {
  modelType: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: string;
  dataQuality: number;
  predictionConfidence: number;
}

class AIRecommendationService {
  private readonly baseUrl = '/api/ai-recommendations';

  // Product Recommendations
  async getPersonalizedRecommendations(
    userId: string,
    options?: {
      count?: number;
      category?: string;
      priceRange?: { min: number; max: number };
      excludeViewed?: boolean;
    }
  ): Promise<ProductRecommendation[]> {
    try {
      const response = await retryWithBackoff(() =>
        api.get(`${this.baseUrl}/personalized/${userId}`, {
          params: options
        })
      );
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error, {
        customMessage: 'Failed to get personalized recommendations.'
      });
      console.warn(apiError.message);
      return [];
    }
  }

  async getSimilarProducts(
    productId: string,
    count: number = 10
  ): Promise<ProductRecommendation[]> {
    try {
      const response = await api.get(`${this.baseUrl}/similar-products/${productId}`, {
        params: { count }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get similar products:', error);
      return [];
    }
  }

  async getComplementaryProducts(
    productId: string,
    count: number = 5
  ): Promise<ProductRecommendation[]> {
    try {
      const response = await api.get(`${this.baseUrl}/complementary/${productId}`, {
        params: { count }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get complementary products:', error);
      return [];
    }
  }

  async getFrequentlyBoughtTogether(
    productId: string,
    count: number = 3
  ): Promise<ProductRecommendation[]> {
    try {
      const response = await api.get(`${this.baseUrl}/frequently-bought/${productId}`, {
        params: { count }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get frequently bought together:', error);
      return [];
    }
  }

  async getTrendingProducts(
    category?: string,
    location?: string,
    count: number = 20
  ): Promise<ProductRecommendation[]> {
    try {
      const response = await api.get(`${this.baseUrl}/trending`, {
        params: { category, location, count }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get trending products:', error);
      return [];
    }
  }

  // Vendor Matching
  async getMatchedVendors(
    requirement: {
      category: string;
      budget?: number;
      location?: string;
      quantity?: number;
      specifications?: string[];
      timeline?: string;
    },
    count: number = 10
  ): Promise<VendorRecommendation[]> {
    try {
      const response = await retryWithBackoff(() =>
        api.post(`${this.baseUrl}/vendor-matching`, {
          requirement,
          count
        })
      );
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error, {
        customMessage: 'Failed to find matching vendors.'
      });
      throw new Error(apiError.message);
    }
  }

  async getVendorRecommendationsForProduct(
    productId: string,
    buyerProfile: Partial<UserProfile>
  ): Promise<VendorRecommendation[]> {
    try {
      const response = await api.post(`${this.baseUrl}/vendor-for-product/${productId}`, {
        buyerProfile
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get vendor recommendations:', error);
      return [];
    }
  }

  async getAlternativeVendors(
    primaryVendorId: string,
    productCategory: string,
    count: number = 5
  ): Promise<VendorRecommendation[]> {
    try {
      const response = await api.get(`${this.baseUrl}/alternative-vendors/${primaryVendorId}`, {
        params: { productCategory, count }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get alternative vendors:', error);
      return [];
    }
  }

  // Price Optimization
  async getPriceOptimization(
    vendorId: string,
    productId?: string
  ): Promise<PriceOptimization[]> {
    try {
      const response = await retryWithBackoff(() =>
        api.get(`${this.baseUrl}/price-optimization/${vendorId}`, {
          params: { productId }
        })
      );
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error, {
        customMessage: 'Failed to get price optimization suggestions.'
      });
      throw new Error(apiError.message);
    }
  }

  async getMarketPriceAnalysis(
    productName: string,
    category: string,
    location?: string
  ): Promise<{
    averagePrice: number;
    priceRange: { min: number; max: number };
    marketPosition: 'below' | 'average' | 'above';
    competitors: Array<{
      vendorName: string;
      price: number;
      rating: number;
    }>;
    recommendation: string;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/market-analysis`, {
        params: { productName, category, location }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get market price analysis:', error);
      throw new Error('Market analysis failed');
    }
  }

  async getDynamicPricing(
    productId: string,
    factors: {
      demandLevel?: 'low' | 'medium' | 'high';
      seasonality?: number;
      inventory?: number;
      competitorActivity?: boolean;
    }
  ): Promise<{
    suggestedPrice: number;
    confidence: number;
    factors: any;
    validUntil: string;
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/dynamic-pricing/${productId}`, {
        factors
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get dynamic pricing:', error);
      throw new Error('Dynamic pricing failed');
    }
  }

  // Smart Insights & Analytics
  async getBusinessInsights(
    userId: string,
    role: 'buyer' | 'vendor',
    timeframe: 'day' | 'week' | 'month' | 'quarter' = 'month'
  ): Promise<SmartInsights[]> {
    try {
      const response = await api.get(`${this.baseUrl}/insights/${userId}`, {
        params: { role, timeframe }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get business insights:', error);
      return [];
    }
  }

  async getMarketTrends(
    category?: string,
    location?: string,
    timeframe: string = '3months'
  ): Promise<{
    trends: Array<{
      keyword: string;
      growth: number;
      volume: number;
      prediction: number;
    }>;
    opportunities: Array<{
      category: string;
      potential: number;
      competition: number;
      description: string;
    }>;
    seasonality: Array<{
      month: string;
      demand: number;
      confidence: number;
    }>;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/market-trends`, {
        params: { category, location, timeframe }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get market trends:', error);
      throw new Error('Market trends analysis failed');
    }
  }

  async getPredictiveAnalytics(
    type: 'demand' | 'sales' | 'price' | 'inventory',
    entityId: string,
    horizon: number = 30
  ): Promise<{
    predictions: Array<{
      date: string;
      value: number;
      confidence: number;
    }>;
    accuracy: number;
    factors: string[];
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/predictive/${type}/${entityId}`, {
        params: { horizon }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get predictive analytics:', error);
      throw new Error('Predictive analytics failed');
    }
  }

  // User Profiling & Segmentation
  async updateUserProfile(
    userId: string,
    profileData: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      const response = await api.put(`${this.baseUrl}/profile/${userId}`, profileData);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error, {
        customMessage: 'Failed to update user profile.'
      });
      throw new Error(apiError.message);
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await api.get(`${this.baseUrl}/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to get user profile:', error);
      throw new Error('User profile not found');
    }
  }

  async getUserSegment(userId: string): Promise<{
    segment: string;
    characteristics: string[];
    recommendations: string[];
    confidence: number;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/segment/${userId}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to get user segment:', error);
      throw new Error('User segmentation failed');
    }
  }

  // Real-time Personalization
  async getPersonalizedUI(
    userId: string,
    pageType: 'home' | 'search' | 'product' | 'category'
  ): Promise<{
    layout: string;
    widgets: Array<{
      type: string;
      position: number;
      config: any;
    }>;
    content: any;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/personalized-ui/${userId}`, {
        params: { pageType }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get personalized UI:', error);
      // Return default UI structure
      return {
        layout: 'default',
        widgets: [],
        content: {}
      };
    }
  }

  async getPersonalizedContent(
    userId: string,
    contentType: 'banners' | 'offers' | 'announcements' | 'tips',
    count: number = 5
  ): Promise<Array<{
    id: string;
    type: string;
    title: string;
    content: string;
    imageUrl?: string;
    cta?: string;
    relevanceScore: number;
  }>> {
    try {
      const response = await api.get(`${this.baseUrl}/personalized-content/${userId}`, {
        params: { contentType, count }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get personalized content:', error);
      return [];
    }
  }

  // Behavior Tracking
  async trackUserBehavior(
    userId: string,
    behavior: {
      action: string;
      entityId?: string;
      entityType?: 'product' | 'vendor' | 'category' | 'search';
      metadata?: any;
      timestamp?: string;
    }
  ): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/track-behavior/${userId}`, {
        ...behavior,
        timestamp: behavior.timestamp || new Date().toISOString()
      });
    } catch (error) {
      // Don't throw errors for tracking failures
      console.warn('Failed to track user behavior:', error);
    }
  }

  async getBehaviorInsights(
    userId: string,
    timeframe: string = '30days'
  ): Promise<{
    patterns: string[];
    interests: string[];
    preferences: any;
    nextBestAction: string;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/behavior-insights/${userId}`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get behavior insights:', error);
      return {
        patterns: [],
        interests: [],
        preferences: {},
        nextBestAction: 'explore_catalog'
      };
    }
  }

  // A/B Testing & Optimization
  async getExperimentVariant(
    userId: string,
    experimentId: string
  ): Promise<{
    variant: string;
    config: any;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/experiment/${experimentId}/variant`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to get experiment variant:', error);
      return {
        variant: 'control',
        config: {}
      };
    }
  }

  async trackExperimentEvent(
    userId: string,
    experimentId: string,
    eventType: string,
    metadata?: any
  ): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/experiment/${experimentId}/track`, {
        userId,
        eventType,
        metadata,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to track experiment event:', error);
    }
  }

  // Model Performance & Health
  async getModelMetrics(): Promise<MLModelMetrics[]> {
    try {
      const response = await api.get(`${this.baseUrl}/model-metrics`);
      return response.data;
    } catch (error) {
      console.warn('Failed to get model metrics:', error);
      return [];
    }
  }

  async retrainModel(
    modelType: string,
    force: boolean = false
  ): Promise<{
    success: boolean;
    jobId: string;
    estimatedTime: number;
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/retrain/${modelType}`, {
        force
      });
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error, {
        customMessage: 'Failed to initiate model retraining.'
      });
      throw new Error(apiError.message);
    }
  }

  // Utility Methods
  formatRecommendationReason(reason: string, score: number): string {
    const confidenceLevel = score > 0.8 ? 'highly' : score > 0.6 ? 'moderately' : 'somewhat';
    return `${reason} (${confidenceLevel} confident)`;
  }

  calculateRecommendationRelevance(
    userProfile: UserProfile,
    recommendation: ProductRecommendation
  ): number {
    let relevance = 0;

    // Category match
    if (userProfile.preferences.categories.includes(recommendation.category)) {
      relevance += 0.3;
    }

    // Price range match
    if (recommendation.price >= userProfile.preferences.priceRange.min &&
        recommendation.price <= userProfile.preferences.priceRange.max) {
      relevance += 0.2;
    }

    // Brand preference
    if (userProfile.preferences.brands.includes(recommendation.vendor.name)) {
      relevance += 0.2;
    }

    // Rating factor
    relevance += (recommendation.rating / 5) * 0.1;

    // Vendor verification
    if (recommendation.vendor.verified) {
      relevance += 0.1;
    }

    // Recommendation score
    relevance += recommendation.recommendationScore * 0.1;

    return Math.min(1, relevance);
  }

  groupRecommendationsByReason(
    recommendations: ProductRecommendation[]
  ): Record<string, ProductRecommendation[]> {
    return recommendations.reduce((groups, rec) => {
      const reason = rec.recommendationReason;
      if (!groups[reason]) {
        groups[reason] = [];
      }
      groups[reason].push(rec);
      return groups;
    }, {} as Record<string, ProductRecommendation[]>);
  }

  // Cache Management
  async clearUserCache(userId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/cache/${userId}`);
    } catch (error) {
      console.warn('Failed to clear user cache:', error);
    }
  }

  async warmupRecommendations(userId: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/warmup/${userId}`);
    } catch (error) {
      console.warn('Failed to warmup recommendations:', error);
    }
  }
}

export const aiRecommendationService = new AIRecommendationService();
export default aiRecommendationService;
