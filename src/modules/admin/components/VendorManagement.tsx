'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  gstNumber: string;
  panNumber: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  totalProducts: number;
  totalOrders: number;
  rating: number;
}

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/vendors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setVendors(response.data);
    } catch (error: any) {
      setError('Failed to fetch vendors: ' + error.message);
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVendorStatus = async (vendorId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/admin/vendors/${vendorId}/status`, {
        isActive: !currentStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchVendors();
    } catch (error: any) {
      setError('Failed to update vendor status: ' + error.message);
    }
  };

  const approveVendor = async (vendorId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/admin/vendors/${vendorId}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchVendors();
    } catch (error: any) {
      setError('Failed to approve vendor: ' + error.message);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'ALL' || 
                         (filterStatus === 'ACTIVE' && vendor.isActive) ||
                         (filterStatus === 'INACTIVE' && !vendor.isActive) ||
                         (filterStatus === 'PENDING' && !vendor.isVerified) ||
                         (filterStatus === 'APPROVED' && vendor.isVerified);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (isActive: boolean, isVerified: boolean) => {
    if (!isVerified) return 'bg-yellow-100 text-yellow-800';
    if (isActive) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (isActive: boolean, isVerified: boolean) => {
    if (!isVerified) return 'Pending';
    if (isActive) return 'Active';
    return 'Inactive';
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return <div className="text-center py-8">Loading vendors...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vendor Management</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">{vendor.name}</div>
                    <div className="text-sm text-gray-500">{vendor.email}</div>
                    <div className="text-sm text-gray-500">{vendor.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">{vendor.businessName}</div>
                    <div className="text-sm text-gray-500">{vendor.businessAddress}</div>
                    <div className="text-sm text-gray-500">GST: {vendor.gstNumber}</div>
                    <div className="text-sm text-gray-500">PAN: {vendor.panNumber}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor.isActive, vendor.isVerified)}`}>
                    {getStatusText(vendor.isActive, vendor.isVerified)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>Products: {vendor.totalProducts}</div>
                  <div>Orders: {vendor.totalOrders}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="text-yellow-400">{getRatingStars(vendor.rating)}</span>
                    <span className="ml-1">({vendor.rating.toFixed(1)})</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(vendor.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setShowModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </button>
                  <button
                    onClick={() => toggleVendorStatus(vendor.id, vendor.isActive)}
                    className={`${vendor.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                  >
                    {vendor.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  {!vendor.isVerified && (
                    <button
                      onClick={() => approveVendor(vendor.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No vendors found matching your criteria.
        </div>
      )}

      {/* Vendor Detail Modal */}
      {showModal && selectedVendor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Vendor Details: {selectedVendor.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  <p><strong>Name:</strong> {selectedVendor.name}</p>
                  <p><strong>Email:</strong> {selectedVendor.email}</p>
                  <p><strong>Phone:</strong> {selectedVendor.phone}</p>
                  <p><strong>Status:</strong> {getStatusText(selectedVendor.isActive, selectedVendor.isVerified)}</p>
                  <p><strong>Joined:</strong> {new Date(selectedVendor.createdAt).toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Business Information</h4>
                  <p><strong>Business Name:</strong> {selectedVendor.businessName}</p>
                  <p><strong>Address:</strong> {selectedVendor.businessAddress}</p>
                  <p><strong>GST Number:</strong> {selectedVendor.gstNumber}</p>
                  <p><strong>PAN Number:</strong> {selectedVendor.panNumber}</p>
                  <p><strong>Rating:</strong> {getRatingStars(selectedVendor.rating)} ({selectedVendor.rating.toFixed(1)})</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-xl font-bold text-blue-600">{selectedVendor.totalProducts}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-xl font-bold text-green-600">{selectedVendor.totalOrders}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
