import { createSlice } from "@reduxjs/toolkit";
import { addFeed } from "./feedSlice";

const newsSlice = createSlice({
    name: 'newsSlice',
    initialState: [],
    extraReducers: {
        [addFeed](state, { payload }){
            state.push(payload)
        }
    }
})

export const { addFeed } = newsSlice.actions;

export default newsSlice.reducer