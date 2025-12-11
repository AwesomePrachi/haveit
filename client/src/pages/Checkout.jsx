import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalContext'
import { RiFileList2Fill } from 'react-icons/ri'
import { MdDeliveryDining, MdOutlineProductionQuantityLimits } from 'react-icons/md'
import { formatRupee } from '../utils/formatRupee'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AddressForm from '../components/AddressForm'
import axiosToastError from '../utils/axiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../config/SummaryApi'
import toast from 'react-hot-toast'
import { BsCreditCardFill } from "react-icons/bs";
import rupee from '../assets/rupee.png'
import { IoIosArrowForward } from "react-icons/io";
import { stripePromise } from '../config/stripe'


const Checkout = () => {
  const { totalQty, totalPrice, actualTotalPrice, fetchOrders } = useGlobalContext()
  const [openAddressForm, setOpenAddressForm] = useState(false)
  const savedAddress = useSelector(state => state.address.savedAddress)
  const [selectedAddress, setSelectedAddress] = useState(0)
  // const [orderId, setOrderId] = useState("")
  const cartItems = useSelector(state => state.cart.cartItems)
  const { fetchCartItems } = useGlobalContext()
  const navigate = useNavigate()

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.cash_on_delivery,
        data: {
          item_list: cartItems,
          addressId: savedAddress[selectedAddress]?._id,
          subTotalAmount: totalPrice,
          totalAmount: totalPrice,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        // setOrderId(responseData.data.orderId)
        fetchCartItems()
        fetchOrders()
        navigate('/success', {
          state: {
            message: "Order Placed Successfully"
          }
        })
      }
    } catch (error) {
      axiosToastError(error)
    }
  }

  const handleOnlinePayment = async () => {
    try {
      toast.loading("wait a sec")
      const response = await Axios({
        ...SummaryApi.online_payment,
        data: {
          item_list: cartItems,
          addressId: savedAddress[selectedAddress]?._id,
          subTotalAmount: totalPrice,
          totalAmount: totalPrice
        }
      })

      const { data: responseData } = response

      // use this method first, if it not works use window. method
      // const stripe = await stripePromise;

      // if (!stripe) {
      //   throw new Error('Stripe.js failed to load');
      // }

      // stripe.redirectToCheckout({ sessionId: responseData.id });

      window.location.href = responseData.url;

      fetchCartItems()
      fetchOrders()

    } catch (error) {
      axiosToastError(error)
    }
  }

  return (
    <section className='bg-blue-50'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-10 justify-between'>
        <div className='w-full flex flex-col gap-3'>

          {/* address */}
          <h3 className='lg:text-xl text-lg font-bold'> Your saved address</h3>
          <div className='bg-white p-2 grid gap-4'>
            {
              savedAddress.map((address, index) => {
                return (
                  <label htmlFor={"address" + index} key={"address" + index}>
                    <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                      <div>
                        <input id={"address" + index}
                          name='address'
                          type='radio'
                          defaultChecked
                          value={index}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                        />
                      </div>
                      <div>
                        <p>{address.address_line}, {address.area}, {address?.landmark}</p>
                        <p>{address.city}, {address.state}</p>
                        <p>{address.country} - {address.pincode}</p>
                      </div>
                    </div>
                  </label>
                )
              })
            }
            <div onClick={() => setOpenAddressForm(true)} className='h-16 hover:bg-blue-100 border-2 border-dashed flex justify-center items-center cursor-pointer'>
              Add a new address
            </div>
          </div>

        </div>

        <div className='w-full max-w-md bg-white py-4 px-2'>

          {/* summary */}
          <h3 className='lg:text-xl text-lg font-bold'>Order Summary</h3>

          <div className='bg-white p-4'>
            <h3 className='font-semibold'>Bill details</h3>
            <div className='flex gap-4 justify-between ml-1'>
              <p className='flex flex-row gap-1 mt-1 text-sm'><span className='mt-1'><RiFileList2Fill /></span>Items total</p>
              <p className='flex items-center gap-2 mt-1 text-sm font-semibold'>
                <span className='line-through text-neutral-500'>
                  {actualTotalPrice !== totalPrice && (
                    <div>{formatRupee(actualTotalPrice)}</div>
                  )
                  }
                </span>
                <span>{formatRupee(totalPrice)}</span></p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p className='flex flex-row gap-1 mt-1 text-sm'><span className='mt-1'><MdOutlineProductionQuantityLimits /></span>Quantity total</p>
              <p className='flex items-center gap-2 mt-1 text-sm font-semibold'>{totalQty} item</p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p className='flex flex-row gap-1 mt-1 text-sm'><span className='mt-1'><MdDeliveryDining /></span>Delivery Charge</p>
              <p className='flex items-center gap-2 mt-1 text-sm font-semibold'>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4 mt-2'>
              <p >Grand total</p>
              <p>{formatRupee(totalPrice)}</p>
            </div>
          </div>

          <div className='w-full flex flex-col'>
            <p className='lg:text-xl text-lg font-bold lg:mt-10 mt-6 mb-5'>Select Payment Method</p>
            <button className='py-4 px-4 flex items-center gap-5 border-t border-b border-gray-300 font-semibold cursor-pointer' onClick={handleOnlinePayment}>
              <BsCreditCardFill size={19} className='text-deepBlue' />
              Credit/Debit/ATM Card
              <IoIosArrowForward size={18} className='ml-auto text-deepBlue' />
            </button>
            <button className='py-4 px-4 flex items-center gap-5 border-b border-gray-300 font-semibold cursor-pointer' onClick={handleCashOnDelivery}>
              {/* <BsCurrencyRupee size={20} className='text-deepBlue'/>  */}
              <img src={rupee} width={24} alt="" />
              Cash on Delivery
              <IoIosArrowForward size={18} className='ml-auto text-deepBlue' />
            </button>

          </div>

        </div>
      </div>


      {
        openAddressForm && (
          <AddressForm close={() => setOpenAddressForm(false)} />
        )
      }
    </section>
  )
}

export default Checkout
