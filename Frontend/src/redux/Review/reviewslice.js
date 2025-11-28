import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ---------------------- 1) Fetch All Reviews ---------------------- */
export const fetchReviews = createAsyncThunk(
  "review/fetchReviews",
  async (productId, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/review/product/${productId}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

/* ---------------------- 2) Add New Review ---------------------- */
export const addReview = createAsyncThunk(
  "review/addReview",
  async ({ productId, text, rating }, thunkAPI) => {
    try {
      const res = await axios.post(
        `http://localhost:5001/api/review/product/${productId}/reviews`,
        { text, rating },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.data; // returns created review
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add review"
      );
    }
  }
);

/* ---------------------- 3) Delete a Review ---------------------- */
export const removeReview = createAsyncThunk(
  "review/removeReview",
  async ({ productId, reviewId }, thunkAPI) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/review/product/${productId}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return reviewId; // return the id so we can remove from state
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

/* ---------------------- Slice ---------------------- */
const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* fetchReviews */
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* addReview */
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.error = action.payload;
      })

      /* removeReview */
      .addCase(removeReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload
        );
      })
      .addCase(removeReview.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;