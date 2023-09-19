import { TypedUseSelectorHook } from "react-redux/es/types"
import { useSelector } from "react-redux/es/exports"
import { RootState } from "../reducers"

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector