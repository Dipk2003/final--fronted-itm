'use client';

import React, { useState, useEffect } from 'react';
import { analyticsApi, DashboardAnalytics, SystemMetrics } from '@/lib/analyticsApi';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, metricsData] = await Promise.all([
        analyticsApi.getDashboardAnalytics(),
        analyticsApi.getSystemMetrics()
      ]);
      
      setAnalytics(analyticsData);
      setSystemMetrics(metricsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchAnalytics}
          className="mt-2 text-red-800 hover:text-red-900 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color = 'blue' }: {
    title: string;
    value: number;
    icon: string;
    color?: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-full bg-${color}-100`}>
          <span className={`text-${color}-600 text-2xl`}>{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <button
          onClick={fetchAnalytics}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Refresh
        </button>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={analytics?.totalUsers || 0} icon="👥" color="blue" />
        <StatCard title="Total Vendors" value={analytics?.totalVendors || 0} icon="🏪" color="green" />
        <StatCard title="Total Products" value={analytics?.totalProducts || 0} icon="📦" color="purple" />
        <StatCard title="Total Orders" value={analytics?.totalOrders || 0} icon="🛒" color="orange" />
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User & Vendor Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">User & Vendor Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Verified Vendors</span>
              <span className="font-semibold">{analytics?.verifiedVendors || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vendor Verification Rate</span>
              <span className="font-semibold">
                {analytics?.totalVendors ? 
                  ((analytics.verifiedVendors / analytics.totalVendors) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Product Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Product Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Products</span>
              <span className="font-semibold">{analytics?.activeProducts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Approved Products</span>
              <span className="font-semibold">{analytics?.approvedProducts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Approval Rate</span>
              <span className="font-semibold">
                {analytics?.totalProducts ? 
                  ((analytics.approvedProducts / analytics.totalProducts) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Inquiry Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Inquiry Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Inquiries</span>
              <span className="font-semibold">{analytics?.totalInquiries || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Resolved Inquiries</span>
              <span className="font-semibold">{analytics?.resolvedInquiries || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Resolution Rate</span>
              <span className="font-semibold">
                {analytics?.totalInquiries ? 
                  ((analytics.resolvedInquiries / analytics.totalInquiries) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Review Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Review Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Reviews</span>
              <span className="font-semibold">{analytics?.totalReviews || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Approved Reviews</span>
              <span className="font-semibold">{analytics?.approvedReviews || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Approval Rate</span>
              <span className="font-semibold">
                {analytics?.totalReviews ? 
                  ((analytics.approvedReviews / analytics.totalReviews) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      {systemMetrics && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Memory</p>
              <p className="text-lg font-semibold">{analyticsApi.formatMemorySize(systemMetrics.totalMemory)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Used Memory</p>
              <p className="text-lg font-semibold">{analyticsApi.formatMemorySize(systemMetrics.usedMemory)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Free Memory</p>
              <p className="text-lg font-semibold">{analyticsApi.formatMemorySize(systemMetrics.freeMemory)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">CPU Cores</p>
              <p className="text-lg font-semibold">{systemMetrics.availableProcessors}</p>
            </div>
          </div>
          
          {/* Memory Usage Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Memory Usage</span>
              <span>{analyticsApi.getMemoryUsagePercentage(systemMetrics).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${analyticsApi.getMemoryUsagePercentage(systemMetrics)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
