import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { type } from 'os';
import feedState from './feedSlice'

export const RootReducer =  combineReducers({
  feedState
}) 

export const  setStore = () => {
  return configureStore({
  reducer: RootReducer,
})
}

export type RootState = ReturnType< typeof RootReducer>
export type AppStore = ReturnType< typeof setStore>
export type AppDispatch = AppStore['dispatch']