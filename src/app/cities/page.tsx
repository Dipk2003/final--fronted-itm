'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, Loader2, AlertCircle } from 'lucide-react';

interface City {
  id: number;
  name: string;
  stateProvince: string;
  country: string;
  isActive: boolean;
  isMajorCity: boolean;
  supplierCount?: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    content: City[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
}

const CitiesPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [majorCitiesOnly, setMajorCitiesOnly] = useState(false);

  const pageSize = 20;

  // Fetch cities from the backend API
  const fetchCities = async (page: number = 0, search: string = '', majorOnly: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
      });

      if (search.trim()) {
        params.append('search', search.trim());
      }

      if (majorOnly) {
        params.append('isMajorCity', 'true');
      }

      // Always get active cities
      params.append('isActive', 'true');

      const url = `${baseUrl}/api/cities?${params}`;
      console.log('🔍 Fetching cities from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      console.log('📊 API Response:', data);
      
      if (data.success && data.data) {
        setCities(data.data.content || []);
        setTotalPages(data.data.totalPages || 0);
        setTotalElements(data.data.totalElements || 0);
        setCurrentPage(data.data.number || 0);
      } else {
        throw new Error(data.message || 'Failed to fetch cities');
      }
    } catch (err) {
      console.error('🚨 Error fetching cities:', err);
      
      let errorMessage = 'An error occurred while fetching cities';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Cannot connect to backend server. Please ensure the backend is running on http://localhost:8080';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCities(0, searchQuery, majorCitiesOnly);
  }, [searchQuery, majorCitiesOnly]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCities(0, searchQuery, majorCitiesOnly);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    fetchCities(newPage, searchQuery, majorCitiesOnly);
  };

  // Generate supplier count (mock data for display)
  const getSupplierCount = (city: City): number => {
    // Mock supplier counts based on city name hash
    const hash = city.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return Math.floor((hash % 20000) + 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All Cities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse suppliers and manufacturers across all cities in India
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              <label className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={majorCitiesOnly}
                  onChange={(e) => setMajorCitiesOnly(e.target.checked)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Major cities only</span>
              </label>
              
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-wrap gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-600">{totalElements}</div>
                <div className="text-sm text-gray-600">Total Cities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{cities.filter(c => c.isMajorCity).length}</div>
                <div className="text-sm text-gray-600">Major Cities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{Math.ceil(totalPages)}</div>
                <div className="text-sm text-gray-600">Pages</div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error Loading Cities</h3>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => fetchCities(currentPage, searchQuery, majorCitiesOnly)}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 size={48} className="animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading cities...</p>
            </div>
          </div>
        )}

        {/* Cities Grid */}
        {!loading && !error && cities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {cities.map((city) => (
              <a
                key={city.id}
                href={`/city/${encodeURIComponent(city.name)}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-indigo-300 p-6"
              >
                <div className="text-center">
                  {/* City Icon */}
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                    <MapPin className="text-indigo-600" size={24} />
                  </div>
                  
                  {/* City Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {city.name}
                    {city.isMajorCity && (
                      <span className="ml-2 inline-block w-2 h-2 bg-gold-500 rounded-full" title="Major City"></span>
                    )}
                  </h3>
                  
                  {/* Location */}
                  {city.stateProvince && (
                    <p className="text-sm text-gray-500 mb-3">
                      {city.stateProvince}, {city.country}
                    </p>
                  )}
                  
                  {/* Supplier Count */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">
                    <Users size={16} />
                    <span>{getSupplierCount(city).toLocaleString()} suppliers</span>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="w-0 group-hover:w-8 h-0.5 bg-indigo-500 transition-all duration-300 mt-4 mx-auto" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && cities.length === 0 && (
          <div className="text-center py-12">
            <MapPin size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cities Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery.trim() 
                ? `No cities found matching "${searchQuery}"`
                : "No cities available at the moment"
              }
            </p>
            {searchQuery.trim() && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  fetchCities(0, '', majorCitiesOnly);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && cities.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = currentPage <= 2 ? i : currentPage - 2 + i;
              if (pageNum >= totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    pageNum === currentPage
                      ? 'text-white bg-indigo-600 border border-indigo-600'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitiesPage;
