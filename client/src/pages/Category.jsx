import React, { useEffect, useState } from 'react'
import UploadCategory from '../components/UploadCategory'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../config/SummaryApi'
import axiosToastError from '../utils/axiosToastError'
import EditCategory from '../components/EditCategory'
import Loading from '../components/Loading'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const Category = () => {
    const [isUploadCategoryOpen, setIsUploadCategoryOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState([])

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState({ name: "", image: "" })

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState({ _id: "" })


    const allCategories = useSelector(state => state.product.allCategories)

    useEffect(() => {
        setCategories(allCategories)
    }, [allCategories])

    const fetchCategory = async () => {
        try {
            setIsLoading(true)
            const response = await Axios({
                ...SummaryApi.get_category
            })
            const { data: responseData } = response

            if (responseData.success) {
                setCategories(responseData.data)
            }
        } catch (error) {
            axiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    const handleDeleteCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.delete_category,
                data: categoryToDelete
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                fetchCategory()
                setOpenDeleteConfirmBox(false)
                setCategoryToDelete({ _id: "" })
            }
        } catch (error) {
            axiosToastError(error)
        }
    }

    return (
        <section className=''>
            <div className='p-2 bg-white shadow-md flex items-center justify-between'>
                <h2 className='font-semibold'>Category</h2>
                <button onClick={() => setIsUploadCategoryOpen(true)} className='text-sm border border-yellowish hover:bg-yellowish px-3 py-1 rounded'>Add Category</button>
            </div>
            {
                !categories[0] && !isLoading && (
                    <NoData />
                )
            }

            <div className='p-4 grid  grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
                {
                    categories.map((category, index) => {
                        return (
                            <div className='w-32 h-56 rounded shadow-md' key={category._id}>
                                <img
                                    alt={category.name}
                                    src={category.image}
                                    className='w-full object-scale-down'
                                />
                                <div className='items-center h-9 flex gap-2'>
                                    <button onClick={() => {
                                        setIsEditOpen(true)
                                        setEditingCategory(category)
                                    }} className='flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded'>
                                        Edit
                                    </button>
                                    <button onClick={() => {
                                        setIsDeleteConfirmOpen(true)
                                        setCategoryToDelete(category)
                                    }} className='flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounded'>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {
                isLoading && (
                    <Loading />
                )
            }

            {
                isUploadCategoryOpen && (
                    <UploadCategory fetchData={fetchCategory} close={() => setIsUploadCategoryOpen(false)} />
                )
            }

            {
                isEditOpen && (
                    <EditCategory data={editData} close={() => setIsEditOpen(false)} fetchData={fetchCategory} />
                )
            }

            {
                isDeleteConfirmOpen && (
                    <ConfirmBox close={() => setIsDeleteConfirmOpen(false)} cancel={() => setIsDeleteConfirmOpen(false)} confirm={handleDeleteCategory} />
                )
            }
        </section>
    )
}

export default Category