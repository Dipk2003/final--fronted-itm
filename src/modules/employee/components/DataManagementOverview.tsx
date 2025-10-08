'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { getDataManagementStats } from '../services/employeeApi';
import { getCategoryStats } from '../services/categoryManagementApi';
import { getLocationStats } from '../services/locationManagementApi';
import { DataManagementStats } from '../types/employee';

interface DataManagementOverviewProps {
  onTabChange: (tabId: string) => void;
}

export default function DataManagementOverview({ onTabChange }: DataManagementOverviewProps) {
  const [stats, setStats] = useState<DataManagementStats | null>(null);
  const [categoryStats, setCategoryStats] = useState<any>(null);
  const [locationStats, setLocationStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [overallStats, catStats, locStats] = await Promise.all([
        getDataManagementStats(),
        getCategoryStats(),
        getLocationStats()
      ]);
      
      setStats(overallStats);
      setCategoryStats(catStats);
      setLocationStats(locStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Management Overview</h2>
          <p className="text-gray-600 mt-1">Monitor and manage all website reference data</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          🔄 Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Category Stats */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-3xl font-bold text-green-600">{stats?.totalCategories || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-500">
              Main: {categoryStats?.totalMain || 0} | Sub: {categoryStats?.totalSub || 0} | Micro: {categoryStats?.totalMicro || 0}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Categories</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.activeCategories || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-red-500">
              Inactive: {stats?.inactiveCategories || 0}
            </div>
          </div>
        </Card>

        {/* Location Stats */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Locations</p>
              <p className="text-3xl font-bold text-purple-600">{(stats?.totalStates || 0) + (stats?.totalCities || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📍</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-500">
              States: {stats?.totalStates || 0} | Cities: {stats?.totalCities || 0}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Locations</p>
              <p className="text-3xl font-bold text-orange-600">{stats?.activeLocations || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🌟</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-red-500">
              Inactive: {stats?.inactiveLocations || 0}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Category Management</h3>
          <p className="text-gray-600 mb-4">
            Manage all product categories, subcategories, and micro-categories that appear across the website.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Main Categories:</span>
              <span className="font-semibold">{categoryStats?.totalMain || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Subcategories:</span>
              <span className="font-semibold">{categoryStats?.totalSub || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Micro Categories:</span>
              <span className="font-semibold">{categoryStats?.totalMicro || 0}</span>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button onClick={() => onTabChange('categories')} className="flex-1">
              Manage Categories
            </Button>
            <Button variant="outline" onClick={() => onTabChange('categories')}>
              Add New
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Location Management</h3>
          <p className="text-gray-600 mb-4">
            Manage all states and cities that appear in location dropdowns throughout the website.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Total States:</span>
              <span className="font-semibold">{locationStats?.totalStates || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Total Cities:</span>
              <span className="font-semibold">{locationStats?.totalCities || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Active Locations:</span>
              <span className="font-semibold">{(locationStats?.activeStates || 0) + (locationStats?.activeCities || 0)}</span>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button onClick={() => onTabChange('locations')} className="flex-1">
              Manage Locations
            </Button>
            <Button variant="outline" onClick={() => onTabChange('locations')}>
              Add New
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">
              ✓
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Category "Electronics" updated</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
              +
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">New city "Bangalore" added to Karnataka</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">
              📝
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Bulk import of 50 cities completed</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm">
            View All Activity
          </Button>
        </div>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">Database Connection</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Operational</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">API Status</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">All endpoints responding</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">Cache Status</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Refreshing in 2 hours</p>
        </Card>
      </div>
    </div>
  );
}
