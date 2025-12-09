import React from 'react'
import { IoClose } from 'react-icons/io5'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../config/SummaryApi'
import axiosToastError from '../utils/axiosToastError'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../provider/GlobalContext'


const AddressForm = ({ close }) => {
    const { register, handleSubmit, reset } = useForm()
    const { fetchAddresses } = useGlobalContext()

    const onSubmit = async(data)=> {
        try {
            const response = await Axios({
                ...SummaryApi.create_address,
                data: {
                    address_line: data.address_line,
                    area: data.area,
                    landmark: data.landmark,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    contact: data.contact
                }
            })

            const { data: responseData} = response
            if (responseData.success) {
                toast.success(responseData.message)
            }
            if (close) {
                close()
                reset()
                fetchAddresses()
            }
        } catch (error) {
            axiosToastError(error)
        }
    }


  return (
    <section className='fixed inset-0 z-50 bg-black/70 h-screen overflow-auto'>
        <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded-md'>
            <div className='flex justify-between items-center gap-4'>
                <h2 className='font-bold'>Enter complete address</h2>
                <button onClick={close} className='hover:text-red-500'>
                    <IoClose  size={25}/>
                </button>
            </div>
            <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-1'>
                    <label htmlFor='addressline' className='font-semibold'>Flat / House no/ Building name *</label>
                    <input
                        type='text'
                        id='addressline' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("address_line",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='area' className='font-semibold'>Area / Sector / Locality *</label>
                    <input
                        type='text'
                        id='area' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("area",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='landmark' className='font-semibold'>Nearby landmark (optional)</label>
                    <input
                        type='text'
                        id='landmark' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("landmark")}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='city' className='font-semibold'>City *</label>
                    <input
                        type='text'
                        id='city' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("city",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='state' className='font-semibold'>State *</label>
                    <input
                        type='text'
                        id='state' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("state",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='pincode' className='font-semibold'>Pincode *</label>
                    <input
                        type='text'
                        id='pincode' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("pincode",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='country' className='font-semibold'>Country *</label>
                    <input
                        type='text'
                        id='country' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("country",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='contact' className='font-semibold'>Your pone number *</label>
                    <input
                        type='text'
                        id='contact' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("contact",{required : true})}
                    />
                </div>

                <button type='submit' className='bg-yellowish rounded-full w-full py-2 font-semibold mt-4 hover:bg-yellowLight'>Submit</button>
            </form>
        </div>
    </section>
  )
}

export default AddressForm