// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

// -------------------- THUNKS --------------------

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Check if server returned JSON
      let data;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        return rejectWithValue({ message: "Server returned non-JSON response", raw: text });
      }

      if (!res.ok) {
        // Backend returned an error response
        // It could be { message, errors } or just { message }
        return rejectWithValue(data);
      }

      return data; // { user, token }
    } catch (err) {
      return rejectWithValue({ message: err.message || "Login failed" });
    }
  }
);


// SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      // Try parsing JSON safely
      let data;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        return rejectWithValue({ message: "Server returned non-JSON response", raw: text });
      }

      if (!res.ok) {
        // Pass the backend response to rejectWithValue
        return rejectWithValue(data);
      }

      return data;
    } catch (err) {
      return rejectWithValue({ message: err.message || "Signup failed" });
    }
  }
);




// VERIFY OTP & LOGIN
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
      return data; // { user, token }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// BECOME VENDOR
export const becomeVendor = createAsyncThunk(
  "auth/becomeVendor",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/users/be-vendor`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      // Parse JSON safely
      let data;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        return rejectWithValue({
          message: "Server returned non-JSON response",
          raw: text,
        });
      }

      if (!res.ok) {
        // Backend could return { message, errors } like Zod
        // Reject with full backend response
        return rejectWithValue(data);
      }

      return data.user; // Success
    } catch (err) {
      return rejectWithValue({ message: err.message || "Vendor request failed" });
    }
  }
);


// FETCH CURRENT USER
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch user");

      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// -------------------- SLICE --------------------
const initialState = {
  tempUser: null,
  user: (() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      if (!u) return null;
      return { ...u, _id: u._id || u.id };
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.cart = null;
      state.tempUser = null;
      state.error = null;
      state.successMessage = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("cart");
    },
    resetAuthMessage: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = {
          ...action.payload.user,
          _id: action.payload.user._id || action.payload.user.id,
        };
        state.user = user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", action.payload.token);
        state.successMessage = "Login successful!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //log out
      .addCase(logout, (state) => {
        state.userOrders = [];
        state.order = [];
        state.allOrders = [];
        state.vendorOrders = [];
        state.loading = false;
        state.success = false;
        state.error = null;
      })

      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tempUser = action.payload;
        state.successMessage = "OTP sent! Verify to login.";
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // VERIFY OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        const user = {
          ...action.payload.user,
          _id: action.payload.user._id || action.payload.user.id,
        };
        state.user = user;
        state.token = action.payload.token;
        state.tempUser = null;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", action.payload.token);
        state.successMessage = "OTP verified! Logged in successfully.";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // BECOME VENDOR
      .addCase(becomeVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(becomeVendor.fulfilled, (state, action) => {
        state.loading = false;
        const user = {
          ...action.payload,
          _id: action.payload._id || action.payload.id,
        };
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
        state.successMessage =
          "Vendor request submitted! Wait for admin verification.";
      })
      .addCase(becomeVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = {
          ...action.payload,
          _id: action.payload._id || action.payload.id,
        };
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, resetAuthMessage } = authSlice.actions;
export default authSlice.reducer;
