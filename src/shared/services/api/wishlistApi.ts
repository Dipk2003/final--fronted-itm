import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: string;
  productImage: string;
  addedAt: string;
}

export interface AddToWishlistRequest {
  productId: string;
}

export const wishlistApi = {
  // Get user's wishlist
  getWishlist: async (page: number = 0, size: number = 20): Promise<WishlistItem[]> => {
    try {
      const response = await api.get('/api/wishlist/my-wishlist', {
        params: { page, size }
      });
      return response.data.content || response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  // Add item to wishlist
  addToWishlist: async (productId: string): Promise<WishlistItem> => {
    try {
      const response = await api.post(`/api/wishlist/add/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId: string): Promise<void> => {
    try {
      await api.delete(`/api/wishlist/remove/${productId}`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Check if product is in wishlist
  isInWishlist: async (productId: string): Promise<boolean> => {
    try {
      const response = await api.get(`/api/wishlist/check/${productId}`);
      return response.data.inWishlist;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  },

  // Get wishlist count
  getWishlistCount: async (): Promise<number> => {
    try {
      const response = await api.get('/api/wishlist/count');
      return response.data.count;
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
      return 0;
    }
  }
};
