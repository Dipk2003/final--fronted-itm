'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, MessageCircle, Package } from 'lucide-react';

interface BuyerStats {
  totalOrders: number;
  activeInquiries: number;
  wishlistItems: number;
  cartItems: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function BuyerStatsPanel() {
  const [stats, setStats] = useState<BuyerStats>({
    totalOrders: 0,
    activeInquiries: 0,
    wishlistItems: 0,
    cartItems: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBuyerStats();
  }, []);

  const fetchBuyerStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyer/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch buyer statistics');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
      console.error('Error fetching buyer stats:', err);
      
      // Fallback to mock data for development
      setStats({
        totalOrders: 12,
        activeInquiries: 3,
        wishlistItems: 18,
        cartItems: 5,
        pendingOrders: 2,
        completedOrders: 10
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
            <div className="animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 lg:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="text-red-600">⚠️</span>
          </div>
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Stats</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchBuyerStats}
            className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <Package className="w-6 h-6" />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900'
    },
    {
      title: 'Active Inquiries',
      value: stats.activeInquiries,
      icon: <MessageCircle className="w-6 h-6" />,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-900'
    },
    {
      title: 'Wishlist Items',
      value: stats.wishlistItems,
      icon: <Heart className="w-6 h-6" />,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-900'
    },
    {
      title: 'Cart Items',
      value: stats.cartItems,
      icon: <ShoppingCart className="w-6 h-6" />,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-900'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center ${card.iconColor}`}>
                {card.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>{card.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Breakdown</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div>
              <p className="text-sm text-yellow-700 font-medium">Pending Orders</p>
              <p className="text-xl font-bold text-yellow-900">{stats.pendingOrders}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600">⏳</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
            <div>
              <p className="text-sm text-emerald-700 font-medium">Completed</p>
              <p className="text-xl font-bold text-emerald-900">{stats.completedOrders}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-emerald-600">✅</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}