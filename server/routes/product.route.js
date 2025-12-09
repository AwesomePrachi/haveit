import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { addProduct, deleteProduct, getProduct, getProductByCategory, getProductDetails, listProductsByCategoryAndSubcategory, searchProduct, updateProduct } from "../controllers/product.controller.js";
import { admin } from "../middlewares/admin.middleware.js";

const productRouter = Router()

productRouter.post("/add-product", auth, admin, addProduct)
productRouter.post("/get-product", getProduct)
productRouter.post("/get-product-by-category", getProductByCategory)
productRouter.post("/list-products-by-category-subcategory", listProductsByCategoryAndSubcategory)
productRouter.post("/get-product-details", getProductDetails)
productRouter.put("/update-product-details", auth, admin, updateProduct)
productRouter.delete("/delete-product", auth, admin, deleteProduct)
productRouter.post("/search-product", searchProduct)
    
export default productRouter