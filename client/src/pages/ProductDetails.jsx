import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosToastError from '../utils/axiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../config/SummaryApi'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import Divider from '../components/Divider'
import { formatRupee } from '../utils/formatRupee'
import img1 from '../assets/10_minute_delivery.png'
import img2 from '../assets/best_prices_offers.png'
import img3 from '../assets/wide_assortment.png'
import { calculateDiscountedPrice } from '../utils/calculateDiscountedPrice'
import AddToCartBtn from '../components/AddToCartBtn'

const ProductDetails = () => {
  const params = useParams()
  let productId = params.product.split("-")?.slice(-1)[0]
  // console.log(productId)

  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [isloading, setIsLoading] = useState(false)
  const [image, setImage] = useState(0)
  const imageInputRef = useRef()


  const fetchData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_product_details,
        data: {
          productId: productId
        }
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

  // console.log("product data", data)

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }

  useEffect(() => {
    fetchData()
  }, [params])

  return (
    <section className='container mx-auto p-2 grid lg:grid-cols-2 '>
      <div className=''>

        {/* left side content */}
        <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
          <img
            src={data.image[image]}
            className='w-full h-full object-scale-down'
          />
        </div>
        <div className='flex items-center justify-center gap-3 my-2'>
          {
            data.image.map((img, index) => {
              return (
                <div key={img + index + "product"} className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-300"}`}></div>
              )
            })
          }
        </div>
        <div className='grid relative'>
          <div ref={imageInputRef} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
            {
              data.image.map((img, index) => {
                return (
                  <div className='w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-md' key={img + index}>
                    <img
                      src={img}
                      alt='more images'
                      onClick={() => setImage(index)}
                      className='w-full h-full object-scale-down'
                    />
                  </div>
                )
              })
            }
          </div>
          <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute  items-center'>
            <button onClick={handleScrollLeft} className='z-10 relative bg-white shadow-md shadow-gray-400 text-lg p-2 rounded-full'>
              <FaAngleLeft />
            </button>
            <button onClick={handleScrollRight} className='z-10 relative bg-white shadow-md shadow-gray-400 text-lg p-2 rounded-full'>
              <FaAngleRight />
            </button>
          </div>
        </div>
        <div>
        </div>

        <div className='my-5 hidden lg:grid gap-3 '>
          <p className='font-bold'>More information</p>
          {
            data?.more_details && Object.keys(data?.more_details).slice(3).map((element, index) => {
              return (
                <div key={element + index}>
                  <p className='font-semibold mt-1'>{element}</p>
                  <p className='text-base'>{data?.more_details[element]}</p>
                </div>
              )
            })
          }
        </div>
      </div>

      {/* right side content */}
      
      <div className='p-4 lg:pl-7 mt-3 text-base lg:text-lg'>
        <p className='text-[12px]'>Home / product / <span className='text-gray-400'>{data.name}</span> </p>
        {/* <p className='bg-green-300 w-fit px-2 my-1 rounded-full'>10 Min</p> */}
        <h2 className=' font-bold mt-1 text-xl lg:text-2xl'>{data.name}</h2>

        <Divider />
        <div className='lg:grid grid-cols-2'>
          <div>
            <p className='text-sm mb-2 text-gray-500 font-semibold'>{data.unit}</p>
            <div className='flex items-center gap-2 lg:gap-4'>
              <p className='font-bold border box-border px-2 rounded border-green-600'>
                {formatRupee(calculateDiscountedPrice(data.price, data.discount))}
              </p>

              {
                data?.discount > 0 && (
                  <p className='line-through'>{formatRupee(data.price)}</p>
                )
              }
              {
                data?.discount == 0 && (
                  <p></p>
                )
              }
              {
                data?.discount > 0 && (
                  <p className="font-bold text-[10px] bg-sky-600 text-white px-2 py-1 rounded-2xl">{data.discount}% OFF</p>
                )
              }

            </div>
            <p className=' my-2 text-[10px] text-gray-600'>{`(Inclusive of all taxes)`}</p>
          </div>

          {
            data.stock === 0 ? (
              <p className='text-lg text-red-500 my-2'>Out of Stock</p>
            )
              : (
                <div className='my-4 lg:text-right lg:ml-44'>

                  <AddToCartBtn 
                    data={data}
                    addLabel="Add to cart"
                    addBtnClass='bg-green-700 text-white text-[16px] font-bold px-2 py-2 lg:px-3 lg:py-3 rounded-md cursor-pointer'
                    inCartWrapperClass='flex w-fit h-full bg-green-700 text-white rounded-md items-center justify-center'
                    minusBtnClass="pl-5 py-[9px] cursor-pointer"
                    plusBtnClass="pr-5 py-[9px] cursor-pointer"
                    qtyClass="px-5 py-[9px] cursor-pointer"
                    iconSize={11} 
                  />

                </div>
              )
          }
        </div>

        <h2 className='font-bold mt-9'>Why shop from haveit? </h2>
        <div>
          <div className='flex  items-center gap-4 my-4'>
            <img
              src={img1}
              alt='superfast delivery'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Superfast Delivery</div>
              <p>Get your orer delivered to your doorstep at the earliest from dark stores near you.</p>
            </div>
          </div>
          <div className='flex  items-center gap-4 my-4'>
            <img
              src={img2}
              alt='Best prices offers'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Best Prices & Offers</div>
              <p>Best price destination with offers directly from the nanufacturers.</p>
            </div>
          </div>
          <div className='flex  items-center gap-4 my-4'>
            <img
              src={img3}
              alt='Wide Assortment'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Wide Assortment</div>
              <p>Choose from 5000+ products across food personal care, household & other categories.</p>
            </div>
          </div>
        </div>


        <div className='mb-8 mt-10 lg:mt-14 grid gap-3 '>
          <p className='font-bold'>Product Details</p>
          <div>
            <p className='font-medium mt-1'>Description</p>
            <p className='text-base'>{data.description}</p>
          </div>
          <div>
            <p className='font-medium'>Unit</p>
            <p className='text-base'>{data.unit}</p>
          </div>

          <div>
            {
              data?.more_details && Object.keys(data?.more_details).slice(0, 3).map((element, index) => {
                return (
                  <div key={element + index + "desktop"}>
                    <p className='font-semibold mt-2'>{element}</p>
                    <p className='text-base'>{data?.more_details[element]}</p>
                  </div>
                )
              })
            }
          </div>

          {/* for mobile only */}
          <div className='lg:hidden -mt-2'>
            {
              data?.more_details && Object.keys(data?.more_details).slice(3).map((element, index) => {
                return (
                  <div key={element + index + "mobile"}>
                    <p className='font-semibold mt-2'>{element}</p>
                    <p className='text-base'>{data?.more_details[element]}</p>
                  </div>
                )
              })
            }
          </div>

        </div>
      </div>
    </section>
  )
}

export default ProductDetails