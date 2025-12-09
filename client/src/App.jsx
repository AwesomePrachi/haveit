import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserData from './utils/fetchUserData';
import { login } from './store/userSlice';
import { useDispatch } from 'react-redux';
import { setAllCategories, setAllSubCategories, setLoadingCategory } from './store/productSlice';
import axiosToastError from './utils/axiosToastError';
import Axios from './utils/Axios';
import SummaryApi from './config/SummaryApi';
import GlobalProvider from './provider/GlobalProvider';
import CartMobileBar from './components/CartMobileBar';

function App() {
    const dispatch = useDispatch()
    const location = useLocation()

    const fetchUser = async () => {
        const userData = await fetchUserData()
        // console.log("user data", userData?.data)
        dispatch(login(userData?.data))
    }

    const fetchCategory = async () => {
        try {
            dispatch(setLoadingCategory(true))
            const response = await Axios({
                ...SummaryApi.get_category
            })
            const { data: responseData } = response

            if (responseData.success) {
                dispatch(setAllCategories(responseData.data))
                // setCategoryData(responseData.data)
            }
        } catch (error) {
            axiosToastError(error)
        } finally {
            dispatch(setLoadingCategory(false))
        }
    }

    const fetchSubCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.get_subcategory
            })
            const { data: responseData } = response

            if (responseData.success) {
                dispatch(setAllSubCategories(responseData.data))
            }
        } catch (error) {
            axiosToastError(error)
        }
    }


    useEffect(() => {
        fetchUser()
        fetchCategory()
        fetchSubCategory()
    }, [])

    return (
        <GlobalProvider>
            <Header />
            <div className='flex justify-center'>
                <main className='min-h-[78vh] w-full max-w-[1320px] px-4 '>
                    <Outlet />
                </main>
            </div>
            <Footer />
            <Toaster />
            {
                location.pathname !== '/checkout' && (
                    <CartMobileBar />
                )
            }
        </GlobalProvider>
    )
}

export default App
