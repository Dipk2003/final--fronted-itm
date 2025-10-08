import { api } from './api';

export interface Review {
  id?: number;
  user: any;
  product: any;
  vendor: any;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorReview {
  id?: number;
  user: any;
  vendor: any;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const reviewApi = {
  // Create a product review
  createProductReview: async (review: Partial<Review>) => {
    const response = await api.post('/api/reviews/product', review);
    return response.data;
  },

  // Create a vendor review
  createVendorReview: async (vendorReview: Partial<VendorReview>) => {
    const response = await api.post('/api/reviews/vendor', vendorReview);
    return response.data;
  },

  // Get reviews for a product
  getProductReviews: async (productId: number) => {
    const response = await api.get(`/api/reviews/product/${productId}`);
    return response.data;
  },

  // Get reviews for a vendor
  getVendorReviews: async (vendorId: number) => {
    const response = await api.get(`/api/reviews/vendor/${vendorId}`);
    return response.data;
  },

  // Calculate average rating for a product
  getProductAverageRating: async (productId: number) => {
    const reviews = await reviewApi.getProductReviews(productId);
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
    return total / reviews.length;
  },

  // Calculate average rating for a vendor
  getVendorAverageRating: async (vendorId: number) => {
    const reviews = await reviewApi.getVendorReviews(vendorId);
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum: number, review: VendorReview) => sum + review.rating, 0);
    return total / reviews.length;
  }
};
