'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  searchService, 
  SearchRequest, 
  SearchProduct, 
  SearchVendor, 
  SearchFilters,
  SearchSortOptions,
  SearchAggregation,
  AutocompleteResult
} from '@/services/searchService';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  StarIcon,
  MapPinIcon,
  TruckIcon,
  CheckBadgeIcon,
  AdjustmentsHorizontalIcon,
  BookmarkIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface AdvancedSearchProps {
  initialQuery?: string;
  initialFilters?: SearchFilters;
  searchType?: 'products' | 'vendors' | 'all';
  showFilters?: boolean;
  compact?: boolean;
}

interface SearchState {
  query: string;
  filters: SearchFilters;
  sort: SearchSortOptions;
  page: number;
  isLoading: boolean;
  results: {
    products: SearchProduct[];
    vendors: SearchVendor[];
    total: number;
    totalPages: number;
  };
  aggregations: SearchAggregation[];
  suggestions: AutocompleteResult[];
  error: string | null;
}

const AdvancedSearchComponent: React.FC<AdvancedSearchProps> = ({
  initialQuery = '',
  initialFilters = {},
  searchType = 'products',
  showFilters = true,
  compact = false
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchState, setSearchState] = useState<SearchState>({
    query: initialQuery,
    filters: initialFilters,
    sort: { field: 'relevance', order: 'desc' },
    page: 1,
    isLoading: false,
    results: {
      products: [],
      vendors: [],
      total: 0,
      totalPages: 0
    },
    aggregations: [],
    suggestions: [],
    error: null
  });

  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Update URL with current search parameters
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    
    if (searchState.query) params.set('q', searchState.query);
    if (searchState.filters.category) params.set('category', searchState.filters.category);
    if (searchState.filters.minPrice) params.set('minPrice', searchState.filters.minPrice.toString());
    if (searchState.filters.maxPrice) params.set('maxPrice', searchState.filters.maxPrice.toString());
    if (searchState.filters.location) params.set('location', searchState.filters.location);
    if (searchState.sort.field !== 'relevance') params.set('sort', searchState.sort.field);
    if (searchState.sort.order !== 'desc') params.set('order', searchState.sort.order);
    if (searchState.page > 1) params.set('page', searchState.page.toString());

    const newUrl = `/search?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [searchState.query, searchState.filters, searchState.sort, searchState.page]);

  // Get autocomplete suggestions
  const getSuggestions = useCallback(async (query: string) => {
    try {
      const suggestions = await searchService.autocomplete(query, searchType);
      setSearchState(prev => ({ ...prev, suggestions }));
      setShowSuggestions(true);
    } catch (error) {
      console.warn('Failed to get suggestions:', error);
    }
  }, [searchType]);

  // Perform search
  const performSearch = useCallback(async () => {
    if (!searchState.query.trim() && Object.keys(searchState.filters).length === 0) {
      return;
    }

    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const searchRequest: SearchRequest = {
        query: searchState.query,
        filters: searchState.filters,
        sort: searchState.sort,
        page: searchState.page - 1, // API uses 0-based indexing
        size: 20,
        includeAggregations: true,
        searchType: searchType
      };

      let response;
      if (searchType === 'products') {
        response = await searchService.searchProducts(searchRequest);
      } else if (searchType === 'vendors') {
        response = await searchService.searchVendors(searchRequest);
      } else {
        response = await searchService.search(searchRequest);
      }

      setSearchState(prev => ({
        ...prev,
        results: {
          products: searchType === 'vendors' ? [] : response.results as SearchProduct[],
          vendors: searchType === 'products' ? [] : response.results as SearchVendor[],
          total: response.total,
          totalPages: response.totalPages
        },
        aggregations: response.aggregations,
        isLoading: false
      }));

      // Update URL
      updateURL();

    } catch (error: any) {
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Search failed'
      }));
    }
  }, [searchState.query, searchState.filters, searchState.sort, searchState.page, searchType, updateURL]);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => {
      const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(null, args), wait);
        };
      };
      return debounce(performSearch, 300);
    },
    [performSearch]
  );

  // Load initial data
  useEffect(() => {
    loadSavedSearches();
    loadSearchHistory();
    
    // Parse URL parameters
    if (searchParams) {
      const urlQuery = searchParams.get('q');
      const urlCategory = searchParams.get('category');
      const urlMinPrice = searchParams.get('minPrice');
      const urlMaxPrice = searchParams.get('maxPrice');
      
      if (urlQuery || urlCategory || urlMinPrice || urlMaxPrice) {
        setSearchState(prev => ({
          ...prev,
          query: urlQuery || prev.query,
          filters: {
            ...prev.filters,
            category: urlCategory || prev.filters.category,
            minPrice: urlMinPrice ? Number(urlMinPrice) : prev.filters.minPrice,
            maxPrice: urlMaxPrice ? Number(urlMaxPrice) : prev.filters.maxPrice
          }
        }));
      }
    }
    
    // Perform initial search if query exists
    if (searchState.query || Object.keys(searchState.filters).length > 0) {
      performSearch();
    }
  }, [searchParams, searchState.query, searchState.filters, performSearch]);

  // Handle search input change
  const handleQueryChange = useCallback((value: string) => {
    setSearchState(prev => ({ ...prev, query: value, page: 1 }));
    
    // Get suggestions
    if (value.length > 2) {
      getSuggestions(value);
    } else {
      setShowSuggestions(false);
    }

    debouncedSearch();
  }, [debouncedSearch, getSuggestions]);

  // Handle filter change
  const handleFilterChange = useCallback((filterKey: keyof SearchFilters, value: any) => {
    setSearchState(prev => ({
      ...prev,
      filters: { ...prev.filters, [filterKey]: value },
      page: 1
    }));
    debouncedSearch();
  }, [debouncedSearch]);

  // Handle sort change
  const handleSortChange = useCallback((sort: SearchSortOptions) => {
    setSearchState(prev => ({ ...prev, sort, page: 1 }));
    performSearch();
  }, [performSearch]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setSearchState(prev => ({ ...prev, page }));
    performSearch();
  }, [performSearch]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      filters: {},
      page: 1
    }));
    debouncedSearch();
  }, [debouncedSearch]);

  // Save current search
  const saveCurrentSearch = async () => {
    if (!searchState.query) return;

    try {
      const searchRequest: SearchRequest = {
        query: searchState.query,
        filters: searchState.filters,
        sort: searchState.sort
      };

      await searchService.saveSearch(`Search: ${searchState.query}`, searchRequest);
      loadSavedSearches();
    } catch (error) {
      console.error('Failed to save search:', error);
    }
  };

  // Load saved searches
  const loadSavedSearches = async () => {
    try {
      const searches = await searchService.getSavedSearches();
      setSavedSearches(searches);
    } catch (error) {
      console.warn('Failed to load saved searches:', error);
    }
  };

  // Load search history
  const loadSearchHistory = () => {
    const history = searchService.getSearchHistory();
    setSearchHistory(history.map(h => h.query));
  };

  // Render filter aggregations
  const renderAggregations = () => (
    <div className="space-y-6">
      {searchState.aggregations.map((agg) => (
        <div key={agg.field} className="space-y-2">
          <h4 className="font-semibold text-gray-900">{agg.label}</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {agg.values.slice(0, 10).map((value) => (
              <label key={value.key} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.selected || false}
                  onChange={(e) => {
                    const currentValue = searchState.filters[agg.field as keyof SearchFilters];
                    if (Array.isArray(currentValue)) {
                      const newValue = e.target.checked
                        ? [...currentValue, value.key]
                        : currentValue.filter(v => v !== value.key);
                      handleFilterChange(agg.field as keyof SearchFilters, newValue);
                    } else {
                      handleFilterChange(agg.field as keyof SearchFilters, e.target.checked ? value.key : undefined);
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex-1">{value.key}</span>
                <span className="text-xs text-gray-500">({value.count})</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Render product result
  const renderProductResult = (product: SearchProduct) => (
    <Card key={product.id} className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>
            
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <span className="text-xl font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">({product.reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{product.vendor.name}</span>
                {product.vendor.verified && (
                  <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
                )}
                <MapPinIcon className="h-4 w-4" />
                <span>{product.vendor.location}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.availability === 'in_stock' ? 'bg-green-100 text-green-800' :
                  product.availability === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.availability.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render vendor result
  const renderVendorResult = (vendor: SearchVendor) => (
    <Card key={vendor.id} className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <img
              src={vendor.logo || '/default-vendor.png'}
              alt={vendor.name}
              className="w-16 h-16 object-cover rounded-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
              {vendor.verified && (
                <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-600">{vendor.companyName}</p>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{vendor.description}</p>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(vendor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({vendor.reviewCount})</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {vendor.totalProducts} Products
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 inline mr-1" />
                {vendor.location.city}, {vendor.location.state}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {vendor.categories.slice(0, 3).map((category) => (
                <span key={category} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {category}
                </span>
              ))}
              {vendor.categories.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{vendor.categories.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder={`Search ${searchType}...`}
                  value={searchState.query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  className="pl-10 pr-4"
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {searchState.isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (searchState.suggestions.length > 0 || searchHistory.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {searchState.suggestions.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs text-gray-500 mb-2">Suggestions</div>
                      {searchState.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer rounded"
                          onClick={() => {
                            handleQueryChange(suggestion.text);
                            setShowSuggestions(false);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <TagIcon className="h-4 w-4 text-gray-400" />
                            <span>{suggestion.text}</span>
                            <span className="text-xs text-gray-500">({suggestion.count})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searchHistory.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500 mb-2">Recent Searches</div>
                      {searchHistory.slice(0, 5).map((query, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer rounded"
                          onClick={() => {
                            handleQueryChange(query);
                            setShowSuggestions(false);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-4 w-4 text-gray-400" />
                            <span>{query}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {showFilters && (
                <Button
                  variant="outline"
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  className="flex items-center space-x-2"
                >
                  <FunnelIcon className="h-4 w-4" />
                  <span>Filters</span>
                  {Object.keys(searchState.filters).length > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                      {Object.keys(searchState.filters).length}
                    </span>
                  )}
                </Button>
              )}

              {searchState.query && (
                <Button
                  variant="outline"
                  onClick={saveCurrentSearch}
                  className="flex items-center space-x-2"
                >
                  <BookmarkIcon className="h-4 w-4" />
                  <span>Save</span>
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {Object.keys(searchState.filters).length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Filters:</span>
              {Object.entries(searchState.filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <span>{key}: {Array.isArray(value) ? value.join(', ') : value.toString()}</span>
                    <button
                      onClick={() => handleFilterChange(key as keyof SearchFilters, undefined)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && showFiltersPanel && (
            <div className="w-64 flex-shrink-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Filters</span>
                    <button
                      onClick={() => setShowFiltersPanel(false)}
                      className="lg:hidden"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Price Range */}
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-gray-900">Price Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={searchState.filters.minPrice || ''}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={searchState.filters.maxPrice || ''}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-gray-900">Location</h4>
                    <Input
                      type="text"
                      placeholder="Enter city or state"
                      value={searchState.filters.location || ''}
                      onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                    />
                  </div>

                  {/* Dynamic Aggregations */}
                  {renderAggregations()}

                  {/* Clear Filters */}
                  {Object.keys(searchState.filters).length > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full mt-4"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div>
                  {searchState.results.total > 0 ? (
                    <p className="text-sm text-gray-600">
                      Showing {((searchState.page - 1) * 20) + 1}-{Math.min(searchState.page * 20, searchState.results.total)} of {searchState.results.total.toLocaleString()} results
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">No results found</p>
                  )}
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={`${searchState.sort.field}-${searchState.sort.order}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    handleSortChange({ field: field as any, order: order as any });
                  }}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="relevance-desc">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="popularity-desc">Most Popular</option>
                  <option value="newest-desc">Newest First</option>
                </select>
              </div>
            </div>

            {/* Error State */}
            {searchState.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{searchState.error}</p>
              </div>
            )}

            {/* Loading State */}
            {searchState.isLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Results */}
            {!searchState.isLoading && (
              <div className="space-y-4">
                {searchType === 'products' && searchState.results.products.map(renderProductResult)}
                {searchType === 'vendors' && searchState.results.vendors.map(renderVendorResult)}
                {searchType === 'all' && (
                  <>
                    {searchState.results.products.map(renderProductResult)}
                    {searchState.results.vendors.map(renderVendorResult)}
                  </>
                )}
              </div>
            )}

            {/* Pagination */}
            {searchState.results.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(searchState.page - 1)}
                    disabled={searchState.page <= 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, searchState.results.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, searchState.page - 2) + i;
                    if (pageNum > searchState.results.totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === searchState.page ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(searchState.page + 1)}
                    disabled={searchState.page >= searchState.results.totalPages}
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchComponent;
