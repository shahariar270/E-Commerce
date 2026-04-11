import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';

export const createCart = createAsyncThunk(
  'cart/createCart',
  async (data) => apiClient('/cart', { method: 'POST', body: JSON.stringify(data) })
);

export const updateCart = createAsyncThunk(
  'cart/updateCart',
  async (data) => apiClient('/cart', { method: 'PUT', body: JSON.stringify(data) })
);

export const getCart = createAsyncThunk(
  'cart/getCart',
  async () => apiClient('/cart')
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id) => apiClient(`/cart/${id}`, { method: 'DELETE' })
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleRejected = (state, action) => { state.loading = false; state.error = action.error.message; };

    builder
      .addCase(createCart.pending, handlePending)
      .addCase(createCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(createCart.rejected, handleRejected)

      .addCase(updateCart.pending, handlePending)
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(updateCart.rejected, handleRejected)

      .addCase(getCart.pending, handlePending)
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getCart.rejected, handleRejected)

      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(removeFromCart.rejected, handleRejected);
  },
});

export default cartSlice.reducer;