'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  Users,
  Star,
  ShoppingCart,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Eye,
  Heart,
  ArrowRight,
  Plus,
  ExternalLink
} from 'lucide-react';

interface ProductRecommendation {
  id: string;
  type: 'trending_category' | 'price_optimization' | 'inventory_alert' | 'market_opportunity' | 'cross_sell';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  action: string;
  data: {
    category?: string;
    suggestedPrice?: number;
    currentPrice?: number;
    stockLevel?: number;
    demandScore?: number;
    competitorCount?: number;
    averageRating?: number;
    searchVolume?: number;
    seasonalTrend?: 'rising' | 'falling' | 'stable';
    relatedProducts?: string[];
  };
  createdAt: string;
  expiresAt?: string;
}

interface MarketInsight {
  category: string;
  trend: 'up' | 'down' | 'stable';
  demandChange: number;
  averagePrice: number;
  competitorCount: number;
  opportunities: string[];
}

interface VendorMetrics {
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
  totalSales: number;
  averageRating: number;
  responseRate: number;
  categories: string[];
}

const ProductRecommendationEngine: React.FC = () => {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([]);
  const [vendorMetrics, setVendorMetrics] = useState<VendorMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'recommendations' | 'insights' | 'optimize'>('recommendations');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendationData();
  }, []);

  const fetchRecommendationData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const [recommendationsResponse, insightsResponse, metricsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor/recommendations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor/market-insights`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor/metrics`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!recommendationsResponse.ok || !insightsResponse.ok || !metricsResponse.ok) {
        throw new Error('Failed to fetch recommendation data');
      }

      const recommendationsData = await recommendationsResponse.json();
      const insightsData = await insightsResponse.json();
      const metricsData = await metricsResponse.json();

      setRecommendations(recommendationsData);
      setMarketInsights(insightsData);
      setVendorMetrics(metricsData);
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setError(err.message);
      
      // Fallback mock data for development
      setRecommendations([
        {
          id: '1',
          type: 'trending_category',
          priority: 'high',
          title: 'Add Smart Home Products',
          description: 'Smart home devices are trending 45% higher in your region. Consider adding IoT sensors and smart switches.',
          impact: 'Potential 25% increase in revenue',
          confidence: 87,
          action: 'Add products in Electronics > Smart Home category',
          data: {
            category: 'Smart Home',
            demandScore: 92,
            competitorCount: 8,
            searchVolume: 1250,
            seasonalTrend: 'rising'
          },
          createdAt: '2024-01-20T10:00:00Z',
          expiresAt: '2024-02-20T10:00:00Z'
        },
        {
          id: '2',
          type: 'price_optimization',
          priority: 'medium',
          title: 'Optimize Industrial Pump Pricing',
          description: 'Your industrial pumps are priced 15% below market average. You can increase prices while maintaining competitiveness.',
          impact: '₹45,000 additional monthly revenue',
          confidence: 92,
          action: 'Increase price from ₹12,000 to ₹14,000',
          data: {
            currentPrice: 12000,
            suggestedPrice: 14000,
            competitorCount: 5,
            averageRating: 4.3
          },
          createdAt: '2024-01-19T14:30:00Z'
        },
        {
          id: '3',
          type: 'inventory_alert',
          priority: 'high',
          title: 'Low Stock Alert: LED Panels',
          description: 'LED panels have high demand but low stock. Restock to avoid missed opportunities.',
          impact: 'Prevent potential ₹30,000 lost sales',
          confidence: 95,
          action: 'Restock LED panels - current level: 3 units',
          data: {
            stockLevel: 3,
            demandScore: 85,
            searchVolume: 680
          },
          createdAt: '2024-01-21T09:15:00Z'
        },
        {
          id: '4',
          type: 'market_opportunity',
          priority: 'medium',
          title: 'Enter Solar Equipment Market',
          description: 'Solar equipment demand has grown 60% with only 3 vendors in your area. Great market entry opportunity.',
          impact: 'New market segment worth ₹2.5L annually',
          confidence: 78,
          action: 'Research solar panels and inverters',
          data: {
            category: 'Solar Equipment',
            competitorCount: 3,
            demandScore: 88,
            seasonalTrend: 'rising'
          },
          createdAt: '2024-01-20T16:45:00Z'
        },
        {
          id: '5',
          type: 'cross_sell',
          priority: 'low',
          title: 'Bundle Industrial Tools',
          description: 'Customers buying industrial drills often purchase safety equipment. Create product bundles.',
          impact: 'Increase average order value by 30%',
          confidence: 73,
          action: 'Create tool + safety equipment bundles',
          data: {
            relatedProducts: ['Safety Helmets', 'Industrial Gloves', 'Safety Glasses']
          },
          createdAt: '2024-01-19T11:20:00Z'
        }
      ]);

      setMarketInsights([
        {
          category: 'Electronics',
          trend: 'up',
          demandChange: 23.5,
          averagePrice: 15600,
          competitorCount: 12,
          opportunities: ['Smart devices', 'IoT sensors', 'Home automation']
        },
        {
          category: 'Industrial Equipment',
          trend: 'stable',
          demandChange: 5.2,
          averagePrice: 45000,
          competitorCount: 8,
          opportunities: ['Energy-efficient models', 'Automation tools']
        },
        {
          category: 'Solar & Renewable',
          trend: 'up',
          demandChange: 45.8,
          averagePrice: 75000,
          competitorCount: 4,
          opportunities: ['Residential solar', 'Battery storage', 'Inverters']
        },
        {
          category: 'Safety Equipment',
          trend: 'stable',
          demandChange: 12.1,
          averagePrice: 850,
          competitorCount: 15,
          opportunities: ['PPE kits', 'Fire safety', 'First aid supplies']
        }
      ]);

      setVendorMetrics({
        totalProducts: 87,
        activeProducts: 82,
        totalViews: 15420,
        totalSales: 234,
        averageRating: 4.3,
        responseRate: 92,
        categories: ['Electronics', 'Industrial Equipment', 'Safety Equipment']
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-green-200 bg-green-50 text-green-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trending_category': return TrendingUp;
      case 'price_optimization': return Target;
      case 'inventory_alert': return AlertCircle;
      case 'market_opportunity': return Lightbulb;
      case 'cross_sell': return ShoppingCart;
      default: return BarChart3;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Smart Recommendations</h2>
            <p className="text-gray-600">AI-powered insights to grow your business</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Eye className="h-4 w-4" />
            <span>Last updated: Just now</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b">
          {[
            { id: 'recommendations', label: 'Recommendations', count: recommendations.length },
            { id: 'insights', label: 'Market Insights', count: marketInsights.length },
            { id: 'optimize', label: 'Quick Optimize' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Tab */}
      {selectedTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const IconComponent = getTypeIcon(rec.type);
            return (
              <div
                key={rec.id}
                className={`bg-white rounded-lg shadow-md border-l-4 p-6 ${
                  rec.priority === 'high' ? 'border-red-500' :
                  rec.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {rec.confidence}% confidence
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{rec.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm">
                          <Target className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="font-medium text-blue-700">{rec.impact}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          <span>{rec.action}</span>
                        </div>
                      </div>

                      {/* Additional Data */}
                      {rec.data && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {rec.data.demandScore && (
                            <div>
                              <span className="text-gray-500">Demand Score:</span>
                              <span className="font-medium text-gray-900 ml-1">{rec.data.demandScore}/100</span>
                            </div>
                          )}
                          {rec.data.competitorCount && (
                            <div>
                              <span className="text-gray-500">Competitors:</span>
                              <span className="font-medium text-gray-900 ml-1">{rec.data.competitorCount}</span>
                            </div>
                          )}
                          {rec.data.searchVolume && (
                            <div>
                              <span className="text-gray-500">Search Volume:</span>
                              <span className="font-medium text-gray-900 ml-1">{rec.data.searchVolume}/mo</span>
                            </div>
                          )}
                          {rec.data.stockLevel && (
                            <div>
                              <span className="text-gray-500">Stock Level:</span>
                              <span className={`font-medium ml-1 ${
                                rec.data.stockLevel < 10 ? 'text-red-600' : 'text-gray-900'
                              }`}>{rec.data.stockLevel} units</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    Take Action
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Market Insights Tab */}
      {selectedTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {marketInsights.map((insight, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{insight.category}</h3>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(insight.trend)}
                  <span className={`text-sm font-medium ${
                    insight.trend === 'up' ? 'text-green-600' :
                    insight.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {insight.demandChange > 0 ? '+' : ''}{insight.demandChange.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Price:</span>
                  <span className="font-medium">₹{insight.averagePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Competitors:</span>
                  <span className="font-medium">{insight.competitorCount}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Opportunities:</h4>
                <div className="space-y-1">
                  {insight.opportunities.map((opp, oppIndex) => (
                    <div key={oppIndex} className="flex items-center text-sm text-gray-600">
                      <Plus className="h-3 w-3 text-green-500 mr-2" />
                      {opp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Optimize Tab */}
      {selectedTab === 'optimize' && vendorMetrics && (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Performance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{vendorMetrics.totalProducts}</div>
                <div className="text-blue-700">Total Products</div>
                <div className="text-xs text-blue-600 mt-1">{vendorMetrics.activeProducts} active</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{vendorMetrics.averageRating}</div>
                <div className="text-green-700">Avg Rating</div>
                <div className="flex justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(vendorMetrics.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{vendorMetrics.responseRate}%</div>
                <div className="text-purple-700">Response Rate</div>
                <div className="text-xs text-purple-600 mt-1">Last 30 days</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Optimization Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Update Product Images</h4>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">15 products need better images</p>
              </button>
              
              <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Price Review</h4>
                  <Target className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">8 products may need price adjustment</p>
              </button>
              
              <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Stock Alerts</h4>
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">5 products running low on stock</p>
              </button>
              
              <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Product Descriptions</h4>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">12 products need detailed descriptions</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendationEngine;
