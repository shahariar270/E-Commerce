import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRoute, getCookie } from '@utils/helper';

export const createCategory = createAsyncThunk(
    'category/createCategory',
    async (categoryData, { rejectWithValue, dispatch }) => {
        try {
            const token = getCookie('token');
            const response = await fetch(`${apiRoute}category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(categoryData),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || 'Failed to create category');
            }
            dispatch({
                message: 'category added successfully',
                delay: "5000",
                type: "success"
            })

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getCategories = createAsyncThunk(
    'category/getCategories',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const token = getCookie('token');
            const response = await fetch(`${apiRoute}categories?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || 'Failed to fetch categories');
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async ({ id, categoryData }, { rejectWithValue }) => {
        try {
            const token = getCookie('token');
            const response = await fetch(`${apiRoute}category/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(categoryData),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || 'Failed to update category');
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            const token = getCookie('token');
            const response = await fetch(`${apiRoute}category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || 'Failed to delete category');
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getCategoryById = createAsyncThunk(
    'category/getCategoryById',
    async (id, { rejectWithValue }) => {
        try {
            const token = getCookie('token');
            const response = await fetch(`${apiRoute}categories/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.message || 'Failed to fetch category');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    });

const initialState = {
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
    message: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
    },
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        setLimit: (state, action) => {
            state.pagination.limit = action.payload;
            state.pagination.page = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create category
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.categories.unshift(action.payload.data);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get categories
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.data;
                state.pagination.total = action.payload.data.length;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update category
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                const index = state.categories.findIndex(cat => cat._id === action.payload.data._id);
                if (index !== -1) {
                    state.categories[index] = action.payload.data;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete category
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.categories = state.categories.filter(cat => cat._id !== action.payload.data?._id);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCategory = action.payload.data;
            })
            .addCase(getCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { clearError, clearMessage, setPage, setLimit } = categorySlice.actions;
export default categorySlice.reducer;