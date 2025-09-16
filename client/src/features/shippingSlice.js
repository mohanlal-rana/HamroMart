import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

// Fetch shipping address
export const fetchShippingAddress = createAsyncThunk(
  "shipping/fetchShippingAddress",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/shipping/shippingAddress`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      return data.address || null; // always return the address object
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Add shipping address
export const addShippingAddress = createAsyncThunk(
  "shipping/addShippingAddress",
  async (address, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/shipping/add-shippingAddress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(address),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add");
      return data.address;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update shipping address
export const updateShippingAddress = createAsyncThunk(
  "shipping/updateShippingAddress",
  async (address, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/shipping/update-shippingAddress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(address),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      return data.address;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const shippingSlice = createSlice({
  name: "shipping",
  initialState: {
    address: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(fetchShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(addShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(updateShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default shippingSlice.reducer;
