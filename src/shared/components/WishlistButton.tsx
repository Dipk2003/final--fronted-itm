'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '@/lib/wishlistApi';

interface WishlistButtonProps {
  productId: number;
  userId: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function WishlistButton({ 
  productId, 
  userId, 
  size = 'md', 
  showText = false 
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  const checkWishlistStatus = useCallback(async () => {
    try {
      const inWishlist = await wishlistApi.isInWishlist(productId.toString());
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  }, [productId]);

  useEffect(() => {
    checkWishlistStatus();
  }, [productId, userId, checkWishlistStatus]);

  const handleToggleWishlist = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (isInWishlist) {
        await wishlistApi.removeFromWishlist(productId.toString());
        setIsInWishlist(false);
      } else {
        await wishlistApi.addToWishlist(productId.toString());
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`
        flex items-center space-x-2 p-2 rounded-md transition-colors
        ${isInWishlist 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-red-500'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        className={`${sizeClasses[size]} ${isInWishlist ? 'fill-current' : 'stroke-current'}`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={isInWishlist ? 0 : 2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      
      {showText && (
        <span className="text-sm font-medium">
          {loading 
            ? 'Loading...' 
            : isInWishlist 
              ? 'In Wishlist' 
              : 'Add to Wishlist'
          }
        </span>
      )}
    </button>
  );
}
