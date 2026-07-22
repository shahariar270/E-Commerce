import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';

export const getCustomers = createAsyncThunk(
  'customer/getCustomers',
  async ({ page = 1, limit = 10, search = '' } = {}) => {
    const query = new URLSearchParams();
    if (page) query.append('page', page);
    if (limit) query.append('limit', limit);
    if (search) query.append('search', search);
    return apiClient(`/admin/customers?${query.toString()}`);
  }
);

const initialState = {
  customers: [],
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload?.data?.data || [];
        state.pagination.total = action.payload?.data?.total || 0;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default customerSlice.reducer;
