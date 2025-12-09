import React, { useEffect, useState } from 'react'
import { MdCloudUpload } from "react-icons/md";
import uploadImage from '../utils/uploadImage';
import Loading from '../components/Loading'
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import AddField from '../components/AddField';
import Axios from '../utils/Axios';
import SummaryApi from '../config/SummaryApi';
import axiosToastError from '../utils/axiosToastError';
import successAlert from '../utils/successAlert';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subcategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {}
  })
  const [loading, setLoading] = useState(false)
  const [viewImageUrl, setViewImageUrl] = useState("")
  const allCategories = useSelector(state => state.product.allCategories)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategories = useSelector(state => state.product.allSubCategories)
  const [openAddFieldBox, setOpenAddFieldBox] = useState(false)
  const [fieldName, setFieldName] = useState("")

  const handleChange = (e)=> {
    const { name, value } = e.target

    setData((prev)=>{
      return{
        ...prev,
        [name]: value
      }
    })
  }

  const handleUploadImage = async(e)=> {
    const file = e.target.files[0]
    if (!file) {
      return
    }
    setLoading(true)
    const response = await uploadImage(file)
    const { data: imageResponse } = response
    const imageUrl = imageResponse.data.url
    
    setData((prev)=> {
        return{
            ...prev,
            image: [...prev.image, imageUrl]
        }
    })
    setLoading(false)
  }

  const handleDeleteImage = async(index)=> {
    data.image.splice(index, 1)
    setData((prev)=>{
      return{
        ...prev
      }
    })
  }

  const handleRemoveCategory = async(index)=> {
    data.category.splice(index, 1)
    setData((prev)=>{
      return{
        ...prev
      }
    })
  }

  const handleRemoveSubCategory = async(index)=> {
    data.subcategory.splice(index, 1)
    setData((prev)=>{
      return{
        ...prev
      }
    })
  }

  const handleSubmitField = ()=> {
    setData((prev)=>{
      return{
        ...prev,
        more_details: { ...prev.more_details, [fieldName]: "" }
      }
    })
    setFieldName("")
    setOpenAddFieldBox(false)
  }

  const handleSubmit = async(e)=> {
    e.preventDefault()
    console.log(data)
    try {
      const response = await Axios({
        ...SummaryApi.add_product,
        data: data
      })
      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        setData({
          name : "",
          image : [],
          category : [],
          subcategory : [],
          unit : "",
          stock : "",
          price : "",
          discount : "",
          description : "",
          more_details : {},
        })
      }
    } catch (error) {
      axiosToastError(error)
    }
  }
  
  useEffect(() => {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((ta) => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    });
  }, [data?.more_details]);
  
  return (
    <section className=''>
        <div className='p-2 bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Upload Product</h2>
        </div>
        <div className='grid p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit}>
              <div className='grid gap-1'> 
                <label htmlFor="name">Name</label>
                <input 
                  id='name'
                  type="text" 
                  placeholder='Enter product name'
                  name='name'
                  value={data.name}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-yellowish rounded'
                  />
              </div>

              <div className='grid gap-1'> 
                <label htmlFor="description">Description</label>
                <textarea 
                  id='description'
                  type="text" 
                  placeholder='Enter product description'
                  name='description'
                  value={data.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className='bg-blue-50 p-2 outline-none border focus-within:border-yellowish rounded resize-none'
                  />
              </div>

              <div>
                <p>Image</p>
                <div>
                  <label htmlFor='image' className='bg-blue-50 h-24 mt-1 border rounded flex justify-center items-center cursor-pointer'>
                    <div className='text-center flex justify-center items-center flex-col'>
                      {
                        loading ? <Loading /> : (
                          <>
                            <MdCloudUpload size={35}/>
                            <p>Upload Image</p>
                          </>
                        )
                      }
                      
                    </div>
                    <input 
                      type="file" 
                      id='image' 
                      className='hidden' 
                      accept='image/*'
                      onChange={handleUploadImage}
                    />
                  </label>
                  {/* dispay uploaded images */}
                  <div className='flex flex-wrap gap-4'>
                    {
                      data.image.map((image, index)=> {
                        return(
                          <div key={image+index} className='my2 h-20 w-20 min-w-20 mt-1 bg-blue-50 border border-gray-500 rounded relative group'>
                            <img 
                              src={image} 
                              alt={image} 
                              className='w-full h-full object-scale-down cursor-pointer' 
                              onClick={()=>{setViewImageUrl(image)}}
                            />
                            <div onClick={()=>handleDeleteImage(index)}
                            className='absolute bottom-0 right-0 p-1 bg-red-200 text-red-500 hover:text-red-600 rounded hidden group-hover:block cursor-pointer'>
                              <MdDelete />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>

              <div className='grid gap-1'>
                <label>Category</label>
                <div className='mt-[3px]'>
                  <select 
                    value={selectCategory} 
                    onChange={(e)=>{
                      const value = e.target.value
                      const category = allCategories.find(el => el._id === value)
                      // console.log(category)

                      setData((prev)=>{
                        return{
                          ...prev,
                          category: [...prev.category, category]
                        }
                      })
                      setSelectCategory("")
                    }}
                    className='bg-blue-50 border border-black/60 w-full p-2 rounded text-neutral-500'
                  >
                    <option value={""}>Select Category</option>
                    {
                      allCategories.map((cat, index)=> {
                        return(
                          <option key={cat._id + index + "selectcategory"} value={cat?._id}>{cat.name}</option>
                        )
                      })
                    }
                  </select>
                  
                  <div className='flex flex-wrap gap-2'>
                    {
                      data.category.map((cat, index)=>{
                        return(
                          <div key={cat._id+index+"productcategory"} className='bg-blue-50/80 text-sm flex items-center gap-1 mt-2 mb-2 px-1'>
                            {cat.name}
                            <div className='cursor-pointer hover:text-red-600' onClick={()=>handleRemoveCategory(index)}>
                              <IoClose size={20}/>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>

                </div>
              </div>

              <div className='grid gap-1'>
                <label>Sub Category</label>
                <div className='mt-[3px]'>
                  <select 
                    value={selectSubCategory} 
                    onChange={(e)=>{
                      const value = e.target.value
                      const subCategory = allSubCategories.find(el => el._id === value)
                      // console.log(category)

                      setData((prev)=>{
                        return{
                          ...prev,
                          subcategory: [...prev.subcategory, subCategory]
                        }
                      })
                      setSelectSubCategory("")
                    }}
                    className='bg-blue-50 border border-black/60 w-full p-2 rounded text-neutral-500'
                  >
                    <option value={""}>Select Sub Category</option>
                    {
                      allSubCategories.map((cat, index)=> {
                        return(
                          <option key={cat._id+index+"selectsubcategory"} value={cat?._id}>{cat.name}</option>
                        )
                      })
                    }
                  </select>
                  
                  <div className='flex flex-wrap gap-2'>
                    {
                      data.subcategory.map((cat, index)=>{
                        return(
                          <div key={cat._id+index+"productcategory"} className='bg-blue-50/80 text-sm flex items-center gap-1 mt-2 mb-2 px-1'>
                            {cat.name}
                            <div className='cursor-pointer hover:text-red-600' onClick={()=>handleRemoveSubCategory(index)}>
                              <IoClose size={20}/>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>

                </div>
              </div>

              <div className='grid gap-1'> 
                <label htmlFor="unit">Unit</label>
                <input 
                  id='unit'
                  type="text" 
                  placeholder='Enter product unit'
                  name='unit'
                  value={data.unit}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-yellowish rounded'
                  />
              </div>

              <div className='grid gap-1'> 
                <label htmlFor="stock">Number of Stock</label>
                <input 
                  id='stock'
                  type="number" 
                  placeholder='Enter product stock'
                  name='stock'
                  value={data.stock}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-yellowish rounded'
                  />
              </div>

              <div className='grid gap-1'> 
                <label htmlFor="price">Price</label>
                <input 
                  id='price'
                  type="number" 
                  placeholder='Enter product price'
                  name='price'
                  value={data.price}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-yellowish rounded'
                  />
              </div>

              <div className='grid gap-1'> 
                <label htmlFor="discount">Discount</label>
                <input 
                  id='discount'
                  type="number" 
                  placeholder='Enter product discount'
                  name='discount'
                  value={data.discount}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-yellowish rounded'
                  />
              </div>
              
              {/* add more fields */}
              {
                Object.keys(data?.more_details).map((key, index)=>{
                  return(
                    <div key={key || index} className='grid gap-1'> 
                      <label htmlFor={key}>{key}</label>
                      <textarea 
                        id={key}
                        type="text"
                        placeholder={`Enter ${key}`}
                        value={data?.more_details[key]}
                        onChange={(e)=>{
                          const value = e.target.value
                          setData((prev)=>{
                            return{
                              ...prev,
                              more_details: {
                                ...prev.more_details,
                                [key]: value
                              }
                            }
                          })
                          // Auto-expand logic
                          e.target.style.height = "auto"; // reset height
                          e.target.style.height = e.target.scrollHeight + "px"; // set new height    
                        }}
                        rows={1}
                        required
                        className='bg-blue-50 p-2 outline-none border focus-within:border-yellowish rounded'
                        />
                    </div>
                  )
                })
              }

              <div onClick={()=>setOpenAddFieldBox(true)} className='bg-purple-600 border border-purple-800 text-white hover:bg-white hover:text-neutral-900 py-1 px-3 mt-2 mb-2 w-32 text-center font-semibold cursor-pointer rounded'>
                Add Fields
              </div>

              <button
                className='px-4 py-2 border bg-yellowish hover:bg-yellowLight font-semibold'
              >
                Submit
              </button>
            </form>
        </div>
        {
          viewImageUrl && (
            <ViewImage url={viewImageUrl} close={()=>{setViewImageUrl("")}}/>
          )
        }

        {
          openAddFieldBox && (
            <AddField 
              value={fieldName} 
              onChange={(e)=>setFieldName(e.target.value)} 
              submit={handleSubmitField}
              close={()=>setOpenAddFieldBox(false)}
            />
          )
        }
    </section>
  )
}

export default UploadProduct