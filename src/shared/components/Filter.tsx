'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter as FilterIcon } from 'lucide-react';
import { api } from '@/lib/api';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'select';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

interface FilterProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
  className?: string;
}

export function Filter({ onFiltersChange, initialFilters = {}, className = '' }: FilterProps) {
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['category', 'price']));
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [categoriesResponse, vendorsResponse] = await Promise.all([
        api.get('/api/categories'),
        api.get('/api/vendors')
      ]);

      const categories = categoriesResponse.data.map((cat: any) => ({
        id: cat.id,
        label: cat.name,
        count: cat.productCount
      }));

      const vendors = vendorsResponse.data.map((vendor: any) => ({
        id: vendor.id,
        label: vendor.businessName || vendor.name,
        count: vendor.productCount
      }));

      setFilterGroups([
        {
          id: 'category',
          label: 'Categories',
          type: 'checkbox',
          options: categories
        },
        {
          id: 'vendor',
          label: 'Vendors',
          type: 'checkbox',
          options: vendors
        },
        {
          id: 'price',
          label: 'Price Range',
          type: 'range',
          min: 0,
          max: 1000000,
          step: 1000
        },
        {
          id: 'rating',
          label: 'Rating',
          type: 'radio',
          options: [
            { id: '4', label: '4 Stars & Above' },
            { id: '3', label: '3 Stars & Above' },
            { id: '2', label: '2 Stars & Above' },
            { id: '1', label: '1 Star & Above' }
          ]
        },
        {
          id: 'inStock',
          label: 'Availability',
          type: 'checkbox',
          options: [
            { id: 'true', label: 'In Stock' },
            { id: 'false', label: 'Out of Stock' }
          ]
        }
      ]);
    } catch (error) {
      console.error('Error loading filter options:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleFilterChange = (groupId: string, value: any, type: string) => {
    const newFilters = { ...filters };

    if (type === 'checkbox') {
      if (!newFilters[groupId]) {
        newFilters[groupId] = [];
      }
      if (newFilters[groupId].includes(value)) {
        newFilters[groupId] = newFilters[groupId].filter((v: any) => v !== value);
      } else {
        newFilters[groupId] = [...newFilters[groupId], value];
      }
      if (newFilters[groupId].length === 0) {
        delete newFilters[groupId];
      }
    } else if (type === 'radio') {
      if (newFilters[groupId] === value) {
        delete newFilters[groupId];
      } else {
        newFilters[groupId] = value;
      }
    } else if (type === 'range') {
      newFilters[groupId] = value;
    }

    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const clearFilter = (groupId: string) => {
    const newFilters = { ...filters };
    delete newFilters[groupId];
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).length;
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FilterIcon className="mr-2" size={20} />
          Filters
        </h3>
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([groupId, value]) => {
              const group = filterGroups.find(g => g.id === groupId);
              if (!group) return null;

              const renderFilterTag = () => {
                if (Array.isArray(value)) {
                  return value.map(v => {
                    const option = group.options?.find(opt => opt.id === v);
                    return (
                      <span
                        key={v}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {option?.label || v}
                        <button
                          onClick={() => handleFilterChange(groupId, v, group.type)}
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  });
                } else if (group.type === 'range') {
                  return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {group.label}: ₹{value.min?.toLocaleString()} - ₹{value.max?.toLocaleString()}
                      <button
                        onClick={() => clearFilter(groupId)}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                } else {
                  const option = group.options?.find(opt => opt.id === value);
                  return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {option?.label || value}
                      <button
                        onClick={() => clearFilter(groupId)}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                }
              };

              return renderFilterTag();
            })}
          </div>
        </div>
      )}

      {/* Filter Groups */}
      <div className="space-y-4">
        {filterGroups.map((group) => (
          <div key={group.id} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <span className="font-medium text-gray-900">{group.label}</span>
              {expandedGroups.has(group.id) ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>

            {expandedGroups.has(group.id) && (
              <div className="mt-2 space-y-2">
                {group.type === 'checkbox' && group.options?.map((option) => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters[group.id]?.includes(option.id) || false}
                      onChange={() => handleFilterChange(group.id, option.id, group.type)}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                    {option.count && (
                      <span className="text-sm text-gray-500 ml-2">({option.count})</span>
                    )}
                  </label>
                ))}

                {group.type === 'radio' && group.options?.map((option) => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="radio"
                      name={group.id}
                      checked={filters[group.id] === option.id}
                      onChange={() => handleFilterChange(group.id, option.id, group.type)}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}

                {group.type === 'range' && (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters[group.id]?.min || ''}
                        onChange={(e) =>
                          handleFilterChange(group.id, {
                            ...filters[group.id],
                            min: parseInt(e.target.value) || 0
                          }, group.type)
                        }
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters[group.id]?.max || ''}
                        onChange={(e) =>
                          handleFilterChange(group.id, {
                            ...filters[group.id],
                            max: parseInt(e.target.value) || group.max
                          }, group.type)
                        }
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
