import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosToastError from '../utils/axiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../config/SummaryApi'
import LoadingCard from './LoadingCard'
import ProductCard from './ProductCard'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { convertToValidUrl } from '../utils/convertToValidUrl'

const ProductsByCategory = ({ id, name }) => {
    const [data, setData] = useState([])
    const [isloading, setIsLoading] = useState(false)
    const cardRef = useRef()
    const allSubCategories = useSelector(state => state.product.allSubCategories)

    const fetchProductsByCategory = async () => {
        try {
            setIsLoading(true)
            const response = await Axios({
                ...SummaryApi.get_product_by_category,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response
            // console.log(responseData)

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            axiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadingCardNumber = new Array(6).fill(null)

    useEffect(() => {
        fetchProductsByCategory()
    }, [])

    const handleScrollLeft = () => {
        cardRef.current.scrollLeft -= 200
    }
    const handleScrollRight = () => {
        cardRef.current.scrollLeft += 200
    }


    const handleRedirectProductList = () => {
        const subCategory = allSubCategories.find(sub => {
            const filter = sub.category.some(c => c._id == id)
            return filter
        })
        const url = `/${convertToValidUrl(name)}-${id}/${convertToValidUrl(subCategory?.name)}-${subCategory?._id}`
        return url
    }

    const redirectUrl = handleRedirectProductList()
    
    return (
        <div>
            <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
                <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
                <Link to={redirectUrl} className='text-green-600 hover:text-green-400'>See All</Link>
            </div>
            <div className='relative flex items-center '>
                <div className=' flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scroll scroll-smooth scrollbar-none' ref={cardRef}>
                    {isloading &&
                        loadingCardNumber.map((_, index) => {
                            return (
                                <LoadingCard key={"CategorywiseProductDisplay123" + index} />
                            )
                        })
                    }


                    {
                        data.map((p, index) => {
                            return (
                                <ProductCard
                                    data={p}
                                    key={p._id + "CategorywiseProductDisplay" + index}
                                />
                            )
                        })
                    }

                </div>
                <div className='w-full left-0 right-0 container mx-auto  px-2  absolute hidden lg:flex justify-between'>
                    <button onClick={handleScrollLeft} className='z-10 relative bg-white shadow-md shadow-gray-400 text-lg p-2 rounded-full'>
                        <FaAngleLeft />
                    </button>
                    <button onClick={handleScrollRight} className='z-10 relative  bg-white shadow-md shadow-gray-400 p-2 text-lg rounded-full'>
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductsByCategory