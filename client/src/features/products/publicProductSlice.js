import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch all products (for Home page)
export const fetchPublicProducts = createAsyncThunk(
  "publicProducts/fetchPublicProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "publicProducts/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch products by category (for similar products)
export const fetchProductsByCategory = createAsyncThunk(
  "publicProducts/fetchProductsByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/products/category/${category}`);
      if (!res.ok) throw new Error("Failed to fetch products by category");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// Fetch products by search query
export const fetchProductsBySearch = createAsyncThunk(
  "publicProducts/fetchProductsBySearch",
  async (query, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${API_URL}/api/products/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to fetch search results");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const publicProductSlice = createSlice({
  name: "publicProducts",
  initialState: {
    items: [], // All products
    product: null, // Single product details
    categoryProducts: [], // Similar products
    searchResults: [],
    loadingAll: false,
    loadingProduct: false,
    loadingCategory: false,
    loadingSearch: false,
    errorAll: null,
    errorProduct: null,
    errorCategory: null,
    errorSearch: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchPublicProducts.pending, (state) => {
        state.loadingAll = true;
        state.errorAll = null;
      })
      .addCase(fetchPublicProducts.fulfilled, (state, action) => {
        state.loadingAll = false;
        state.items = action.payload;
      })
      .addCase(fetchPublicProducts.rejected, (state, action) => {
        state.loadingAll = false;
        state.errorAll = action.payload;
      })

      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.loadingProduct = true;
        state.errorProduct = null;
        state.product = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loadingProduct = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loadingProduct = false;
        state.errorProduct = action.payload;
      })

      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loadingCategory = true;
        state.errorCategory = null;
        state.categoryProducts = [];
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loadingCategory = false;
        state.categoryProducts = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loadingCategory = false;
        state.errorCategory = action.payload;
      })
       .addCase(fetchProductsBySearch.pending, (state) => {
        state.loadingSearch = true;
        state.errorSearch = null;
        state.searchResults = [];
      })
      .addCase(fetchProductsBySearch.fulfilled, (state, action) => {
        state.loadingSearch = false;
        state.searchResults = action.payload;
      })
      .addCase(fetchProductsBySearch.rejected, (state, action) => {
        state.loadingSearch = false;
        state.errorSearch = action.payload;
      });
  },
});

export default publicProductSlice.reducer;
