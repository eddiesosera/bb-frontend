import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
interface AuthState {
  user: any;
  token: string | null;
  authorId: string | null; // Added authorId
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  authorId: localStorage.getItem("authorId"),
  loading: false,
  error: null,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk for registering a user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/auth/register`, userData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Async thunk for logging in a user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        credentials
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Async thunk to fetch current user
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      const authorId = state.auth.authorId;

      if (!token || !authorId) {
        return rejectWithValue("No token or authorId found");
      }

      const response = await axios.get(`${API_BASE_URL}/api/auth/${authorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.authorId = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("authorId");
    },
    resetAuthState(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register User
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      console.log("Register fulfilled:", action.payload);
      state.loading = false;
      state.user = action.payload.author;
      state.token = action.payload.token;
      state.authorId = action.payload.author._id;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("authorId", action.payload.author._id);
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      console.log("Register rejected:", action.payload);
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login User
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log("Login fulfilled:", action.payload);
      state.loading = false;
      state.user = action.payload.author;
      state.token = action.payload.token;
      state.authorId = action.payload.author._id;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("authorId", action.payload.author._id);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      console.log("Login rejected:", action.payload);
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch User
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      console.log("FetchUser fulfilled:", action.payload);
      state.loading = false;
      state.user = action.payload.author;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      console.log("FetchUser rejected:", action.payload);
      state.loading = false;
      state.error = action.payload as string;
      state.token = null;
      state.authorId = null;
      // localStorage.removeItem("token");
      // localStorage.removeItem("authorId");
      state.user = null;
    });
  },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
