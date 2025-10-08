'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/Button';

// Mock data for wishlist
const mockWishlist = [
  { id: 'P001', name: 'Bluetooth Headphones', price: 89.99 },
  { id: 'P002', name: 'Smart Watch', price: 199.99 },
  { id: 'P003', name: 'Wireless Charger', price: 39.99 }
];

export default function UserWishlist() {
  const [wishlist, setWishlist] = useState(mockWishlist);

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold">My Wishlist</h2>
        <div className="mt-6 space-y-4">
          {wishlist.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your wishlist is empty.</p>
            </div>
          ) : (
            wishlist.map(item => (
              <div key={item.id} className="flex justify-between items-center border rounded-lg p-4">
                <div>
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div>
                  <Button
                    onClick={() => removeFromWishlist(item.id)}
                    className="bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded-md text-sm"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
