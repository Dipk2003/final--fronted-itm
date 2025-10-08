'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { sendForgotPasswordOtp, verifyForgotPasswordOtp, clearError, login, verifyOtp } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, otpSent } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Try the dedicated forgot password endpoint first
    console.log('🔄 Trying forgot password OTP endpoint...');
    const forgotResult = await dispatch(sendForgotPasswordOtp(email));
    
    if (sendForgotPasswordOtp.fulfilled.match(forgotResult)) {
      console.log('✅ Forgot password OTP sent successfully');
      setStep('otp');
      return;
    }
    
    // If forgot password endpoint fails or doesn't send email,
    // try using regular login which might trigger OTP
    console.log('⚠️ Forgot password OTP might not be working, trying login-based OTP as fallback...');
    
    try {
      // Use login with a dummy password to trigger OTP for the email
      const loginResult = await dispatch(login({ 
        emailOrPhone: email, 
        password: 'trigger-otp-mode' // This should trigger OTP send
      }));
      
      if (login.fulfilled.match(loginResult)) {
        console.log('✅ Login-based OTP triggered successfully');
        setStep('otp');
      }
    } catch (error) {
      console.log('❌ Both methods failed:', error);
      // The original error from forgot password will be shown
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔘 Button clicked! Starting OTP verification...');
    console.log('🔘 OTP value:', otp, 'Length:', otp.length);
    console.log('🔘 Email:', email);
    console.log('🔘 Loading state:', loading);
    
    if (!otp || otp.length < 4) {
      console.log('❌ OTP too short:', otp);
      alert('Please enter at least 4 digits for OTP');
      return;
    }
    
    console.log('🔐 Starting OTP verification with:', { email, otp });
    console.log('🔐 Current loading state:', loading);
    console.log('🔐 Current error state:', error);
    
    // Clear any previous errors
    dispatch(clearError());
    
    try {
      // Try forgot password OTP verification first
      console.log('🔐 Trying forgot password OTP verification...');
      const forgotOtpResult = await dispatch(verifyForgotPasswordOtp({ email, otp }));
      console.log('🔐 Forgot OTP result:', forgotOtpResult);
      
      if (verifyForgotPasswordOtp.fulfilled.match(forgotOtpResult)) {
        console.log('✅ Forgot password OTP verification successful');
        alert('OTP verified successfully! Redirecting to dashboard...');
        router.push('/dashboard/user');
        return;
      }
      
      // If forgot password verification fails, try regular OTP verification
      console.log('⚠️ Forgot password OTP verification failed, trying regular OTP verification...');
      const regularOtpResult = await dispatch(verifyOtp({ emailOrPhone: email, otp }));
      console.log('🔐 Regular OTP result:', regularOtpResult);
      
      if (verifyOtp.fulfilled.match(regularOtpResult)) {
        console.log('✅ Regular OTP verification successful');
        alert('OTP verified successfully! Redirecting to dashboard...');
        router.push('/dashboard/user');
        return;
      }
      
      // If both methods fail, show an error
      console.log('❌ Both OTP verification methods failed');
      alert('OTP verification failed. Please check your OTP and try again.');
      
    } catch (error: any) {
      console.error('🚨 OTP verification threw an exception:', error);
      alert(`OTP verification error: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    dispatch(clearError());
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (step === 'otp') {
    return (
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to {email}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
          <div>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              required
              maxLength={6}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          
          <div className="space-y-4">
            <div className="text-center text-xs text-gray-500 mb-2">
              {otp.length === 0 && "Enter your OTP"}
              {otp.length > 0 && otp.length < 4 && `${otp.length} digits - need at least 4`}
              {otp.length >= 4 && otp.length < 6 && `${otp.length} digits - button enabled`}
              {otp.length === 6 && "✅ Ready to verify!"}
              {otp.length > 6 && "Too many digits"}
            </div>
            {/* Test button - Always clickable */}
            <button
              type="button"
              onClick={() => {
                console.log('🟢 TEST BUTTON CLICKED - ALWAYS WORKS!');
                console.log('🟢 Current OTP:', otp);
                console.log('🟢 Current email:', email);
                alert('Test button works! OTP: ' + otp + ' Email: ' + email);
              }}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '500',
                marginBottom: '8px'
              }}
            >
              🟢 TEST BUTTON (Always Works)
            </button>

            {/* Simple HTML button for testing */}
            <button
              type="submit"
              disabled={loading || otp.length < 4}
              onClick={(e) => {
                console.log('🚀 SIMPLE BUTTON CLICKED!');
                console.log('🚀 Event:', e.type);
                console.log('🚀 OTP:', otp, 'Length:', otp.length);
                console.log('🚀 Loading:', loading);
                console.log('🚀 Disabled:', loading || otp.length < 4);
                alert('Button clicked! OTP: ' + otp);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: (loading || otp.length < 4) ? '#9CA3AF' : '#4F46E5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: (loading || otp.length < 4) ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {loading ? 'Verifying...' : `Verify OTP & Login ${otp.length >= 4 ? '✓' : ''}`}
            </button>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBackToEmail}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                ← Back to email
              </button>
              
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                Back to login
              </button>
            </div>
            
            {/* Debug Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <div><strong>Debug Info:</strong></div>
              <div>Email: {email}</div>
              <div>OTP: {otp} (length: {otp.length})</div>
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
              <div>Button enabled: {(!loading && otp.length >= 4) ? 'Yes' : 'No'}</div>
              {error && <div className="text-red-600">Error: {error}</div>}
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email to receive an OTP and login directly
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
        <div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        
        <div className="space-y-4">
          <Button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
          
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full text-center text-sm text-gray-600 hover:text-gray-500"
          >
            ← Back to login
          </button>
        </div>
      </form>
    </div>
  );
}
