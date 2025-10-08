'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Slider,
  Select,
  MultiSelect,
  Checkbox,
  RangeSlider,
  Button,
  Input,
} from '@/shared/components';
import { FilterIcon, SearchIcon, XIcon } from '@heroicons/react/outline';
import { debounce } from 'lodash';

interface SearchFilters {
  query: string;
  categories: string[];
  priceRange: [number, number];
  city: string;
  state: string;
  inStock: boolean;
  minOrderQuantity: number;
  specifications: Record<string, string[]>;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const AdvancedSearch: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    priceRange: [0, 100000],
    city: '',
    state: '',
    inStock: false,
    minOrderQuantity: 1,
    specifications: {},
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesRes, locationsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/locations')
        ]);
        
        const categories = await categoriesRes.json();
        const locations = await locationsRes.json();
        
        setAvailableCategories(categories);
        setCities(locations.cities);
        setStates(locations.states);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  // Handle URL params
  useEffect(() => {
    if (!searchParams) return;
    
    const query = searchParams.get('q') || '';
    const categories = searchParams.getAll('category');
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 100000;
    const city = searchParams.get('city') || '';
    const state = searchParams.get('state') || '';
    const inStock = searchParams.get('inStock') === 'true';
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    setFilters(prevFilters => ({
      ...prevFilters,
      query,
      categories,
      priceRange: [minPrice, maxPrice],
      city,
      state,
      inStock,
      sortBy,
      sortOrder
    }));
  }, [searchParams]);

  const updateSearchParams = debounce((newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.query) params.set('q', newFilters.query);
    newFilters.categories.forEach(cat => params.append('category', cat));
    params.set('minPrice', newFilters.priceRange[0].toString());
    params.set('maxPrice', newFilters.priceRange[1].toString());
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.state) params.set('state', newFilters.state);
    if (newFilters.inStock) params.set('inStock', 'true');
    if (newFilters.sortBy !== 'relevance') params.set('sortBy', newFilters.sortBy);
    if (newFilters.sortOrder !== 'desc') params.set('sortOrder', newFilters.sortOrder);

    router.push(`/search?${params.toString()}`);
  }, 500);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: SearchFilters = {
      query: '',
      categories: [],
      priceRange: [0, 100000],
      city: '',
      state: '',
      inStock: false,
      minOrderQuantity: 1,
      specifications: {},
      sortBy: 'relevance',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    updateSearchParams(defaultFilters);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            placeholder="Search products, brands, or categories..."
            className="w-full pl-10"
          />
          <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Button onClick={() => updateSearchParams(filters)} loading={isLoading}>
          Search
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories
          </label>
          <MultiSelect
            options={availableCategories.map(cat => ({ label: cat, value: cat }))}
            value={filters.categories}
            onChange={(value) => handleFilterChange('categories', value)}
            placeholder="Select categories"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <RangeSlider
            min={0}
            max={100000}
            value={filters.priceRange}
            onChange={(value) => handleFilterChange('priceRange', value)}
            step={100}
          />
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500">₹{filters.priceRange[0]}</span>
            <span className="text-sm text-gray-500">₹{filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <Select
              options={cities.map(city => ({ label: city, value: city }))}
              value={filters.city}
              onChange={(value) => handleFilterChange('city', value)}
              placeholder="Select city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <Select
              options={states.map(state => ({ label: state, value: state }))}
              value={filters.state}
              onChange={(value) => handleFilterChange('state', value)}
              placeholder="Select state"
            />
          </div>
        </div>

        {/* Additional Filters */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox
              checked={filters.inStock}
              onChange={(checked) => handleFilterChange('inStock', checked)}
              id="inStock"
            />
            <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
              In Stock Only
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <Select
              options={[
                { label: 'Relevance', value: 'relevance' },
                { label: 'Price: Low to High', value: 'price_asc' },
                { label: 'Price: High to Low', value: 'price_desc' },
                { label: 'Rating', value: 'rating' },
                { label: 'Most Recent', value: 'recent' }
              ]}
              value={filters.sortBy}
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
              }}
            />
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.categories.map((category) => (
          <div
            key={category}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
          >
            <span>{category}</span>
            <XIcon
              className="h-4 w-4 ml-1 cursor-pointer"
              onClick={() => handleFilterChange('categories', 
                filters.categories.filter(c => c !== category))}
            />
          </div>
        ))}
        {(filters.city || filters.state) && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
            <span>{[filters.city, filters.state].filter(Boolean).join(', ')}</span>
            <XIcon
              className="h-4 w-4 ml-1 cursor-pointer"
              onClick={() => {
                handleFilterChange('city', '');
                handleFilterChange('state', '');
              }}
            />
          </div>
        )}
        {filters.inStock && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
            <span>In Stock Only</span>
            <XIcon
              className="h-4 w-4 ml-1 cursor-pointer"
              onClick={() => handleFilterChange('inStock', false)}
            />
          </div>
        )}
        {(filters.sortBy !== 'relevance' || filters.sortOrder !== 'desc') && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
            <span>
              Sort: {filters.sortBy} {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </span>
            <XIcon
              className="h-4 w-4 ml-1 cursor-pointer"
              onClick={() => {
                handleFilterChange('sortBy', 'relevance');
                handleFilterChange('sortOrder', 'desc');
              }}
            />
          </div>
        )}
        {(filters.categories.length > 0 || filters.city || filters.state || 
          filters.inStock || filters.sortBy !== 'relevance' || 
          filters.sortOrder !== 'desc') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-gray-600"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
