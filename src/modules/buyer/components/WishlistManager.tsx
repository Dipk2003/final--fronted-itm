'use client';

import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, Star, MapPin, AlertCircle } from 'lucide-react';

interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  vendor: {
    id: string;
    name: string;
    location: string;
    rating: number;
  };
  category: string;
  location: {
    city: string;
    state: string;
  };
  isInCart?: boolean;
  rating: number;
  reviewCount: number;
  minOrderQuantity: number;
  addedAt: Date;
  availability: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LIMITED';
}

export default function WishlistManager() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyer/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      setWishlistItems(data.map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt)
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wishlist');
      console.error('Error fetching wishlist:', err);
      
      // Mock data for development
      const mockWishlist: WishlistItem[] = [
        {
          id: '1',
          productId: '101',
          productName: 'Premium Cotton T-Shirts',
          description: 'High-quality cotton t-shirts in bulk quantities. Perfect for retail or corporate use.',
          price: 250,
          originalPrice: 350,
          images: ['/api/placeholder/300/300'],
          vendor: {
            id: '1',
            name: 'Fashion Hub India',
            location: 'Mumbai, Maharashtra',
            rating: 4.5
          },
          category: 'Clothing',
          location: {
            city: 'Mumbai',
            state: 'Maharashtra'
          },
          isInCart: false,
          rating: 4.3,
          reviewCount: 127,
          minOrderQuantity: 50,
          addedAt: new Date(Date.now() - 86400000 * 3),
          availability: 'IN_STOCK'
        },
        {
          id: '2',
          productId: '102',
          productName: 'Stainless Steel Kitchen Utensils Set',
          description: 'Complete kitchen utensils set made from high-grade stainless steel.',
          price: 1500,
          originalPrice: 2000,
          images: ['/api/placeholder/300/300'],
          vendor: {
            id: '2',
            name: 'Kitchen Pro Solutions',
            location: 'Delhi, Delhi',
            rating: 4.7
          },
          category: 'Kitchen',
          location: {
            city: 'Delhi',
            state: 'Delhi'
          },
          isInCart: true,
          rating: 4.6,
          reviewCount: 89,
          minOrderQuantity: 10,
          addedAt: new Date(Date.now() - 86400000),
          availability: 'LIMITED'
        }
      ];
      setWishlistItems(mockWishlist);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyer/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      } else {
        throw new Error('Failed to remove item from wishlist');
      }
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      // For development, simulate removal
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const addToCart = async (item: WishlistItem) => {
    if (item.isInCart) return;
    
    setAddingToCart(prev => new Set(prev).add(item.id));
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buyer/cart/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: item.productId,
          quantity: item.minOrderQuantity
        }),
      });

      if (response.ok) {
        setWishlistItems(prev => prev.map(wishlistItem => 
          wishlistItem.id === item.id 
            ? { ...wishlistItem, isInCart: true }
            : wishlistItem
        ));
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (err) {
      console.error('Error adding item to cart:', err);
      // For development, simulate adding to cart
      setWishlistItems(prev => prev.map(wishlistItem => 
        wishlistItem.id === item.id 
          ? { ...wishlistItem, isInCart: true }
          : wishlistItem
      ));
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'IN_STOCK':
        return 'bg-green-100 text-green-800';
      case 'LIMITED':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'IN_STOCK':
        return 'In Stock';
      case 'LIMITED':
        return 'Limited Stock';
      case 'OUT_OF_STOCK':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse flex-1"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Wishlist</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchWishlist}
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
          <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
          <p className="text-gray-600">{wishlistItems.length} items saved</p>
        </div>
        
        {wishlistItems.length > 0 && (
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-600 hover:text-gray-800">
              Sort by: Recently Added
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">Save items you're interested in to your wishlist</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img
                  src={item.images[0]}
                  alt={item.productName}
                  className="w-full h-48 object-cover"
                />
                
                {/* Availability Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(item.availability)}`}>
                    {getAvailabilityText(item.availability)}
                  </span>
                </div>

                {/* Added Date */}
                <div className="absolute top-3 right-3">
                  <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    Added {formatDate(item.addedAt)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.productName}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    <span className="text-sm text-gray-600">{item.rating}</span>
                  </div>
                  <span className="text-sm text-gray-400">({item.reviewCount})</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location.city}, {item.location.state}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xl font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{item.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Min: {item.minOrderQuantity} pcs
                  </div>
                </div>
                
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => addToCart(item)}
                    disabled={item.isInCart || item.availability === 'OUT_OF_STOCK' || addingToCart.has(item.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                      item.isInCart
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : item.availability === 'OUT_OF_STOCK'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {addingToCart.has(item.id) 
                      ? 'Adding...' 
                      : item.isInCart 
                        ? 'In Cart' 
                        : item.availability === 'OUT_OF_STOCK'
                          ? 'Out of Stock'
                          : 'Add to Cart'
                    }
                  </button>
                  
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={removingItems.has(item.id)}
                    className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    {removingItems.has(item.id) ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{item.vendor.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <span className="text-gray-600">{item.vendor.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bulk Actions */}
      {wishlistItems.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
            </span>
            <div className="flex items-center gap-3">
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Share Wishlist
              </button>
              <button 
                onClick={() => {
                  const availableItems = wishlistItems.filter(item => 
                    !item.isInCart && item.availability !== 'OUT_OF_STOCK'
                  );
                  availableItems.forEach(item => addToCart(item));
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Add All to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}