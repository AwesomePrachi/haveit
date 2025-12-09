import { Product } from '../models/product.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const addProduct = asyncHandler(async (req, res) => {
    const { name, image, category, subcategory, unit, stock, price, discount, description, more_details } = req.body

    if (!name || !image[0] || !category[0] || !subcategory[0] || !unit || !price || !description) {
        return res.status(400).json({
            message: "Enter required fields",
            error : true,
            success : false
        })
    }

    const product = new Product({
        name,
        image,
        category,
        subcategory,
        unit,
        stock,
        price,
        discount,
        description,
        more_details
    })

    const saveProduct = await product.save()
    console.log(saveProduct)

    return res.status(200).json({
        message: "Product added",
        data: saveProduct,
        error: false,
        success: true
    })
})

const getProduct = asyncHandler(async (req, res) => {
    let { page, limit, search } = req.body

    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 10
    }

    const query = search ? {
        $text: {
            $search: search
        }
    } : {}
    const skip = ( page-1 ) * limit

    // product
    // total no. of product
    const [ data, totalCount ] = await Promise.all([
        Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subcategory'),
        Product.countDocuments(query)
    ])

    return res.status(200).json({
        message: "Product data",
        data: data,
        totalCount: totalCount,
        totalNumberOfPages: Math.ceil(totalCount/limit),
        error: false,
        success: true
    })
})

const getProductByCategory = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({
            message: "Cannot find product by this category",
            error: true,
            success: false
        })
    }

    const produt = await Product.find({
        category: { $in: id }
    }).limit(20)

    return res.status(200).json({
        message: "Category product list",
        data: produt,
        error: false,
        success: true
    })
})

const listProductsByCategoryAndSubcategory = asyncHandler(async (req, res) => {
    const { categoryId, subcategoryId, page, limit }  = req.body

    if (!categoryId || !subcategoryId) {
        return res.status(400).json({
            message: "Provide categoryId and subcategoryId",
            error: true,
            success: false
        })
    }

    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 10
    }

    const query = {
        category: { $in: categoryId},
        subcategory: { $in: subcategoryId}
    }
    const skip = ( page-1 ) * limit

    const [ data, totalCount ] = await Promise.all([
        Product.find(query).sort({ createdAt: -1}).skip(skip).limit(limit),
        Product.countDocuments(query)
    ])

    return res.status(200).json({
        message: "Product list",
        data: data,
        page: page,
        totalCount: totalCount,
        totalNumberOfPages : Math.ceil(totalCount/limit),
        limit: limit,
        error: false,
        success: true
    })
})

const getProductDetails = asyncHandler(async (req, res) => {
    const { productId } = req.body
    const product = await Product.findOne({ _id: productId })

    return res.status(200).json({
        message: "Product details",
        data : product,
        error: false,
        success: true
    })
})

const updateProduct = asyncHandler(async (req, res) => {
    const { _id } = req.body
    if (!_id) {
        return res.status(400).json({
            message: "Provide product _id",
            error: true,
            success: false
        })
    }

    const update = await Product.updateOne({ _id: _id },{
        ...req.body
    })

    return res.status(200).json({
        message: "Product details updated successfully",
        data: update,
        error: false,
        success: true
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { _id } = req.body

    const deleted = await Product.findByIdAndDelete(_id)

    return res.status(200).json({
        message: "Product deleted successfully",
        data: deleted,
        error: false,
        success: true
    })
})

const searchProduct = asyncHandler(async (req, res) => {
    let { search, page, limit } = req.body
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 10
    }

    const searchText = search ? search.trim() : "";

    // BASIC SUBSTRING MATCH (case-insensitive)
    const query = searchText
        ? { name: { $regex: searchText, $options: "i" } }
        : {};

    const skip = ( page-1 ) * limit

    const [data, totalCount] = await Promise.all([
        Product.find(query).sort({ createdAt: -1}).skip(skip).limit(limit).populate('category subcategory'),
        Product.countDocuments(query)
    ])

    return res.status(200).json({
        message: "Product",
        data: data,
        page: page,
        limit: limit,
        totalCount: totalCount,
        totalNumberOfPages : Math.ceil(totalCount/limit),
        error: false,
        success: true
    })
})



export {
    addProduct,
    getProduct,
    getProductByCategory,
    listProductsByCategoryAndSubcategory,
    getProductDetails,
    updateProduct,
    deleteProduct,
    searchProduct
}