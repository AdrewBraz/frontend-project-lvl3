import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: 'feedSlice',
    initialState: [],
    reducers: {
        addFeed(state, { payload }){
            state.push(payload)
        }
    }
})

export const { addFeed } = feedSlice.actions;

export default feedSlice.reducer