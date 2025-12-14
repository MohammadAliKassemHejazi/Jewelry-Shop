import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import httpClient from "@/utils/httpClient";

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone?: string;
  role?: string;
  isAdmin?: boolean;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await httpClient.post("/api/auth/signin", credentials);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = (error as any)?.response?.data?.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await httpClient.post("/api/auth/register", userData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = (error as any)?.response?.data?.message || "Registration failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getSession = createAsyncThunk(
  "user/getSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpClient.get("/api/auth/session");
      return response.data;
    } catch (error: unknown) {
      const errorMessage = (error as any)?.response?.data?.message || "Session check failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpClient.get("/api/auth/signout");
      return response.data;
    } catch (error: unknown) {
      const errorMessage = (error as any)?.response?.data?.message || "Logout failed";
      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Session
      .addCase(getSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(getSession.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
