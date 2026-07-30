import { createSlice, nanoid } from "@reduxjs/toolkit";

// Live notification feed for the admin bell dropdown (new users, new
// orders, ...), fed by the socket connection — separate from the toast
// queue in notificationSlice.js.
const MAX_ITEMS = 30;

const initialState = {
    items: [],
    unreadCount: 0,
};

const adminNotificationSlice = createSlice({
    name: "adminNotifications",
    initialState,
    reducers: {
        notificationReceived: (state, action) => {
            const { message, link, type = "info" } = action.payload || {};
            if (!message) return;

            state.items.unshift({
                id: nanoid(),
                type,
                message,
                link,
                time: new Date().toISOString(),
                read: false,
            });

            if (state.items.length > MAX_ITEMS) {
                state.items.length = MAX_ITEMS;
            }

            state.unreadCount += 1;
        },
        markAllRead: (state) => {
            state.items.forEach((item) => { item.read = true; });
            state.unreadCount = 0;
        },
    },
});

export const { notificationReceived, markAllRead } = adminNotificationSlice.actions;
export default adminNotificationSlice.reducer;
