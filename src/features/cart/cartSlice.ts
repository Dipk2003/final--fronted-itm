import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define CartItem interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  vendorId: string;
  vendorName: string;
  category: string;
  description?: string;
  sku?: string;
  unit?: string;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  inStock?: boolean;
  stockQuantity?: number;
}

// Define Cart state interface
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Helper functions
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, totalAmount };
};

// Async thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    // Mock API call - replace with actual API
    return new Promise<CartItem>((resolve) => {
      setTimeout(() => {
        resolve({
          ...item,
          quantity: item.quantity || 1,
        } as CartItem);
      }, 300);
    });
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string) => {
    // Mock API call
    return new Promise<string>((resolve) => {
      setTimeout(() => resolve(itemId), 300);
    });
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    // Mock API call
    return new Promise<{ itemId: string; quantity: number }>((resolve) => {
      setTimeout(() => resolve({ itemId, quantity }), 300);
    });
  }
);

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  // Mock API call
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(true), 300);
  });
});

export const loadCartFromStorage = createAsyncThunk(
  'cart/loadFromStorage',
  async () => {
    // Load cart from localStorage or API
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart) as CartItem[];
    }
    return [];
  }
);

export const syncCartToStorage = createAsyncThunk(
  'cart/syncToStorage',
  async (items: CartItem[]) => {
    // Save cart to localStorage or API
    localStorage.setItem('cart', JSON.stringify(items));
    return items;
  }
);

// Create cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Synchronous reducers for immediate updates
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      state.lastUpdated = new Date().toISOString();
    },

    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      state.lastUpdated = new Date().toISOString();
    },

    updateCartItem: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== itemId);
        } else {
          item.quantity = quantity;
        }
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        state.lastUpdated = new Date().toISOString();
      }
    },

    clearCartItems: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.lastUpdated = new Date().toISOString();
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingItem = state.items.find(item => item.id === action.payload.id);
        
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add item to cart';
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to remove item from cart';
      });

    // Update quantity
    builder
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        const { itemId, quantity } = action.payload;
        const item = state.items.find(item => item.id === itemId);
        
        if (item) {
          if (quantity <= 0) {
            state.items = state.items.filter(item => item.id !== itemId);
          } else {
            item.quantity = quantity;
          }
          
          const totals = calculateTotals(state.items);
          state.totalItems = totals.totalItems;
          state.totalAmount = totals.totalAmount;
          state.lastUpdated = new Date().toISOString();
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update item quantity';
      });

    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to clear cart';
      });

    // Load from storage
    builder
      .addCase(loadCartFromStorage.fulfilled, (state, action) => {
        state.items = action.payload;
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
      });

    // Sync to storage
    builder
      .addCase(syncCartToStorage.fulfilled, (state, action) => {
        state.lastUpdated = new Date().toISOString();
      });
  },
});

// Export actions and selectors
export const {
  addCartItem,
  removeCartItem,
  updateCartItem,
  clearCartItems,
  clearError,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotalItems = (state: { cart: CartState }) => state.cart.totalItems;
export const selectCartTotalAmount = (state: { cart: CartState }) => state.cart.totalAmount;
export const selectCartIsLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;

export default cartSlice.reducer;
