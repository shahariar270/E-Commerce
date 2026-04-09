import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    message: '',
    delay: 1000,
    type: ''
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (state, action) => {
            state.message = action.payload.message;
            state.delay = action.payload.delay;
            state.type = action.payload.type;
        }
    }
})

export const { showNotification } = notificationSlice.actions;
export default notificationSlice.reducer;