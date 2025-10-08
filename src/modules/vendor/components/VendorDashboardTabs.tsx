'use client';

import React, { useState } from 'react';
import VendorOverview from './VendorOverview';
import VendorProducts from './VendorProducts';
import VendorOrders from './VendorOrders';
import VendorAnalytics from './VendorAnalytics';
import VendorLeads from './VendorLeads';
import VendorProfile from './VendorProfile';
import VendorInvoices from './VendorInvoices';
import VendorInquiries from './VendorInquiries';
import VendorPackagesPage from './VendorPackagesPage';
import TransactionHistory from './TransactionHistory';
import ProductRecommendationEngine from '../../../components/vendor/ProductRecommendationEngine';

const tabs = [
  { id: 'overview', label: 'Dashboard', icon: '🏠', color: 'blue' },
  { id: 'recommendations', label: 'Smart Insights', icon: '🧠', color: 'violet' },
  { id: 'products', label: 'Products', icon: '📦', color: 'green' },
  { id: 'inquiries', label: 'Inquiries', icon: '💬', color: 'purple' },
  { id: 'orders', label: 'Orders', icon: '🛒', color: 'orange' },
  { id: 'invoices', label: 'Invoices', icon: '📄', color: 'indigo' },
  { id: 'analytics', label: 'Analytics', icon: '📈', color: 'pink' },
  { id: 'leads', label: 'Leads', icon: '🎯', color: 'teal' },
  { id: 'packages', label: 'Subscription', icon: '💎', color: 'yellow' },
  { id: 'billing', label: 'Billing', icon: '💳', color: 'cyan' },
  { id: 'profile', label: 'Profile', icon: '👤', color: 'gray' }
];

interface VendorDashboardTabsProps {
  isMobile?: boolean;
}

export default function VendorDashboardTabs({ isMobile = false }: VendorDashboardTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [productView, setProductView] = useState<'list' | 'add' | 'excel'>('list');

  const handleTabChange = (tab: string, subAction?: string) => {
    setActiveTab(tab);
    if (tab === 'products' && subAction) {
      setProductView(subAction as 'list' | 'add' | 'excel');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <VendorOverview onTabChange={handleTabChange} />;
      case 'recommendations':
        return <ProductRecommendationEngine />;
      case 'products':
        return <VendorProducts initialView={productView} />;
      case 'inquiries':
        return <VendorInquiries />;
      case 'orders':
        return <VendorOrders />;
      case 'invoices':
        return <VendorInvoices />;
      case 'analytics':
        return <VendorAnalytics />;
      case 'leads':
        return <VendorLeads />;
      case 'packages':
        return <VendorPackagesPage />;
      case 'billing':
        return <TransactionHistory />;
      case 'profile':
        return <VendorProfile />;
      default:
        return <VendorOverview onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Enhanced Header with Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Seller Dashboard</h1>
                  <p className="text-sm text-gray-500">Manage your business</p>
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
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <span className="text-sm">🔔</span>
                  <span className="text-sm">Notifications</span>
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
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
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? `text-${tab.color}-600 border-${tab.color}-600 bg-${tab.color}-50`
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === 'inquiries' && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">5</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
