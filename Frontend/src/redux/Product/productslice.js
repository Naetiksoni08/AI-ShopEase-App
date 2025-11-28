import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// 🧠 Fetch all products
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:5001/api/product", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch products";
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
      const res = await axios.get(`http://localhost:5001/api/product/${id}`, {
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
      const res = await axios.post("http://localhost:5001/api/product", formData, {
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
      const res = await axios.put(`http://localhost:5001/api/product/${id}`, updatedData, {
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
      await axios.delete(`http://localhost:5001/api/product/${id}`, {
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
      // Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })

      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
