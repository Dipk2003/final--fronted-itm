/**
 * 🔐 Login Component
 * 
 * General login form component
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { login, verifyOtp, clearError } from '@/features/auth/authSlice';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

interface LoginProps {
  userType?: 'user' | 'vendor' | 'admin' | 'employee';
  redirectTo?: string;
}

const Login: React.FC<LoginProps> = ({ 
  userType = 'user', 
  redirectTo = '/dashboard' 
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, otpSent, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = React.useState({
    emailOrPhone: '',
    password: '',
  });
  const [otpCode, setOtpCode] = React.useState('');

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.emailOrPhone || !formData.password) {
      return;
    }

    dispatch(login(formData));
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode) {
      return;
    }

    dispatch(verifyOtp({
      emailOrPhone: formData.emailOrPhone,
      otp: otpCode
    }));
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case 'admin':
        return 'Admin Login';
      case 'vendor':
        return 'Vendor Login';
      case 'employee':
        return 'Employee Login';
      default:
        return 'User Login';
    }
  };

  const getRegisterLink = () => {
    switch (userType) {
      case 'admin':
        return '/auth/admin/register';
      case 'vendor':
        return '/auth/vendor/register';
      default:
        return '/auth/user/register';
    }
  };

  if (otpSent) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Verify OTP - {getUserTypeTitle()}
        </h2>

        <form onSubmit={handleOtpVerification}>
          <div className="mb-4">
            <Input
              type="text"
              label="Enter OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter 6-digit OTP"
              required
              maxLength={6}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            loading={loading}
            disabled={!otpCode || loading}
          >
            Verify OTP
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        {getUserTypeTitle()}
      </h2>

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <Input
            type="text"
            name="emailOrPhone"
            label="Email or Phone"
            value={formData.emailOrPhone}
            onChange={handleInputChange}
            placeholder="Enter your email or phone number"
            required
          />
        </div>

        <div className="mb-6">
          <Input
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full mb-4"
          loading={loading}
          disabled={!formData.emailOrPhone || !formData.password || loading}
        >
          Sign In
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href={getRegisterLink()} className="text-blue-600 hover:text-blue-800">
              Sign up here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
