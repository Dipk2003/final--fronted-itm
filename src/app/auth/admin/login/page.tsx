'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, verifyOtp, clearError } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import AuthRedirect from '@/modules/core/components/AuthRedirect';

export default function AdminLoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, otpSent, tempCredentials } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    adminCode: 'ADMIN2025', // Default admin code
  });
  
  const [otpCode, setOtpCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 Admin login attempt for:', formData.emailOrPhone);
    
    const result = await dispatch(login(formData));
    
    if (login.fulfilled.match(result)) {
      console.log('✅ Admin login successful');
      if (result.payload.user && result.payload.token) {
        // Check if user is admin
        if (result.payload.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          alert('This account is not registered as an admin. Access denied.');
          return;
        }
      }
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || !tempCredentials) {
      return;
    }
    
    const result = await dispatch(verifyOtp({
      emailOrPhone: tempCredentials.emailOrPhone,
      otp: otpCode,
    }));
    
    if (verifyOtp.fulfilled.match(result)) {
      console.log('✅ Admin OTP verification successful');
      // Check user role after OTP verification
      if (result.payload.user && result.payload.user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        alert('This account is not registered as an admin. Access denied.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (otpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin OTP Verification
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter the OTP sent to your email/phone
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleOtpVerification}>
            <div>
              <Input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm text-center font-mono text-lg"
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            
            <div>
              <Button
                type="submit"
                disabled={loading || otpCode.length < 4}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {loading ? 'Verifying...' : 'Verify Admin OTP'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthRedirect />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Authorized personnel only
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Input
                  name="emailOrPhone"
                  type="text"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  placeholder="Admin Email or Phone"
                  required
                  autoComplete="username"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Admin Password"
                  required
                  autoComplete="current-password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <Input
                  name="adminCode"
                  type="text"
                  value={formData.adminCode}
                  onChange={handleChange}
                  placeholder="Admin Access Code"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Admin access code is required for security</p>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {loading ? 'Signing in...' : 'Sign in as Admin'}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                <a href="/auth/user/login" className="font-medium text-blue-600 hover:text-blue-500">
                  User Login
                </a>
                {' | '}
                <a href="/auth/vendor/login" className="font-medium text-green-600 hover:text-green-500">
                  Vendor Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
