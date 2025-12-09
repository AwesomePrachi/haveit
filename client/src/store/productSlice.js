import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allCategories  : [],
    loadingCategory : false,
    allSubCategories  : [],
    product : []
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setAllCategories: (state, action)=> {
            state.allCategories = [...action.payload]
        },
        setLoadingCategory: (state, action)=> {
            state.loadingCategory = action.payload
        },
        setAllSubCategories: (state, action)=> {
            state.allSubCategories = [...action.payload]
        }
    }
})

export const { setAllCategories, setAllSubCategories, setLoadingCategory } = productSlice.actions

export default productSlice.reducer