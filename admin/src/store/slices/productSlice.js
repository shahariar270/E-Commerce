import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (data) => apiClient('/product', { method: 'POST', body: JSON.stringify(data) })
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, data }) => apiClient(`/product/${id}`, { method: 'PUT', body: JSON.stringify(data) })
);

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (params = {}) => {
    return apiClient(`/products`);
  }
);

export const getProductById = createAsyncThunk(
  'product/getProductById',
  async (id) => apiClient(`/products/${id}`)
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id) => apiClient(`/product/${id}`, { method: 'DELETE' })
);

const initialState = {
  data: [],
  current: null,
  loading: false,
  error: null,
  pagination: { page: 1, perPage: 10, total: 0 },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleRejected = (state, action) => { state.loading = false; state.error = action.error.message; };

    builder
      .addCase(createProduct.pending, handlePending)
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload.data);
      })
      .addCase(createProduct.rejected, handleRejected)

      .addCase(updateProduct.pending, handlePending)
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const i = state.data.findIndex(p => p._id === action.payload.data._id);
        if (i !== -1) state.data[i] = action.payload.data;
      })
      .addCase(updateProduct.rejected, handleRejected)

      .addCase(getProducts.pending, handlePending)
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination.total = action.payload.total;
      })
      .addCase(getProducts.rejected, handleRejected)

      .addCase(getProductById.fulfilled, (state, action) => { state.current = action.payload.data; })

      .addCase(deleteProduct.pending, handlePending)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(p => p._id !== action.payload.data?._id);
      })
      .addCase(deleteProduct.rejected, handleRejected);
  },
});

export default productSlice.reducer;