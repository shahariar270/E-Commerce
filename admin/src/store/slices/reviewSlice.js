import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';

export const createReview = createAsyncThunk(
    'review/createReview',
    async ({ productId, rating, title, comment }) => {
        return apiClient(`/review/${productId}`, {
            method: 'POST',
            body: JSON.stringify({ rating, title, comment }),
        });
    }
);

const initialState = {
    loading: false,
    error: null,
    latest: null,
};

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        clearReviewError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.loading = false;
                state.latest = action.payload.data;
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
