'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AuthGuard } from '@/modules/core';
import {
  BuyerDashboardTabs,
  BuyerStatsPanel,
  ProductBrowser,
  OrderManagement,
  InquiryTracker,
  WishlistManager,
  BuyerProfile
} from '@/modules/buyer';

export default function BuyerDashboard() {
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
    { id: 'browse', label: 'Browse Products', icon: '🛍️' },
    { id: 'orders', label: 'My Orders', icon: '📦' },
    { id: 'inquiries', label: 'Inquiries', icon: '💬' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <BuyerStatsPanel />
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-2 gap-8'}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                <OrderManagement compact={true} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Inquiries</h3>
                <InquiryTracker compact={true} />
              </div>
            </div>
          </div>
        );
      case 'browse':
        return <ProductBrowser />;
      case 'orders':
        return <OrderManagement />;
      case 'inquiries':
        return <InquiryTracker />;
      case 'wishlist':
        return <WishlistManager />;
      case 'profile':
        return <BuyerProfile />;
      default:
        return (
          <div className="space-y-8">
            <BuyerStatsPanel />
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-2 gap-8'}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                <OrderManagement compact={true} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Inquiries</h3>
                <InquiryTracker compact={true} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <AuthGuard allowedRoles={['ROLE_USER', 'USER', 'ROLE_BUYER', 'BUYER']}>
      <div className="w-full bg-gray-50 min-h-screen">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                  B
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Buyer Dashboard</h1>
                  <p className="text-xs text-gray-500">Hi, {user?.name || 'Buyer'}</p>
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
                          ? 'bg-purple-600 text-white shadow-md'
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
                <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'Buyer'}! 🛍️</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-700">Active Account</span>
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
            </div>
            
            <BuyerDashboardTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              tabs={tabs}
            />
            
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
  );
}