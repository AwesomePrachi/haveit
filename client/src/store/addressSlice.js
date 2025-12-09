import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    savedAddress: []
}

const addressSlice = createSlice({
    name: " address",
    initialState,
    reducers: {
        setAddress: (state, action)=>{
            state.savedAddress = [...action.payload]
        }
    }
})

export const { setAddress } = addressSlice.actions

export default addressSlice.reducer