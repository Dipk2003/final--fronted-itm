'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Input, Button } from '@/shared/components';
import { directoryApi } from '../services/directoryApi';

interface DirectorySearchProps {
  onSearch: (query: string, location: string, category?: string) => void;
  defaultQuery?: string;
  defaultLocation?: string;
  defaultCategory?: string;
  showFilters?: boolean;
}

const DirectorySearch: React.FC<DirectorySearchProps> = ({
  onSearch,
  defaultQuery = '',
  defaultLocation = '',
  defaultCategory = '',
  showFilters = true
}) => {
  const [query, setQuery] = useState(defaultQuery);
  const [location, setLocation] = useState(defaultLocation);
  const [category, setCategory] = useState(defaultCategory);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Popular service categories for quick search
  const popularCategories = [
    'Land Surveyors',
    'Construction Services',
    'Engineering Consultants',
    'Architectural Services',
    'Interior Designers',
    'Legal Services',
    'CA Services',
    'IT Services',
    'Digital Marketing',
    'Transportation Services'
  ];

  // Popular cities
  const popularCities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
    'Hyderabad', 'Pune', 'Ahmedabad', 'Noida', 'Gurgaon',
    'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore'
  ];

  useEffect(() => {
    // Load popular searches on component mount
    loadPopularSearches();
  }, []);

  const loadPopularSearches = async () => {
    try {
      const searches = await directoryApi.getPopularSearches();
      setPopularSearches(searches);
    } catch (error) {
      console.error('Failed to load popular searches:', error);
    }
  };

  const handleSearch = () => {
    if (!query.trim() && !location.trim()) {
      return;
    }
    onSearch(query.trim(), location.trim(), category);
    setShowSuggestions(false);
  };

  const handleQueryChange = async (value: string) => {
    setQuery(value);
    
    if (value.length > 2) {
      try {
        setIsLoading(true);
        const searchSuggestions = await directoryApi.getSearchSuggestions(value);
        setSuggestions(searchSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to get suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion, location.trim(), category);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      {/* Main Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Find Service Providers Near You
          </h2>
          <p className="text-gray-600">
            Search for businesses, services, and professionals in your area
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Service/Business Search */}
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="What service do you need? (e.g., Land Survey, Construction)"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-4 py-3 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Search */}
          <div className="flex-1">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Enter city or location (e.g., Noida, Delhi)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-4 py-3 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Quick Search Categories */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Services:</h3>
          <div className="flex flex-wrap gap-2">
            {popularCategories.slice(0, 8).map((cat, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(cat)}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Cities */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Cities:</h3>
          <div className="flex flex-wrap gap-2">
            {popularCities.slice(0, 10).map((city, index) => (
              <button
                key={index}
                onClick={() => {
                  setLocation(city);
                  if (query.trim()) {
                    onSearch(query.trim(), city, category);
                  }
                }}
                className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Examples */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Search Examples:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
          <div>• "Land Survey in Noida"</div>
          <div>• "Construction Services in Delhi"</div>
          <div>• "CA Services in Bangalore"</div>
          <div>• "Interior Designer in Mumbai"</div>
        </div>
      </div>
    </div>
  );
};

export default DirectorySearch;
