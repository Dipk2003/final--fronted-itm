'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  SupportDashboardTabs,
  SupportStatsPanel,
  SLATrackingPanel,
  KnowledgeBasePanel,
  TicketManagement,
  SupportAnalytics
} from '@/modules/support';
import LiveChatInterface from '@/modules/support/components/LiveChatInterface';
import { AuthGuard } from '@/modules/core';

export default function SupportDashboard() {
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
    { id: 'live-chat', label: 'Live Chat', icon: '💬' },
    { id: 'tickets', label: 'Tickets', icon: '🎫' },
    { id: 'sla', label: 'SLA', icon: '⏱️' },
    { id: 'knowledge-base', label: 'Knowledge', icon: '📚' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <SupportStatsPanel />
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-2 gap-8'}`}>
              <SLATrackingPanel />
              <SupportAnalytics />
            </div>
          </div>
        );
      case 'live-chat':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Live Chat Support</h2>
                <p className="text-gray-600">Real-time customer conversations</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
              </div>
            </div>
            <LiveChatInterface />
          </div>
        );
      case 'tickets':
        return <TicketManagement />;
      case 'sla':
        return <SLATrackingPanel detailed={true} />;
      case 'knowledge-base':
        return <KnowledgeBasePanel />;
      case 'analytics':
        return <SupportAnalytics detailed={true} />;
      default:
        return (
          <div className="space-y-8">
            <SupportStatsPanel />
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-2 gap-8'}`}>
              <SLATrackingPanel />
              <SupportAnalytics />
            </div>
          </div>
        );
    }
  };

  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN', 'ADMIN', 'ROLE_SUPPORT', 'SUPPORT']}>
      <div className="w-full bg-gray-50 min-h-screen">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Support Center</h1>
                  <p className="text-xs text-gray-500">Hi, {user?.name || 'Agent'}</p>
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
                          ? 'bg-blue-600 text-white shadow-md'
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
                <h1 className="text-3xl font-bold text-gray-900">Support Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to the Support Center, {user?.name || 'Agent'}! 🎧</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700">Online & Ready</span>
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
            
            <SupportDashboardTabs 
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
  )
}
