import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/subCategory.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addCategory = asyncHandler(async (req, res) => {
    const { name, image } = req.body

    if (!name || !image) {
        return res.status(400).json({
            message: "Enter required fields",
            error : true,
            success : false
        })
    }

    const category = new Category({
        name,
        image
    })

    const saveCategory = await category.save()
    
    return res.status(200).json({
        message: "Category added",
        data: saveCategory,
        error: false,
        success: true
    })
})

const getCategory = asyncHandler( async (req, res) => {
    const data = await Category.find().sort({ createdAt: -1 })

    return res.status(200).json({
        data: data,
        error: false,
        success: true
    })
})

const updateCategory = asyncHandler( async (req, res) => {
    const { _id, name, image } = req.body 

    const update = await Category.updateOne({
        _id: _id,
    },{
        name,
        image
    })

    return res.status(200).json({
        message: "Category updated",
        data: update,
        error: false,
        success: true
    })
})

const deleteCategory = asyncHandler( async (req, res) => {
    const { _id } = req.body

    const checkSubCategory = await SubCategory.find({
        category: {
            "$in": [ _id ]
        }
    }).countDocuments()

    const checkProduct = await Product.find({
        category: {
            "$in": [ _id ]
        }
    }).countDocuments()

    if (checkSubCategory > 0 || checkProduct > 0) {
        return res.status(400).json({
            message: "Category is already in use that's why it can't be deleted",
            error: true,
            success: false
        })
    }

    const deleted = await Category.deleteOne({ _id: _id })
    return res.status(200).json({
        message: "Category deleted",
        data: deleted,
        error: false,
        success: true
    })
})

export {
    addCategory,
    getCategory,
    updateCategory,
    deleteCategory
}