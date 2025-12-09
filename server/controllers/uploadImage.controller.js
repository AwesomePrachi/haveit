import { asyncHandler } from "../utils/asyncHandler.js";
import imageCloudinary from "../utils/imageCloudinary.js";

export const uploadImage = asyncHandler(async (req, res) => {
    const file = req.file
    const uploadImage = await imageCloudinary(file)

    return res.status(200).json({
        message: "Catrgory image uploaded",
        data: uploadImage,
        error: false,
        success: true
    })
})
