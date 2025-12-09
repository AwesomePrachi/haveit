import React from 'react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../config/SummaryApi'
import axiosToastError from '../utils/axiosToastError'
import noDataImg from '../assets/nothing.webp'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import { useSelector } from 'react-redux'
import { convertToValidUrl } from '../utils/convertToValidUrl'
import { useEffect } from 'react'

const ProductList = () => {

  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1) // or const [currentPage, setCurrentPage]
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const params = useParams()
  const allSubCategories = useSelector(state => state.product.allSubCategories) // rename in store if possible
  const [displaySubCategories, setDisplaySubCategories] = useState([])

  const subParts = params?.subcategory?.split("-") ?? []
  const subcategoryName = subParts.slice(0, subParts.length - 1).join(" ")

  const categoryId = params.category.split("-").slice(-1)[0]
  const subcategoryId = params.subcategory.split("-").slice(-1)[0]
  // console.log("categoryId", categoryId, "subcategoryId", subcategoryId)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await Axios({
        ...SummaryApi.list_products_by_category_subcategory,
        data: {
          categoryId: categoryId,
          subcategoryId: subcategoryId,
          page: page,
          limit: 8
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page === 1) {
          setProducts(responseData.data)
        } else {
          setProducts([...data, ...responseData.data])
        }
        setTotalPages(responseData.totalNumberOfPages)
      }
    } catch (error) {
      axiosToastError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [params])

  useEffect(() => {
    const sub = allSubCategories.filter(s => {
      const filter = s.category.some(el => el._id == categoryId)
      return filter ? filter : null
    })
    setDisplaySubCategories(sub);
  }, [params, allSubCategories])

  return (
    <section className='sticky top-24 lg:top-20'>
      <div className='container sticky top-24  mx-auto grid grid-cols-[90px_1fr]  md:grid-cols-[200px_1fr] lg:grid-cols-[280px_1fr]'>
        {/**sub category **/}
        <div className=' min-h-[88vh] max-h-[88vh] overflow-y-scroll  grid gap-1 shadow-md scrollbar-custom bg-white py-2'>
          {
            displaySubCategories.map((s, index) => {
              const link = `/${convertToValidUrl(s?.category[0]?.name)}-${s?.category[0]?._id}/${convertToValidUrl(s.name)}-${s._id}`
              return (
                <Link key={s._id + "category"} to={link} className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b 
                  hover:bg-blue-100 cursor-pointer
                  ${subcategoryId === s._id ? "bg-blue-100 font-semibold" : ""}
                `}
                >
                  <div className='w-fit max-w-28 mx-auto lg:mx-0  rounded  box-border' >
                    <img
                      src={s.image}
                      alt='subCategory'
                      className=' w-14 lg:h-14 lg:w-12 h-full object-scale-down'
                    />
                  </div>
                  <p className='-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base'>{s.name}</p>
                </Link>
              )
            })
          }
        </div>


        {/**Product **/}
        <div className='sticky top-20'>
          <div className='bg-white shadow-md p-4 z-10'>
            <h3 className='font-semibold'>{subcategoryName}</h3>
          </div>
          <div>
            {
              !products[0] && (
                <div className='flex flex-col items-center justify-center p-4 gap-1'>
                  <img src={noDataImg} alt="no data" className='w-100' />
                  <p className='text-neutral-500 text-sm'>No items in the list</p>
                </div>
              )
            }
            <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto relative'>
              <div className=' grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4 '>
                {
                  products.map((p, index) => {
                    return (
                      <ProductCard
                        data={p}
                        key={p._id + "productSubCategory" + index}
                      />
                    )
                  })
                }
              </div>
            </div>

            {
              isLoading && (
                <Loading />
              )
            }

          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductList