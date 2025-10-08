/**
 * 📝 Register Component
 * 
 * General registration form component
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { register, verifyOtp, clearError } from '@/features/auth/authSlice';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';

interface RegisterProps {
  userType?: 'user' | 'vendor' | 'admin';
  redirectTo?: string;
}

const Register: React.FC<RegisterProps> = ({ 
  userType = 'user', 
  redirectTo = '/dashboard' 
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, otpSent, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      return false;
    }

    if (userType === 'vendor' && (!formData.companyName || !formData.gstNumber)) {
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const registerData = {
      ...formData,
      role: userType === 'admin' ? 'ROLE_ADMIN' : userType === 'vendor' ? 'ROLE_VENDOR' : 'ROLE_USER',
      userType: userType,
    };

    dispatch(register(registerData));
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode) {
      return;
    }

    dispatch(verifyOtp({
      emailOrPhone: formData.email,
      otp: otpCode
    }));
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case 'admin':
        return 'Admin Registration';
      case 'vendor':
        return 'Vendor Registration';
      default:
        return 'User Registration';
    }
  };

  const getLoginLink = () => {
    switch (userType) {
      case 'admin':
        return '/auth/admin/login';
      case 'vendor':
        return '/auth/vendor/login';
      default:
        return '/auth/user/login';
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
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        {getUserTypeTitle()}
      </h2>

      <form onSubmit={handleRegister}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Input
              type="text"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-4">
            <Input
              type="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <Input
              type="tel"
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mb-4">
            <Input
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="mb-4">
            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          {userType === 'vendor' && (
            <>
              <div className="mb-4">
                <Input
                  type="text"
                  name="companyName"
                  label="Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="mb-4">
                <Input
                  type="text"
                  name="gstNumber"
                  label="GST Number"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  placeholder="Enter GST number"
                  required
                />
              </div>
            </>
          )}

          <div className="mb-4 md:col-span-2">
            <Input
              type="text"
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your address"
            />
          </div>

          <div className="mb-4">
            <Input
              type="text"
              name="city"
              label="City"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter your city"
            />
          </div>

          <div className="mb-4">
            <Input
              type="text"
              name="state"
              label="State"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Enter your state"
            />
          </div>

          <div className="mb-4">
            <Input
              type="text"
              name="pincode"
              label="Pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              placeholder="Enter pincode"
            />
          </div>
        </div>

        {formData.password !== formData.confirmPassword && formData.confirmPassword && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            Passwords do not match
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full mb-4"
          loading={loading}
          disabled={!validateForm() || loading}
        >
          Create Account
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href={getLoginLink()} className="text-blue-600 hover:text-blue-800">
              Sign in here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
