'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shared/components/Button';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { wishlistApi } from '@/lib/wishlistApi';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  productId, 
  className = '',
  size = 'md'
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if product is in wishlist
  const checkWishlistStatus = useCallback(async () => {
    try {
      const wishlistItems = await wishlistApi.getWishlist();
      const isInList = wishlistItems.some(item => item.productId === productId);
      setIsInWishlist(isInList);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  }, [productId]);

  // Toggle wishlist status
  const handleToggleWishlist = async () => {
    setLoading(true);
    try {
      if (isInWishlist) {
        await wishlistApi.removeFromWishlist(productId);
        setIsInWishlist(false);
      } else {
        await wishlistApi.addToWishlist(productId);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: { icon: 'h-4 w-4', button: 'p-1' },
    md: { icon: 'h-5 w-5', button: 'p-2' },
    lg: { icon: 'h-6 w-6', button: 'p-3' }
  };

  useEffect(() => {
    checkWishlistStatus();
  }, [productId, checkWishlistStatus]);

  return (
    <Button
      variant="outline"
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`${sizeConfig[size].button} border-gray-300 hover:border-red-300 hover:bg-red-50 transition-colors ${className}`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isInWishlist ? (
        <HeartSolidIcon className={`${sizeConfig[size].icon} text-red-500`} />
      ) : (
        <HeartOutlineIcon className={`${sizeConfig[size].icon} text-gray-500 hover:text-red-500`} />
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
        </div>
      )}
    </Button>
  );
};

export default WishlistButton;
