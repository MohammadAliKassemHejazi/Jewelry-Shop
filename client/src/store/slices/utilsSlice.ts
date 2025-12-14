import { createSlice } from "@reduxjs/toolkit";

interface UtilsState {
  loading: boolean;
  error: string | null;
}

const initialState: UtilsState = {
  loading: false,
  error: null,
};

const utilsSlice = createSlice({
  name: "utils",
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

export const { setLoading, setError } = utilsSlice.actions;
export default utilsSlice.reducer;
