import React, { useEffect, useState } from "react"

const useMobile = (breakpoint = 768)=>{
    const [isMobile,setIsMobile] = useState(window.innerWidth < breakpoint)

    const handleWindowResize = ()=>{
        const checkpoint = window.innerWidth < breakpoint
        setIsMobile(checkpoint)
    }

    useEffect(()=>{
        handleWindowResize()

        window.addEventListener('resize', handleWindowResize)

        return ()=>{
            window.removeEventListener('resize', handleWindowResize)
        }
    },[])

    return [ isMobile ]
}

export default useMobile