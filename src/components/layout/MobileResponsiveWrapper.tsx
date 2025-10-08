'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { Menu, X, Bell, User, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface MobileResponsiveWrapperProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  tabs?: Array<{
    id: string;
    label: string;
    icon?: string;
    onClick: () => void;
    active?: boolean;
  }>;
  showNotifications?: boolean;
  backgroundColor?: string;
}

export default function MobileResponsiveWrapper({
  children,
  title,
  subtitle,
  primaryAction,
  tabs,
  showNotifications = true,
  backgroundColor = 'bg-gray-50'
}: MobileResponsiveWrapperProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  // Mobile detection with proper cleanup
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showMobileMenu && !target.closest('[data-mobile-menu]')) {
        setShowMobileMenu(false);
      }
      if (showUserMenu && !target.closest('[data-user-menu]')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu, showUserMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  return (
    <div className={`min-h-screen ${backgroundColor}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-500 truncate">{subtitle}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {showNotifications && (
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              )}
              
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                data-mobile-menu
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Primary Action Button - Mobile */}
          {primaryAction && (
            <div className="px-4 pb-4">
              <button
                onClick={primaryAction.onClick}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {primaryAction.icon}
                {primaryAction.label}
              </button>
            </div>
          )}

          {/* Mobile Navigation Tabs */}
          {tabs && tabs.length > 0 && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {tabs.slice(0, 6).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={tab.onClick}
                    className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                      tab.active
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.icon && <span className="text-lg">{tab.icon}</span>}
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-gray-600">{subtitle}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {primaryAction && (
                  <button
                    onClick={primaryAction.onClick}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {primaryAction.icon}
                    {primaryAction.label}
                  </button>
                )}
                
                {showNotifications && (
                  <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                )}
                
                {/* User Menu */}
                <div className="relative" data-user-menu>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Account Settings
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation Tabs */}
            {tabs && tabs.length > 0 && (
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={tab.onClick}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                        tab.active
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.icon && <span className="text-lg">{tab.icon}</span>}
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" data-mobile-menu>
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                    {user?.role}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full text-left p-3 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-3">
                  <User className="w-5 h-5" />
                  Profile Settings
                </button>
                <button className="w-full text-left p-3 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-3">
                  <Bell className="w-5 h-5" />
                  Notifications
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button className="w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`${isMobile ? 'px-2 py-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {children}
      </main>
    </div>
  );
}