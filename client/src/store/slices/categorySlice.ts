import { createSlice } from "@reduxjs/toolkit";

interface CategoryState {
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
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

export const { setLoading, setError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
