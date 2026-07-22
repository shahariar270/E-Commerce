import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';

export const subscribe = createAsyncThunk(
  'subscriber/subscribe',
  async (email) => apiClient('/subscribe', { method: 'POST', body: JSON.stringify({ email }) })
);

export const getSubscribers = createAsyncThunk(
  'subscriber/getSubscribers',
  async ({ page = 1, limit = 10, search = '' } = {}) => {
    const query = new URLSearchParams();
    if (page) query.append('page', page);
    if (limit) query.append('limit', limit);
    if (search) query.append('search', search);
    return apiClient(`/admin/subscribers?${query.toString()}`);
  }
);

export const deleteSubscriber = createAsyncThunk(
  'subscriber/deleteSubscriber',
  async (id) => apiClient(`/admin/subscribers/${id}`, { method: 'DELETE' })
);

const initialState = {
  subscribers: [],
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
};

const subscriberSlice = createSlice({
  name: 'subscriber',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload?.data?.data || [];
        state.pagination.total = action.payload?.data?.total || 0;
      })
      .addCase(getSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteSubscriber.fulfilled, (state, action) => {
        state.subscribers = state.subscribers.filter((s) => s._id !== action.payload?.data?._id);
      })
      .addCase(deleteSubscriber.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default subscriberSlice.reducer;
