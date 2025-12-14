import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { cartApi } from "@/services/api";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartApi.get();
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (params: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const cart = await cartApi.addItem(params.productId, params.quantity);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add item to cart");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (params: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const cart = await cartApi.updateItem(params.itemId, params.quantity);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update cart item");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const cart = await cartApi.removeItem(itemId);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove item from cart");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await cartApi.clear();
      return { items: [], total: 0, itemCount: 0 };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Local cart actions for immediate UI updates
    addItemLocal: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = state.items.reduce((sum, item) => sum + (item.product?.price * item.quantity || 0), 0);
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    removeItemLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.product?.price * item.quantity || 0), 0);
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    updateQuantityLocal: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        }
      }
      state.total = state.items.reduce((sum, item) => sum + (item.product?.price * item.quantity || 0), 0);
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.itemCount = action.payload.itemCount || 0;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.itemCount = action.payload.itemCount || 0;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.itemCount = action.payload.itemCount || 0;
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.itemCount = action.payload.itemCount || 0;
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.itemCount = action.payload.itemCount;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, addItemLocal, removeItemLocal, updateQuantityLocal } = cartSlice.actions;
export default cartSlice.reducer;
