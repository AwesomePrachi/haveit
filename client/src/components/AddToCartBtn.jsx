import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalContext'
import Axios from '../utils/Axios'
import SummaryApi from '../config/SummaryApi'
import axiosToastError from '../utils/axiosToastError'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from 'react-icons/fa'

const AddToCartBtn = ({ 
    data,
    addLabel,
    addBtnClass,
    inCartWrapperClass,
    minusBtnClass,
    plusBtnClass,
    qtyClass,
    iconSize 
}) => {
    const { fetchCartItems, updateCartQty, removeCartItem } = useGlobalContext()
    const [isloading, setIsLoading] = useState(false)
    const cartItems = useSelector(state => state.cart.cartItems)
    const [isInCart, setIsInCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [itemInCart, setItemInCart] = useState()
    // console.log("cart",cartItems)

    const handleAddTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setIsLoading(true)

            const response = await Axios({
                ...SummaryApi.add_to_cart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                fetchCartItems()
            }
        } catch (error) {
            axiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const increaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const response = await updateCartQty(itemInCart?._id, qty + 1)
        if (response.success) {
            toast.success("Item added to cart")
        }
    }

    const decreaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (qty === 1) {
            removeCartItem(itemInCart?._id)
        } else {
            const response = await updateCartQty(itemInCart?._id, qty - 1)
            if (response.success) {
            toast.success("Item removed")
        }
        }
    }

    // checking if item is in cart
    useEffect(() => {
        const check = cartItems.some(item => item.productId._id === data._id)
        setIsInCart(check)

        const item = cartItems.find((item) => item.productId._id === data._id)
        setQty(item?.quantity)
        setItemInCart(item)
    }, [data, cartItems])

    return (
        <div className='w-full max-w-[150px]'>
            {
                isInCart ? (
                    <div className={inCartWrapperClass}>
                        <button onClick={decreaseQty} className={minusBtnClass}>
                            <FaMinus size={iconSize}/>
                        </button>

                        <p onClick={(e)=>{e.preventDefault()}} className={qtyClass}>{qty}</p>

                        <button onClick={increaseQty} className={plusBtnClass}>
                            <FaPlus size={iconSize}/>
                        </button>
                    </div>
                ) : (
                    <button onClick={handleAddTocart} className={addBtnClass}>
                        {addLabel}
                    </button>
                )
            }

        </div>
    )
}

export default AddToCartBtn