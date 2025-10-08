'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MegaMenu } from '@/shared/components';
import { Search, Grid, List, Filter } from 'lucide-react';

const CategoriesPage = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Browse All Categories
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Explore thousands of products across hundreds of business categories from verified suppliers
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-lg focus:ring-4 focus:ring-white/30 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Stats Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">20+</div>
                <div className="text-sm text-gray-600">Main Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3000+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-gray-600">Verified Suppliers</div>
              </div>
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
        </div>
      </div>

      {/* Categories Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <button 
                  onClick={() => router.push('/')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Home
                </button>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-900">Categories</li>
            </ol>
          </nav>

          {viewMode === 'grid' ? (
            // Grid View - Use the existing MegaMenu component
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <MegaMenu />
            </div>
          ) : (
            // List View - Simple category list
            <div className="space-y-4">
              {[
                'Building & Construction',
                'Agriculture & Farming', 
                'Electrical Equipment',
                'Electronics & Electrical',
                'R&D and Testing Labs',
                'Business & Audit Services',
                'Automobile & Automotive',
                'Chemicals, Dyes & Solvents',
                'Food & Beverages',
                'Pharma & Medical',
                'Industrial Supplies',
                'Mechanical Parts'
              ].map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-600 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category}</h3>
                        <p className="text-sm text-gray-600">Explore products in this category</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push(`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Products
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Post your requirements and let suppliers come to you with the best quotes
          </p>
          <button 
            onClick={() => router.push('/post-requirement')}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Post Your Requirement
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
