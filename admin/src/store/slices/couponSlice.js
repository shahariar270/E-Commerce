import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';

export const createCoupon = createAsyncThunk(
  'coupon/createCoupon',
  async (couponData) => apiClient('/coupon', { method: 'POST', body: JSON.stringify(couponData) })
);

export const getCoupons = createAsyncThunk(
  'coupon/getCoupons',
  async ({ page = 1, limit = 10 } = {}) => apiClient(`/coupons?page=${page}&limit=${limit}`)
);

export const updateCoupon = createAsyncThunk(
  'coupon/updateCoupon',
  async ({ id, couponData }) => apiClient(`/coupon/${id}`, { method: 'PUT', body: JSON.stringify(couponData) })
);

export const deleteCoupon = createAsyncThunk(
  'coupon/deleteCoupon',
  async (id) => apiClient(`/coupon/${id}`, { method: 'DELETE' })
);

export const getCouponById = createAsyncThunk(
  'coupon/getCouponById',
  async (id) => apiClient(`/coupon/${id}`)
);

const initialState = {
  coupons: [],
  currentCoupon: null,
  loading: false,
  error: null,
  message: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create coupon
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.coupons.unshift(action.payload.data);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Get coupons
      .addCase(getCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload?.data?.data || [];
        state.pagination.total = action.payload?.data?.total || 0;
      })
      .addCase(getCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update coupon
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        const index = state.coupons.findIndex((c) => c._id === action.payload.data._id);
        if (index !== -1) {
          state.coupons[index] = action.payload.data;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete coupon
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.coupons = state.coupons.filter((c) => c._id !== action.payload.data?._id);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getCouponById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoupon = action.payload.data;
      })
      .addCase(getCouponById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearMessage, setPage, setLimit } = couponSlice.actions;
export default couponSlice.reducer;
