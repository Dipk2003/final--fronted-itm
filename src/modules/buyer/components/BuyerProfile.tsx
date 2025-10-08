'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  Edit3, 
  Save, 
  X, 
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Address {
  id: string;
  type: 'HOME' | 'OFFICE' | 'WAREHOUSE';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface BuyerProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  gstNumber?: string;
  addresses: Address[];
  profileImage?: string;
  accountStatus: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  verificationStatus: 'VERIFIED' | 'PENDING' | 'NOT_VERIFIED';
  registrationDate: Date;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
  };
}

export default function BuyerProfile() {
  const [profile, setProfile] = useState<BuyerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState<Partial<BuyerProfileData>>({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyer/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile({
        ...data,
        registrationDate: new Date(data.registrationDate)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      console.error('Error fetching profile:', err);
      
      // Mock data for development
      const mockProfile: BuyerProfileData = {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@example.com',
        phone: '+919876543210',
        companyName: 'Kumar Enterprises',
        gstNumber: '07AABCU9603R1ZX',
        profileImage: '/api/placeholder/150/150',
        accountStatus: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        registrationDate: new Date(Date.now() - 86400000 * 90),
        addresses: [
          {
            id: '1',
            type: 'OFFICE',
            street: '123 Business Park, Sector 15',
            city: 'Gurgaon',
            state: 'Haryana',
            zipCode: '122001',
            country: 'India',
            isDefault: true
          },
          {
            id: '2',
            type: 'WAREHOUSE',
            street: '456 Industrial Area, Phase 2',
            city: 'Noida',
            state: 'Uttar Pradesh',
            zipCode: '201301',
            country: 'India',
            isDefault: false
          }
        ],
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: true
        }
      };
      setProfile(mockProfile);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (section: string) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyer/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile({
          ...updatedProfile,
          registrationDate: new Date(updatedProfile.registrationDate)
        });
        setEditMode(null);
        setEditForm({});
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      // For development, simulate update
      if (profile) {
        setProfile({ ...profile, ...editForm });
        setEditMode(null);
        setEditForm({});
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyer/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      if (response.ok) {
        alert('Password changed successfully');
        setShowPasswordChange(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error('Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      alert('Error changing password');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED':
      case 'NOT_VERIFIED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Profile</h3>
            <p className="text-red-600 text-sm">{error || 'Profile data not available'}</p>
          </div>
          <button
            onClick={fetchProfile}
            className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profile.accountStatus)}`}>
            {profile.accountStatus}
          </span>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profile.verificationStatus)}`}>
            {profile.verificationStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <button
                onClick={() => {
                  if (editMode === 'basic') {
                    handleSaveProfile('basic');
                  } else {
                    setEditMode('basic');
                    setEditForm({
                      name: profile.name,
                      email: profile.email,
                      phone: profile.phone
                    });
                  }
                }}
                disabled={saving}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                {editMode === 'basic' ? (
                  <>
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </>
                )}
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {editMode === 'basic' ? (
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{profile.name}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {editMode === 'basic' ? (
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{profile.email}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {editMode === 'basic' ? (
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{profile.phone}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <div className="text-gray-900">
                  {profile.registrationDate.toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
              <button
                onClick={() => {
                  if (editMode === 'business') {
                    handleSaveProfile('business');
                  } else {
                    setEditMode('business');
                    setEditForm({
                      companyName: profile.companyName,
                      gstNumber: profile.gstNumber
                    });
                  }
                }}
                disabled={saving}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                {editMode === 'business' ? (
                  <>
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </>
                )}
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                {editMode === 'business' ? (
                  <input
                    type="text"
                    value={editForm.companyName || ''}
                    onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{profile.companyName || 'Not provided'}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                {editMode === 'business' ? (
                  <input
                    type="text"
                    value={editForm.gstNumber || ''}
                    onChange={(e) => setEditForm({ ...editForm, gstNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                ) : (
                  <div className="text-gray-900">{profile.gstNumber || 'Not provided'}</div>
                )}
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Addresses</h3>
              <button
                onClick={() => setShowAddAddress(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Address
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {profile.addresses.map((address) => (
                <div key={address.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{address.type}</span>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Default</span>
                        )}
                      </div>
                      <div className="text-gray-700">
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-600 hover:text-blue-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
            
            <div className="p-6">
              <button
                onClick={() => setShowPasswordChange(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Change Photo
            </button>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.preferences.emailNotifications}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      emailNotifications: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.preferences.smsNotifications}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      smsNotifications: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">SMS Notifications</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.preferences.marketingEmails}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      marketingEmails: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Marketing Emails</span>
              </label>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Orders</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Wishlist Items</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Inquiries</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}