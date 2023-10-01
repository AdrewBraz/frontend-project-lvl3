import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IFeed, IContent } from '../types'
import { unSubscribefromFeed } from "./listSlice";
import { RootState } from "./index";

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
        const state = thunkApi.getState() as RootState
        const { articles } = state.feedState.feed.find((item: IFeed) => item.url === url)
        const diff = checkFeedDiff(articles, newFeed.articles)
        const obj = { ...newFeed, diff: diff.length}
        if(diff.length > 0){
            console.log("SOMETHING DRASTIC HAS HAPPENED")
            thunkApi.dispatch(feedSlice.actions.fetchByDif(obj))
        }
        longPooling(url)
     }
 )


const feedSlice = createSlice({
    name: 'feedSlice',
    initialState,
    reducers: {
        fetchByDif(state, action: PayloadAction< IFeed>){
            const { url, articles } = action.payload
            const indexOfChangedElem = state.feed.map((item: IFeed) => item.url).indexOf(url)
            state.feed[indexOfChangedElem].articles = articles 
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(fetchFeed.pending.type, (state, action: PayloadAction<IFeed>) => {
            state.isLoading = true
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

export default feedSlice.reducer;