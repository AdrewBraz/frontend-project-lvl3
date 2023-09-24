import { combineReducers, configureStore } from '@reduxjs/toolkit';
import feedState from './feedSlice'
import listSlice from './listSlice';

export const RootReducer =  combineReducers({
  feedState,
  listSlice
}) 

export const  setStore = () => {
  return configureStore({
  reducer: RootReducer,
})
}

export type RootState = ReturnType< typeof RootReducer>
export type AppStore = ReturnType< typeof setStore>
export type AppDispatch = AppStore['dispatch']