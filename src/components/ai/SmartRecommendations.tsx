'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  aiRecommendationService,
  ProductRecommendation,
  VendorRecommendation,
  SmartInsights,
  PriceOptimization
} from '@/services/aiRecommendationService';
import { Button } from '@/shared/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card';
import {
  SparklesIcon,
  StarIcon,
  LightBulbIcon,
  ShoppingCartIcon,
  MapPinIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  UsersIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { TrendingUp } from "lucide-react";
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface SmartRecommendationsProps {
  type: 'products' | 'vendors' | 'insights' | 'pricing' | 'all';
  userId?: string;
  productId?: string;
  context?: {
    category?: string;
    priceRange?: { min: number; max: number };
    location?: string;
  };
  maxItems?: number;
  showReason?: boolean;
  compact?: boolean;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  type = 'all',
  userId,
  productId,
  context,
  maxItems = 10,
  showReason = true,
  compact = false
}) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const actualUserId = userId || user?.id;

  const [recommendations, setRecommendations] = useState<{
    products: ProductRecommendation[];
    vendors: VendorRecommendation[];
    insights: SmartInsights[];
    pricing: PriceOptimization[];
  }>({
    products: [],
    vendors: [],
    insights: [],
    pricing: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'recommended' | 'similar' | 'trending' | 'complementary'>('recommended');

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const promises: Promise<any>[] = [];

      // Load different types of recommendations based on type prop
      if (type === 'products' || type === 'all') {
        if (actualUserId) {
          promises.push(
            aiRecommendationService.getPersonalizedRecommendations(actualUserId, {
              count: maxItems,
              category: context?.category,
              priceRange: context?.priceRange
            })
          );
        }
        
        if (productId) {
          promises.push(
            aiRecommendationService.getSimilarProducts(productId, Math.min(maxItems, 10))
          );
        }
      }

      if (type === 'vendors' || type === 'all') {
        if (context?.category && actualUserId) {
          promises.push(
            aiRecommendationService.getMatchedVendors({
              category: context.category,
              location: context.location
            }, Math.min(maxItems, 10))
          );
        }
      }

      if (type === 'insights' || type === 'all') {
        if (actualUserId && user?.role) {
          promises.push(
            aiRecommendationService.getBusinessInsights(
              actualUserId,
              user.role as 'buyer' | 'vendor'
            )
          );
        }
      }

      if (type === 'pricing' || type === 'all') {
        if (user?.role === 'vendor' && actualUserId) {
          promises.push(
            aiRecommendationService.getPriceOptimization(actualUserId, productId)
          );
        }
      }

      const results = await Promise.allSettled(promises);
      
      // Process results
      let productIndex = 0;
      const newRecommendations = {
        products: [] as ProductRecommendation[],
        vendors: [] as VendorRecommendation[],
        insights: [] as SmartInsights[],
        pricing: [] as PriceOptimization[]
      };

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (type === 'products' || type === 'all') {
            if ((actualUserId && index === productIndex) || (productId && index === productIndex + (actualUserId ? 1 : 0))) {
              newRecommendations.products.push(...(result.value as ProductRecommendation[]));
            }
          }
          if (type === 'vendors' || type === 'all') {
            // Handle vendor results
            if (Array.isArray(result.value) && result.value[0]?.companyName) {
              newRecommendations.vendors = result.value as VendorRecommendation[];
            }
          }
          if (type === 'insights' || type === 'all') {
            // Handle insights results
            if (Array.isArray(result.value) && result.value[0]?.type) {
              newRecommendations.insights = result.value as SmartInsights[];
            }
          }
          if (type === 'pricing' || type === 'all') {
            // Handle pricing results
            if (Array.isArray(result.value) && result.value[0]?.suggestedPrice) {
              newRecommendations.pricing = result.value as PriceOptimization[];
            }
          }
        }
      });

      setRecommendations(newRecommendations);

      // Track user behavior
      if (actualUserId && newRecommendations.products.length > 0) {
        aiRecommendationService.trackUserBehavior(actualUserId, {
          action: 'view_recommendations',
          entityType: 'product',
          metadata: {
            recommendationCount: newRecommendations.products.length,
            context
          }
        });
      }

    } catch (err: any) {
      setError(err.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }, [actualUserId, context, maxItems, productId, type, user?.role]);

  useEffect(() => {
    if (actualUserId || productId) {
      loadRecommendations();
    }
  }, [actualUserId, productId, type, context, loadRecommendations]);

  const handleProductClick = (product: ProductRecommendation) => {
    if (actualUserId) {
      aiRecommendationService.trackUserBehavior(actualUserId, {
        action: 'click_recommendation',
        entityId: product.id,
        entityType: 'product',
        metadata: {
          recommendationReason: product.recommendationReason,
          score: product.recommendationScore
        }
      });
    }
  };

  const handleVendorClick = (vendor: VendorRecommendation) => {
    if (actualUserId) {
      aiRecommendationService.trackUserBehavior(actualUserId, {
        action: 'click_vendor_recommendation',
        entityId: vendor.id,
        entityType: 'vendor',
        metadata: {
          matchReason: vendor.matchReason,
          score: vendor.recommendationScore
        }
      });
    }
  };

  const renderProductRecommendation = (product: ProductRecommendation) => (
    <Card 
      key={product.id} 
      className={`hover:shadow-lg transition-all cursor-pointer group ${compact ? 'p-3' : 'p-4'}`}
      onClick={() => handleProductClick(product)}
    >
      <CardContent className="p-0">
        <div className={`flex ${compact ? 'space-x-3' : 'space-x-4'}`}>
          <div className="flex-shrink-0 relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} object-cover rounded-lg group-hover:scale-105 transition-transform`}
            />
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`${compact ? 'text-sm' : 'text-base'} font-semibold text-gray-900 truncate group-hover:text-blue-600`}>
              {product.name}
            </h4>
            
            <div className="flex items-center space-x-2 mt-1">
              <span className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-blue-600`}>
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} ${
                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">({product.reviewCount})</span>
              {product.vendor.verified && (
                <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
              )}
            </div>
            
            {showReason && (
              <p className="text-xs text-blue-600 mt-2 flex items-center">
                <SparklesIcon className="h-3 w-3 mr-1" />
                {aiRecommendationService.formatRecommendationReason(
                  product.recommendationReason,
                  product.recommendationScore
                )}
              </p>
            )}
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">{product.vendor.name}</span>
              <div className="flex space-x-1">
                <Button size="sm" variant="ghost" className="h-6 px-2">
                  <HeartIcon className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 px-2">
                  <ShoppingCartIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderVendorRecommendation = (vendor: VendorRecommendation) => (
    <Card 
      key={vendor.id} 
      className="hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => handleVendorClick(vendor)}
    >
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <img
              src={vendor.profileImage || '/default-vendor.png'}
              alt={vendor.name}
              className="w-12 h-12 rounded-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600">
                {vendor.name}
              </h4>
              {vendor.verified && (
                <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
              )}
            </div>
            
            <p className="text-sm text-gray-600">{vendor.companyName}</p>
            
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(vendor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-600 ml-1">({vendor.reviewCount})</span>
              </div>
              
              <div className="text-xs text-gray-600">
                {vendor.totalProducts} Products
              </div>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <MapPinIcon className="h-3 w-3 mr-1" />
              {vendor.location.city}, {vendor.location.state}
            </div>
            
            {showReason && (
              <p className="text-xs text-blue-600 mt-2 flex items-center">
                <LightBulbIcon className="h-3 w-3 mr-1" />
                {vendor.matchReason} (Match: {Math.round(vendor.recommendationScore * 100)}%)
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderInsight = (insight: SmartInsights) => (
    <Card 
      key={insight.title} 
      className={`border-l-4 ${
        insight.priority === 'urgent' ? 'border-red-500 bg-red-50' :
        insight.priority === 'high' ? 'border-orange-500 bg-orange-50' :
        insight.priority === 'medium' ? 'border-blue-500 bg-blue-50' :
        'border-green-500 bg-green-50'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${
            insight.type === 'trend' ? 'bg-blue-100' :
            insight.type === 'opportunity' ? 'bg-green-100' :
            insight.type === 'optimization' ? 'bg-purple-100' :
            'bg-yellow-100'
          }`}>
            {insight.type === 'trend' && <TrendingUp className="h-5 w-5 text-blue-600" />}
            {insight.type === 'opportunity' && <LightBulbIcon className="h-5 w-5 text-green-600" />}
            {insight.type === 'optimization' && <ChartBarIcon className="h-5 w-5 text-purple-600" />}
            {insight.type === 'alert' && <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />}
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  insight.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  insight.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  insight.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {insight.priority.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(insight.confidence * 100)}% confidence
                </span>
              </div>
              
              <Button size="sm" variant="outline" className="text-xs">
                View Details
              </Button>
            </div>
            
            {insight.expectedBenefit && (
              <p className="text-xs text-green-600 mt-2">
                Expected: {insight.expectedBenefit}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPriceOptimization = (pricing: PriceOptimization) => (
    <Card key={pricing.productId} className="border-l-4 border-green-500 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-full bg-green-100">
            <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900">Price Optimization</h4>
            
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="text-center">
                <p className="text-xs text-gray-500">Current</p>
                <p className="text-lg font-bold text-gray-900">₹{pricing.currentPrice.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Suggested</p>
                <p className={`text-lg font-bold ${
                  pricing.suggestedPrice > pricing.currentPrice ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{pricing.suggestedPrice.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Change</p>
                <p className={`text-lg font-bold ${
                  pricing.priceChangePercent > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {pricing.priceChangePercent > 0 ? '+' : ''}{pricing.priceChangePercent.toFixed(1)}%
                </p>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mt-3">{pricing.reasoning}</p>
            
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-blue-600">
                {Math.round(pricing.confidence * 100)}% confidence
              </span>
              <Button size="sm" variant="outline" className="text-xs">
                Apply Suggestion
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4 text-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700">{error}</p>
          <Button onClick={loadRecommendations} variant="outline" className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const hasRecommendations = 
    recommendations.products.length > 0 ||
    recommendations.vendors.length > 0 ||
    recommendations.insights.length > 0 ||
    recommendations.pricing.length > 0;

  if (!hasRecommendations) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600">
            {!isAuthenticated 
              ? "Sign in to get personalized recommendations"
              : "Explore products to get personalized recommendations"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Recommendations */}
      {recommendations.products.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2 text-blue-500" />
              Recommended for You
            </h3>
            {recommendations.products.length > 5 && (
              <Button variant="outline" size="sm">View All</Button>
            )}
          </div>
          
          <div className={`grid gap-4 ${
            compact 
              ? 'grid-cols-1 md:grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {recommendations.products.slice(0, maxItems).map(renderProductRecommendation)}
          </div>
        </div>
      )}

      {/* Vendor Recommendations */}
      {recommendations.vendors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <UsersIcon className="h-5 w-5 mr-2 text-green-500" />
              Recommended Vendors
            </h3>
          </div>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {recommendations.vendors.slice(0, Math.min(maxItems, 6)).map(renderVendorRecommendation)}
          </div>
        </div>
      )}

      {/* Smart Insights */}
      {recommendations.insights.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <LightBulbIcon className="h-5 w-5 mr-2 text-purple-500" />
              Smart Insights
            </h3>
          </div>
          
          <div className="space-y-3">
            {recommendations.insights.slice(0, 3).map(renderInsight)}
          </div>
        </div>
      )}

      {/* Price Optimization */}
      {recommendations.pricing.length > 0 && user?.role === 'vendor' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-green-500" />
              Price Optimization
            </h3>
          </div>
          
          <div className="space-y-3">
            {recommendations.pricing.slice(0, 3).map(renderPriceOptimization)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartRecommendations;
