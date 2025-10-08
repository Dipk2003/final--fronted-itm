'use client';

import React, { useState } from 'react';
import ServiceProviderCard from './ServiceProviderCard';
import DirectoryFilters from './DirectoryFilters';
import { ServiceProvider, DirectorySearchFilters } from '../types/directory';
import { ChevronLeft, ChevronRight, Grid, List, SortAsc, Filter } from 'lucide-react';
import { Button } from '@/shared/components';

interface ServiceProviderListProps {
  providers: ServiceProvider[];
  total: number;
  currentPage: number;
  totalPages: number;
  filters: DirectorySearchFilters;
  isLoading: boolean;
  onFilterChange: (filters: DirectorySearchFilters) => void;
  onPageChange: (page: number) => void;
  onContactSupplier: (providerId: string) => void;
  onViewMobileNumber: (providerId: string) => void;
  searchQuery?: string;
  searchLocation?: string;
}

const ServiceProviderList: React.FC<ServiceProviderListProps> = ({
  providers,
  total,
  currentPage,
  totalPages,
  filters,
  isLoading,
  onFilterChange,
  onPageChange,
  onContactSupplier,
  onViewMobileNumber,
  searchQuery,
  searchLocation
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(filters.sortBy || 'relevance');

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy as any);
    onFilterChange({
      ...filters,
      sortBy: newSortBy as any,
      page: 1
    });
  };

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'responseRate', label: 'Response Rate' },
    { value: 'yearsInBusiness', label: 'Years in Business' },
    { value: 'name', label: 'Name (A-Z)' }
  ];

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: React.ReactElement[] = [];
    const showPages = 5; // Number of page buttons to show
    const startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 text-sm font-medium border ${
            i === currentPage
              ? 'z-10 bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      );
    }

    return (
      <nav className="flex justify-center mt-8" aria-label="Pagination">
        <div className="flex">{pages}</div>
      </nav>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search Results Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery && searchLocation
                ? `${searchQuery} in ${searchLocation}`
                : searchQuery || searchLocation || 'Service Providers'}
            </h1>
            <p className="text-gray-600">
              Found {total.toLocaleString()} service providers
              {searchLocation && ` in ${searchLocation}`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid size={20} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.rating || filters.isGSTVerified || filters.category) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            {filters.rating && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Rating: {filters.rating}+ stars
                <button
                  onClick={() => onFilterChange({ ...filters, rating: undefined, page: 1 })}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.isGSTVerified && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                GST Verified
                <button
                  onClick={() => onFilterChange({ ...filters, isGSTVerified: false, page: 1 })}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {filters.category}
                <button
                  onClick={() => onFilterChange({ ...filters, category: undefined, page: 1 })}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        {showFilters && (
          <div className="w-1/4 min-w-[280px]">
            <DirectoryFilters
              filters={filters}
              onFilterChange={onFilterChange}
            />
          </div>
        )}

        {/* Main Content */}
        <div className={`${showFilters ? 'flex-1' : 'w-full'}`}>
          {providers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-500 text-lg mb-2">No service providers found</div>
              <p className="text-gray-400">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <>
              {/* Provider Cards */}
              <div className={`space-y-6 ${viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}`}>
                {providers.map((provider) => (
                  <ServiceProviderCard
                    key={provider.id}
                    provider={provider}
                    onContactSupplier={onContactSupplier}
                    onViewMobileNumber={onViewMobileNumber}
                  />
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}

              {/* Results Info */}
              <div className="mt-6 text-center text-sm text-gray-500">
                Showing {((currentPage - 1) * (filters.limit || 10)) + 1} to {Math.min(currentPage * (filters.limit || 10), total)} of {total.toLocaleString()} results
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderList;
