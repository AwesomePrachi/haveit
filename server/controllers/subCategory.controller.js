import { SubCategory } from "../models/subCategory.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addSubCategory = asyncHandler(async (req, res) => {
    const { name, image, category }= req.body

    if (!name?.trim() || !image?.trim() || !category || category.length === 0) {
        return res.status(400).json({
            message: "Enter required fields",
            error : true,
            success : false
        })
    }

    const subCategory = new SubCategory({
        name,
        image,
        category
    })

    const saveSubCategory = await subCategory.save()
    
    return res.status(200).json({
        message: "Sub Category added",
        data: saveSubCategory,
        error: false,
        success: true
    })
})

const getSubCategory = asyncHandler(async (req, res) => {
    const data = await SubCategory.find().populate('category')
    
    return res.status(200).json({
        data: data,
        error: false,
        success: true
    })
})

const updateSubCategory = asyncHandler(async (req, res) => {
    const { _id, name, image, category } = req.body
    const checkSubCategory = await SubCategory.findById(_id)

    if (!checkSubCategory) {
        return res.status(400).json({
            message: "Invalid sub category _id",
            error: true,
            success: false
        })
    }

    const update = await SubCategory.findByIdAndUpdate(_id, {
        name,
        image,
        category
    })

    return res.status(200).json({
        message: "Sub Category updated",
        data: update,
        error: false,
        success: true
    })
})

const deleteSubCategory = asyncHandler(async (req, res) => {
    const { _id } = req.body

    const deleted = await SubCategory.findByIdAndDelete(_id)

    return res.status(200).json({
        message: "Sub Category deleted",
        data: deleted,
        error: false,
        success: true
    })
})

export {
    addSubCategory,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory
}