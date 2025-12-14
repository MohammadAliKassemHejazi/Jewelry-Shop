import { createSlice } from "@reduxjs/toolkit";

interface PaymentState {
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
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

export const { setLoading, setError } = paymentSlice.actions;
export default paymentSlice.reducer;
