import { createSlice } from "@reduxjs/toolkit";

interface RoleState {
  loading: boolean;
  error: string | null;
}

const initialState: RoleState = {
  loading: false,
  error: null,
};

const rolesSlice = createSlice({
  name: "roles",
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

export const { setLoading, setError } = rolesSlice.actions;
export default rolesSlice.reducer;
