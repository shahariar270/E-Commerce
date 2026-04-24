import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';
import { apiRoute, getCookie } from '@utils/helper';

export const getAllOrder = createAsyncThunk(
    "order/getAllOrder",
    async (_, thunApi) => apiClient('/order')
);

const initialState = {
    order : [],
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
    }

});

export default OrderSlices.reducer;