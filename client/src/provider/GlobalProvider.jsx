import { useDispatch, useSelector } from "react-redux"
import SummaryApi from "../config/SummaryApi"
import { setCartItems } from "../store/cartSlice"
import Axios from "../utils/Axios"
import { GlobalContext } from "./GlobalContext"
import { useEffect, useState } from "react"
import axiosToastError from "../utils/axiosToastError"
import toast from "react-hot-toast"
import { calculateDiscountedPrice } from "../utils/calculateDiscountedPrice"
import { setAddress } from "../store/addressSlice"
import { setOrders } from "../store/orderSlice"

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const cartItems = useSelector(state => state.cart.cartItems)
  const [totalQty, setTotalQty] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [actualTotalPrice, setActualTotalPrice] = useState(0)

  const fetchCartItems = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_cart_items
      })

      const { data: responseData } = response
      if (responseData.success) {
        // console.log(responseData)
        dispatch(setCartItems(responseData.data))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateCartQty = async (id, quantity) => {
    try {
      const response = await Axios({
        ...SummaryApi.update_cart_qty,
        data: {
          _id: id,
          quantity: quantity
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        // toast.success(responseData.message)
        fetchCartItems()
        return responseData
      }
    } catch (error) {
      axiosToastError(error)
      return error
    }
  }

  const removeCartItem = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.remove_from_cart,
        data: {
          _id: id
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        fetchCartItems()
      }
    } catch (error) {
      axiosToastError(error)
    }
  }

  useEffect(() => {
    const quantity = cartItems.reduce((prev, curr) => {
      return prev + curr.quantity
    }, 0)
    setTotalQty(quantity)

    const price = cartItems.reduce((prev, curr) => {
      const priceAfterDiscount = calculateDiscountedPrice(curr?.productId?.price, curr?.productId?.discount)
      return prev + (priceAfterDiscount * curr.quantity)
    }, 0)
    setTotalPrice(price)

    // total price without discount
    const originalPrice = cartItems.reduce((prev, curr) => {
      return prev + (curr?.productId?.price * curr.quantity)
    }, 0)
    setActualTotalPrice(originalPrice)

  }, [cartItems])

  const fetchAddresses = async()=> {
    try {
      const response = await Axios({
        ...SummaryApi.get_address
      })
      const { data: responseData } = response
      if (responseData.success) {
        dispatch(setAddress(responseData.data))
      }
    } catch (error) {
      // axiosToastError(error)
    }
  }

  const logoutUser = () => {
    localStorage.clear()
    dispatch(setCartItems([]))
  }

  const fetchOrders = async()=> {
    try {
      const response = await Axios({
        ...SummaryApi.get_order_items
      })

      const { data: responseData } = response
      if (responseData.success) {
        dispatch(setOrders(responseData.data))
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetchCartItems()
    fetchAddresses()
    logoutUser(),
    fetchOrders()
  }, [user])

  return (
    <GlobalContext.Provider value={{ fetchCartItems, updateCartQty, removeCartItem, fetchAddresses, fetchOrders, totalQty, totalPrice, actualTotalPrice }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider



