import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


const api = import.meta.env.VITE_API_URL;
/* ---------------------------------------------------------
   Fetch Cart Items
--------------------------------------------------------- */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${api}/api/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res.data.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

/* ---------------------------------------------------------
   Remove Item From Cart
--------------------------------------------------------- */
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, thunkAPI) => {
    try {
      const res = await axios.delete(`${api}/api/cart/removed/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data && res.data.success) {
        toast.success("Removed from cart");
        return productId;
      } else {
        return thunkAPI.rejectWithValue(
          res.data?.message || "Failed to remove"
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove"
      );
    }
  }
);

/* ---------------------------------------------------------
   Update Cart Quantity
--------------------------------------------------------- */
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${api}/api/cart/update/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return { productId, quantity: res.data.data.quantity };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

/* ---------------------------------------------------------
   Slice
--------------------------------------------------------- */
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder
      /* ------------ fetchCart ------------ */
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ------------ removeFromCart ------------ */
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        toast.error(action.payload);
      })

      /* ------------ updateQuantity ------------ */
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const item = state.items.find((i) => i._id === action.payload.productId);
        if (item) item.quantity = action.payload.quantity;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        toast.error(action.payload);
      })

  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;