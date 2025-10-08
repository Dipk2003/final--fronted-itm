'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

export default function UserProfile() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  // Move all useState hooks to top level - before any conditions
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  // Debug logging
  // console.log('UserProfile component - User:', user, 'Authenticated:', isAuthenticated);
  
  // Early return after all hooks are declared
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }
  
  // Make sure we don't make any API calls that might cause 403 errors
  // console.log('UserProfile loaded successfully, no API calls needed');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let filteredValue = value;
    
    // Apply input filtering based on field type
    switch (name) {
      case 'name':
        // Only allow alphabets and spaces
        filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case 'phone':
        // Only allow numbers, max 10 digits
        filteredValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        break;
      case 'email':
        // Basic email filtering (allow alphanumeric, @, ., -, _)
        filteredValue = value.replace(/[^a-zA-Z0-9@._-]/g, '');
        break;
      case 'pincode':
        // Only allow numbers, max 6 digits
        filteredValue = value.replace(/[^0-9]/g, '').slice(0, 6);
        break;
      case 'city':
        // Only allow alphabets, spaces, and common punctuation
        filteredValue = value.replace(/[^a-zA-Z\s.-]/g, '');
        break;
      case 'address':
        // Allow alphanumeric, spaces, and common address characters
        filteredValue = value.replace(/[^a-zA-Z0-9\s.,#/-]/g, '');
        break;
      default:
        break;
    }
    
    setFormData(prev => ({ ...prev, [name]: filteredValue }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Real-time validation
    const newErrors: {[key: string]: string} = {};
    
    switch (name) {
      case 'name':
        if (filteredValue.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        }
        break;
      case 'phone':
        if (filteredValue.length > 0 && filteredValue.length < 10) {
          newErrors.phone = 'Phone number must be 10 digits';
        }
        break;
      case 'email':
        if (filteredValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(filteredValue)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 'pincode':
        if (filteredValue.length > 0 && filteredValue.length < 6) {
          newErrors.pincode = 'Pincode must be 6 digits';
        }
        break;
      case 'city':
        if (filteredValue.length > 0 && filteredValue.length < 2) {
          newErrors.city = 'City name must be at least 2 characters';
        }
        break;
      case 'address':
        if (filteredValue.length > 0 && filteredValue.length < 5) {
          newErrors.address = 'Address must be at least 5 characters';
        }
        break;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(prev => ({ ...prev, ...newErrors }));
    }
  };

  const handleSave = () => {
    // Here you would typically dispatch an action to update the user profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
    // You can add API call here to save the profile
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="space-x-2">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            {isEditing ? (
              <div>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full ${validationErrors.name ? 'border-red-500' : ''}`}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{formData.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            {isEditing ? (
              <div>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full ${validationErrors.email ? 'border-red-500' : ''}`}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{formData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            {isEditing ? (
              <div>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className={`w-full ${validationErrors.phone ? 'border-red-500' : ''}`}
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{formData.phone || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            {isEditing ? (
              <div>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className={`w-full ${validationErrors.city ? 'border-red-500' : ''}`}
                />
                {validationErrors.city && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{formData.city || 'Not provided'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            {isEditing ? (
              <div>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  className={`w-full ${validationErrors.address ? 'border-red-500' : ''}`}
                />
                {validationErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{formData.address || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            {isEditing ? (
              <div>
                <Input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter pincode"
                  className={`w-full ${validationErrors.pincode ? 'border-red-500' : ''}`}
                />
                {validationErrors.pincode && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.pincode}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{formData.pincode || 'Not provided'}</p>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{user?.id || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                {user?.role?.replace('ROLE_', '') || 'User'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
