'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Package, Truck, CheckCircle, Clock, Eye, Download } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
}

export default function OrdersPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample orders data - replace with API call
  const sampleOrders = useMemo<Order[]>(() => [
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      date: '2024-07-10',
      status: 'delivered',
      totalAmount: 53500,
      items: [
        {
          id: 1,
          name: 'Premium Laptop',
          price: 45000,
          quantity: 1,
          image: '/api/placeholder/300/200'
        }
      ],
      shippingAddress: '123 Business Street, Mumbai, Maharashtra 400001',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-002',
      date: '2024-07-12',
      status: 'shipped',
      totalAmount: 20060,
      items: [
        {
          id: 2,
          name: 'Office Chair',
          price: 8500,
          quantity: 2,
          image: '/api/placeholder/300/200'
        }
      ],
      shippingAddress: '456 Corporate Avenue, Delhi, Delhi 110001',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 3,
      orderNumber: 'ORD-2024-003',
      date: '2024-07-13',
      status: 'processing',
      totalAmount: 29500,
      items: [
        {
          id: 3,
          name: 'Industrial Printer',
          price: 25000,
          quantity: 1,
          image: '/api/placeholder/300/200'
        }
      ],
      shippingAddress: '789 Industrial Zone, Bangalore, Karnataka 560001'
    }
  ], []);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setOrders(sampleOrders);
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, sampleOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'processing':
        return <Package className="text-blue-500" size={20} />;
      case 'shipped':
        return <Truck className="text-purple-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login to View Orders</h2>
          <p className="text-gray-600 mb-8">You need to be logged in to access your order history.</p>
          <Link href="/login" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        
        {/* Filter Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Found</h2>
          <p className="text-gray-600 mb-8">
            {selectedStatus === 'all' 
              ? "You haven't placed any orders yet." 
              : `No orders found with status: ${selectedStatus}`}
          </p>
          <Link href="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 md:mt-0 text-sm text-gray-600">
                    <p>Order Date: {new Date(order.date).toLocaleDateString()}</p>
                    <p className="font-semibold">Total: ₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <p className="text-gray-600">{order.shippingAddress}</p>
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Tracking Number: <span className="font-mono">{order.trackingNumber}</span>
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    <Eye size={16} />
                    View Details
                  </button>
                  
                  {order.status === 'delivered' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                      <Download size={16} />
                      Download Invoice
                    </button>
                  )}
                  
                  {(order.status === 'shipped' || order.status === 'delivered') && order.trackingNumber && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                      <Truck size={16} />
                      Track Package
                    </button>
                  )}

                  {order.status === 'pending' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
