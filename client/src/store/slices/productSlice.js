import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (
    {
      availability = "",
      price = "0-1000000",
      category = "",
      ratings = "",
      search = "",
      page = 1
    },
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams();
      if (availability) params.append("availability", availability);
      if (price) params.append("price", price);
      if (category) params.append("category", category);
      if (ratings) params.append("ratings", ratings);
      if (search) params.append("search", search);
      if (page) params.append("page", page);

      const res = await axiosInstance.get(`/product?${params.toString()}`);

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch products"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: {},
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: []
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.newProductsQuery = action.payload.newProductsQuery;
        state.topRatedProducts = action.payload.topRatedProducts;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
      });
  }
});

export default productSlice.reducer;
