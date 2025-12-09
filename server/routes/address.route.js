import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { addAddress, deleteAddress, getAddress, updateAddress } from "../controllers/address.controller.js";

const addressRouter = Router()

addressRouter.post('/create-address', auth, addAddress)
addressRouter.get('/get-address', auth, getAddress)
addressRouter.put('/update-address', auth, updateAddress)
addressRouter.delete('/delete-address', auth, deleteAddress)

export default addressRouter