import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// 🔹 Fetch all products (admin)
export const fetchAllProductsAdmin = createAsyncThunk(
  "adminProducts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/products/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Delete product (admin)
export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/products/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Confirm product (admin)
export const confirmAdminProduct = createAsyncThunk(
  "adminProducts/confirm",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/products/admin/confirm-product/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to confirm product");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    items: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetAdminProductsState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchAllProductsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProductsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllProductsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete product
      .addCase(deleteAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Confirm product
      .addCase(confirmAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((p) =>
          p._id === action.payload.product._id ? action.payload.product : p
        );
        state.success = true;
      })
      .addCase(confirmAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAdminProductsState } = adminProductSlice.actions;
export default adminProductSlice.reducer;
