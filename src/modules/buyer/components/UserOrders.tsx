'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/Button';

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    total: 1299.99,
    status: 'Delivered',
    items: [
      { name: 'Laptop HP Pavilion', price: 1299.99, quantity: 1 }
    ]
  },
  {
    id: 'ORD-002',
    date: '2024-01-20',
    total: 45.99,
    status: 'Shipped',
    items: [
      { name: 'Wireless Mouse', price: 25.99, quantity: 1 },
      { name: 'Mouse Pad', price: 19.99, quantity: 1 }
    ]
  },
  {
    id: 'ORD-003',
    date: '2024-01-25',
    total: 199.99,
    status: 'Processing',
    items: [
      { name: 'Mechanical Keyboard', price: 199.99, quantity: 1 }
    ]
  }
];

export default function UserOrders() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const filteredOrders = mockOrders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Orders</h2>
          <div className="flex space-x-2">
            <Button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All
            </Button>
            <Button
              onClick={() => setFilter('processing')}
              className={`px-4 py-2 rounded-md ${filter === 'processing' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Processing
            </Button>
            <Button
              onClick={() => setFilter('shipped')}
              className={`px-4 py-2 rounded-md ${filter === 'shipped' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Shipped
            </Button>
            <Button
              onClick={() => setFilter('delivered')}
              className={`px-4 py-2 rounded-md ${filter === 'delivered' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Delivered
            </Button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                    <p className="text-gray-600 text-sm">Placed on {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">₹{order.total}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-sm font-medium">
                        {order.items[0].name}
                        {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-md text-sm"
                      >
                        {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                      </Button>
                      {order.status === 'Delivered' && (
                        <Button className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-md text-sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {selectedOrder === order.id && (
                  <div className="mt-4 pt-4 border-t bg-gray-50 rounded-md p-4">
                    <h4 className="font-semibold mb-3">Order Details</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total:</span>
                        <span>₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
