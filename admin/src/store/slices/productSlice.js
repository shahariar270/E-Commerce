import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';
import { getCookie } from '@utils/helper';

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
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.filter) query.append('filter', params.filter);
    if (params.page) query.append('page', params.page);
    if (params.per_page) query.append('per_page', params.per_page);
    const queryString = query.toString();
    return apiClient(`/products${queryString ? `?${queryString}` : ''}`);
  }
);

export const getProductById = createAsyncThunk(
  'product/getProductById',
  async (id) => apiClient(`/product/${id}`)
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id) => apiClient(`/product/${id}`, { method: 'DELETE' })
);

export const uploadProductImages = createAsyncThunk(
  'product/uploadProductImages',
  async ({ id, images }, thunkApi) => {
    try {
      let formData = new FormData();

      images.forEach(element => {
        formData.append('products_gallery', element);
      });
       const token = getCookie('token');

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/products/${id}/images`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      return data?.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message)
    }
  }
)

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
        state.data = action.payload.data.products;
        state.pagination.total = action.payload.data.total;
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