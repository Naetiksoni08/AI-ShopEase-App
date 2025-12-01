import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;

// LOGIN USER
export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    const res = await axios.post(`${api}/api/auth/login`, credentials);

    const { token, user } = res.data.data;
    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("username", user.username);
    localStorage.setItem("role", user.role);
    localStorage.setItem("userId", user._id);
    return { token, username: user.username, role: user.role, userId: user._id };

  } catch (error) {
    const msg = error.response?.data?.message || "Login failed";
    return thunkAPI.rejectWithValue(msg);
  }
});


export const registerUser = createAsyncThunk("auth/registerUser", async (formData, thunkAPI) => {
  try {
    const res = await axios.post(`${api}/api/auth/register`, formData);
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Registration failed";
    return thunkAPI.rejectWithValue(msg);
  }
});


export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  return {};
});


const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || null,
    role: localStorage.getItem("role") || null,
    userId: localStorage.getItem("userId") || null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.username = action.payload.username;
        state.role = action.payload.role,
          state.userId = action.payload.userId;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.username = null;
      });
  },
});

export default authSlice.reducer;
