import React, { useState } from 'react'
import haveit_logo from '../assets/haveit_logo.png'
import haveit_logo_another from '../assets/haveit_logo_another.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { PiShoppingCartBold } from "react-icons/pi";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { formatRupee } from '../utils/formatRupee';
import { useGlobalContext } from '../provider/GlobalContext';
import CartItem from './CartItem';

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const params = useLocation()
    const searchText = params.search.slice(3)
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)

    const cartItems = useSelector(state => state.cart.cartItems)
    const { totalQty, totalPrice } = useGlobalContext()

    const [openCartSection, setOpenCartSection] = useState(false)

    //  console.log("user from store", user)

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleMobileUser = () => {
        if (!user?._id) {
            navigate("/login")
            return
        }
        navigate("/user")
    }

    // total cart items & their total price

    // const [totalPrice, setTotalPrice] = useState(0)
    // const [totalQty, setTotalQty] = useState(0)

    // useEffect(()=>{
    //     const quantity = cartItems.reduce((prev, curr)=>{
    //         return prev + curr.quantity
    //     },0)
    //     setTotalQty(quantity)

    //     const price = cartItems.reduce((prev, curr)=>{
    //         return prev + (curr.productId.price * curr.quantity)
    //     },0)
    //     setTotalPrice(price)
    // },[cartItems])

    return (
        <header>
            <div className='w-full max-w-[1480px] h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white'>
                {
                    !(isSearchPage && isMobile) && (
                        <div className='container mx-auto flex items-center px-2 justify-between'>
                            {/* logo */}
                            <div className='h-full'>
                                <Link to={"/"} className='h-full flex justify-center items-center'>
                                    <img
                                        src={haveit_logo}
                                        width={170}
                                        height={60}
                                        alt='logo'
                                        className='hidden ml-2 lg:block'
                                    />
                                    <img
                                        src={haveit_logo_another}
                                        width={120}
                                        height={60}
                                        alt='logo'
                                        className='lg:hidden'
                                    />
                                </Link>
                            </div>

                            {/**SearchBar */}
                            <div className='hidden lg:block'>
                                <SearchBar />
                            </div>


                            {/**login and my cart */}
                            <div className=''>
                                {/**user icons display in only mobile version**/}
                                <button className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>
                                    <FaRegCircleUser size={26} />
                                </button>

                                {/**Desktop**/}
                                <div className='hidden lg:flex  items-center gap-10'>
                                    {
                                        user?._id ? (
                                            <div className='relative'>
                                                <div onClick={() => setOpenUserMenu(prev => !prev)} className='flex select-none items-center gap-1 cursor-pointer'>
                                                    <p>Account</p>
                                                    {
                                                        openUserMenu ? (
                                                            <GoTriangleUp size={25} />
                                                        ) : (
                                                            <GoTriangleDown size={25} />
                                                        )
                                                    }

                                                </div>
                                                {
                                                    openUserMenu && (
                                                        <div className='absolute right-0 top-12'>
                                                            <div className='bg-white rounded p-4 min-w-52 lg:shadow-lg'>
                                                                <UserMenu close={handleCloseUserMenu} />
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                            </div>
                                        ) : (
                                            <button onClick={redirectToLoginPage} className='text-lg px-2'>Login</button>
                                        )
                                    }

                                    <button onClick={() => setOpenCartSection(true)} className='flex items-center text-sm gap-2 bg-green-700 px-3 py-2 mt-2 rounded-lg text-white'>
                                        {/**add to card icons */}
                                        <div className='hover:animate-bounce'>
                                            <PiShoppingCartBold size={25} />
                                        </div>
                                        <div className='font-bold text-sm'>
                                            {
                                                cartItems[0] ? (
                                                    <div>
                                                        <p className='mb-[-3px]'>{totalQty} items</p>
                                                        <p>{formatRupee(totalPrice)}</p>
                                                    </div>
                                                ) : (
                                                    <p>My Cart</p>
                                                )
                                            }
                                        </div>
                                    </button>

                                </div>
                            </div>
                        </div>
                    )
                }

                <div className='container mx-auto px-2 lg:hidden'>
                    <SearchBar />
                </div>

                {
            openCartSection && (
                <CartItem close={()=>setOpenCartSection(false)}/>
            )
        }
            </div>
        </header>
    )
}

export default Header