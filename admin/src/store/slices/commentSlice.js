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

export const updateComment = createAsyncThunk(
    'comment/updateComment',
    async ({ commentId, content }, { rejectWithValue }) => {
        try {
            const response = await apiClient(`/comment/${commentId}`, {
                method: 'PUT',
                body: JSON.stringify({ content })
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
                if (!action.payload.data.parent) {
                    state.comments.unshift(action.payload.data);
                } else {
                    // For replies, the UI usually refetches or we'd need to find the parent in nested state.
                    // For now, let's keep it simple.
                }
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(c => c._id !== action.payload.data._id);
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                // Find and update the comment in the flat or nested state
                const updateInNested = (list) => {
                    return list.map(c => {
                        if (c._id === action.payload.data._id) {
                            return { ...c, content: action.payload.data.content };
                        }
                        if (c.children && c.children.length > 0) {
                            return { ...c, children: updateInNested(c.children) };
                        }
                        return c;
                    });
                };
                state.comments = updateInNested(state.comments);
            });
    }
});

export const { clearCommentError } = commentSlice.actions;
export default commentSlice.reducer;
