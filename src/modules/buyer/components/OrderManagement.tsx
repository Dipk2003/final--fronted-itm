'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  RefreshCw,
  AlertCircle,
  Star,
  MapPin,
  Calendar,
  Filter
} from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  orderDate: Date;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  vendor: {
    id: string;
    name: string;
    location: string;
    rating: number;
  };
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  trackingNumber?: string;
  expectedDelivery?: Date;
  deliveredDate?: Date;
}

interface OrderManagementProps {
  compact?: boolean;
}

export default function OrderManagement({ compact = false }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyer/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.map((order: any) => ({
        ...order,
        orderDate: new Date(order.orderDate),
        expectedDelivery: order.expectedDelivery ? new Date(order.expectedDelivery) : undefined,
        deliveredDate: order.deliveredDate ? new Date(order.deliveredDate) : undefined,
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      console.error('Error fetching orders:', err);
      
      // Mock data for development
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          orderDate: new Date(Date.now() - 86400000 * 2),
          status: 'SHIPPED',
          totalAmount: 15000,
          paymentStatus: 'PAID',
          paymentMethod: 'UPI',
          vendor: {
            id: '1',
            name: 'Fashion Hub India',
            location: 'Mumbai, Maharashtra',
            rating: 4.5
          },
          items: [
            {
              id: '1',
              productId: '101',
              productName: 'Premium Cotton T-Shirts',
              productImage: '/api/placeholder/100/100',
              quantity: 60,
              unitPrice: 250,
              totalPrice: 15000
            }
          ],
          shippingAddress: {
            street: '123 Business Park, Sector 15',
            city: 'Gurgaon',
            state: 'Haryana',
            zipCode: '122001'
          },
          trackingNumber: 'TRK123456789',
          expectedDelivery: new Date(Date.now() + 86400000 * 2)
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          orderDate: new Date(Date.now() - 86400000 * 7),
          status: 'DELIVERED',
          totalAmount: 25000,
          paymentStatus: 'PAID',
          paymentMethod: 'Bank Transfer',
          vendor: {
            id: '2',
            name: 'Kitchen Pro Solutions',
            location: 'Delhi, Delhi',
            rating: 4.7
          },
          items: [
            {
              id: '2',
              productId: '102',
              productName: 'Stainless Steel Kitchen Utensils Set',
              productImage: '/api/placeholder/100/100',
              quantity: 15,
              unitPrice: 1500,
              totalPrice: 22500
            },
            {
              id: '3',
              productId: '103',
              productName: 'Commercial Grade Mixing Bowls',
              productImage: '/api/placeholder/100/100',
              quantity: 10,
              unitPrice: 250,
              totalPrice: 2500
            }
          ],
          shippingAddress: {
            street: '456 Industrial Area, Phase 2',
            city: 'Noida',
            state: 'Uttar Pradesh',
            zipCode: '201301'
          },
          deliveredDate: new Date(Date.now() - 86400000 * 2)
        }
      ];
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4" />;
      case 'SHIPPED':
        return <Truck className="w-4 h-4" />;
      case 'DELIVERED':
        return <Package className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
    
    if (dateFilter !== 'ALL') {
      const now = new Date();
      const orderDate = order.orderDate;
      
      switch (dateFilter) {
        case 'TODAY':
          if (orderDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'WEEK':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (orderDate < weekAgo) return false;
          break;
        case 'MONTH':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (orderDate < monthAgo) return false;
          break;
      }
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Orders</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchOrders}
            className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {!compact && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
              <p className="text-gray-600">{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found</p>
            </div>
            
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">Last Week</option>
              <option value="MONTH">Last Month</option>
            </select>
          </div>
        </>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your filters or place your first order</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(compact ? filteredOrders.slice(0, 3) : filteredOrders).map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">#{order.orderNumber}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.orderDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{order.vendor.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                        <span>{order.vendor.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      ₹{order.totalAmount.toLocaleString()}
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus.charAt(0) + order.paymentStatus.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mb-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 min-w-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{item.productName}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <span className="text-sm text-gray-600">+{order.items.length - 3} more</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tracking and Delivery Info */}
                {order.trackingNumber && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                        <p className="text-sm text-blue-700">{order.trackingNumber}</p>
                      </div>
                      {order.expectedDelivery && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-900">Expected Delivery</p>
                          <p className="text-sm text-blue-700">{formatDate(order.expectedDelivery)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    
                    <button className="flex items-center gap-2 text-green-600 hover:text-green-800 text-sm font-medium">
                      <Download className="w-4 h-4" />
                      Invoice
                    </button>
                    
                    {order.status === 'SHIPPED' && (
                      <button className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm font-medium">
                        <Truck className="w-4 h-4" />
                        Track Order
                      </button>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {order.paymentMethod}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-gray-600">#{selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Status and Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status.charAt(0) + selectedOrder.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus.charAt(0) + selectedOrder.paymentStatus.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
                  <div className="text-gray-700">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                    <p>{selectedOrder.shippingAddress.zipCode}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.productName}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Unit Price: ₹{item.unitPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{item.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
