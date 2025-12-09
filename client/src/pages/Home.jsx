import React from 'react'
import banner from '../assets/banner.jpg'
import mobile_banner from '../assets/mobile_banner.png'
import { useSelector } from 'react-redux'
import { convertToValidUrl } from '../utils/convertToValidUrl'
import { Link, useNavigate } from 'react-router-dom'
import ProductsByCategory from '../components/ProductsByCategory'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const allCategories = useSelector(state => state.product.allCategories)
  const allSubCategories = useSelector(state => state.product.allSubCategories)
  const navigate = useNavigate()

  const handleRedirectProductList =(id, cat)=> {
    const subCategory = allSubCategories.find(sub => {
      const filter = sub.category.some(c => c._id == id)
      return filter
    })
    const url = `/${convertToValidUrl(cat)}-${id}/${convertToValidUrl(subCategory.name)}-${subCategory._id}`
    navigate(url)
  }
  
  return (
    <section>
        
        {/* Banner */}
        <div className='my-6'>
          <img 
            src={banner} 
            alt="banner"
            className='rounded-lg w-full h-auto object-cover hidden lg:block'
          />
          <img 
            src={mobile_banner} 
            alt="banner"
            className='rounded-lg w-full h-auto object-cover lg:hidden'
          />
        </div>

        {/* Categories */}
        <div className='my-4'>
          <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2'>
            {loadingCategory ? (
              new Array(10).fill(null).map((cat, index) => (
                <div
                  key={index + 'loadingCategory'}
                  className='bg-white rounded p-4 min-h-36 grid gap-2 shadow-sm animate-pulse'
                >
                  <div className='bg-blue-50 min-h-24 rounded'></div>
                  <div className='bg-blue-50 min-h-8 rounded'></div>
                </div>
              ))
            ) : (
              allCategories.map((cat) => (
                <div
                  key={cat._id + 'displayCategory'}
                  className='text-center cursor-pointer'
                  onClick={() => handleRedirectProductList(cat._id, cat.name)}
                >
                  <div className='w-full h-full'>
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      className='object-contain'
                    />
                  </div>
                  
                </div>
              ))
            )}
          </div>
        </div>

        {/* Displaying products by category */}
        {
          allCategories.slice(1, 7).map((cat, index) => (
            <ProductsByCategory key={cat?._id+"ProductsByCat"} id={cat._id} name={cat.name}/>
          ))
        }
        
    </section>
  )
}

export default Home