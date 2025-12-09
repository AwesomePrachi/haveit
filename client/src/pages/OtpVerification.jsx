import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../config/SummaryApi';
import axiosToastError from '../utils/axiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineMarkEmailUnread } from "react-icons/md";

const OtpVerification = () => {
    const [data, setData] = useState(["","","","","",""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()
    // console.log(location)

    useEffect(()=>{
        if(!location?.state?.email){
            navigate("/forgot-password")
        }
    },[])

    const filledData = data.every(each => each)

    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.verify_otp,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData(["","","","","",""])
                navigate("/reset-password",{
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                })
            }

        } catch (error) {
            axiosToastError(error)
        }
    }
    
    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <p className='font-bold text-lg'>OTP Verification</p>

                    <p  className='m-5 text-left'>
                        To reset the password, please enter your otp that has been to your email address.
                    </p>

                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='email'>Enter Your OTP :</label>
                        <div className='flex items-center gap-2 justify-between mt-3'>
                            {
                                data.map((element, index) => {
                                    return(
                                        <input
                                            key={"otp"+index}
                                            type='text'
                                            id='otp'
                                            ref={(ref)=>{
                                                inputRef.current[index] = ref
                                                return ref 
                                            }}
                                            value={data[index]}
                                            onChange={(e)=>{
                                                const value =  e.target.value
                                                console.log("value",value)

                                                const newData = [...data]
                                                newData[index] = value
                                                setData(newData)

                                                if (value && index < 5) {
                                                    inputRef.current[index + 1].focus()
                                                }
                                            }}
                                            maxLength={1}
                                            className='bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold'
                                        />
                                    )
                                })
                            }
                        </div>
                        
                    </div>
                    
                    <button disabled={!filledData} 
                    className={` ${filledData ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} 
                    text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                        Verify OTP
                    </button>

                </form>

                <p>
                    <Link to={"/forgot-password"} className='font-semibold flex flex-wrap items-center gap-1 hover:underline hover:text-yellowish'>
                        <MdOutlineMarkEmailUnread />Resend OTP
                    </Link>
                </p>
            </div>
        </section>
    )
}

export default OtpVerification