'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart } from 'lucide-react';
import { api } from '@/shared/utils/apiClient';
import { dynamicDataService } from '@/shared/services/dynamicDataService';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  vendor?: {
    name: string;
    location?: string;
  };
  inStock: boolean;
}

interface SearchFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  rating?: number;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams ? searchParams.get('q') || '' : '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Search products function
  const searchProducts = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const searchData = {
        query: query.trim(),
        page,
        limit: 20,
        ...filters
      };
      
      console.log('🔍 Starting product search for:', query);
      const response = await dynamicDataService.products.searchProducts(query, searchData);
      
      if (page === 1) {
        setProducts(response.products || []);
      } else {
        setProducts(prev => [...prev, ...(response.products || [])]);
      }
      
      setTotalResults(response.total || 0);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search products. Please try again.');
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      searchProducts(searchQuery, 1);
      setCurrentPage(1);
    }
  };

  // Load initial search results
  useEffect(() => {
    if (initialQuery) {
      searchProducts(initialQuery, 1);
    }
  }, [initialQuery, searchProducts]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    if (searchQuery) {
      searchProducts(searchQuery, 1);
      setCurrentPage(1);
    }
  };

  // Load more products
  const loadMore = () => {
    const nextPage = currentPage + 1;
    searchProducts(searchQuery, nextPage);
    setCurrentPage(nextPage);
  };

  // Add to cart
  const handleAddToCart = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await dynamicDataService.cart.addToCart(productId, 1);
      console.log('Product added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  // Add to wishlist
  const handleAddToWishlist = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await dynamicDataService.wishlist.addToWishlist(productId);
      console.log('Product added to wishlist');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products, services, suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Search Results Info */}
          {searchQuery && (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Search Results for "{searchQuery}"
                </h1>
                <p className="text-gray-600">
                  {totalResults} products found
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                >
                  <Grid size={16} className={viewMode === 'grid' ? 'text-blue-600' : 'text-gray-600'} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                >
                  <List size={16} className={viewMode === 'list' ? 'text-blue-600' : 'text-gray-600'} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (INR)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin || ''}
                    onChange={(e) => handleFilterChange({ priceMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax || ''}
                    onChange={(e) => handleFilterChange({ priceMax: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange({ category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="industrial">Industrial</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="food">Food & Beverages</option>
                </select>
              </div>
              
              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating || ''}
                  onChange={(e) => handleFilterChange({ rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1">
            {loading && currentPage === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                {/* Results Grid */}
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
                }>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => router.push(`/products/${product.id}`)}
                      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                        viewMode === 'list' ? 'flex gap-4 p-4' : 'p-6'
                      }`}
                    >
                      {/* Product Image */}
                      <div className={`bg-gray-100 rounded-md flex items-center justify-center overflow-hidden relative ${
                        viewMode === 'list' ? 'w-32 h-32 shrink-0' : 'h-40 mb-4'
                      }`}>
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                        
                        {/* Quick Actions */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleAddToWishlist(product.id, e)}
                            className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                          >
                            <Heart className="w-3 h-3 text-gray-600 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                          {!product.inStock && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(product.rating!)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">({product.reviewCount})</span>
                          </div>
                        )}
                        
                        {/* Vendor */}
                        {product.vendor && (
                          <p className="text-xs text-gray-500 mb-3">
                            by {product.vendor.name} • {product.vendor.location}
                          </p>
                        )}
                        
                        {/* Price and Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-blue-600 font-bold text-lg">
                              {formatPrice(product.price)}
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="text-gray-400 text-sm line-through">
                                {formatPrice(product.originalPrice)}
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={(e) => handleAddToCart(product.id, e)}
                            disabled={!product.inStock}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Load More Button */}
                {products.length < totalResults && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Load More Products'}
                    </button>
                  </div>
                )}
              </>
            ) : searchQuery ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found for "{searchQuery}"
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={() => router.push('/categories')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse All Categories
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start your search
                </h3>
                <p className="text-gray-600">
                  Enter a search term to find products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

// Helper function (same as ProductGrid)
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
