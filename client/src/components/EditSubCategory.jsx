import React from 'react'
import { useState } from 'react';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/uploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../config/SummaryApi';
import toast from 'react-hot-toast';
import axiosToastError from '../utils/axiosToastError';

const EditSubCategory = ({close, data, fetchData}) => {
    const [subCategoryData, setSubCategoryData] = useState({
        _id: data._id,
        name: data.name,
        image: data.image,
        category: data.category || []
    })

    const allCategories = useSelector(state => state.product.allCategories)

    const handleChange = (e)=> {
        const { name, value } = e.target

        setSubCategoryData((prev)=>{
            return{
                ...prev,
                [name] : value
            }
        })
    }   
    const handleUploadSubCategoryImage = async(e)=> {
        const file = e.target.files[0]
        if (!file) {
            return
        }

        const response = await uploadImage(file)
        const { data: imageResponse } = response
        setSubCategoryData((prev)=> {
            return{
                ...prev,
                image: imageResponse.data.url
            }
        })
    }

    const handleRemoveSelectedCategory = (categoryId) => {
        const index = subCategoryData.category.findIndex(el => el.id === categoryId)   
        subCategoryData.category.splice(index, 1)
        setSubCategoryData((prev)=> {
            return{
                ...prev
            }
        })

    }

    const handleSubmitSubCategory = async(e)=> {
        e.preventDefault()
        try {
            const response = await Axios({
                ...SummaryApi.update_subcategory,
                data: subCategoryData
            })

            const { data: responseData } = response
            // console.log('add_subcategory_data',responseData)
            
            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                }
                if(fetchData){
                    fetchData()
                }
            }
        } catch (error) {
            axiosToastError(error)
        }
    }
    
  return (
    <section className='fixed inset-0 bg-neutral-600/60 z-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-5xl bg-white p-4 rounded'>
            <div className='flex items-center justify-between gap-3'>
                <h1 className='font-semibold'>Edit Sub Category</h1>
                <button onClick={close}>
                    <IoClose size={25}/>
                </button>
            </div>
            <form className='my-3 grid gap-3' onSubmit={handleSubmitSubCategory}>
                    <div className='grid gap-1'>
                        <label htmlFor='name'>Name</label>
                        <input 
                            id='name'
                            name='name'
                            value={subCategoryData.name}
                            onChange={handleChange}
                            className='p-3 bg-blue-50 border outline-none focus-within:border-yellowish rounded '
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p>Image</p>
                        <div className='flex flex-col lg:flex-row items-center gap-3'>
                            <div className='border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center'>
                                {
                                    !subCategoryData.image ? (
                                        <p className='text-sm text-neutral-400'>No Image</p>
                                    ) : (
                                        <img
                                            alt='subCategory'
                                            src={subCategoryData.image}
                                            className='w-full h-full object-scale-down'
                                        />
                                    )
                                }
                            </div>
                            <label htmlFor='uploadSubCategoryImage'>
                                <div className='px-4 py-1 border border-yellowLight text-yellowish rounded hover:bg-yellowish hover:text-neutral-900 cursor-pointer  '>
                                    Upload Image
                                </div>
                                <input 
                                    type='file'
                                    id='uploadSubCategoryImage'
                                    className='hidden'
                                    onChange={handleUploadSubCategoryImage}
                                />
                            </label>
                            
                        </div>
                    </div>
                    <div className='grid gap-1'>
                        <label>Select Category</label>
                        <div className='border focus-within:border-yellowish rounded'>
                            {/*display value**/}
                            <div className='flex flex-wrap gap-2'>
                                {
                                    subCategoryData.category.map((cat,index)=>{
                                        return(
                                            <div key={cat._id+"selectedValue"} className='bg-white shadow-md px-1 m-1 flex items-center gap-2'>
                                                {cat.name}
                                                <div className='cursor-pointer hover:text-red-600' onClick={()=>handleRemoveSelectedCategory(cat._id)}>
                                                    <IoClose size={20}/>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            {/*select category**/}
                            <select
                                className='w-full p-2 bg-transparent outline-none border'
                                onChange={(e)=>{
                                    const value = e.target.value
                                    const categoryDetails = allCategories.find(el => el._id == value)
                                    
                                    setSubCategoryData((prev)=>{
                                        return{
                                            ...prev,
                                            category : [...prev.category,categoryDetails]
                                        }
                                    })
                                }}
                            >
                                <option value={""}>Select Category</option>
                                {
                                    allCategories.map((category,index)=>{
                                        return(
                                            <option value={category?._id} key={category._id+"subcategory"}>{category?.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>

                    <button
                        className={`px-4 py-2 border
                            ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0] ? "bg-yellowish hover:bg-yellowLight" : "bg-gray-200"}    
                            font-semibold
                        `}
                    >
                        Update
                    </button>
                    
            </form>
        </div>
    </section>
  )
}

export default EditSubCategory