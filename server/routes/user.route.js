import { Router } from "express";
import { forgotPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, resetPassword, updateAccountDetails, updateUserAvatar, verifyForgotPasswordOtp, verifyUserEmail } from "../controllers/user.controller.js";
import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router()

router.post('/register', registerUser)
router.post('/verify-email', verifyUserEmail)
router.post('/login', loginUser)
router.get('/logout', auth, logoutUser)
router.put('/upload-avatar', auth,upload.single('avatar'), updateUserAvatar)
router.put('/update-account', auth, updateAccountDetails)
router.put('/forgot-password', forgotPassword)
router.put('/verify-forgot-password-otp', verifyForgotPasswordOtp)
router.put('/reset-password', resetPassword)
router.post('/refresh-token', refreshAccessToken)
router.get('/current-user', auth, getCurrentUser)

export default router