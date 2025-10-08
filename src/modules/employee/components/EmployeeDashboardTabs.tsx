'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import DataManagementOverview from './DataManagementOverview';
import CategoryManagement from './CategoryManagement';
import LocationManagement from './LocationManagement';
import EmployeeAnalytics from './EmployeeAnalytics';
import { AuthGuard } from '@/modules/core';

const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊', color: 'blue' },
  { id: 'categories', label: 'Categories', icon: '📋', color: 'green' },
  { id: 'locations', label: 'Locations', icon: '📍', color: 'purple' },
  { id: 'analytics', label: 'Analytics', icon: '📈', color: 'indigo' },
  { id: 'tasks', label: 'My Tasks', icon: '✅', color: 'emerald' },
];

export default function EmployeeDashboardTabs() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DataManagementOverview onTabChange={setActiveTab} />;
      case 'categories':
        return <CategoryManagement />;
      case 'locations':
        return <LocationManagement />;
      case 'analytics':
        return <EmployeeAnalytics />;
      case 'tasks':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                3 Pending
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">Update Electronics Category</h3>
                    <p className="text-sm text-gray-600">Add new subcategories for mobile accessories</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Due: Today</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">Verify Mumbai Pincodes</h3>
                    <p className="text-sm text-gray-600">Cross-check postal codes for accuracy</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Due: Tomorrow</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">Data Quality Review</h3>
                    <p className="text-sm text-gray-600">Weekly data accuracy check</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Due: This Week</span>
              </div>
            </div>
          </div>
        );
      default:
        return <DataManagementOverview onTabChange={setActiveTab} />;
    }
  };

  return (
    <AuthGuard allowedRoles={['ROLE_EMPLOYEE', 'EMPLOYEE', 'ROLE_DATA_ENTRY', 'DATA_ENTRY']}>
      <div className="w-full bg-gray-50 min-h-screen">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  E
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Employee Panel</h1>
                  <p className="text-xs text-gray-500">Hi, {user?.name || 'Employee'}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {/* Mobile Menu */}
            {showMobileMenu && (
              <div className="border-t border-gray-200 bg-white">
                <div className="grid grid-cols-2 gap-2 p-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowMobileMenu(false);
                      }}
                      className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      E
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Employee Dashboard</h1>
                      <p className="text-sm text-gray-500">Welcome, {user?.name || 'Employee'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors">
                      <span className="text-sm text-gray-700">Help</span>
                      <span className="text-blue-600">❓</span>
                    </button>
                  </div>
                  
                  <div className="relative">
                    <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                      <span className="text-sm">🔔</span>
                      <span className="text-sm">Notifications</span>
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                      activeTab === tab.id
                        ? 'text-indigo-600 border-indigo-600 bg-indigo-50'
                        : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className={`max-w-7xl mx-auto ${isMobile ? 'px-2 py-4' : 'px-4 py-6'}`}>
          {renderTabContent()}
        </div>
      </div>
    </AuthGuard>
  );
}
