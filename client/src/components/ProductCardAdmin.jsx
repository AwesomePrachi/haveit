import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import ConfirmBox from './ConfirmBox'
import axiosToastError from '../utils/axiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../config/SummaryApi'
import toast from 'react-hot-toast'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const handleDeleteProduct = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_product,
        data: {
          _id: data._id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchProductData()
        setIsDeleteConfirmOpen(false)
      }
    } catch (error) {
      axiosToastError(error)
    }
  }
  
  return (
    <div className='w-36 p-4 bg-white'>
      <div>
        <img
          src={data?.image[0]}
          alt={data?.name}
          className='w-full h-full object-scale-down'
        />
      </div>
      <p className='text-ellipsis line-clamp-2 font-medium'>{data?.name}</p>
      <p className='text-neutral-500'>{data?.unit}</p>
      <div className='grid grid-cols-2 gap-3 py-2'>
        <button onClick={() => setIsEditOpen(true)} className='px-1 py-1 text-sm border border-green-600 bg-green-100 text-green-800 hover:bg-green-200 rounded'>Edit</button>
        <button onClick={() => setIsDeleteConfirmOpen(true)} className='px-1 py-1 text-sm border border-red-600 bg-red-100 text-red-800 hover:bg-red-200 rounded'>Delete</button>
      </div>

      {
        isEditOpen && (
          <EditProductAdmin data={data} fetchProductData={fetchProductData} close={() => setIsEditOpen(false)} />
        )
      }
      {
        isDeleteConfirmOpen && (
          <ConfirmBox close={() => setIsDeleteConfirmOpen(false)} cancel={() => setIsDeleteConfirmOpen(false)} confirm={handleDeleteProduct} />
        )
      }
    </div>
  )
}

export default ProductCardAdmin