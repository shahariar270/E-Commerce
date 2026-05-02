import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';
import { apiRoute, getCookie } from '@utils/helper';

export const getAllOrder = createAsyncThunk(
    "order/getAllOrder",
    async (_, thunApi) => apiClient('/admin/order')
);

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (FormData, thunkApi) => apiClient('/order', { method: 'POST', body: JSON.stringify(FormData) })
);

export const getUserOrders = createAsyncThunk(
    "order/getUserOrders",
    async (thunkApi) => apiClient(`/orders`)
);

export const updateOrder = createAsyncThunk(
    "order/updateOrder",
    async (data, thunkApi) => apiClient(`/admin/order/${data?._id}`, { method: "PUT", body: JSON.stringify(data) })
)

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
                state.orders = action.payload.data;
            })
            .addCase(getAllOrder.rejected, handleRejected)
            .addCase(getUserOrders.fulfilled, (state, action) => {
                console.log(action.payload);
                state.orders = action.payload?.data;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex(item => item._id === action.payload?.data?._id);
                if (index !== -1) {
                    state.orders[index] = action.payload.data;
                }
            })
    }

});

export default OrderSlices.reducer;