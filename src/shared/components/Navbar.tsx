'use client';

import React, { useState } from 'react';
import SearchBar from './SearchBar';
import NotificationCenter from './NotificationCenter';
import MegaMenuContent from './MegaMenuContent';
import { Search, User, LogOut, Settings, ShoppingCart, BarChart, Menu, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';

export default function Navbar() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  // Make role checking case-insensitive and flexible
  const userRole = user?.role?.toLowerCase() || '';
  const isAdmin = userRole === 'admin' || userRole === 'role_admin';
  const isVendor = userRole === 'vendor' || userRole === 'role_vendor';
  const isUser = userRole === 'user' || userRole === 'buyer' || userRole === 'role_user';
  
  // Debug user role
  console.log('Current user:', user);
  console.log('User role:', user?.role);
  console.log('isAdmin:', isAdmin, 'isVendor:', isVendor, 'isUser:', isUser);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full px-4 py-3 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={() => router.push('/')} 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <img src="/logo.png" alt="Indian Trade Mart" className="h-8 w-auto" />
            <div className="text-xl font-bold hidden sm:block">Indian Trade Mart</div>
          </button>
          
          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <SearchBar placeholder="Search products, categories, vendors..." />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                setUserDropdownOpen(false);
                setVendorDropdownOpen(false);
                setMegaMenuOpen(false);
              }}
              className={`md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                mobileSearchOpen ? 'bg-gray-100' : ''
              }`}
            >
              <Search size={20} className="text-gray-600" />
            </button>
            
            {/* Notification Bell - Only show when authenticated */}
            {isAuthenticated && <NotificationCenter />}
            
            <div className="text-sm space-x-6 text-gray-700 flex items-center flex-shrink-0">
              <button 
                onClick={() => router.push('/')} 
                className="hover:text-blue-600 transition-colors hidden sm:block"
              >
                Home
              </button>

              <button 
                onClick={() => router.push('/directory')} 
                className="hover:text-blue-600 transition-colors hidden sm:block"
              >
                Directory
              </button>

              {/* Browse Categories with Mega Menu - Desktop */}
              <div 
                className="relative hidden lg:block"
              >
                <button
                  onMouseEnter={() => {
                    setMegaMenuOpen(true);
                    setUserDropdownOpen(false);
                    setVendorDropdownOpen(false);
                  }}
                  onClick={() => {
                    setMegaMenuOpen(!megaMenuOpen);
                    setUserDropdownOpen(false);
                    setVendorDropdownOpen(false);
                  }}
                  className="flex items-center space-x-1 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  <Menu size={16} />
                  <span>Browse Categories</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Browse Categories - Mobile/Tablet */}
              <button 
                onClick={() => router.push('/categories')} 
                className="lg:hidden hover:text-blue-600 transition-colors flex items-center space-x-1"
              >
                <Menu size={16} />
                <span className="hidden sm:inline">Categories</span>
              </button>
          
              {isAuthenticated ? (
                // Authenticated user navigation
                <>
                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(!userDropdownOpen);
                        setVendorDropdownOpen(false);
                        setMobileSearchOpen(false);
                        setMegaMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 hover:text-blue-600 transition-colors focus:outline-none"
                    >
                      <User size={16} />
                      <span className="hidden sm:inline">{user?.name || 'User'}</span>
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        {isVendor && (
                          <>
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                router.push('/dashboard/vendor-panel');
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <BarChart size={16} className="mr-2" />
                              Dashboard
                            </button>
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                router.push('/products-you-buy');
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <ShoppingCart size={16} className="mr-2" />
                              Products
                            </button>
                          </>
                        )}
                        {isUser && (
                          <>
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                router.push('/dashboard/user');
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <BarChart size={16} className="mr-2" />
                              Dashboard
                            </button>
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                router.push('/products-you-buy');
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <ShoppingCart size={16} className="mr-2" />
                              Products
                            </button>
                          </>
                        )}
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                router.push('/dashboard/admin');
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <BarChart size={16} className="mr-2" />
                              Admin Dashboard
                            </button>
                          </>
                        )}
                        {/* General Dashboard option for users whose role doesn't match the specific conditions */}
                        {!isVendor && !isUser && !isAdmin && isAuthenticated && (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              router.push('/dashboard');
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <BarChart size={16} className="mr-2" />
                            Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            router.push('/profile');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Settings size={16} className="mr-2" />
                          Profile Settings
                        </button>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            dispatch(logout());
                            router.push('/');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Non-authenticated user navigation
                <>
                  {/* User/Buyer Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(!userDropdownOpen);
                        setVendorDropdownOpen(false);
                        setMobileSearchOpen(false);
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-blue-600 transition-colors focus:outline-none"
                    >
                      Buyer/User
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            router.push('/auth/user/login');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            router.push('/auth/user/register');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Register
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Vendor Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setVendorDropdownOpen(!vendorDropdownOpen);
                        setUserDropdownOpen(false);
                        setMobileSearchOpen(false);
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-blue-600 transition-colors focus:outline-none"
                    >
                      Vendor
                    </button>
                    {vendorDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <button
                          onClick={() => {
                            setVendorDropdownOpen(false);
                            router.push('/auth/vendor/login');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            setVendorDropdownOpen(false);
                            router.push('/auth/vendor/register');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Register
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden mt-4 pb-4">
            <SearchBar placeholder="Search products, categories, vendors..." />
          </div>
        )}
      </div>
      
      {/* Mega Menu Dropdown */}
      {megaMenuOpen && (
        <div 
          className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-40"
          onMouseEnter={() => setMegaMenuOpen(true)}
          onMouseLeave={() => setMegaMenuOpen(false)}
        >
          <div className="max-w-7xl mx-auto">
            <MegaMenuContent onClose={() => setMegaMenuOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Click outside to close dropdowns */}
      {(userDropdownOpen || vendorDropdownOpen || megaMenuOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setUserDropdownOpen(false);
            setVendorDropdownOpen(false);
            setMegaMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
}
