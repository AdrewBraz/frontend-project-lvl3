import { useDispatch } from "react-redux/es/exports"
import { AppDispatch } from "../reducers"

export const useAppDispatch = () => useDispatch<AppDispatch>()