import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// -------------------- THUNKS --------------------

// Create a new COD order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/orders/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch orders of a user
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user orders");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch single order by ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch order");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all orders (Admin)
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch all orders");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch vendor orders
export const fetchVendorOrders = createAsyncThunk(
  "orders/fetchVendorOrders",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/orders/vendor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch vendor orders");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update order payment (mark paid)
export const updateOrderPayment = createAsyncThunk(
  "orders/updateOrderPayment",
  async (orderId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/pay`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update payment");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Mark order delivered
export const markOrderDelivered = createAsyncThunk(
  "orders/markOrderDelivered",
  async (orderId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/deliver`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to mark order delivered");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// -------------------- NEW: Confirm Order --------------------
export const confirmOrder = createAsyncThunk(
  "orders/confirmOrder",
  async (orderId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/orders/confirm-order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to confirm order");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// -------------------- SLICE --------------------
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    order: [],
    userOrders: [],
    allOrders: [],
    vendorOrders: [],
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.userOrders = [];
      state.allOrders = [];
      state.vendorOrders = [];
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // existing thunks handled here...
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserOrders.fulfilled, (state, action) => { state.loading = false; state.userOrders = action.payload; })
      .addCase(fetchUserOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchOrderById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; })
      .addCase(fetchOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchAllOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.loading = false; state.allOrders = action.payload; })
      .addCase(fetchAllOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchVendorOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchVendorOrders.fulfilled, (state, action) => { state.loading = false; state.vendorOrders = action.payload; })
      .addCase(fetchVendorOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateOrderPayment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateOrderPayment.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; })
      .addCase(updateOrderPayment.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(markOrderDelivered.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(markOrderDelivered.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; })
      .addCase(markOrderDelivered.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // NEW: confirmOrder
      .addCase(confirmOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.success = true;
      })
      .addCase(confirmOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
