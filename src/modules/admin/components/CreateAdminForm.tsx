'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function CreateAdminForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '9876543210',
    password: 'admin123',
    adminCode: 'ADMIN2025'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [adminCreated, setAdminCreated] = useState(false);

  console.log('Current state:', { showOtpVerification, adminCreated, loading, message, error });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/admin/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', response.data);
      console.log('Setting showOtpVerification to true');
      setAdminCreated(true);
      setShowOtpVerification(true);
      setMessage('Admin user created successfully! Please verify your email/phone with the OTP sent to you.');
      console.log('Admin created:', response.data);
    } catch (err: any) {
      console.error('Error response:', err.response?.data);
      setError(err.response?.data || 'Failed to create admin user');
      console.error('Error creating admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        emailOrPhone: formData.email,
        otp: otpCode
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        router.push('/dashboard/admin');
      }
    } catch (err: any) {
      setError(err.response?.data || 'OTP verification failed');
      console.error('Error verifying OTP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // If OTP verification is required, show OTP form
  if (showOtpVerification) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        
        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleOtpVerification} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              placeholder="Enter the OTP sent to your email/phone"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {loading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          <p>Please check your email ({formData.email}) or phone ({formData.phone}) for the OTP.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Admin User</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {loading ? 'Creating Admin...' : 'Create Admin User'}
        </button>
        
        {/* Test button to show OTP form */}
        <button
          type="button"
          onClick={() => {
            console.log('Test button clicked');
            setShowOtpVerification(true);
            setMessage('Test: OTP form shown');
          }}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Test: Show OTP Form
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-600">
        <p className="font-medium">Next steps:</p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Create the admin user using the form above</li>
          <li>Go to <a href="/login" className="text-indigo-600 hover:text-indigo-800">/login</a></li>
          <li>Login with the credentials you entered</li>
          <li>Navigate to <a href="/dashboard/admin" className="text-indigo-600 hover:text-indigo-800">/dashboard/admin</a></li>
        </ol>
      </div>
    </div>
  );
}
