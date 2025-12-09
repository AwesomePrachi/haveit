import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import axiosToastError from '../utils/axiosToastError';
import SummaryApi from '../config/SummaryApi';

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    })
    // console.log(location)
    const [showPassword, setShowPassword] = useState()
    const [showConfirmPassword, setShowConfirmPassword] = useState()

    const filledData = Object.values(data).every(each => each)

    useEffect(()=>{
        if (!(location?.state?.data?.success)) {
            navigate("/")
        }        
    },[])

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    console.log("reset password data", data)



    const handleSubmit = async(e)=>{
        e.preventDefault()

        // optional 
        if(data.newPassword !== data.confirmPassword){
            toast.error("New password and confirm new password must match.")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.reset_password,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                navigate("/login")
                setData({
                    email : "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }

        } catch (error) {
            axiosToastError(error)
        }
    }
    
  return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <p className='font-bold text-lg'>Password</p>
                
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='newPassword'>New password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center 
                        focus-within:border-yellowish'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                placeholder='Enter your new password'
                                className='w-full outline-none'
                                name='newPassword'
                                value={data.newPassword}
                                onChange={handleChange}
                            />
                            <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer'>
                                {
                                    showPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                        <Link to={"/forgot-password"} className='block ml-auto hover:text-yellowish'>Forgot Password ? </Link>
                    </div>
                    
                    <div className='grid gap-1'>
                                            <label htmlFor='confirmPassword'>Confirm new password :</label>
                                            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-yellowish'>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    id='confirmPassword'
                                                    placeholder='Enter your confirm new password'
                                                    className='w-full outline-none'
                                                    name='confirmPassword'
                                                    value={data.confirmPassword}
                                                    onChange={handleChange}
                                                />
                                                <div onClick={() => setShowConfirmPassword(prev => !prev)} className='cursor-pointer'>
                                                    {
                                                        showConfirmPassword ? (
                                                            <FaRegEye />
                                                        ) : (
                                                            <FaRegEyeSlash />
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>

                    <button disabled={!filledData} 
                    className={` ${filledData ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} 
                    text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                        Change password
                    </button>

                </form>
            </div>
        </section>
    )
}

export default ResetPassword