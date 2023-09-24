import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListItem } from '../types'


interface initialState {
   list: ListItem[]
   activeId: string
}

const initialState: initialState = { list: [], activeId: ''}




const listSlice = createSlice({
    name: 'listSlice',
    initialState,
    reducers: {
        subscribetoFeed(state, action: PayloadAction<ListItem>){
            state.list.push(action.payload)
        },
        switchActiveFeed(state, action: PayloadAction<string>){
            state.activeId = action.payload
        }
    },
})

export const {subscribetoFeed, switchActiveFeed} = listSlice.actions

export default listSlice.reducer
