import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/cart`, {
        method: "GET", // ✅ GET instead of POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/cart/add/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update quantity
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, action }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/cart/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }), // action = "increment" or "decrement"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/cart/remove/${productId}`, {
        method: "DELETE", // ✅ DELETE instead of POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/cart/clear`, {
        method: "DELETE", // ✅ DELETE instead of POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        state.loading = false;
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        state.loading = false;
      })

      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        state.loading = false;
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
