import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { unSubscribefromFeed } from "./listSlice";
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
    extraReducers: (builder) => {
        builder.addCase(fetchFeed.pending.type, (state, action: PayloadAction<string>) => {
            state.isLoading = true;
        })
        builder.addCase(fetchFeed.fulfilled.type, (state, action: PayloadAction<IFeed>) => {
            state.isLoading = false
            state.feed.push(action.payload)
        })
        builder.addCase(fetchFeed.rejected.type, (state, action: PayloadAction<string>) => {
            return state
        })
        builder.addCase(unSubscribefromFeed, (state, action: PayloadAction<string>) => {
            return {feed: state.feed.filter((item) => item.id !== action.payload), isLoading: false, error: ''}
        })
    }
    
})

export default feedSlice.reducer
