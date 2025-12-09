import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { uploadImage } from "../controllers/uploadImage.controller.js";
import upload from "../middlewares/multer.middleware.js";

const uploadRouter = Router()

uploadRouter.post('/upload', auth, upload.single("image"),uploadImage)

export default uploadRouter