import { createSlice } from "@reduxjs/toolkit";

interface StoreState {
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  loading: false,
  error: null,
};

const storeSlice = createSlice({
  name: "store",
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

export const { setLoading, setError } = storeSlice.actions;
export default storeSlice.reducer;
