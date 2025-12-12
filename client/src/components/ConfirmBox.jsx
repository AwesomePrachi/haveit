import React from 'react'
import { IoClose } from "react-icons/io5";

const ConfirmBox = ({cancel, confirm, close}) => {
  return (
    <div className='fixed inset-0 z-50 bg-neutral-600/70 p-4 flex justify-center items-center'>
      <div className='bg-white w-full max-w-md p-4 rounded'>
           <div className='flex justify-between items-center gap-3'>
                <h1 className='font-semibold'>Delete Permanently</h1>
                <button onClick={close}>
                    <IoClose size={25} />
                </button>
           </div>
           <p className='my-4'>Are you sure you want to delete this permanently?</p>
           <div className='w-fit ml-auto flex items-center gap-8'>
                <button onClick={cancel} className='px-6.5 py-1.5 text-black/45  border-2 border-black/20 rounded'>Cancel</button>
                <button onClick={confirm} className='px-6 py-2 text-white bg-green-700 hover:bg-green-600 rounded'>Confirm</button>
           </div>
      </div>
    </div>
  )
}

export default ConfirmBox
