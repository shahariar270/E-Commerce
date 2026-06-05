import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';


export const getCardData = createAsyncThunk(
    "dashboard/getCardData",
    async (_, thunkApi) => apiClient('/dashboard/cards')
);

export const getTopProducts = createAsyncThunk(
    "dashboard/getTopProducts",
    async (_, thunkApi) => apiClient('/dashboard/total_data')
);

const initialState = {
    card: {},
    topProducts: [],
    loading: false,
    error: null
}


const dashboardSlices = createSlice({
    name: "dashboard",
    initialState,
    // reducer: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCardData.fulfilled, (state, action) => {
                state.loading = false;
                state.card = action.payload.data || action.payload;
            })
            .addCase(getCardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getTopProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTopProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.topProducts = action.payload.data?.topProducts;
            })
            .addCase(getTopProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
});

export default dashboardSlices.reducer;