// src/features/products/vendorProductSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL;

// -------------------- THUNKS --------------------

// Fetch all products for vendor
export const fetchVendorProducts = createAsyncThunk(
  "vendorProducts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/products/vendor`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch products");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Add new product
export const createVendorProduct = createAsyncThunk(
  "vendorProducts/add",
  async (productData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: productData,
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
        // Backend could send { message, errors } (Zod-like)
        return rejectWithValue(data);
      }

      return data.product; // Success
    } catch (err) {
      return rejectWithValue({
        message: err.message || "Failed to create product",
      });
    }
  }
);


// Fetch single product by ID
export const fetchSingleProduct = createAsyncThunk(
  "vendorProducts/fetchSingle",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch product");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update existing product
export const updateVendorProduct = createAsyncThunk(
  "vendorProducts/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      // Check content type for JSON
      const contentType = res.headers.get("content-type") || "";
      let data;
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
        // If backend returns structured error, pass it
        return rejectWithValue(data);
      }

      return data.product; // Success
    } catch (err) {
      return rejectWithValue({
        message: err.message || "Failed to update product",
      });
    }
  }
);





// Delete product
export const deleteVendorProduct = createAsyncThunk(
  "vendorProducts/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete product");
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// -------------------- SLICE --------------------
const vendorProductSlice = createSlice({
  name: "vendorProducts",
  initialState: {
    items: [],
    loading: false,
    error: null,
    successMessage: null,
    singleProduct: null,
  },
  reducers: {
    resetMessage: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearSingleProduct: (state) => {
      state.singleProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchVendorProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createVendorProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendorProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.successMessage = "Product created successfully!";
      })
      .addCase(createVendorProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH SINGLE
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateVendorProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendorProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
        state.successMessage = "Product updated successfully!";
      })
      .addCase(updateVendorProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteVendorProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVendorProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p._id !== action.payload);
        state.successMessage = "Product deleted successfully!";
      })
      .addCase(deleteVendorProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMessage, clearSingleProduct } = vendorProductSlice.actions;
export default vendorProductSlice.reducer;
