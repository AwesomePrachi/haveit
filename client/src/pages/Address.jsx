import React, { useState } from 'react'
import { HiDotsVertical } from "react-icons/hi";
import AddressForm from '../components/AddressForm'
import { useSelector } from 'react-redux';
import { FaHome } from "react-icons/fa";
import EditAddressForm from '../components/EditAddressForm';
import Axios from '../utils/Axios';
import SummaryApi from '../config/SummaryApi';
import axiosToastError from '../utils/axiosToastError';
import ConfirmBox from '../components/ConfirmBox';
import { useGlobalContext } from '../provider/GlobalContext';
import toast from 'react-hot-toast';

const Address = () => {
   const savedAddress = useSelector(state => state.address.savedAddress)
   // console.log(savedAddress)
   const [openAddressForm, setOpenAddressForm] = useState(false)

   const [openOptionId, setOpenOptionId] = useState(null)
   const [isEditOpen, setIsEditOpen] = useState(false)
   const [editingAddress, setEditingAddress] = useState()

   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
   const [deletingAddressId, setDeletingAddressId] = useState(null)

   const { fetchAddresses } = useGlobalContext()

   const handleDeleteAddress = async () => {
      try {
         const response = await Axios({
            ...SummaryApi.delete_address,
            data: {
               _id: deletingAddressId
            }
         })

         const { data: responseData } = response

         if (responseData.success) {
            toast.success(responseData.message)
            fetchAddresses()
            setIsDeleteConfirmOpen(false)
         }
      } catch (error) {
         axiosToastError(error)
      }
   }

   return (
      <div onClick={() => setOpenOptionId(null)}>
         <div className='bg-white px-2 py-2 flex flex-col gap-2'>
            <h2 className='font-bold text-xl font-sans'>My addresses</h2>
            <div onClick={(e) => {
               e.stopPropagation();
               setOpenAddressForm(true);
            }}
               className='p-1 font-semibold text-green-700 cursor-pointer'
            >
               + Add new address
            </div>
         </div>
         <div className='bg-white flex flex-col gap-5 mt-4'>
            {
               savedAddress.map((address, index) => {
                  if (!address.status) return null;
                  return (
                     <div
                        key={address._id ?? index}
                        className="border border-gray-400 rounded p-2 flex gap-3 bg-white"
                        onClick={(e) => e.stopPropagation()}
                     >
                        <FaHome size={17} className='mt-1' />

                        <div className='w-full'>
                           <p>{address.address_line}, {address.area}, {address?.landmark}</p>
                           <p>{address.city}, {address.state}</p>
                           <p className='text-gray-500'>{address.country} - {address.pincode}</p>
                        </div>

                        <div className='flex items-start relative'>
                           <button
                              onClick={(e) => {
                                 e.stopPropagation();
                                 setOpenOptionId(prev => prev === address._id ? null : address._id);
                              }}
                              className='text-green-700'
                           >
                              <HiDotsVertical />
                           </button>

                           {/* dropdown for this card only */}
                           {openOptionId === address._id && (
                              <div className="absolute right-6 top-1 bg-white ">
                                 <p
                                    onClick={() => {
                                       setIsEditOpen(true)
                                       setEditingAddress(address)
                                       setOpenOptionId(null)
                                    }}
                                    className="text-xs border-r border-b border-gray-300 shadow-md text-green-700 hover:underline px-4 py-1 cursor-pointer"
                                 >
                                    Edit
                                 </p>
                                 <p
                                    onClick={()=> { 
                                       setIsDeleteConfirmOpen(true)
                                       setDeletingAddressId(address._id)
                                       setOpenOptionId(null)
                                    }}
                                    className="text-xs border-r border-b border-gray-300 shadow-md text-green-700 hover:underline px-4 py-1 cursor-pointer"
                                 >
                                    Delete
                                 </p>
                              </div>
                           )
                           }
                        </div>

                     </div>
                  )
               })
            }

         </div>


         {
            openAddressForm && (
               <AddressForm close={() => setOpenAddressForm(false)} />
            )
         }

         {
            isEditOpen && (
               <EditAddressForm data={editingAddress} close={() => setIsEditOpen(false)} />
            )
         }

         {
            isDeleteConfirmOpen && (
               <ConfirmBox close={() => setIsDeleteConfirmOpen(false)} cancel={() => setIsDeleteConfirmOpen(false)} confirm={handleDeleteAddress} />
            )
         }

      </div>
   )
}

export default Address