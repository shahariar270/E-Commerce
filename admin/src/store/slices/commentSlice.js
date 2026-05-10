import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';

export const getComments = createAsyncThunk(
    'comment/getComments',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await apiClient(`/comments/${productId}`);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createComment = createAsyncThunk(
    'comment/createComment',
    async ({ productId, content, parent }, { rejectWithValue }) => {
        try {
            const response = await apiClient(`/comment/${productId}`, {
                method: 'POST',
                body: JSON.stringify({ content, parent })
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteComment = createAsyncThunk(
    'comment/deleteComment',
    async (commentId, { rejectWithValue }) => {
        try {
            const response = await apiClient(`/comment/${commentId}`, {
                method: 'DELETE'
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    comments: [],
    loading: false,
    error: null,
};

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        clearCommentError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload.data;
            })
            .addCase(getComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                // If it's a top-level comment, unshift it. 
                // If it's a reply, we might need more complex logic or just refetch.
                // For simplicity, let's just unshift if parent is null.
                if (!action.payload.data.parent) {
                    state.comments.unshift(action.payload.data);
                } else {
                    // For replies, it's better to refetch or handle nested state.
                    // For now, let's just push it and we'll handle display logic in component.
                    state.comments.push(action.payload.data);
                }
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(c => c._id !== action.payload.data._id);
            });
    }
});

export const { clearCommentError } = commentSlice.actions;
export default commentSlice.reducer;
