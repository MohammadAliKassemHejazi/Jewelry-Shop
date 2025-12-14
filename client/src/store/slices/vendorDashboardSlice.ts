import { createSlice } from "@reduxjs/toolkit";

interface DashboardState {
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  loading: false,
  error: null,
};

const DashboardSlice = createSlice({
  name: "Dashboard",
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

export const { setLoading, setError } = DashboardSlice.actions;
export default DashboardSlice.reducer;
