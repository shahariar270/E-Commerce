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

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (code) => apiClient('/coupon/apply', { method: 'POST', body: JSON.stringify({ code }) })
);

export const removeCoupon = createAsyncThunk(
  'cart/removeCoupon',
  async () => apiClient('/coupon/apply', { method: 'DELETE' })
);

const initialState = {
  items: [],
  total_quantity: 0,
  total_price: 0,
  coupon: null,
  grand_total: 0,
  loading: false,
  error: null,
};

const applyCartPayload = (state, action) => {
  const data = action.payload?.data;
  state.loading = false;
  state.items = data?.items || [];
  state.total_quantity = data?.total_quantity || 0;
  state.total_price = data?.total_price || 0;
  state.coupon = data?.coupon?.code ? data.coupon : null;
  state.grand_total = data?.grand_total ?? data?.total_price ?? 0;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // The backend deletes the cart document once an order is placed, so
    // local state needs an explicit reset too — a rejected getCart (404,
    // cart not found) doesn't touch items, and there's nothing else that
    // would clear stale items/coupon/badge count after checkout.
    clearCart: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleRejected = (state, action) => { state.loading = false; state.error = action.error.message; };

    builder
      .addCase(createCart.pending, handlePending)
      .addCase(createCart.fulfilled, applyCartPayload)
      .addCase(createCart.rejected, handleRejected)

      .addCase(updateCart.pending, handlePending)
      .addCase(updateCart.fulfilled, applyCartPayload)
      .addCase(updateCart.rejected, handleRejected)

      .addCase(getCart.pending, handlePending)
      .addCase(getCart.fulfilled, applyCartPayload)
      .addCase(getCart.rejected, handleRejected)

      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled, applyCartPayload)
      .addCase(removeFromCart.rejected, handleRejected)

      .addCase(applyCoupon.pending, handlePending)
      .addCase(applyCoupon.fulfilled, applyCartPayload)
      .addCase(applyCoupon.rejected, handleRejected)

      .addCase(removeCoupon.pending, handlePending)
      .addCase(removeCoupon.fulfilled, applyCartPayload)
      .addCase(removeCoupon.rejected, handleRejected);
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
