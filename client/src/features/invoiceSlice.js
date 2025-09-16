// src/features/invoiceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all invoices
export const fetchInvoices = createAsyncThunk(
  "invoice/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch invoices");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Generate invoice
export const generateInvoice = createAsyncThunk(
  "invoice/generate",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoices/generate-invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ orderId }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to generate invoice");
      return data.invoice;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Download invoice PDF
export const downloadInvoice = createAsyncThunk(
  "invoice/download",
  async (invoiceId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoices/download/${invoiceId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to download invoice");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      return invoiceId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [], // all invoices
    invoice: null, // single generated invoice
    loading: false,
    error: null,
  },
  reducers: {
    resetInvoiceState: (state) => {
      state.invoice = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchInvoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // generateInvoice
      .addCase(generateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice = action.payload;
        state.invoices.push(action.payload); // update invoices array
      })
      .addCase(generateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // downloadInvoice
      .addCase(downloadInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadInvoice.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetInvoiceState } = invoiceSlice.actions;
export default invoiceSlice.reducer;
