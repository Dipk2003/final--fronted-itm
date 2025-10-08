'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  AdminDashboardTabs,
  AdminStatsPanel,
  TopSellingProductList,
  TicketList,
  LiveChatSupport,
  UserManagement,
  VendorManagement,
  ProductManagement
} from '@/modules/admin';
import { AuthGuard } from '@/modules/core';

export default function AdminDashboard() {
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'vendors', label: 'Vendors', icon: '🏪' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'support', label: 'Support', icon: '🎧' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className={`space-y-${isMobile ? '6' : '8'}`}>
            <AdminStatsPanel />
            <TopSellingProductList />
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return (
          <div className={`bg-white ${isMobile ? 'p-4' : 'p-6'} rounded-lg shadow-md`}>
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-4`}>Order Management</h2>
            <p className="text-gray-600">Order management features coming soon...</p>
          </div>
        );
      case 'support':
        return (
          <div className={`space-y-${isMobile ? '6' : '8'}`}>
            <TicketList />
            <LiveChatSupport />
          </div>
        );
      default:
        return (
          <div className={`space-y-${isMobile ? '6' : '8'}`}>
            <AdminStatsPanel />
            <TopSellingProductList />
          </div>
        );
    }
  };

  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN', 'ADMIN']}>
      <div className="w-full bg-gray-50 min-h-screen">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-xs text-gray-500">Hi, {user?.name || 'Admin'}</p>
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
                          ? 'bg-red-600 text-white shadow-md'
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
          <section className="max-w-7xl mx-auto px-4 py-10 space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome, {user?.name || 'Admin'}! 👋</p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            <AdminDashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="mt-8">
              {renderTabContent()}
            </div>
          </section>
        )}

        {/* Mobile Content */}
        {isMobile && (
          <div className="px-2 py-4">
            {renderTabContent()}
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
