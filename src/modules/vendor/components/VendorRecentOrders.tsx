'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getVendorOrders } from '@/lib/api';

interface RecentOrder {
  id: number;
  name: string;
  status: string;
  price: string;
  date: string;
}

export default function VendorRecentOrders() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecentOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getVendorOrders(Number(user.id), 0, 5); // Get last 5 orders
        const ordersData = response.data.content || response.data || [];
        
        const transformedOrders = ordersData.slice(0, 5).map((order: any) => ({
          id: order.id || order.orderId,
          name: order.products?.[0]?.name || 
                order.orderItems?.[0]?.productName || 
                order.productName || 
                'Unknown Product',
          status: (order.status || order.orderStatus || 'pending')
            .charAt(0).toUpperCase() + (order.status || order.orderStatus || 'pending').slice(1),
          price: `₹${(order.totalAmount || order.amount || order.total || 0).toLocaleString()}`,
          date: new Date(order.orderDate || order.createdAt || order.date || Date.now())
            .toLocaleDateString('en-IN')
        }));
        
        setOrders(transformedOrders);
        setError(null);
      } catch (err: any) {
        console.error('Error loading recent orders:', err);
        setError('Failed to load recent orders');
        
        // Fallback to mock data
        setOrders([
          { id: 1, name: "Dell XPS 13", status: "Completed", price: "₹75,000", date: "15/06/2024" },
          { id: 2, name: "HP Pavilion", status: "Processing", price: "₹55,000", date: "14/06/2024" },
          { id: 3, name: "MacBook Air", status: "Shipped", price: "₹95,000", date: "13/06/2024" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadRecentOrders();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'shipped':
        return 'text-purple-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-md border shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between text-sm border-b pb-2 animate-pulse">
              <div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="text-right">
                <div className="w-16 h-4 bg-gray-200 rounded mb-1"></div>
                <div className="w-12 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md border shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>
      {error && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          {error}
        </div>
      )}
      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">No recent orders found</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((item, i) => (
            <li key={item.id || i} className="flex justify-between text-sm border-b pb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-700">{item.price}</p>
                <p className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
