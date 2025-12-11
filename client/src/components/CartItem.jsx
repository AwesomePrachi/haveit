import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalContext'
import { formatRupee } from '../utils/formatRupee'
import emptyCart from '../assets/empty_cart.webp'
import { useSelector } from 'react-redux'
import { calculateDiscountedPrice } from '../utils/calculateDiscountedPrice'
import AddToCartBtn from './AddToCartBtn'
import { RiFileList2Fill } from "react-icons/ri";
import { MdDeliveryDining } from "react-icons/md";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";

const CartItem = ({ close }) => {
  const { totalQty, totalPrice, actualTotalPrice } = useGlobalContext()
  const cartItems = useSelector(state => state.cart.cartItems)
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/checkout")
      close()
      return
    }
    toast("Please Login again")
  }

  return (
    <section className='fixed inset-0 bg-black/70 z-50'>
      <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
        <div className='flex items-center p-4 shadow-md gap-3 justify-between'>
          <h2 className='font-bold'>My Cart</h2>
          <Link to={"/"} className='lg:hidden'>
            <IoClose size={25} />
          </Link>
          <button onClick={close} className='hidden lg:block'>
            <IoClose size={25} />
          </button>
        </div>

        <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4'>
          {/***display items */}
          {
            cartItems[0] ? (
              <>
                <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 text-sm font-semibold rounded-full'>
                  <p>Your total savings</p>
                  <p>{formatRupee(actualTotalPrice - totalPrice)}</p>
                </div>
                <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                  {
                    cartItems[0] && (
                      cartItems.map((item, index) => {
                        return (
                          <div key={item?._id + "cartItemDisplay"} className='flex  w-full gap-4'>
                            <div className='w-16 h-16 min-h-16 min-w-16'>
                              <img
                                src={item?.productId?.image[0]}
                                className='object-contain'
                              />
                            </div>
                            <div className='w-full max-w-sm text-xs flex flex-col gap-0.5'>
                              <p className='text-xs text-ellipsis line-clamp-2'>{item?.productId?.name}</p>
                              <p className='text-neutral-400'>{item?.productId?.unit}</p>
                              <div className='flex flex-row gap-2'>
                                <p className='font-bold'>{formatRupee(calculateDiscountedPrice(item?.productId?.price, item?.productId?.discount))}</p>
                                {
                                  item?.productId?.discount > 0 && (
                                    <p className='line-through'>{formatRupee(item?.productId?.price)}</p>
                                  )
                                }
                              </div>
                            </div>
                            <div>
                              <AddToCartBtn
                                data={item?.productId}
                                addLabel="ADD"
                                addBtnClass='text-green-700 text-sm font-semibold border border-green-700 px-2 lg:px-4 py-[6px] rounded-md cursor-pointer'
                                inCartWrapperClass='flex w-full h-full bg-green-700 text-white text-sm rounded-md items-center justify-center'
                                minusBtnClass="pl-3 py-[6px] cursor-pointer"
                                plusBtnClass="pr-3 py-[6px] cursor-pointer"
                                qtyClass="px-2 py-[6px] cursor-pointer"
                                iconSize={8}
                              />
                            </div>
                          </div>
                        )
                      })
                    )
                  }
                </div>
                <div className='bg-white p-4'>
                  <h3 className='font-bold'>Bill details</h3>
                  <div className='flex gap-4 justify-between ml-1'>
                    <p className='flex flex-row gap-1 mt-1 text-sm'><span className='mt-1'><RiFileList2Fill /></span>Items total</p>
                    <p className='flex items-center gap-2 mt-1 text-sm font-semibold'>
                      <span className='line-through text-neutral-500'>
                        {actualTotalPrice !== totalPrice && (
                          <div>{formatRupee(actualTotalPrice)}</div>
                        )
                        }
                      </span>
                      {formatRupee(totalPrice)}</p>
                  </div>
                  <div className='flex gap-4 justify-between ml-1'>
                    <p className='flex flex-row gap-1 mt-1 text-sm'><span className='mt-1'><MdOutlineProductionQuantityLimits /></span>Quantity total</p>
                    <p className='flex items-center gap-2 mt-1 text-sm font-semibold'>{totalQty} item</p>
                  </div>
                  <div className='flex gap-4 justify-between ml-1'>
                    <p className='flex flex-row gap-1 mt-1 text-sm'><span className='mt-1'><MdDeliveryDining /></span>Delivery Charge</p>
                    <p className='flex items-center gap-2 mt-1 text-sm font-semibold'>Free</p>
                  </div>
                  <div className='font-bold flex items-center justify-between gap-4 mt-2'>
                    <p >Grand total</p>
                    <p>{formatRupee(totalPrice)}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className='bg-white flex flex-col justify-center items-center'>
                <img
                  src={emptyCart}
                  className='w-full h-full object-scale-down'
                />
                <Link onClick={close} to={"/"} className='block bg-green-600 px-4 py-2 text-white rounded'>Shop Now</Link>
              </div>
            )
          }

        </div>

        {
          cartItems[0] && (
            <div className='px-3 py-2 -mt-1'>
              <div className='bg-green-700 text-neutral-100 px-4 font-semibold text-base lg:py-3 py-2 static bottom-3 rounded-lg flex items-center gap-4 justify-between'>
                <div className='flex flex-col'>
                  {formatRupee(totalPrice)}
                  <p className='text-xs font-normal mb-1 lg:mb-0'>TOTAL</p>
                </div>
                <button onClick={redirectToCheckoutPage} className='flex items-center text-lg gap-1 font-normal'>
                  Proceed
                  <span><FaAngleRight /></span>
                </button>
              </div>
            </div>
          )
        }

      </div>
    </section>
  )
}

export default CartItem