'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { RootState } from '@/store';
import {
  UserActions,
  RecentOrders,
  CategorySidebar,
  UserProductGrid,
  AccountActions,
  UserProfile,
  UserOrders,
  UserWishlist,
  UserSupport
} from '@/modules/buyer';
import { SearchBar } from '@/shared/components';
import { AuthGuard } from '@/modules/core';

function UserDashboardContent() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState('home');
  const [isMobile, setIsMobile] = useState(false);
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Debug logging
  console.log('Dashboard state:', { user, isAuthenticated, loading, activeView });
  
  // Handle URL parameters for navigation
  useEffect(() => {
    if (searchParams) {
      const view = searchParams.get('view');
      console.log('URL view parameter:', view);
      if (view && ['home', 'profile', 'orders', 'wishlist', 'support'].includes(view)) {
        console.log('Setting active view to:', view);
        setActiveView(view);
      }
    }
  }, [searchParams]);
  
  const handleNavigate = (view: string) => {
    console.log('Navigating to view:', view);
    setActiveView(view);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return (
          <>
            <SearchBar placeholder="Search for products..." />
            <div className={`${isMobile ? 'mt-6 space-y-6' : 'mt-10 grid grid-cols-1 md:grid-cols-3 gap-6'}`}>
              {!isMobile ? (
                <>
                  <div className="md:col-span-2 space-y-6">
                    <RecentOrders />
                    <UserProductGrid />
                  </div>
                  <div className="space-y-6">
                    <CategorySidebar />
                    <AccountActions onNavigate={handleNavigate} />
                  </div>
                </>
              ) : (
                /* Mobile Layout */
                <>
                  <AccountActions onNavigate={handleNavigate} />
                  <RecentOrders />
                  <CategorySidebar />
                  <UserProductGrid />
                </>
              )}
            </div>
          </>
        );
      case 'profile':
        return <UserProfile />;
      case 'orders':
        return <UserOrders />;
      case 'wishlist':
        return <UserWishlist />;
      case 'support':
        return <UserSupport />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {activeView === 'home' ? 'Dashboard' : 
                   activeView === 'profile' ? 'Profile' :
                   activeView === 'orders' ? 'Orders' :
                   activeView === 'wishlist' ? 'Wishlist' :
                   activeView === 'support' ? 'Support' : 'Dashboard'}
                </h1>
                <p className="text-xs text-gray-500">Hi, {user?.name || 'User'}</p>
              </div>
            </div>
            {activeView !== 'home' && (
              <button
                onClick={() => setActiveView('home')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Home
              </button>
            )}
          </div>
        </div>
      )}

      <section className={`${isMobile ? 'px-2 py-4' : 'px-4 py-10 max-w-7xl mx-auto mt-4'}`}>
        {/* Desktop Header */}
        {!isMobile && (
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                {activeView === 'home' ? `Welcome back, ${user?.name || 'User'}!` : 
                 activeView === 'profile' ? 'My Profile' :
                 activeView === 'orders' ? 'My Orders' :
                 activeView === 'wishlist' ? 'My Wishlist' :
                 activeView === 'support' ? 'Support' : 'Dashboard'}
              </h1>
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 mt-1">
                  Auth: {isAuthenticated ? 'Yes' : 'No'} | User: {user?.email || 'None'} | Role: {user?.role || 'None'}
                </div>
              )}
            </div>
            {activeView !== 'home' && (
              <button
                onClick={() => setActiveView('home')}
                className="text-blue-600 hover:underline"
              >
                ← Back to Dashboard
              </button>
            )}
          </div>
        )}
        
        {activeView === 'home' && <UserActions onNavigate={handleNavigate} />}
        
        {renderActiveView()}
      </section>
    </div>
  )
}

export default function UserDashboard() {
  return (
    <AuthGuard allowedRoles={['ROLE_USER', 'USER']}>
      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
        <UserDashboardContent />
      </Suspense>
    </AuthGuard>
  )
}
