import { createSlice } from "@reduxjs/toolkit";

interface SubCategoryState {
  loading: boolean;
  error: string | null;
}

const initialState: SubCategoryState = {
  loading: false,
  error: null,
};

const subCategoriesSlice = createSlice({
  name: "subCategories",
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

export const { setLoading, setError } = subCategoriesSlice.actions;
export default subCategoriesSlice.reducer;
