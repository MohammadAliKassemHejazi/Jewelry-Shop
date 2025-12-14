import { createSlice } from "@reduxjs/toolkit";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
}

interface ShopState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  products: [],
  loading: false,
  error: null,
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProducts, setLoading, setError } = shopSlice.actions;
export default shopSlice.reducer;
