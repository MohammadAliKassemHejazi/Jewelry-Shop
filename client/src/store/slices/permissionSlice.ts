import { createSlice } from "@reduxjs/toolkit";

interface PermissionState {
  loading: boolean;
  error: string | null;
}

const initialState: PermissionState = {
  loading: false,
  error: null,
};

const permissionSlice = createSlice({
  name: "permission",
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

export const { setLoading, setError } = permissionSlice.actions;
export default permissionSlice.reducer;
