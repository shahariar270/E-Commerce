
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRoute } from '@utils/helper';


export const createProduct = createAsyncThunk(
    'product/createProduct',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const res = await fetch(`${apiRoute}product`, data);
            const data = res.json();

            return data.data;
        } catch (error) {
            rejectWithValue(error.message);
        }
    }
);


const initialState = {
    loading: false,
    data: [],
    page: 1,
    per_page: 10,
    error: false
}

const productSlices = createSlice({
    name: 'product',
    initialState,
    reducers: (builder) => {
        builder
            .addCase(createProduct.fulfilled, (state, action) => {
                state.data = [state.data, ...action.payload];
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.error = action.payload;
            })
    }
})

export default productSlices.reducer;
