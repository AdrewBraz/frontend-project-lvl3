import { createSlice, CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { IFeed } from '../types'

interface initialState {
   feed: any [],
   isLoading: boolean,
   error: string
}

const initialState: initialState = { feed: [], isLoading: false, error: ''}


const feedSlice = createSlice({
    name: 'feedSlice',
    initialState,
    reducers: {
          feedFetching(state, action: PayloadAction<string>){
            state.isLoading = true
          },
          fetchingSuccess(state, action: PayloadAction<IFeed[]>){
            state.isLoading = false,
            state.error = ''
            state.feed.push(action.payload)
          },
          fetchingError(state, action: PayloadAction<string>){
            state.isLoading = false,
            state.error = action.payload
          }

        },
    }
)

export const { feedFetching, fetchingError, fetchingSuccess } = feedSlice.actions

export default feedSlice.reducer