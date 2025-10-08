import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/features/cart/cartSlice';
import authReducer from '@/features/auth/authSlice';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  avatar?: string;
  isVerified: boolean;
}

// Root state type
export interface RootState {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    loading: boolean;
    error: string | null;
  };
  cart: {
    items: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
    totalItems: number;
    totalAmount: number;
    loading: boolean;
    error: string | null;
  };
}

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer
  }
});

export type AppDispatch = typeof store.dispatch;
