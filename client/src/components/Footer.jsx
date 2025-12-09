import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='flex justify-center'>
    <div className='w-full max-w-[1460px] border-t bg-blue-50 border-slate-200'>
      <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
        
        <p>© All Rights Reserved 2025.</p>

        <div className='flex items-center gap-4 justify-center text-2xl'>
          <a href='' className='hover:text-yellowLight'>
              <FaFacebook/>
          </a>
          <a href='' className='hover:text-yellowLight'>
              <FaInstagram/>
          </a>
          <a href='' className='hover:text-yellowLight'>
              <FaLinkedin/>
          </a>
        </div>
        
      </div>
      </div>
    </footer>
  )
}

export default Footer