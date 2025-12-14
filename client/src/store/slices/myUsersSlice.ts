import { createSlice } from "@reduxjs/toolkit";

interface UsersState {
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
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

export const { setLoading, setError } = usersSlice.actions;
export default usersSlice.reducer;
