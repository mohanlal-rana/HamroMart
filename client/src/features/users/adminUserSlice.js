import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// -------------------- THUNKS --------------------

// Fetch all users (admin)
export const fetchAllUsers = createAsyncThunk(
  "adminUsers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch users");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch single user by ID (admin)
export const fetchUserById = createAsyncThunk(
  "adminUsers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch user");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update user role (admin)
export const updateUserRole = createAsyncThunk(
  "adminUsers/updateRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update user role");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete user (admin)
export const deleteUser = createAsyncThunk(
  "adminUsers/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete user");
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// -------------------- SLICE --------------------
const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState: {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetAdminUsersState: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single user
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update the role in users array
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAdminUsersState } = adminUserSlice.actions;
export default adminUserSlice.reducer;
