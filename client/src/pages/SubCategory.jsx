import React, { useEffect } from 'react'
import { useState } from 'react'
import UploadSubCategory from '../components/UploadSubCategory'
import axiosToastError from '../utils/axiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../config/SummaryApi'
import AddTable from '../components/AddTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { MdDelete  } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import EditSubCategory from '../components/EditSubCategory'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'

const SubCategory = () => {
  const [isAddSubCategoryOpen, setIsAddSubCategoryOpen] = useState(false)
  const [data, setData] = useState([])
  const [isloading, setIsLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [previewImageUrl, setPreviewImageUrl] = useState("")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingSubCategory, setEditingSubCategory] = useState({
    _id: ""
  })
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [subCategoryToDelete, setSubCategoryToDelete] = useState({
    _id: ""
  })

  const fetchSubCategory = async()=> {
    try {
        setIsLoading(true)
        const response = await Axios({
            ...SummaryApi.get_subcategory
        })

        const { data: responseData } = response

        if (responseData.success) {
            setData(responseData.data)
        }
    } catch (error) {
        axiosToastError(error)
    } finally {
        setIsLoading(false)
    }
  }

  useEffect(()=>{
    fetchSubCategory()
  },[])

  const handleDeleteSubCategory = async()=> {
    try {
      const response = await Axios({
        ...SummaryApi.delete_subcategory,
        data: subCategoryToDelete
      })

      const { data: responseData} = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchSubCategory()
        setIsDeleteConfirmOpen(false)
        setSubCategoryToDelete({_id: ""})
      }
    } catch (error) {
      axiosToastError(error)
    }
  }

  // console.log('SubCategoryData',data)

  const column = [
    columnHelper.accessor('name', {
      header: "Name"
    }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({row})=>{
        return <div className='flex justify-center items-center'> 
          <img 
            src={row.original.image} 
            alt={row.original.name} 
            className='w-8 h-10 cursor-pointer'
            onClick={()=>{
              setPreviewImageUrl(row.original.image)
            }}
          /> 
          </div>
      }
    }),
    columnHelper.accessor('category', {
      header: "Category",
      cell: ({row})=> {
        return(
          <>
            {
              row.original.category.map((cat, index)=>{
                return(
                  <p key={cat._id+"table"} className='shadow-md px-1 inline-block'>{cat.name}</p>
                )
              })
            }
          </>
        )
      }
    }),
    columnHelper.accessor("_id",{
      header: "Action",
      cell: ({row})=> {
        return(
          <div className='flex items-center justify-center gap-3'>
            <button 
            onClick={()=>{
              setIsEditOpen(true)
              setEditingSubCategory(row.original)
            }}
            className='p-2 bg-green-100 rounded-full hover:text-green-600'>
              <HiPencil size={20}/>
            </button>
            <button 
            onClick={()=>{
              setIsDeleteConfirmOpen(true)
              setSubCategoryToDelete(row.original)
            }}
            className='p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600'>
              <MdDelete  size={20}/>
            </button>
          </div>
        )
      }
    })
  ]

  return (
    <section className=''>
        <div className='p-2 bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Sub Category</h2>
            <button onClick={()=>setIsAddSubCategoryOpen(true)} className='text-sm border border-yellowish hover:bg-yellowish px-3 py-1 rounded'>Add Sub Category</button>
        </div>

        <div className='overflow-auto w-full max-w-[95vw]'>
            <AddTable 
            data={data}
            column={column}
            />
        </div>

        {
          isAddSubCategoryOpen && (
            <UploadSubCategory close={()=>setIsAddSubCategoryOpen(false)} fetchData={fetchSubCategory}/>
          )
        }

        {
          previewImageUrl && (
            <ViewImage url={previewImageUrl} close={() => setPreviewImageUrl("")} />
          )
        }
        {
          isEditOpen && (
            <EditSubCategory data={editingSubCategory} close={()=>setIsEditOpen(false)} fetchData={fetchSubCategory} />
          )
        }
        {
          isDeleteConfirmOpen && (
            <ConfirmBox close={()=>setIsDeleteConfirmOpen(false)} cancel={()=>setIsDeleteConfirmOpen(false)} confirm={handleDeleteSubCategory}/>
          )
        }
    </section>
  )
}

export default SubCategory