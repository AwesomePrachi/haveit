import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { cashOnDeliveryPayment, getUserOrders, onlinePayment, webhookStripe } from "../controllers/order.controller.js";

const orderRouter = Router()
orderRouter.post('/cash-on-delivery-payment', auth, cashOnDeliveryPayment)
orderRouter.post('/online-payment', auth, onlinePayment)
orderRouter.post('/webhook', webhookStripe)
orderRouter.get('/order-list', auth, getUserOrders)

export default orderRouter