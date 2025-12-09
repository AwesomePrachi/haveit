import React, { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../config/SummaryApi'
import axiosToastError from '../utils/axiosToastError'
import { updatedAvatar } from '../store/userSlice'
import { IoClose } from "react-icons/io5";

const UserProfileAvatarEdit = ({close}) => {
    const user = useSelector(state => state.user)
    const [isloading, setIsLoading] = useState(false)
    const dispatch = useDispatch()

    const handleSubmit = (e)=> {
        e.preventDefault()
    }

    const handleUploadAvatarImage = async(e)=> {
        const file = e.target.files[0]

        if (!file) {
            return
        }
        
        const formData = new FormData()
        formData.append('avatar',file)
        
        try {
            setIsLoading(true)
            const response = await Axios({
            ...SummaryApi.upload_avatar,
            data: formData
        })
        const { data: responseData} = response
        // console.log(response)

        dispatch(updatedAvatar(responseData.data))
        } catch (error) {
            axiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <section className='fixed inset-0 bg-neutral-600/60 p-4 flex items-center justify-center'>
        <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center'>
            <button onClick={close} className='text-neutral-800 w-fit block ml-auto'>
                <IoClose size={20}/>
            </button>
            <div className='w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
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
            <form onSubmit={handleSubmit}>
                <label htmlFor='uploadProfile'>
                    <div className='border border-yellowish cursor-pointer hover:bg-yellowish px-4 py-1 rounded text-sm my-3'>
                        {
                            isloading ? "Loading..." : "Upload"
                        }
                    </div>
                    <input onChange={handleUploadAvatarImage} type='file' id='uploadProfile' className='hidden'/>
                </label>
            </form>
        </div>
    </section>
  )
}

export default UserProfileAvatarEdit