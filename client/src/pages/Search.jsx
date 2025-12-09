import React, { useEffect, useState } from 'react'
import LoadingCard from '../components/LoadingCard'
import axiosToastError from '../utils/axiosToastError'
import SummaryApi from '../config/SummaryApi'
import ProductCard from '../components/ProductCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'

const Search = () => {
  const [data, setData] = useState([])
  const [isloading, setIsLoading] = useState(false)
  const loadingCardNumber = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const params = useLocation()
  const searchText = params.search.slice(3)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await Axios({
        ...SummaryApi.search_product,
        data: {
          search: searchText,
          page: page
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data)
        } else {
          setData((prev) => {
            return [
              ...prev,
              ...(responseData.data || []) 
            ]
          })
        }
        setTotalPages(responseData.totalNumberOfPages)
      }
    } catch (error) {
      axiosToastError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFetchMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, searchText])

  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4'>
        <p className='font-semibold'>Search Results: {data.length}  </p>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={true}
          next={handleFetchMore}
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4'>
            {
              data.map((p, index) => {
                return (
                  <ProductCard data={p} key={p?._id + "searchProduct" + index} />
                )
              })
            }

            {/***loading data */}
            {
              isloading && (
                loadingCardNumber.map((_, index) => {
                  return (
                    <LoadingCard key={"loadingsearch" + index} />
                  )
                })
              )
            }
          </div>
        </InfiniteScroll>

        {
          //no data 
          !data[0] && !isloading && (
            <NoData />
          )
        }
      </div>
    </section>
  )
}

export default Search