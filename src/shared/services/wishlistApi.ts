import { api } from './api';

export interface WishlistItem {
  id?: number;
  user: any;
  product: any;
  createdAt?: string;
}

export const wishlistApi = {
  // Add item to wishlist
  addToWishlist: async (wishlistItem: Partial<WishlistItem>) => {
    const response = await api.post('/api/wishlist', wishlistItem);
    return response.data;
  },

  // Get user's wishlist
  getUserWishlist: async (userId: number) => {
    const response = await api.get(`/api/wishlist/user/${userId}`);
    return response.data;
  },

  // Remove item from wishlist
  removeFromWishlist: async (itemId: number) => {
    const response = await api.delete(`/api/wishlist/${itemId}`);
    return response.data;
  },

  // Check if product is in wishlist
  isInWishlist: async (userId: number, productId: number) => {
    try {
      const wishlist = await wishlistApi.getUserWishlist(userId);
      return wishlist.some((item: WishlistItem) => item.product.id === productId);
    } catch (error) {
      return false;
    }
  },

  // Toggle wishlist item
  toggleWishlist: async (userId: number, productId: number) => {
    const wishlist = await wishlistApi.getUserWishlist(userId);
    const existingItem = wishlist.find((item: WishlistItem) => item.product.id === productId);
    
    if (existingItem) {
      await wishlistApi.removeFromWishlist(existingItem.id!);
      return false; // Removed from wishlist
    } else {
      await wishlistApi.addToWishlist({
        user: { id: userId },
        product: { id: productId }
      });
      return true; // Added to wishlist
    }
  }
};
