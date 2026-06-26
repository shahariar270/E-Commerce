import { createSlice, nanoid } from "@reduxjs/toolkit";

// Queue-based notification store so multiple toasts can stack.
// Each notification carries the props the Toast component expects:
// { id, type, message, timeout }
const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      const { type = "info", message, timeout = 4000 } = action.payload || {};
      if (!message) return;
      state.notifications.push({
        id: nanoid(),
        type,
        message,
        timeout,
      });
    },
    dismissNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const { showNotification, dismissNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
