'use client';

import React, { useState, useEffect } from 'react';
import { ServiceCategory } from '../types/directory';
import { directoryApi } from '../services/directoryApi';
import { Tags, ChevronDown } from 'lucide-react';

interface ServiceCategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

const ServiceCategoryFilter: React.FC<ServiceCategoryFilterProps> = ({
  selectedCategory = '',
  onCategoryChange,
  className = ''
}) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(selectedCategory);
  const [filteredCategories, setFilteredCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setSearchTerm(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const categoryData = await directoryApi.getServiceCategories();
      setCategories(categoryData);
      setFilteredCategories(categoryData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: ServiceCategory) => {
    setSearchTerm(category.name);
    onCategoryChange(category.name);
    setIsOpen(false);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    onCategoryChange(value);
    setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Tags className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="What service do you need?"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-12 pr-10 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <ChevronDown 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No categories found</div>
          ) : (
            <>
              {/* Popular Categories */}
              {!searchTerm && (
                <>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-100">
                    Popular Services
                  </div>
                  {[
                    'Land Surveyors',
                    'Construction Services', 
                    'Engineering Consultants',
                    'Architectural Services',
                    'Legal Services',
                    'CA Services',
                    'IT Services',
                    'Digital Marketing'
                  ].map((service) => (
                    <button
                      key={service}
                      onClick={() => handleCategorySelect({ 
                        id: service, 
                        name: service, 
                        slug: service.toLowerCase().replace(/\s+/g, '-'),
                        description: '',
                        subCategories: [],
                        count: 0
                      })}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-50 last:border-b-0 flex items-center justify-between"
                    >
                      <span>{service}</span>
                      <span className="text-sm text-blue-600">Popular</span>
                    </button>
                  ))}
                  {categories.length > 0 && (
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-100">
                      All Categories
                    </div>
                  )}
                </>
              )}

              {/* Filtered Categories */}
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-500 truncate">
                          {category.description}
                        </div>
                      )}
                    </div>
                    {category.count > 0 && (
                      <span className="text-sm text-gray-500">
                        {category.count} providers
                      </span>
                    )}
                  </div>
                  
                  {/* Subcategories Preview */}
                  {category.subCategories.length > 0 && (
                    <div className="mt-1 text-xs text-gray-400">
                      {category.subCategories.slice(0, 3).map(sub => sub.name).join(', ')}
                      {category.subCategories.length > 3 && '...'}
                    </div>
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ServiceCategoryFilter;
