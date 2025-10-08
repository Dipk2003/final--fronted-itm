'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/shared/components/Button';
import { Card, CardContent } from '@/shared/components/Card';
import { Badge } from '@/shared/components';
import { wishlistApi } from '@/lib/wishlistApi';
import { TrashIcon, HeartIcon } from '@heroicons/react/24/outline';

interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: string;
  productImage: string;
  addedAt: string;
}

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const items = await wishlistApi.getWishlist();
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const handleRemoveItem = async (productId: string) => {
    setRemoving(productId);
    try {
      await wishlistApi.removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    } finally {
      setRemoving(null);
    }
  };

  // Clear entire wishlist
  const handleClearWishlist = async () => {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) {
      return;
    }

    try {
      // Remove all items individually (if no bulk delete endpoint)
      await Promise.all(
        wishlistItems.map(item => wishlistApi.removeFromWishlist(item.productId))
      );
      setWishlistItems([]);
      alert('Wishlist cleared successfully!');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      alert('Failed to clear wishlist. Please try again.');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading your wishlist...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <HeartIcon className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
          
          {wishlistItems.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Save products you love to easily find them later
              </p>
              <Link href="/">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {/* Product Image */}
                  <div className="relative h-48 w-full mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform"
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={removing === item.productId}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remove from wishlist"
                    >
                      {removing === item.productId ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem]">
                      {item.productName}
                    </h3>
                    
                    <p className="text-lg font-bold text-indigo-600">
                      ₹ {item.productPrice}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                      <Badge variant="outline" className="text-xs">
                        Saved
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 space-y-2">
                    <Link href={`/productdetails/${item.productId}`}>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                        View Details
                      </Button>
                    </Link>
                    
                    <Button
                      variant="outline"
                      className="w-full text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                      onClick={() => {
                        // Add to cart logic here
                        alert('Add to cart functionality will be implemented');
                      }}
                    >
                      Quick Inquiry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recently Viewed Section */}
        {wishlistItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              You might also like
            </h2>
            <Card className="p-6 text-center text-gray-500">
              <p>Related products feature coming soon...</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
