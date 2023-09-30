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
        },
        unSubscribefromFeed(state, action: PayloadAction<string>){
            const newState = { activeId: '', list: state.list.filter(item => item.id !== action.payload)}
            return newState
        },
    },
})

export const {subscribetoFeed, switchActiveFeed, unSubscribefromFeed} = listSlice.actions

export default listSlice.reducer
