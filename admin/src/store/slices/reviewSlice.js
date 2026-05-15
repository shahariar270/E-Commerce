import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';

export const createReview = createAsyncThunk(
    'review/createReview',
    async ({ productId, rating, title, comment }, { rejectWithValue }) => {
        try {
            return await apiClient(`/review/${productId}`, {
                method: 'POST',
                body: JSON.stringify({ rating, title, comment }),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getReviews = createAsyncThunk(
    'review/getReviews',
    async (_, { rejectWithValue }) => {
        try {
            return await apiClient('/review');
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    reviews: [],
    loading: false,
    creating: false,
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
            .addCase(getReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.data || [];
            })
            .addCase(getReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(createReview.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.creating = false;
                const newReview = action.payload.data;
                state.latest = newReview;
                state.reviews = [
                    newReview,
                    ...state.reviews.filter(review => review._id !== newReview?._id),
                ];
            })
            .addCase(createReview.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
