import React from 'react'
import { useSelector } from 'react-redux'
import { useGlobalContext } from '../provider/GlobalContext'
import { PiShoppingCart, PiShoppingCartBold } from "react-icons/pi";
import { formatRupee } from '../utils/formatRupee';
import { FaCaretRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CartMobileBar = () => {
    const cartItems = useSelector(state => state.cart.cartItems)
    const { totalQty, totalPrice } = useGlobalContext()

    return (
        <>
            {
                cartItems[0] && (
                    <div className='sticky bottom-4 p-2'>
                        <div className='bg-green-700 px-2 py-2 rounded-lg text-neutral-100 text-sm  flex items-center justify-between gap-3 lg:hidden'>
                            <div className='flex items-center gap-2'>
                                <div className='p-2 bg-white/30 rounded-lg w-fit'>
                                    <PiShoppingCartBold size={20} />
                                </div>
                                <div className='text-xs'>
                                    <p>{totalQty} items</p>
                                    <p>{formatRupee(totalPrice)}</p>
                                </div>
                            </div>

                            <Link to={"/cart"} className='flex items-center gap-1'>
                                <span className='text-lg'>View Cart</span>
                                <FaCaretRight />
                            </Link>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default CartMobileBar