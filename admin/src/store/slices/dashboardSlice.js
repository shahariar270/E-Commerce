import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@utils/api';


export const getCardData = createAsyncThunk(
    "dashboard/getCardData",
    async (_, thunkApi) => apiClient('/dashboard/cards')
);

const initialState = {
    card: {}
}


const dashboardSlices = createSlice({
    name: "dashboard",
    initialState,
    extraReducers:(builder)=>{
        builder
    }
});

export default dashboardSlices;