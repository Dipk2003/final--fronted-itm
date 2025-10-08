'use client';

import { useState, useEffect } from 'react';
import { VendorDashboardTabs } from '@/modules/vendor';
import { AuthGuard } from '@/modules/core';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function VendorDashboard() {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  console.log('🏦 VendorDashboard Debug:');
  console.log('  - isAuthenticated:', isAuthenticated);
  console.log('  - loading:', loading);
  console.log('  - user:', user);
  console.log('  - user.role:', user?.role);
  
  return (
    <AuthGuard allowedRoles={['ROLE_VENDOR', 'VENDOR']}>
      <div className="w-full bg-gray-50 min-h-screen">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                  V
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Vendor Panel</h1>
                  <p className="text-xs text-gray-500">Hi, {user?.name || 'Vendor'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-700">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <section className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'Vendor'}! 💼</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700">Store Active</span>
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
            <VendorDashboardTabs isMobile={isMobile} />
          </section>
        )}

        {/* Mobile Content */}
        {isMobile && (
          <div className="px-2 py-4">
            <VendorDashboardTabs isMobile={isMobile} />
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
