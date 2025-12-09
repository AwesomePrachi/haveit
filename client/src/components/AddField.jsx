import React from 'react'
import { IoClose } from 'react-icons/io5'

const AddField = ({close, value, onChange, submit}) => {
  return (
    <section className='fixed inset-0 bg-neutral-600/70 z-50 flex justify-center items-center p-4'>
        <div className='bg-white rounded p-4 w-full max-w-md'>
            <div className='flex items-center justify-between gap-3'>
                <h1 className='font-semibold'>Add new field</h1>
                <button onClick={close}>
                    <IoClose size={25}/>
                </button>
            </div>
            <input
                 className='bg-blue-50 my-3 p-2 border outline-none focus-within:border-yellowLight rounded w-full '
                 placeholder='Enter field name'
                 value={value}
                 onChange={onChange}
            />
            <button
                onClick={submit}
                className='bg-yellowLight hover:bg-yellowish px-5 py-2 m-2 rounded mx-auto w-fit block'
            >Add Field</button>
        </div>
   </section>
  )
}

export default AddField