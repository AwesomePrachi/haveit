import React, { useEffect, useState } from 'react'
import axiosToastError from '../utils/axiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../config/SummaryApi'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoMdSearch } from "react-icons/io";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [isloading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")

  const fetchProductData = async()=> {
      try {
          setLoading(true)
          const response = await Axios({
              ...SummaryApi.get_product,
              data: {
                  page: page,
                  limit: 12,
                  search: search
              }
          })
          const { data: responseData} = response

          if (responseData.success) {
              setTotalPages(responseData.totalNumberOfPages)
              setProductData(responseData.data)
          }
      } catch (error) {
          axiosToastError(error)
      } finally {
          setLoading(false)
      }
  }

  
  const handlePrevious = ()=> {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }

  const handleNext = ()=> {
    if (page < totalPages) {
      setPage(prev => prev + 1)      
    }
  }
  
  const handleChange = (e)=> {
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProductData()
    }, 300)

    return () => clearTimeout(handler)
  }, [page, search])

  return (
    <section className=''>
        <div className='p-2 bg-white shadow-md flex items-center justify-between gap-4'>
            <h2 className='font-semibold'>Product</h2>
            <div className='h-full w-full max-w-74 bg-blue-50 min-w-24 px-4 py-2 flex items-center gap-3 rounded border border-neutral-400 focus-within:border-yellowish'>
              <IoMdSearch size={25}/>
              <input 
                type="text"
                placeholder='Search product here...'
                className='h-full w-full outline-none bg-transparent'
                value={search}
                onChange={handleChange}
              />
            </div>
        </div>
        {
          isloading && (
            <Loading />
          )
        }

        <div className='p-4 bg-blue-50'>
          <div className='min-h-[60vh]'>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
              {
                productData.map((p, index)=>{
                  return(
                    <ProductCardAdmin key={p._id} data={p} fetchProductData={fetchProductData}/>
                  )
                })
              }
            </div>
          </div>

          <div className='flex justify-between my-4'>
            <button onClick={handlePrevious} className='border bg-yellowLight border-yellowish px-4 py-1 hover:bg-yellowish'>Previous</button>
            <button className='w-full'>{page}/{totalPages}</button>
            <button onClick={handleNext} className='border bg-yellowLight border-yellowish px-4 py-1 hover:bg-yellowish'>Next</button>
          </div>
        </div>
        
    </section>
  )
}

export default ProductAdmin