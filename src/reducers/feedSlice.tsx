import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IFeed } from '../types'
import axios from "axios";

interface initialState {
   feed: any [],
   isLoading: boolean,
   error: string
}

const initialState: initialState = { feed: [], isLoading: false, error: ''}

export const fetchFeed = createAsyncThunk(
   'feedSlice/addFeed',
    async(url: string, thunkApi) => {

      const response =  await axios.get<IFeed []>(`/api/?url=${url}`)
      return response.data
    }
)


const feedSlice = createSlice({
    name: 'feedSlice',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchFeed.pending.type]:( state, action: PayloadAction<IFeed []>) =>{
            state.isLoading = true;
        },
        [fetchFeed.fulfilled.type]:( state, action: PayloadAction<IFeed []>) =>{
            state.isLoading = false;
            state.feed.push(action.payload)
            state.error = ''
        },
        [fetchFeed.rejected.type]:( state, action: PayloadAction<IFeed []>) =>{
            state.isLoading = false;
            state.error = action.payload
        },
    }
})

export default feedSlice.reducer
