import React from 'react'
import { useSelector } from 'react-redux'
import notOrders from '../assets/not_orders.webp'
import { formatRupee } from '../utils/formatRupee'

const MyOrders = () => {
  const orders = useSelector((state) => state.orders.orders)
  console.log("orders", orders)
  return (
    <div>
      <div className='bg-white shadow-md p-3 text-xl font-sans font-bold'>
        <h1>My orders</h1>
      </div>
      {
        orders?.length === 0 && (
          <img src={notOrders}  alt={notOrders} className='w-xl h-full mx-auto'/>
        )
      }
      { orders && (
        orders.map((order, index) => {
          return (
            <div key={order._id + index + "order"} className='order rounded p-4 text-sm'>
              <p className='font-semibold'>Order ID : {order?.orderId}</p>
              <div className='flex gap-3'>
                <img
                  src={order.product_details.image[0]}
                  className='w-14 h-14'
                />
                <p className='font-medium text-gray-700 mt-1'>{order.product_details.name}</p>
                <p className='text-xs bg-blue-300 text-white px-3 mt-1 mb-10 py-0.5 rounded-2xl'>{formatRupee(order.totalAmount)}</p>
              </div>
            </div>
          )
        }))
      }
    </div>
  )
}

export default MyOrders