import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';


export const getCardData = createAsyncThunk(
    "dashboard/getCardData",
    async (_, thunkApi) => apiClient('/dashboard/cards')
);

const initialState = {
    card: {},
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
    }
});

export default dashboardSlices.reducer;