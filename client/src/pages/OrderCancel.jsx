import React from 'react'
import orderCancel from '../assets/cancel_order.png'
import { FaRegCircleCheck } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';

const OrderCancel = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full lg:min-h-[80vh] bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg border border-gray-400 shadow-lg">
          <div className="flex flex-col items-center gap-1">

            <img src={orderCancel} width={90} alt={orderCancel} />
            <h1 className="lg:text-2xl text-lg font-bold text-red-600 mt-4">Order Cancelled</h1>
            <p className="text-gray-500 text-sm lg:text-base text-center mt-2">
              Your order has been cancelled.
            </p>
            <Link to="/" className="bg-gray-900 text-white text-sm lg:text-base mt-4 mb-2 py-2 px-5 rounded-md">Go To Homepage</Link>

          </div>
        </div>
      </div>
    </>
  )
}

export default OrderCancel