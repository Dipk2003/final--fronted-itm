'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeCartItem, updateCartItem, clearCartItems } from '@/features/cart/cartSlice';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card';
import { TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalAmount, isLoading } = useSelector(
    (state: RootState) => state.cart
  );

  const handleRemoveItem = (id: string) => {
    dispatch(removeCartItem(id));
  };

  const handleUpdateQuantity = (id: string, quantity: string) => {
    if (parseInt(quantity) > 0) {
      dispatch(updateCartItem({ itemId: id, quantity: parseInt(quantity) }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCartItems());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600">Add some products to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCartIcon className="h-6 w-6" />
              <span>Shopping Cart ({totalItems} items)</span>
            </CardTitle>
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700"
            >
              Clear Cart
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image
                    src={item.image || '/api/placeholder/80/80'}
                    alt={item.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.vendorName}</p>
                  <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                  <p className="text-sm text-gray-600">Category: {item.category}</p>
                  {item.description && (
                    <p className="text-sm text-gray-600">Description: {item.description}</p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Qty:</label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                    className="w-20"
                    min="1"
                  />
                </div>

                {/* Remove Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Total Items: {totalItems}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                Total Amount: ₹{totalAmount.toFixed(2)}
              </p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Proceed to Checkout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;
