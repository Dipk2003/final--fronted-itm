'use client';

import React from 'react';
import VendorStatsPanel from './VendorStatsPanel';
import VendorQuickActions from './VendorQuickActions';
import VendorRecentOrders from './VendorRecentOrders';

interface VendorOverviewProps {
  onTabChange?: (tab: string, subAction?: string) => void;
}

export default function VendorOverview({ onTabChange }: VendorOverviewProps) {
  const handleActionClick = (action: string, subAction?: string) => {
    if (onTabChange) {
      onTabChange(action, subAction);
    }
  };
  return (
    <div className="space-y-6">
      {/* Welcome Section - Enhanced */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
              <p className="text-blue-100 text-lg">Ready to grow your business today?</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Today's Date</p>
              <p className="text-white font-semibold">{new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3">
              <p className="text-blue-100 text-sm">Active Since</p>
              <p className="text-white font-bold text-lg">Jan 2023</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3">
              <p className="text-blue-100 text-sm">Member Status</p>
              <p className="text-white font-bold text-lg">⭐ Premium</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3">
              <p className="text-blue-100 text-sm">Response Rate</p>
              <p className="text-white font-bold text-lg">98%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <VendorStatsPanel />

      {/* Quick Actions - Enhanced */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <span>⚡</span>
            <span>Quick Actions</span>
          </h3>
          <span className="text-sm text-gray-500">Get things done faster</span>
        </div>
        <VendorQuickActions onActionClick={handleActionClick} />
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - 2/3 width */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <span>📦</span>
                <span>Recent Orders</span>
              </h3>
              <button 
                onClick={() => handleActionClick('orders')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all →
              </button>
            </div>
            <VendorRecentOrders />
          </div>
        </div>

        {/* Activity Feed - 1/3 width */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <span>📈</span>
              <span>Activity Feed</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-3 border-green-400">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New Order Received</p>
                  <p className="text-xs text-gray-500">#ORD-2024-001 • ₹15,000</p>
                  <p className="text-xs text-green-600">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-3 border-blue-400">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  📝
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Product Updated</p>
                  <p className="text-xs text-gray-500">Laptop Stand pricing</p>
                  <p className="text-xs text-blue-600">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border-l-3 border-orange-400">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  ⚠
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Stock Alert</p>
                  <p className="text-xs text-gray-500">Wireless Mouse - Low stock</p>
                  <p className="text-xs text-orange-600">6 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border-l-3 border-purple-400">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  💬
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New Inquiry</p>
                  <p className="text-xs text-gray-500">JSP India - Bulk order inquiry</p>
                  <p className="text-xs text-purple-600">1 day ago</p>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 text-center text-sm text-gray-500 hover:text-gray-700 py-2">
              View all activity →
            </button>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-green-800">This Month</h4>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📊</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-700">Revenue</span>
              <span className="text-lg font-bold text-green-900">₹1,25,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-700">Orders</span>
              <span className="text-lg font-bold text-green-900">45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-700">New Customers</span>
              <span className="text-lg font-bold text-green-900">12</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-green-300">
            <p className="text-xs text-green-600">📈 +15% from last month</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-blue-800">Top Products</h4>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🏆</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Laptop Stand</span>
              <span className="text-lg font-bold text-blue-900">25 sold</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Wireless Mouse</span>
              <span className="text-lg font-bold text-blue-900">18 sold</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">USB Hub</span>
              <span className="text-lg font-bold text-blue-900">15 sold</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-blue-300">
            <p className="text-xs text-blue-600">🔥 Best performing this month</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-purple-800">Satisfaction</h4>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">⭐</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700">Average Rating</span>
              <span className="text-lg font-bold text-purple-900">4.8/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700">Total Reviews</span>
              <span className="text-lg font-bold text-purple-900">127</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700">Response Rate</span>
              <span className="text-lg font-bold text-purple-900">98%</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-300">
            <p className="text-xs text-purple-600">💯 Excellent customer service</p>
          </div>
        </div>
      </div>
      
      {/* Action Items */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">📋</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-900">Action Items</h3>
            <p className="text-yellow-700 text-sm">Tasks that need your attention</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-orange-500">⚠️</span>
              <span className="text-sm font-medium text-gray-900">23 Products</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Missing price details</p>
            <button 
              onClick={() => handleActionClick('products')}
              className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-full"
            >
              Add Prices
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-500">💬</span>
              <span className="text-sm font-medium text-gray-900">5 New Inquiries</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Waiting for response</p>
            <button 
              onClick={() => handleActionClick('inquiries')}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full"
            >
              Reply Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-500">📦</span>
              <span className="text-sm font-medium text-gray-900">3 Orders</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Ready for shipment</p>
            <button 
              onClick={() => handleActionClick('orders')}
              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full"
            >
              Ship Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-purple-500">📊</span>
              <span className="text-sm font-medium text-gray-900">Profile Score</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">65% - Can be improved</p>
            <button 
              onClick={() => handleActionClick('profile')}
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full"
            >
              Improve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
