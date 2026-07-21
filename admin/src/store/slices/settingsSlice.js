import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';

export const getSettings = createAsyncThunk(
  'settings/getSettings',
  async () => apiClient('/settings')
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (data) => apiClient('/settings', { method: 'PUT', body: JSON.stringify(data) })
);

const initialState = {
  require_guest_email_verification: true,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  extraReducers: (builder) => {
    const applySettings = (state, action) => {
      state.loading = false;
      const data = action.payload?.data;
      if (data && typeof data.require_guest_email_verification === 'boolean') {
        state.require_guest_email_verification = data.require_guest_email_verification;
      }
    };

    builder
      .addCase(getSettings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getSettings.fulfilled, applySettings)
      .addCase(getSettings.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(updateSettings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateSettings.fulfilled, applySettings)
      .addCase(updateSettings.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default settingsSlice.reducer;
