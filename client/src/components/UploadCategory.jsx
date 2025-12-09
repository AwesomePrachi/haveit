import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/uploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../config/SummaryApi';
import toast from 'react-hot-toast';
import axiosToastError from '../utils/axiosToastError';
import { useDispatch } from 'react-redux';
import { setAllCategories } from '../store/productSlice';

const UploadCategory = ({close, fetchData}) => {
    const [data, setData] = useState({
        name: "",
        image: ""
    })

    const [isloading, setIsLoading] = useState(false)
    const dispatch = useDispatch();

    const handleOnChange = (e)=> {
        const {name, value} = e.target

        setData((prev)=>{
            return{
                ...prev,
                [name]: value
            }
        })
    }

    
    const handleUploadCategoryImage = async(e)=> {
        const file = e.target.files[0]
        if (!file) {
            return
        }
        
        const response = await uploadImage(file)
        const { data: imageResponse } = response
        setData((prev)=> {
            return{
                ...prev,
                image: imageResponse.data.url
            }
        })
    }
    
    const handleSubmit = async(e)=> {
        e.preventDefault()
        try {
            setIsLoading(true)
            
            const response = await Axios({
                ...SummaryApi.add_category,
                data: data
            })
            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                
                const refetch = await Axios(SummaryApi.get_subcategory);
                const { data: refetchData } = refetch;
                if (refetchData.success) {
                dispatch(setAllCategories(refetchData.data));
                }

                if (fetchData) fetchData();
                if (close) close();
            }
        } catch (error) {
            axiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <section className='fixed inset-0 bg-neutral-600/60 flex items-center justify-center'>
        <div className='bg-white max-w-4xl w-full p-4 rounded'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold'>Category</h1>
                <button onClick={close} className='w-fit block ml-auto'>
                    <IoClose size={25}/>
                </button>
            </div>
            <form  className='my-3 grid gap-2' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                    <label htmlFor="category-name">Name</label>
                    <input 
                    type="text" 
                    id='category-name' 
                    placeholder='Enter category name'
                    value={data.name}
                    name='name'
                    onChange={handleOnChange}
                    className='bg-blue-50 p-2 border border-blue-100 focus-within:border-yellowish outline-none rounded'
                    />
                </div>
                <div className='grid gap-1'>
                    <p>Image</p>
                    <div className='flex gap-4 flex-col lg:flex-row items-center'>
                        <div className='border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded'>
                            {
                                data.image ? (
                                    <img
                                        alt='category'
                                        src={data.image}
                                        className='w-full h-full object-scale-down'
                                    />
                                ) : (
                                    <p className='text-sm text-neutral-500'>No Image</p>
                                )
                            }
                            
                        </div>
                        <label htmlFor='uploadCategoryImage'>
                            <div  className={`
                            ${!data.name ? "bg-gray-300" : "border-yellowish hover:bg-yellowLight" }  
                                px-4 py-2 rounded cursor-pointer border font-medium
                            `}>Upload Image</div>

                            <input disabled={!data.name} onChange={handleUploadCategoryImage} type='file' id='uploadCategoryImage' className='hidden'/>
                        </label>
                        
                    </div>
                </div>

                <button
                    className={`
                    ${data.name && data.image ? "bg-yellowish hover:bg-yellowLight" : "bg-gray-300 "}
                    py-2 font-semibold mt-3`}>
                        Add Category
                    </button>
            </form>
        </div>
    </section>
  )
}

export default UploadCategory