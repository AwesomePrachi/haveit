import { Router } from 'express'
import auth from '../middlewares/auth.middleware.js'
import { addSubCategory, deleteSubCategory, getSubCategory, updateSubCategory } from '../controllers/subCategory.controller.js'

const subCategoryRouter = Router()

subCategoryRouter.post("/add-sub-category", auth, addSubCategory)
subCategoryRouter.post("/get-sub-category", getSubCategory)
subCategoryRouter.put("/update-sub-category", auth, updateSubCategory)
subCategoryRouter.delete("/delete-sub-category", auth, deleteSubCategory)

export default subCategoryRouter