import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const api = import.meta.env.VITE_API_URL;


// 🧠 Fetch all products (now with filters + pagination support)
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params = {}, thunkAPI) => {
    try {
      const res = await axios.get(`${api}/api/product`, {
        params, // { search, category, minPrice, maxPrice, sort, page, limit }
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data.data; // { products, pagination }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch products";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// 🧠 Fetch only the logged-in seller's products
export const fetchMyProducts = createAsyncThunk(
  "product/fetchMyProducts",
  async (params = {}, thunkAPI) => {
    try {
      const res = await axios.get(`${api}/api/product/mine`, {
        params, // { page, limit }
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data.data; // { products, pagination }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch your products";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// 🧠 Fetch a single product
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${api}/api/product/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch product";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// 🧠 Add a new product
export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post(`${api}/api/product`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Product added successfully!");
      return res.data.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add product";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// 🧠 Update a product
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const res = await axios.put(`${api}/api/product/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Product updated successfully!");
      return res.data.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update product";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// 🧠 Delete a product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${api}/api/product/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Product deleted successfully!");
      return id; // Return deleted ID to filter it from the state
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete product";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// 🧱 Slice
const productSlice = createSlice({
  name: "product",
  initialState: {
    items: [],
    pagination: { total: 0, page: 1, limit: 12, totalPages: 1 },
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🆕 my products — same shape, reuse items/pagination
      .addCase(fetchMyProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
