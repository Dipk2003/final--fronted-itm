'use client';

import { useState, useEffect } from 'react';
import { adminProductAPI, TopSellingProduct } from '@/lib/adminApi';
import TopProductItem from "./TopProductItem"

export default function TopSellingProductList() {
  const [products, setProducts] = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const topProducts = await adminProductAPI.getTopSellingProducts();
      setProducts(topProducts.slice(0, 5)); // Show top 5 products
    } catch (err) {
      console.error('Error fetching top products:', err);
      setError('Failed to fetch top selling products');
    } finally {
      setLoading(false);
    }
  };

  const formatRevenue = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-md border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-md border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="text-red-400 mr-2">❌</div>
            <div className="text-red-800">{error}</div>
          </div>
          <button 
            onClick={fetchTopProducts}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white p-6 rounded-md border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📦</div>
          <p>No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
      <div className="space-y-4">
        {products.map((productData, i) => (
          <TopProductItem 
            key={productData.product.id} 
            name={productData.product.name}
            vendor={productData.product.vendor.name || productData.product.vendor.businessName || 'Unknown Vendor'}
            sold={productData.totalSold}
            revenue={formatRevenue(productData.totalRevenue)}
            rating={Math.round(productData.rating * 10) / 10}
          />
        ))}
      </div>
    </div>
  );
}
