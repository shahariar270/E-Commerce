import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';
import { apiRoute, getCookie } from '@utils/helper';

export const getAllOrder = createAsyncThunk(
    "order/getAllOrder",
    async (_, thunApi) => apiClient('/order')
);

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (FormData, thunkApi) => apiClient('/order', { method: 'POST', body: JSON.stringify(FormData) })
);

export const getUserOrders = createAsyncThunk(
    "order/getUserOrders",
    async (thunkApi) => apiClient(`/orders`)
);

const initialState = {
    orders: [],
    loading: false,
    error: null,
}

const OrderSlices = createSlice({
    name: 'order',
    initialState,
    extraReducers: (builder) => {
        const handlePending = (state) => { state.loading = true; state.error = null; };
        const handleRejected = (state, action) => { state.loading = false; state.error = action.error.message; };

        builder
            .addCase(getAllOrder.pending, handlePending)
            .addCase(getAllOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getAllOrder.rejected, handleRejected)
            .addCase(getUserOrders.fulfilled, (state, action) => {
                state.orders = action.payload.orders
            })
    }

});

export default OrderSlices.reducer;