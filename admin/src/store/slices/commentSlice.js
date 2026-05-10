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
                const newComment = action.payload.data;
                if (!newComment.parent) {
                    state.comments.unshift(newComment);
                } else {
                    const addToNested = (list) => {
                        return list.map(c => {
                            if (c._id === newComment.parent) {
                                return {
                                    ...c,
                                    children: [newComment, ...(c.children || [])]
                                };
                            }
                            if (c.children && c.children.length > 0) {
                                return { ...c, children: addToNested(c.children) };
                            }
                            return c;
                        });
                    };
                    state.comments = addToNested(state.comments);
                }
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const deleteId = action.payload.data?._id;
                const removeFromNested = (list) => {
                    return list
                        .filter(c => c._id !== deleteId)
                        .map(c => {
                            if (c.children && c.children.length > 0) {
                                return { ...c, children: removeFromNested(c.children) };
                            }
                            return c;
                        });
                };
                state.comments = removeFromNested(state.comments);
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
