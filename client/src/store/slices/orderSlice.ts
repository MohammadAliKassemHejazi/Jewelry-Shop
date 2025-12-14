import { createSlice } from "@reduxjs/toolkit";

interface OrderState {
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError } = orderSlice.actions;
export default orderSlice.reducer;
