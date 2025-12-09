import { CartProduct } from "../models/cartProduct.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { productId } = req.body

    if (!productId) {
        return res.status(401).json({
            message: "Provide productId",
            error : true,
            success : false
        })
    }

    const checkItemCart = await CartProduct.findOne({
        userId : userId,
        productId : productId
    })

    if(checkItemCart){
        return res.status(400).json({
            message : "Item already in cart"
        })
    }

    const cartItem = new CartProduct({
        quantity: 1,
        userId: userId,
        productId: productId
    })

    const save = await cartItem.save()

    const update = await User.updateOne({ _id: userId},{
        $push: {
            shopping_cart: productId
        }
    })

    return res.status(200).json({
        message: "Item added to cart",
        data: save,
        error: false,
        success: true
    })
})

const getCartItems = asyncHandler(async (req, res) => {
    const userId = req.userId

    const cartItems = await CartProduct.find({
        userId: userId
    }).populate('productId')

    return res.status(200).json({
        data: cartItems,
        error: false,
        success: true
    })
})

const updateCartItemQty = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { _id, quantity } = req.body

    if (!_id || !quantity) {
        return res.status(401).json({
            message: "Provide product's _id and quantity",
            error : true,
            success : false
        })
    }

    const updateCart = await CartProduct.updateOne({
        _id: _id,
        userId: userId
    },{
         $set: { quantity: quantity }
    })

    return res.status(200).json({
        data: updateCart,
        error: false,
        success: true
    })
})

const removeFromCart = asyncHandler(async (req, res) => {
    const userId = req.userId

    const { _id } = req.body
    if (!_id) {
        return res.status(401).json({
            message: "Provide product's _id",
            error : true,
            success : false
        })
    }

    const removeItem = await CartProduct.deleteOne({_id: _id, userId: userId})

    return res.status(200).json({
        message: "Item removed from cart",
        data: removeItem,
        error: false,
        success: true
    })
})

export {
    addToCart,
    getCartItems,
    updateCartItemQty,
    removeFromCart
}