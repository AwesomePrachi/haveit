import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUser } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import axiosToastError from '../utils/axiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../config/SummaryApi';
import toast from 'react-hot-toast';
import fetchUserData from '../utils/fetchUserData';
import { login } from '../store/userSlice';

const Profile = () => {
  const user = useSelector(state => state.user)
    const [isAvatarEditOpen,setIsAvatarEditOpen] = useState(false)
    const [userData,setUserData] = useState({
        name : user.name,
        email : user.email,
        mobile : user.mobile,
    })
    const [isloading,setIsLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        setUserData({
            name : user.name,
            email : user.email,
            mobile : user.mobile,
        })
    },[user])

    const handleOnChange  = (e)=>{
        const { name, value} = e.target 

        setUserData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        
        try {
            setIsLoading(true)
            const response = await Axios({
                ...SummaryApi.update_account,
                data : userData
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                const userData = await fetchUserData()
                dispatch(login(userData.data))
            }

        } catch (error) {
            axiosToastError(error)
        } finally{
            setIsLoading(false)
        }

    }

  return (
    <div className='p-4'>

        {/**profile upload and display image */}
        <div className='w-20 h-20 bg-gray-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
            {
                user.avatar ? (
                    <img 
                      src={user.avatar}
                      alt={user.name}
                      className='w-full h-full'
                    />
                ) : (
                    <FaUser size={65}/>
                )
            }
        </div>
        <button onClick={()=>setIsAvatarEditOpen(true)} className='text-sm min-w-20 border border-yellowLight hover:border-yellowish hover:bg-yellowish px-3 py-1 rounded-full mt-3'>Edit</button>
        
        {
            isAvatarEditOpen && (
                <UserProfileAvatarEdit close={()=>setIsAvatarEditOpen(false)}/>
            )
        }

        {/**name, mobile , email, change password */}
        <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
            <div className='grid'>
                <label>Name</label>
                <input
                    type='text'
                    placeholder='Enter your name' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-yellowish rounded'
                    value={userData.name}
                    name='name'
                    onChange={handleOnChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='email'>Email</label>
                <input
                    type='email'
                    id='email'
                    placeholder='Enter your email' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-yellowish rounded'
                    value={userData.email}
                    name='email'
                    onChange={handleOnChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='mobile'>Mobile</label>
                <input
                    type='text'
                    id='mobile'
                    placeholder='Enter your mobile' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-yellowish rounded'
                    value={userData.mobile}
                    name='mobile'
                    onChange={handleOnChange}
                    required
                />
            </div>

            <button className='border px-4 py-2 mt-4 font-semibold rounded border-yellow-400 bg-gray-100 text-yellow-600 hover:bg-yellow-400 hover:text-gray-900 shadow-sm hover:shadow-md transition'>
                {
                    isloading ? "Loading..." : "Submit"
                }
            </button>
        </form>
    </div>
  )
}

export default Profile