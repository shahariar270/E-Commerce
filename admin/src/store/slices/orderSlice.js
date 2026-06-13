import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';

export const getAllOrder = createAsyncThunk(
    "order/getAllOrder",
    async (params = {}, thunApi) => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page);
        if (params.limit) query.append('limit', params.limit);
        if (params.search) query.append('search', params.search);
        const queryString = query.toString();
        return apiClient(`/admin/order${queryString ? `?${queryString}` : ''}`);
    }
);

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (FormData, thunkApi) => apiClient('/order', { method: 'POST', body: JSON.stringify(FormData) })
);

export const getUserOrders = createAsyncThunk(
    "order/getUserOrders",
    async (params = {}, thunkApi) => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page);
        if (params.limit) query.append('limit', params.limit);
        const queryString = query.toString();
        return apiClient(`/orders${queryString ? `?${queryString}` : ''}`);
    }
);

export const updateOrder = createAsyncThunk(
    "order/updateOrder",
    async (data, thunkApi) => apiClient(`/admin/order/${data?._id}`, { method: "PUT", body: JSON.stringify(data) })
)

const initialState = {
    orders: [],
    loading: false,
    error: null,
    pagination: { page: 1, limit: 10, total: 0 },
}

const getOrderList = (payload) => {
    const orders = payload?.data?.data ?? payload?.data;
    return Array.isArray(orders) ? orders : [];
};

const getOrderTotal = (payload) => {
    return payload?.data?.total ?? 0;
};

const OrderSlices = createSlice({
    name: 'order',
    initialState,
    extraReducers: (builder) => {
        const handlePending = (state) => { state.loading = true; state.error = null; };
        const handleRejected = (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.orders = [];
        };

        builder
            .addCase(getAllOrder.pending, handlePending)
            .addCase(getAllOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = getOrderList(action.payload);
                state.pagination.total = getOrderTotal(action.payload);
            })
            .addCase(getAllOrder.rejected, handleRejected)
            .addCase(getUserOrders.pending, handlePending)
            .addCase(getUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = getOrderList(action.payload);
                state.pagination.total = getOrderTotal(action.payload);
            })
            .addCase(getUserOrders.rejected, handleRejected)
            .addCase(updateOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex(item => item._id === action.payload?.data?._id);
                if (index !== -1) {
                    state.orders[index] = action.payload.data;
                }
            })
    }

});

export default OrderSlices.reducer;
