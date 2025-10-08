'use client';

import React, { useState, useEffect } from 'react';
import { DirectorySearchFilters, ServiceCategory } from '../types/directory';
import { directoryApi } from '../services/directoryApi';
import { Card } from '@/shared/components';
import { Filter, X, Star, Shield, CheckCircle, MapPin, DollarSign } from 'lucide-react';

interface DirectoryFiltersProps {
  filters: DirectorySearchFilters;
  onFilterChange: (filters: DirectorySearchFilters) => void;
}

const DirectoryFilters: React.FC<DirectoryFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const categoryData = await directoryApi.getServiceCategories();
      setCategories(categoryData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterUpdate = (newFilter: Partial<DirectorySearchFilters>) => {
    onFilterChange({
      ...filters,
      ...newFilter,
      page: 1 // Reset to first page when filters change
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      query: filters.query,
      location: filters.location,
      page: 1,
      limit: filters.limit,
      sortBy: filters.sortBy
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.rating,
    filters.responseRate,
    filters.isGSTVerified,
    filters.isTrustSEALVerified,
    filters.isVerifiedSupplier,
    filters.priceRange?.min || filters.priceRange?.max
  ].filter(Boolean).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <X size={14} className="mr-1" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Service Category Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Service Category</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading categories...</div>
            ) : (
              categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category.slug}
                    onChange={() => handleFilterUpdate({ category: category.slug })}
                    className="text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">{category.name}</span>
                  <span className="text-xs text-gray-500">({category.count})</span>
                </label>
              ))
            )}
            {filters.category && (
              <button
                onClick={() => handleFilterUpdate({ category: undefined })}
                className="text-sm text-blue-600 hover:text-blue-800 ml-6"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Star size={16} className="mr-2 text-yellow-500" />
            Minimum Rating
          </h4>
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <label key={rating} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => handleFilterUpdate({ rating })}
                  className="text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${
                        i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-700 ml-1">{rating}+ stars</span>
                </div>
              </label>
            ))}
            {filters.rating && (
              <button
                onClick={() => handleFilterUpdate({ rating: undefined })}
                className="text-sm text-blue-600 hover:text-blue-800 ml-6"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>

        {/* Response Rate Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Minimum Response Rate</h4>
          <div className="space-y-2">
            {[90, 80, 70, 60].map((rate) => (
              <label key={rate} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="responseRate"
                  checked={filters.responseRate === rate}
                  onChange={() => handleFilterUpdate({ responseRate: rate })}
                  className="text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{rate}% or higher</span>
              </label>
            ))}
            {filters.responseRate && (
              <button
                onClick={() => handleFilterUpdate({ responseRate: undefined })}
                className="text-sm text-blue-600 hover:text-blue-800 ml-6"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>

        {/* Verification Filters */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Verification Status</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isGSTVerified || false}
                onChange={(e) => handleFilterUpdate({ isGSTVerified: e.target.checked })}
                className="text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm text-gray-700">GST Verified</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isTrustSEALVerified || false}
                onChange={(e) => handleFilterUpdate({ isTrustSEALVerified: e.target.checked })}
                className="text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <Shield size={16} className="text-blue-600" />
                <span className="text-sm text-gray-700">TrustSEAL Verified</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isVerifiedSupplier || false}
                onChange={(e) => handleFilterUpdate({ isVerifiedSupplier: e.target.checked })}
                className="text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-purple-600" />
                <span className="text-sm text-gray-700">Verified Plus Supplier</span>
              </div>
            </label>
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <MapPin size={16} className="mr-2 text-gray-600" />
            Location
          </h4>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter city or state"
              value={filters.city || ''}
              onChange={(e) => handleFilterUpdate({ city: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <DollarSign size={16} className="mr-2 text-gray-600" />
            Budget Range
          </h4>
          <div className="space-y-2">
            {[
              { label: 'Under ₹10,000', min: 0, max: 10000 },
              { label: '₹10,000 - ₹50,000', min: 10000, max: 50000 },
              { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
              { label: '₹1,00,000 - ₹5,00,000', min: 100000, max: 500000 },
              { label: 'Above ₹5,00,000', min: 500000, max: 0 }
            ].map((range, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    filters.priceRange?.min === range.min && 
                    (range.max === 0 || filters.priceRange?.max === range.max)
                  }
                  onChange={() => handleFilterUpdate({
                    priceRange: { min: range.min, max: range.max === 0 ? 999999999 : range.max }
                  })}
                  className="text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
            {filters.priceRange && (
              <button
                onClick={() => handleFilterUpdate({ priceRange: undefined })}
                className="text-sm text-blue-600 hover:text-blue-800 ml-6"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>

        {/* Years in Business Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Years in Business</h4>
          <div className="space-y-2">
            <select
              value={filters.sortBy === 'yearsInBusiness' ? 'desc' : ''}
              onChange={(e) => {
                if (e.target.value === 'desc') {
                  handleFilterUpdate({ sortBy: 'yearsInBusiness', sortOrder: 'desc' });
                }
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any experience</option>
              <option value="desc">Most experienced first</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DirectoryFilters;
