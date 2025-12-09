import { Address } from "../models/address.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addAddress = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { address_line, area, landmark, city, state, country, pincode, contact } = req.body

    const create = new Address({
        address_line,
        area,
        landmark,
        city,
        state,
        country,
        pincode,
        contact,
        userId: userId
    })

    const save = await create.save()

    const addAddressId = await User.findByIdAndUpdate(userId,{
        $push: {
            address_details: save._id
        }
    })

    return res.status(200).json({
        message: "Address saved successfully",
        data: save,
        error: false,
        success: true
    })
})

const getAddress = asyncHandler(async (req, res) => {
    const userId = req. userId

    const data = await Address.find({ userId: userId })
    
    return res.status(200).json({
        data: data,
        error: false,
        success: true
    })
})
const updateAddress = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { _id, address_line, area, landmark, city, state, country, pincode, contact } = req.body

    const update = await Address.updateOne({ _id: _id, userId: userId }, {
        address_line,
        area,
        landmark,
        city,
        state,
        country,
        pincode,
        contact
    })

    return res.status(200).json({
        message: "Address updated successfully",
        data: update,
        error: false,
        success: true
    })
})

const deleteAddress = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { _id } = req.body

    const deleted = await Address.findByIdAndDelete(_id)

    return res.status(200).json({
        message: "Address deleted successfully",
        data: deleted,
        error: false,
        success: true
    })
})

export {
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress
}