'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, verifyOtp, clearError, setTempCredentials } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import AuthRedirect from '@/modules/core/components/AuthRedirect';

export default function VendorRegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, otpSent } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'vendor', // Fixed as vendor
    panCard: '',
    businessName: '',
    businessAddress: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
  });
  
  const [kycDocuments, setKycDocuments] = useState<{
    panCardFile: File | null;
    gstCertificate: File | null;
    businessRegistration: File | null;
    bankStatement: File | null;
  }>({
    panCardFile: null,
    gstCertificate: null,
    businessRegistration: null,
    bankStatement: null,
  });
  
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [otpCode, setOtpCode] = useState('');

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Name validation (only alphabets)
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = 'Name should contain only alphabets';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (10 digits)
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    } else if (formData.phone.startsWith('0')) {
      errors.phone = 'Phone number should not start with 0';
    }
    
    // Password validation (strong password)
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // PAN card validation (for vendors only)
    if (!formData.panCard.trim()) {
      errors.panCard = 'PAN card number is required for vendors';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard)) {
      errors.panCard = 'PAN card number must be in format: ABCDE1234F';
    }
    
    // Business name validation
    if (!formData.businessName.trim()) {
      errors.businessName = 'Business name is required for vendors';
    }
    
    // Business address validation
    if (!formData.businessAddress.trim()) {
      errors.businessAddress = 'Business address is required for vendors';
    }
    
    // City validation
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    // State validation
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    
    // Pincode validation
    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Pincode must be exactly 6 digits';
    }
    
    // GST validation (optional but if provided should be valid)
    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      errors.gstNumber = 'Invalid GST format';
    }
    
    return errors;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form on client side
    const errors = validateForm();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Store credentials for OTP verification
    dispatch(setTempCredentials({
      emailOrPhone: formData.email,
      password: formData.password,
    }));

    const registerData: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      userType: 'vendor', // Fixed as vendor - cannot be changed
      panNumber: formData.panCard,
      businessName: formData.businessName,
      businessAddress: formData.businessAddress,
    };

    const result = await dispatch(register(registerData));
    
    if (register.fulfilled.match(result)) {
      // OTP sent, show OTP form
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(verifyOtp({
      emailOrPhone: formData.email,
      otp: otpCode,
    }));
    
    if (verifyOtp.fulfilled.match(result)) {
      console.log('✅ Vendor OTP verified successfully, user authenticated');
      // AuthRedirect component will handle the redirect
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Real-time validation
    const newErrors: {[key: string]: string} = {};
    
    if (name === 'name' && value && !/^[a-zA-Z\s]+$/.test(value)) {
      newErrors.name = 'Name should contain only alphabets';
    }
    
    if (name === 'confirmPassword' && value && formData.password !== value) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (name === 'phone' && value) {
      if (!/^\d{10}$/.test(value)) {
        newErrors.phone = 'Phone number must be exactly 10 digits';
      } else if (value.startsWith('0')) {
        newErrors.phone = 'Phone number should not start with 0';
      }
    }
    
    if (name === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    setValidationErrors(prev => ({ ...prev, ...newErrors }));
    
    setFormData({
      ...formData,
      [name]: value,
    });
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
              Verify OTP
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter the OTP sent to {formData.email}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleOtpVerification}>
            <div>
              <Input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter OTP"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <Button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Vendor Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Register as a vendor in our B2B marketplace
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <Input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name (alphabets only)"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

             
            <div>
              <Input
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Business Name"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.businessName ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.businessName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.businessName}</p>
              )}
            </div>
            
             <div>
              <Input
                name="businessAddress"
                type="text"
                value={formData.businessAddress}
                onChange={handleChange}
                placeholder="Business Address"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.businessAddress ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.businessAddress && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.businessAddress}</p>
              )}
            </div>

            <div>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address (example@gmail.com)"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>
            
            <div>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (10 digits, not starting with 0)"
                required
                maxLength={10}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.city ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                />
                {validationErrors.city && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
                )}
              </div>
              <div>
                <Input
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.state ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                />
                {validationErrors.state && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
                )}
              </div>
            </div>
            
            <div>
              <Input
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode (6 digits)"
                required
                maxLength={6}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.pincode ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.pincode && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.pincode}</p>
              )}
            </div>

            <div>
              <Input
                name="panCard"
                type="text"
                value={formData.panCard}
                onChange={handleChange}
                placeholder="PAN Card Number (ABCDE1234F)"
                required
                maxLength={10}
                style={{ textTransform: 'uppercase' }}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.panCard ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.panCard && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.panCard}</p>
              )}
            </div>
            
            <div>
              <Input
                name="gstNumber"
                type="text"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="GST Number (Optional)"
                style={{ textTransform: 'uppercase' }}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.gstNumber ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.gstNumber && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.gstNumber}</p>
              )}
            </div>
           
            <div>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (min 8 chars, strong)"
                required
                autoComplete="new-password"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>
            
            <div>
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                autoComplete="new-password"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* KYC Document Upload Section */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900">KYC Documents</h3>
            <p className="text-sm text-gray-600">Upload required documents for verification</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card *</label>
                <input
                  type="file"
                  name="panCardFile"
                  accept="image/*,.pdf"
                  onChange={(e) => setKycDocuments({ ...kycDocuments, panCardFile: e.target.files?.[0] || null })}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {kycDocuments.panCardFile && (
                  <p className="mt-1 text-xs text-green-600">✓ {kycDocuments.panCardFile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Certificate</label>
                <input
                  type="file"
                  name="gstCertificate"
                  accept="image/*,.pdf"
                  onChange={(e) => setKycDocuments({ ...kycDocuments, gstCertificate: e.target.files?.[0] || null })}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {kycDocuments.gstCertificate && (
                  <p className="mt-1 text-xs text-green-600">✓ {kycDocuments.gstCertificate.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration Document</label>
                <input
                  type="file"
                  name="businessRegistration"
                  accept="image/*,.pdf"
                  onChange={(e) => setKycDocuments({ ...kycDocuments, businessRegistration: e.target.files?.[0] || null })}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {kycDocuments.businessRegistration && (
                  <p className="mt-1 text-xs text-green-600">✓ {kycDocuments.businessRegistration.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Statement (Last 3 months)</label>
                <input
                  type="file"
                  name="bankStatement"
                  accept="image/*,.pdf"
                  onChange={(e) => setKycDocuments({ ...kycDocuments, bankStatement: e.target.files?.[0] || null })}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {kycDocuments.bankStatement && (
                  <p className="mt-1 text-xs text-green-600">✓ {kycDocuments.bankStatement.name}</p>
                )}
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>• Accepted formats: JPG, PNG, PDF (Max 5MB each)</p>
              <p>• Documents will be verified by our team within 24-48 hours</p>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Creating Account...' : 'Create Vendor Account'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/auth/vendor/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

