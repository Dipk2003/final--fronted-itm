'use client';

import React, { useState, useEffect } from 'react';
import { AddProductForm, ProductList, ExcelImport } from '@/modules/vendor';
import { productAPI } from '@/shared/services/productApi';
import PriceUpdateModal from './PriceUpdateModal';

interface VendorProductsProps {
  initialView?: 'list' | 'add' | 'excel';
}

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export default function VendorProducts({ initialView = 'list' }: VendorProductsProps) {
  const [activeView, setActiveView] = useState(initialView);
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddPriceModal, setShowAddPriceModal] = useState(false);
  const [productsNeedingPrice, setProductsNeedingPrice] = useState<any[]>([]);

  const handleAddPriceAction = async () => {
    try {
      console.log('💰 Fetching products that need pricing...');
      const response = await productAPI.getMyProducts(0, 1000);
      const products = response.content || [];
      
      // Filter products without price or with price = 0
      const needsPricing = products.filter(p => !p.price || p.price === 0 || p.price === null);
      
      console.log(`Found ${needsPricing.length} products that need pricing`);
      setProductsNeedingPrice(needsPricing);
      setShowAddPriceModal(true);
    } catch (error) {
      console.error('❌ Error fetching products for pricing:', error);
      // Fallback: show modal anyway to allow manual entry
      setShowAddPriceModal(true);
    }
  };

  const fetchProductStats = async () => {
    try {
      setLoadingStats(true);
      console.log('📊 Fetching vendor product stats...');
      
      // Fetch products to calculate stats
      const response = await productAPI.getMyProducts(0, 1000); // Get all products for stats
      const products = response.content || [];
      
      console.log('✅ Successfully fetched products for stats:', products.length);
      
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.isActive).length;
      const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;
      const outOfStockProducts = products.filter(p => p.stock === 0).length;
      
      setStats({
        totalProducts,
        activeProducts,
        lowStockProducts,
        outOfStockProducts
      });
    } catch (error: any) {
      console.error('❌ Error fetching product stats:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url
      });
      
      // Keep default values of 0 on error - don't crash the component
      console.log('🛡️ Using default stats due to API error');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchProductStats();
  }, [activeView]); // Refresh stats when switching views

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <span>📦</span>
            <span>Product Management</span>
            {stats.totalProducts > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                {stats.totalProducts} products
              </span>
            )}
          </h2>
          <p className="text-gray-600 mt-1">Manage your products, pricing, and inventory</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              activeView === 'list'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>📋</span>
            <span>Manage Products</span>
          </button>
          <button
            onClick={() => setActiveView('add')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              activeView === 'add'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>➕</span>
            <span>Add Product</span>
          </button>
          <button
            onClick={() => setActiveView('excel')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              activeView === 'excel'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>📊</span>
            <span>Bulk Import</span>
          </button>
          <button 
            onClick={() => handleAddPriceAction()}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all"
          >
            <span>💰</span>
            <span>Add Price Now</span>
          </button>
        </div>
      </div>

      {/* Product Alerts */}
      {stats.totalProducts > 23 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-orange-500 text-2xl">⚠️</span>
            <div>
              <h3 className="text-orange-800 font-medium">Products Missing Price Details</h3>
              <p className="text-orange-700 text-sm">
                You have {stats.totalProducts} products with missing price details. 
                Buyers are likely to show interest in products with price.
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Add Price Now
                </button>
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-blue-900">
                {loadingStats ? (
                  <span className="animate-pulse bg-blue-200 rounded w-12 h-8 inline-block"></span>
                ) : (
                  stats.totalProducts
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active Products</p>
              <p className="text-2xl font-bold text-green-900">
                {loadingStats ? (
                  <span className="animate-pulse bg-green-200 rounded w-12 h-8 inline-block"></span>
                ) : (
                  stats.activeProducts
                )}
              </p>
              <p className="text-xs text-green-600 mt-1">Live & Selling</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-lg border border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">No Price</p>
              <p className="text-2xl font-bold text-orange-900">
                {loadingStats ? (
                  <span className="animate-pulse bg-orange-200 rounded w-12 h-8 inline-block"></span>
                ) : (
                  Math.floor(stats.totalProducts * 0.6) // Mock: 60% have no price
                )}
              </p>
              <p className="text-xs text-orange-600 mt-1">Need Pricing</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Low Score</p>
              <p className="text-2xl font-bold text-red-900">
                {loadingStats ? (
                  <span className="animate-pulse bg-red-200 rounded w-12 h-8 inline-block"></span>
                ) : (
                  Math.floor(stats.totalProducts * 0.2) // Mock: 20% have low score
                )}
              </p>
              <p className="text-xs text-red-600 mt-1">Need Improvement</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📉</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Based on Active View */}
      <div className="bg-white rounded-lg border border-gray-200">
        {activeView === 'list' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">All Products</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home & Garden">Home & Garden</option>
                </select>
              </div>
            </div>
            <ProductList searchTerm={searchTerm} selectedCategory={selectedCategory} />
          </div>
        )}

        {activeView === 'add' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6">Add New Product</h3>
            <AddProductForm />
          </div>
        )}

        {activeView === 'excel' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6">Bulk Import Products</h3>
            <ExcelImport 
              onProductsUpdated={() => {
                // Force refresh stats and switch to list view
                fetchProductStats();
                setActiveView('list');
                // Force a re-render of the entire component
                window.location.reload();
              }}
            />
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Product Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Product "Wireless Earbuds" was added</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Added</span>
          </div>
          
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Product "Laptop Stand" was updated</p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Updated</span>
          </div>
          
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Stock updated for "USB Cable"</p>
              <p className="text-xs text-gray-500">6 hours ago</p>
            </div>
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Stock Update</span>
          </div>
        </div>
      </div>

      {/* Price Update Modal */}
      <PriceUpdateModal
        isOpen={showAddPriceModal}
        onClose={() => setShowAddPriceModal(false)}
        products={productsNeedingPrice}
        onProductsUpdated={() => {
          // Refresh stats after price updates
          fetchProductStats();
          // If we're on list view, also refresh the product list
          if (activeView === 'list') {
            // Force a re-render of the ProductList component
            window.location.reload();
          }
        }}
      />
    </div>
  );
}
