'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getVendorOrders } from '@/lib/api';

interface Order {
  id: number;
  customer: string;
  email: string;
  products: string[];
  amount: number;
  status: string;
  date: string;
  paymentStatus: string;
}

export default function VendorOrders() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data as fallback
  const mockOrders = useMemo<Order[]>(() => [
    {
      id: 12345,
      customer: 'John Doe',
      email: 'john@example.com',
      products: ['Laptop Stand', 'Wireless Mouse'],
      amount: 2500,
      status: 'pending',
      date: '2024-01-15',
      paymentStatus: 'paid'
    },
    {
      id: 12346,
      customer: 'Jane Smith',
      email: 'jane@example.com',
      products: ['USB Hub', 'Phone Case'],
      amount: 1800,
      status: 'processing',
      date: '2024-01-14',
      paymentStatus: 'paid'
    },
    {
      id: 12347,
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      products: ['Wireless Earbuds'],
      amount: 3200,
      status: 'shipped',
      date: '2024-01-13',
      paymentStatus: 'paid'
    },
    {
      id: 12348,
      customer: 'Sarah Wilson',
      email: 'sarah@example.com',
      products: ['Laptop Bag', 'Mouse Pad'],
      amount: 1500,
      status: 'delivered',
      date: '2024-01-12',
      paymentStatus: 'paid'
    }
  ], []);

  // Load orders from API
  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) {
        console.log('No user ID available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Loading orders for vendor:', user.id);
        const response = await getVendorOrders(Number(user.id), currentPage, 10);
        console.log('Orders response:', response.data);
        
        // Handle both array and paginated response formats
        const ordersData = response.data.content || response.data;
        const transformedOrders = (Array.isArray(ordersData) ? ordersData : []).map((order: any) => ({
          id: order.id || order.orderId,
          customer: order.customerName || order.customer || order.user?.name || 'Unknown Customer',
          email: order.customerEmail || order.email || order.user?.email || '',
          products: order.products?.map((p: any) => p.name || p.productName) || 
                   order.orderItems?.map((item: any) => item.productName || item.product?.name) || 
                   [order.productName || 'Unknown Product'],
          amount: order.totalAmount || order.amount || order.total || 0,
          status: order.status || order.orderStatus || 'pending',
          date: order.orderDate || order.createdAt || order.date || new Date().toISOString().split('T')[0],
          paymentStatus: order.paymentStatus || 'pending'
        }));
        
        setOrders(transformedOrders);
        setTotalPages(response.data.totalPages || 1);
        setError(null);
      } catch (err: any) {
        console.error('Error loading orders:', err);
        setError('Failed to load orders. Using fallback data.');
        
        // Fallback to mock data if API fails
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.id, currentPage, mockOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on orders:`, selectedOrders);
    setSelectedOrders([]);
  };

  // Calculate dynamic stats
  const stats = {
    total: orders.length,
    pending: orders.filter(order => order.status === 'pending').length,
    processing: orders.filter(order => order.status === 'processing').length,
    shipped: orders.filter(order => order.status === 'shipped').length,
    delivered: orders.filter(order => order.status === 'delivered').length
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
            <p className="text-gray-600 mt-1">Loading your orders...</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600 mt-1">Track and manage your customer orders</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            📊 Export Orders
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            🔔 Send Notifications
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <p className="text-yellow-800">{error}</p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <span className="text-2xl">📋</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <span className="text-2xl">⏳</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            </div>
            <span className="text-2xl">⚙️</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
            </div>
            <span className="text-2xl">🚚</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'processing', 'shipped', 'delivered'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)} Orders
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search orders..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Date Range</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedOrders.length} order(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('ship')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Mark as Shipped
              </button>
              <button
                onClick={() => handleBulkAction('cancel')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Cancel Orders
              </button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(filteredOrders.map(order => order.id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Products</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium">#{order.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {order.products.map((product, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {product}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">₹{order.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm">
                        Update
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
