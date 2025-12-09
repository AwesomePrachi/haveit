import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { addCategory, deleteCategory, getCategory, updateCategory } from "../controllers/category.controller.js";

const categoryRouter = Router()

categoryRouter.post("/add-category", auth, addCategory)
categoryRouter.get("/get-category", getCategory)
categoryRouter.put("/update-category", auth, updateCategory)
categoryRouter.delete("/delete-category", auth, deleteCategory)

export default categoryRouter