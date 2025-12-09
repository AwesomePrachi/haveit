import React from 'react'
import { FaRegCircleCheck } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';

const Success = () => {
  const location = useLocation()
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full lg:min-h-[80vh] bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg border border-gray-400 shadow-lg">
          <div className="flex flex-col items-center gap-1">

            <FaRegCircleCheck className="text-green-500 h-16 w-16 mb-1" />
            <h1 className="lg:text-2xl text-lg font-bold text-gray-900 mt-4">{location?.state?.message ? location?.state?.message : "Payment Successful"}</h1>
            <p className="text-gray-500 text-sm lg:text-base text-center mt-2">
              Thank you for your {location?.state?.message ? "Purchasing" : "Payment"}. Your order is being processed.
            </p>
            <Link to="/" className="bg-gray-900 text-white text-sm lg:text-base mt-4 mb-2 py-2 px-5 rounded-md">Go To Homepage</Link>

          </div>
        </div>
      </div>
    </>
  )
}

export default Success