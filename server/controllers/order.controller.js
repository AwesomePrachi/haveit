import Stripe from "../config/stripe.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { CartProduct } from "../models/cartProduct.model.js";


const calculateDiscountedPrice = (price, discount = 1) => {
    const discountAmout = Math.ceil((Number(price) * Number(discount)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

const cashOnDeliveryPayment = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { item_list, addressId, subTotalAmount, totalAmount } = req.body

    const payload = item_list.map((el) => {
        return ({
            userId: userId,
            orderId: `OD${new mongoose.Types.ObjectId()}`,
            productId: el.productId._id,
            product_details: {
                name: el.productId.name,
                image: el.productId.image
            },
            paymentId: "",
            payment_status: "cash On Delivery",
            delivery_address: addressId,
            subTotalAmount: subTotalAmount,
            totalAmount: totalAmount
        })
    })

    const generatedOrder = await Order.insertMany(payload)

    // remove cart items
    const removeCartItems = await CartProduct.deleteMany({ userId: userId })

    // update the user's shopping cart
    const updateUserCart = await User.updateOne({ _id: userId }, { shopping_cart: [] })

    return res.status(200).json({
        message: "Order successfully placed",
        data: generatedOrder,
        error: false,
        success: true
    })
})

const onlinePayment = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { item_list, addressId, subTotalAmount, totalAmount } = req.body
    const user = await User.findById(userId)

    const line_items = item_list.map(item => {
        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.productId.name,
                    images: item.productId.image,
                    metadata: {
                        productId: item.productId._id
                    }
                },
                unit_amount: Math.round((calculateDiscountedPrice(item.productId.price, item.productId.discount)) * 100)
            },
            adjustable_quantity: {
                enabled: true,
                minimum: 1
            },
            quantity: item.quantity
        }
    })

    const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: user.email,
        metadata: {
            userId: userId,
            // name: user.name,
            addressId: addressId
        },
        line_items: line_items,
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel-order`
    }

    const session = await Stripe.checkout.sessions.create(params)

    // console.log(session)
    return res.status(200).json(session)    
})

const getOrderItems = async ({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
}) => {

    const productList = []

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await Stripe.products.retrieve(item.price.product)

            const payload = {
                userId: userId,
                orderId: `OD${new mongoose.Types.ObjectId()}`,
                productId: product.metadata.productId,  
                product_details: {
                    name: product.name,
                    image: product.images           
                },
                paymentId: paymentId,
                payment_status: payment_status,
                delivery_address: addressId,
                subTotalAmount: (item.amount_subtotal) / 100,
                totalAmount: (item.amount_total) / 100,
            }

            productList.push(payload)
        }
    }

    return productList
}

// stripe listen --forward-to localhost:8000/api/order/webhook
const webhookStripe = async (req, res) => {
    try {
        const event = req.body
        const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
                const userId = session.metadata.userId

                const orderProducts = await getOrderItems({
                    lineItems: lineItems,
                    userId: userId,
                    addressId: session.metadata.addressId,
                    paymentId: session.payment_intent,
                    payment_status: session.payment_status,
                })

                const order = await Order.insertMany(orderProducts)

                if (order && order.length) {
                    await Promise.all([
                        User.findByIdAndUpdate(userId, { shopping_cart: [] }),
                        CartProduct.deleteMany({ userId: userId })
                    ])
                }
                break
            }

            default:
                console.log(`Unhandled event type ${event.type}`)
        }

        res.json({ received: true })
    } catch (err) {
        res.error
    }
}

const getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.userId

    const order = await Order.find({ userId: userId }).populate('delivery_address')

    return res.status(200).json({
        data: order,
        error: false,
        success: true
    })
})

export {
    cashOnDeliveryPayment,
    onlinePayment,
    webhookStripe,
    getUserOrders
}