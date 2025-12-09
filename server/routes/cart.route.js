import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { addToCart, getCartItems, removeFromCart, updateCartItemQty } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.post("/add-to-cart", auth, addToCart)
cartRouter.get("/get-cart-items", auth, getCartItems)
cartRouter.put("/update-cart-qty", auth, updateCartItemQty)
cartRouter.delete("/remove-from-cart", auth, removeFromCart)

export default cartRouter