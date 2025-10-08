'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/shared/components/Card';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';
import MultiSelect from '@/shared/components/MultiSelect';
import { Button } from '@/shared/components/Button';
import Checkbox from '@/shared/components/Checkbox';
import RangeSlider from '@/shared/components/RangeSlider';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FilterIcon,
  SearchIcon,
  XIcon
} from '@heroicons/react/outline';
import { advancedFeaturesService, type SearchFilters as ServiceSearchFilters, type SearchResponse, type SearchSuggestion } from '@/services/advancedFeaturesService';

interface SearchFilters {
  query: string;
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  minRating: number | null;
  specifications: Record<string, string[]>;
  city: string;
  state: string;
  inStockOnly: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface Aggregations {
  categories: { [key: string]: number };
  brands: { [key: string]: number };
  priceRanges: { [key: string]: number };
  cities: { [key: string]: number };
  states: { [key: string]: number };
  ratings: { [key: string]: number };
}

const AdvancedProductSearch: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    brands: [],
    priceRange: [0, 100000],
    minRating: null,
    specifications: {},
    city: '',
    state: '',
    inStockOnly: false,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const [aggregations, setAggregations] = useState<Aggregations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['categories', 'price']));
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);

  useEffect(() => {
    if (!searchParams) return;
    
    // Load initial filters from URL
    const query = searchParams.get('q') || '';
    const categories = searchParams.getAll('category');
    const brands = searchParams.getAll('brand');
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 100000;
    const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : null;
    const city = searchParams.get('city') || '';
    const state = searchParams.get('state') || '';
    const inStockOnly = searchParams.get('inStock') === 'true';
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Load specifications from URL
    const specs: Record<string, string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('spec_')) {
        const specName = key.replace('spec_', '');
        specs[specName] = value.split(',');
      }
    }

    setFilters({
      query,
      categories,
      brands,
      priceRange: [minPrice, maxPrice],
      minRating,
      specifications: specs,
      city,
      state,
      inStockOnly,
      sortBy,
      sortOrder
    });

    // Load initial aggregations and perform search
    loadAggregations();
    if (query) {
      performSearch(query);
    }
  }, [searchParams]);

  const loadAggregations = async () => {
    try {
      // Use the advanced features service to get search data
      // This will provide facets/aggregations from the search response
      const response = await advancedFeaturesService.search('', {
        limit: 0 // Just get facets, no results
      });
      
      // Transform facets to aggregations format
      const transformedAggregations: Aggregations = {
        categories: {},
        brands: {},
        priceRanges: {},
        cities: {},
        states: {},
        ratings: {}
      };
      
      response.facets.categories.forEach(cat => {
        transformedAggregations.categories[cat.name] = cat.count;
      });
      
      response.facets.vendors.forEach(vendor => {
        transformedAggregations.brands[vendor.name] = vendor.count;
      });
      
      response.facets.locations.forEach(loc => {
        transformedAggregations.cities[loc.name] = loc.count;
      });
      
      response.facets.ratings.forEach(rating => {
        transformedAggregations.ratings[`${rating.rating}+ Stars`] = rating.count;
      });
      
      setAggregations(transformedAggregations);
    } catch (error) {
      console.error('Error loading aggregations:', error);
      // Fallback aggregations for development
      setAggregations({
        categories: { 'Electronics': 1250, 'Industrial': 890, 'Automotive': 650 },
        brands: { 'Samsung': 420, 'LG': 380, 'Sony': 320 },
        priceRanges: { '0-1000': 500, '1000-5000': 800, '5000+': 300 },
        cities: { 'Mumbai': 400, 'Delhi': 350, 'Bangalore': 300 },
        states: { 'Maharashtra': 500, 'Delhi': 400, 'Karnataka': 350 },
        ratings: { '4+ Stars': 800, '3+ Stars': 600, '2+ Stars': 400, '1+ Stars': 200 }
      });
    }
  };
  
  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Convert component filters to service filters
      const serviceFilters: ServiceSearchFilters = {
        category: filters.categories,
        priceMin: filters.priceRange[0],
        priceMax: filters.priceRange[1],
        rating: filters.minRating || undefined,
        location: [filters.city, filters.state].filter(Boolean),
        inStock: filters.inStockOnly,
        sortBy: filters.sortBy === 'price' ? 
          (filters.sortOrder === 'asc' ? 'price_asc' : 'price_desc') : 
          filters.sortBy as any
      };
      
      const response = await advancedFeaturesService.search(query, serviceFilters);
      setSearchResults(response);
      
      // Save search query for analytics
      advancedFeaturesService.saveSearchQuery(query, serviceFilters);
      advancedFeaturesService.saveRecentSearch(query);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      return;
    }
    
    try {
      const suggestions = await advancedFeaturesService.getSearchSuggestions(query, 8);
      setSearchSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    
    if (filters.query) params.set('q', filters.query);
    filters.categories.forEach(cat => params.append('category', cat));
    filters.brands.forEach(brand => params.append('brand', brand));
    params.set('minPrice', filters.priceRange[0].toString());
    params.set('maxPrice', filters.priceRange[1].toString());
    if (filters.minRating !== null) params.set('minRating', filters.minRating.toString());
    if (filters.city) params.set('city', filters.city);
    if (filters.state) params.set('state', filters.state);
    if (filters.inStockOnly) params.set('inStock', 'true');
    if (filters.sortBy !== 'relevance') {
      params.set('sortBy', filters.sortBy);
      params.set('sortOrder', filters.sortOrder);
    }

    // Add specifications to URL
    Object.entries(filters.specifications).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(`spec_${key}`, values.join(','));
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSpecificationChange = (name: string, values: string[]) => {
    setFilters(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: values
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      categories: [],
      brands: [],
      priceRange: [0, 100000],
      minRating: null,
      specifications: {},
      city: '',
      state: '',
      inStockOnly: false,
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
    router.push('/search');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Filters Sidebar */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <FilterIcon className="h-5 w-5 mr-2" />
                Filters
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-600"
              >
                Clear All
              </Button>
            </div>

            {/* Categories */}
            <div className="border-b pb-4 mb-4">
              <button
                onClick={() => toggleSection('categories')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <span className="font-medium">Categories</span>
                {expandedSections.has('categories') ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('categories') && (
                <MultiSelect
                  options={aggregations?.categories ? 
                    Object.entries(aggregations.categories).map(([name, count]) => ({
                      label: `${name} (${count})`,
                      value: name
                    })) : []
                  }
                  value={filters.categories}
                  onChange={(value) => handleFilterChange('categories', value)}
                  className="w-full"
                />
              )}
            </div>

            {/* Price Range */}
            <div className="border-b pb-4 mb-4">
              <button
                onClick={() => toggleSection('price')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <span className="font-medium">Price Range</span>
                {expandedSections.has('price') ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('price') && (
                <>
                  <RangeSlider
                    min={0}
                    max={100000}
                    step={100}
                    value={filters.priceRange}
                    onChange={(value) => handleFilterChange('priceRange', value)}
                  />
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                </>
              )}
            </div>

            {/* Brands */}
            <div className="border-b pb-4 mb-4">
              <button
                onClick={() => toggleSection('brands')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <span className="font-medium">Brands</span>
                {expandedSections.has('brands') ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('brands') && (
                <MultiSelect
                  options={aggregations?.brands ? 
                    Object.entries(aggregations.brands).map(([name, count]) => ({
                      label: `${name} (${count})`,
                      value: name
                    })) : []
                  }
                  value={filters.brands}
                  onChange={(value) => handleFilterChange('brands', value)}
                  className="w-full"
                />
              )}
            </div>

            {/* Location */}
            <div className="border-b pb-4 mb-4">
              <button
                onClick={() => toggleSection('location')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <span className="font-medium">Location</span>
                {expandedSections.has('location') ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('location') && (
                <div className="space-y-2">
                  <Select
                    options={aggregations?.states ? 
                      Object.keys(aggregations.states).map(state => ({
                        label: state,
                        value: state
                      })) : []
                    }
                    value={filters.state}
                    onChange={(value) => handleFilterChange('state', value)}
                    placeholder="Select State"
                    className="w-full mb-2"
                  />
                  <Select
                    options={aggregations?.cities ? 
                      Object.keys(aggregations.cities).map(city => ({
                        label: city,
                        value: city
                      })) : []
                    }
                    value={filters.city}
                    onChange={(value) => handleFilterChange('city', value)}
                    placeholder="Select City"
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="border-b pb-4 mb-4">
              <button
                onClick={() => toggleSection('rating')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <span className="font-medium">Rating</span>
                {expandedSections.has('rating') ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('rating') && (
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <Checkbox
                        checked={filters.minRating === rating}
                        onChange={() => handleFilterChange('minRating', rating)}
                      />
                      <span className="ml-2">{rating}+ Stars</span>
                      {aggregations?.ratings && (
                        <span className="ml-auto text-gray-500">
                          ({aggregations.ratings[`${rating}+ Stars`] || 0})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              <div className="flex items-center">
                <Checkbox
                  checked={filters.inStockOnly}
                  onChange={(checked) => handleFilterChange('inStockOnly', checked)}
                />
                <span className="ml-2">In Stock Only</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Results */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                value={filters.query}
                onChange={(e) => {
                  const newQuery = e.target.value;
                  handleFilterChange('query', newQuery);
                  loadSuggestions(newQuery);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    performSearch(filters.query);
                    setSearchSuggestions([]);
                  }
                }}
                placeholder="Search products, brands, or categories..."
                className="pl-10"
              />
              <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              
              {/* Search Suggestions Dropdown */}
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${suggestion.id}`}
                      onClick={() => {
                        handleFilterChange('query', suggestion.text);
                        performSearch(suggestion.text);
                        setSearchSuggestions([]);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <span className={`px-2 py-1 text-xs rounded ${
                        suggestion.type === 'product' ? 'bg-blue-100 text-blue-800' :
                        suggestion.type === 'category' ? 'bg-green-100 text-green-800' :
                        suggestion.type === 'vendor' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {suggestion.type}
                      </span>
                      <span>{suggestion.text}</span>
                      {suggestion.count && (
                        <span className="ml-auto text-gray-500 text-sm">({suggestion.count})</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button 
              onClick={() => performSearch(filters.query)}
              className="px-6"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
            <Select
              options={[
                { label: 'Relevance', value: 'relevance' },
                { label: 'Price: Low to High', value: 'price_asc' },
                { label: 'Price: High to Low', value: 'price_desc' },
                { label: 'Rating', value: 'rating' },
                { label: 'Most Recent', value: 'recent' }
              ]}
              value={filters.sortBy + (filters.sortBy === 'price' ? '_' + filters.sortOrder : '')}
              onChange={(value) => {
                const stringValue = typeof value === 'string' ? value : (value as any)?.target?.value;
                if (stringValue === 'price_asc') {
                  handleFilterChange('sortBy', 'price');
                  handleFilterChange('sortOrder', 'asc');
                } else if (stringValue === 'price_desc') {
                  handleFilterChange('sortBy', 'price');
                  handleFilterChange('sortOrder', 'desc');
                } else {
                  handleFilterChange('sortBy', stringValue);
                }
                // Re-search with new sort order if we have results
                if (searchResults && filters.query) {
                  setTimeout(() => performSearch(filters.query), 100);
                }
              }}
              className="w-48"
            />
          </div>
        </div>

        {/* Active Filters */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {filters.categories.map((category) => (
              <div
                key={category}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                <span>{category}</span>
                <button
                  onClick={() => handleFilterChange(
                    'categories',
                    filters.categories.filter(c => c !== category)
                  )}
                  className="ml-1"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            {filters.brands.map((brand) => (
              <div
                key={brand}
                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                <span>{brand}</span>
                <button
                  onClick={() => handleFilterChange(
                    'brands',
                    filters.brands.filter(b => b !== brand)
                  )}
                  className="ml-1"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            {Object.entries(filters.specifications).map(([key, values]) =>
              values.map((value) => (
                <div
                  key={`${key}-${value}`}
                  className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => handleSpecificationChange(
                      key,
                      values.filter(v => v !== value)
                    )}
                    className="ml-1"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
            {filters.minRating && (
              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center">
                <span>{filters.minRating}+ Stars</span>
                <button
                  onClick={() => handleFilterChange('minRating', null)}
                  className="ml-1"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            {(filters.city || filters.state) && (
              <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center">
                <span>{[filters.city, filters.state].filter(Boolean).join(', ')}</span>
                <button
                  onClick={() => {
                    handleFilterChange('city', '');
                    handleFilterChange('state', '');
                  }}
                  className="ml-1"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        )}
        
        {searchResults && !isLoading && (
          <div>
            {/* Search Results Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {searchResults.total.toLocaleString()} results for "{searchResults.query}"
                </h3>
                <span className="text-sm text-gray-500">
                  Search took {searchResults.processingTime}ms
                </span>
              </div>
            </div>
            
            {/* Search Results Grid */}
            {searchResults.results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.results.map((result) => (
                  <Card key={`${result.type}-${result.id}`} className="hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      {result.image && (
                        <img 
                          src={result.image} 
                          alt={result.title}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                      )}
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{result.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${
                          result.type === 'product' ? 'bg-blue-100 text-blue-800' :
                          result.type === 'vendor' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {result.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{result.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          {result.price && (
                            <span className="text-lg font-bold text-green-600">
                              ₹{result.price.toLocaleString()}
                            </span>
                          )}
                          {result.vendor && (
                            <span className="text-sm text-gray-500">by {result.vendor}</span>
                          )}
                        </div>
                        
                        {result.rating && (
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm font-medium ml-1">{result.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full mt-4"
                        onClick={() => window.open(result.url, '_blank')}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
                <Button onClick={() => {
                  clearFilters();
                  setSearchResults(null);
                }}>
                  Clear All Filters
                </Button>
              </div>
            )}
            
            {/* Pagination */}
            {searchResults.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  disabled={searchResults.page === 1}
                  onClick={() => {
                    const newFilters = { ...filters, page: searchResults.page - 1 };
                    setFilters(newFilters);
                    performSearch(filters.query);
                  }}
                >
                  Previous
                </Button>
                
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {searchResults.page} of {searchResults.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  disabled={searchResults.page === searchResults.totalPages}
                  onClick={() => {
                    const newFilters = { ...filters, page: searchResults.page + 1 };
                    setFilters(newFilters);
                    performSearch(filters.query);
                  }}
                >
                  Next
                </Button>
              </div>
            )}
            
            {/* Search Suggestions */}
            {searchResults.suggestions.length > 0 && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Related searches:</h4>
                <div className="flex flex-wrap gap-2">
                  {searchResults.suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => {
                        handleFilterChange('query', suggestion.text);
                        performSearch(suggestion.text);
                      }}
                      className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Recent Searches */}
        {!searchResults && !isLoading && (
          <div className="py-8">
            <div className="text-center mb-8">
              <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start your search</h3>
              <p className="text-gray-600">Enter a product name, category, or brand to begin</p>
            </div>
            
            {(() => {
              const recentSearches = advancedFeaturesService.getRecentSearches();
              return recentSearches.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-3">Recent Searches:</h4>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleFilterChange('query', search);
                          performSearch(search);
                        }}
                        className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => advancedFeaturesService.clearRecentSearches()}
                    className="text-sm text-gray-500 hover:text-gray-700 mt-3"
                  >
                    Clear recent searches
                  </button>
                </div>
              ) : null;
            })()
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedProductSearch;
