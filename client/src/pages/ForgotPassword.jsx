import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../config/SummaryApi';
import axiosToastError from '../utils/axiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import { IoChevronBackSharp } from "react-icons/io5";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: ""
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const filledData = Object.values(data).every(each => each)


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        setData({
          email: data
        })
        navigate("/otp-verification", {
          state: data
        })
      }

    } catch (error) {
      axiosToastError(error)
    }
  }

  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
        <p className='font-bold text-lg'>Forgot your Password?</p>

        <p className='m-5 text-left'>
          Please enter your email address and we will email you a otp to reset your password.
        </p>

        <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor='email'>Email :</label>
            <input
              type='email'
              id='email'
              placeholder='Enter your email'
              className='bg-blue-50 p-2 border rounded outline-none focus:border-yellowish'
              name='email'
              value={data.email}
              onChange={handleChange}
            />
          </div>

          <button disabled={!filledData}
            className={` ${filledData ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} 
                    text-white py-2 rounded font-semibold my-3 tracking-wide`}>
            Reset Password
          </button>

        </form>

        <p>
          <Link to={"/login"} className='font-semibold  flex flex-wrap items-center hover:underline hover:text-yellowish'>
            <IoChevronBackSharp />Back to login page
          </Link>
        </p>
      </div>
    </section>
  )
}

export default ForgotPassword