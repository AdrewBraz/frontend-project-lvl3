import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IFeed, IContent } from '../types'

import axios from "axios";

interface initialState {
   feed: any [],
   isLoading: boolean,
   error: string
}


const initialState: initialState = { feed: [], isLoading: false, error: ''}
const checkFeedDiff = (feed: IContent[], newFeed: IContent[]) => {
    return newFeed.filter(item => !feed.some(other => item.guid == other.guid))
}

export const fetch = async (route: string, url: string) => {
    const response = await axios.get<IFeed>(route.concat(url))
    return response.data
}

export const fetchFeed = createAsyncThunk(
   'feedSlice/addFeed',
    async(url: string, thunkApi) => await fetch('/api/?url=',url)
)

export const longPooling = createAsyncThunk(
    'feedSlice/Pooling',
     async(url: string, thunkApi) => {
        const newFeed = await fetch('/api/pooling/?url=',url)
        const state = thunkApi.getState() as initialState
        const articles = state.feed.find((item: IFeed) => item.url === url)
        const diff = checkFeedDiff(articles, newFeed.articles)
        const obj = { newFeed, diff: diff.length}
        thunkApi.dispatch(feedSlice.actions.fetchByDif(obj))
        longPooling(url)
     }
 )


const feedSlice = createSlice({
    name: 'feedSlice',
    initialState,
    reducers: {
        fetchByDif(state, action: PayloadAction< Object>){
            console.log(action.payload)
            state.feed.push(action.payload)
        }
    },
    extraReducers: {
        [fetchFeed.pending.type]:( state, action: PayloadAction<string>) =>{
            state.isLoading = true;
        },
        [fetchFeed.fulfilled.type]:( state, action: PayloadAction<IFeed>) =>{
            state.isLoading = false;
            state.feed.push(action.payload)
            state.error = ''
        },
        [fetchFeed.rejected.type]:( state, action: PayloadAction<string>) =>{
            state.isLoading = false;
            state.error = action.payload
        },
    }
})

export default feedSlice.reducer
