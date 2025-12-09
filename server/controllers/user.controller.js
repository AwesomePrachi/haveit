import sendEmail from "../config/sendEmail.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import imageCloudinary from "../utils/imageCloudinary.js";
import generatedOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";

// register user controller

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        })
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        return res.json({
            message: "User with email already exists",
            error: true,
            success: false
        })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashPassword = await bcryptjs.hash(password, salt)

    const payload = {
        name,
        email,
        password: hashPassword
    }

    const user = new User(payload)
    const save = await user.save()
    
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`
    const verifyEmail = await sendEmail({
        sendTo: email,
        subject: "Verify Your Email Address – Haveit",
        html: verifyEmailTemplate({
            name,
            url: verifyEmailUrl
        })
    })

    return res.status(200).json({
        message: "User registered successfully",
        error: false,
        success: true,
        data: save
    })
})

// verify user email controller

const verifyUserEmail = asyncHandler(async (req, res) => {
    const { code } = req.body
    
    const user = await User.findOne({ _id: code })
    
    if (!user) {
        res.status(400).json({
            message: "Invalid code",
            error: true,
            success: false
        })
    }

    const updateUser = await User.updateOne({ _id: code }, {
        verify_email : true
    })
    
    return res.status(200).json({
        message: "Email verified successfully",
        error: false,
        success: true
    })
})

// login controller

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({ email })
    
    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide email and password",
            error: true,
            success: false
        })
    }
    
    if (!user) {
        return res.status(400).json({
            message: "User does not exist",
            error: true,
            success: false
        })
    }
    
    if (user.status !== "Active") {
        res.status(400).json({
            message: "Contact to admin",
            error: true,
            success: false
        })
    }
    
    const checkPassword = await bcryptjs.compare(password, user.password)

    if (!checkPassword) {
        return res.status(400).json({
            message: "Invalid password",
            error: true,
            success: false
        })
    }
    
    const accessToken = await generatedAccessToken( user._id )
    const refreshToken = await generatedRefreshToken( user._id )

    const updateUser = await User.findById(user?._id, {
        last_login_date: new Date()
    })
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }
    
    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, cookieOptions)
    
    return res.status(200).json({
        message: "Successfully logged in! ",
        error: false,
        success: true,
        data: {
            accessToken,
            refreshToken
        }
    })
})

// logout controller

const logoutUser = asyncHandler(async (req, res) => {
    
    const userId = req.userId   //middleware
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }
    res.clearCookie("accessToken", cookieOptions)
    res.clearCookie("refreshToken", cookieOptions)
    
    const removeRefreshToken = await User.findByIdAndUpdate(userId, {
        refresh_token: ""
    })
    
    return res.status(200).json({
        message: "logged out successfully",
        error: false,
        success: true
    })
})

// upload user avatar controller

const updateUserAvatar = asyncHandler(async (req, res) => {
    const userId = req.userId   // auth middleware  
    const image = req.file
    console.log("image", image)

    const upload = await imageCloudinary(image)

    if (!upload.url) {
        return res.status(400).json({
            message: "Error while uploading on avatar",
            error: true,
            success: false
        })
    }

    const updateUserProfile = await User.findByIdAndUpdate(userId, {
        avatar: upload.url
    })

    return res.status(200).json({
        message: "profile image updated successfully",
        success: true,
        data: {
            _id: userId,
            avatar: upload.url
        }
    })
})

// update user account details controller

const updateAccountDetails = asyncHandler(async (req, res) => {
    const userId = req.userId   // auth middleware
    const { name, email, mobile, password } = req.body

    let hashPassword = ""
    if (password) {
        const salt = await bcryptjs.genSalt(10)
        hashPassword = await bcryptjs.hash(password, salt)
    }
    const updateUser = await User.updateOne({ _id: userId }, {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword })
    })

    return res.status(200).json({
        message: "Account  details updated successfully",
        error: false,
        success: true,
        data: updateUser
    })
})

// forgot password controller when user doesn't login

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    
    if (!user) {
        return res.status(400).json({
            message: "User doesn't exist with email",
            error: true,
            success: false
        })
    }

    const otp = generatedOtp()
    const expireTime  = new Date() + 10 * 60 * 1000      // 10 minutes
    
    const update = await User.findByIdAndUpdate(user._id, {
        forgot_password_otp: otp,
        forgot_password_expiry: new Date(expireTime).toISOString()
    })

    await sendEmail({
        sendTo : email,
        subject : "Your Haveit Password Reset Code",
        html : forgotPasswordTemplate({
            name : user.name,
            otp : otp
        })
    })

    return res.status(200).json({
        message: "OTP sent to the email",
        error: false,
        success: true
    })
})

// verify forgot passord otp controller

const verifyForgotPasswordOtp = asyncHandler(async (req, res) => {
    const { email , otp }  = req.body

    if(!email || !otp){
        return res.status(400).json({
            message : "Email and OTP are required.",
            error : true,
            success : false
        })
    }

    const user = await User.findOne({ email })

    if(!user){
        return res.status(400).json({
            message : "User doesn't exist with email",
            error : true,
            success : false
        })
    }

    const currentTime = new Date().toISOString()

    if(user.forgot_password_expiry < currentTime  ){
        return res.status(400).json({
            message : "OTP is expired",
            error : true,
            success : false
        })
    }

    if(otp !== user.forgot_password_otp){
        return res.status(400).json({
            message : "Invalid OTP",
            error : true,
            success : false
        })
    }

    //if otp is not expired
    //otp === user.forgot_password_otp

    const updateUser = await User.findByIdAndUpdate(user?._id,{
        forgot_password_otp : "",
        forgot_password_expiry : ""
    })
    
    return res.status(200).json({
        message : "OTP verified successfully",
        error : false,
        success : true
    })

})

// reset password controller

const resetPassword = asyncHandler(async (req, res) => {
    const { email , newPassword, confirmPassword } = req.body 

    if(!email || !newPassword || !confirmPassword){
        return res.status(400).json({
            message : "Missing required fields: email, newPassword, and confirmPassword"
        })
    }

    const user = await User.findOne({ email })

    if(!user){
        return response.status(400).json({
            message : "User doesn't exist with email",
            error : true,
            success : false
        })
    }

    if(newPassword !== confirmPassword){
        return res.status(400).json({
            message : "New password and confirm password must match",
            error : true,
            success : false,
        })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashPassword = await bcryptjs.hash(newPassword,salt)

    const update = await User.findOneAndUpdate(user._id,{
        password : hashPassword
    })

    return res.status(200).json({
        message : "Password changed successfully",
        error : false,
        success : true
    })
})

// generated new access token controller

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]
    if(!refreshToken){
        return res.status(401).json({
            message : "Invalid token",
            error  : true,
            success : false
        })
    }
    // console.log("refresh_token", refreshToken)

    const verifyToken = jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)
    const userId = verifyToken?.id

    const user = await User.findById(userId)
    if (!user || user.refresh_token !== refreshToken) {
        return res.status(403).json({
            message: "Invalid or expired refresh token",
            error: true,
            success: false,
        })
    }

    // generate new access token
    const newAccessToken = await generatedAccessToken(userId)

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    }

    res.cookie("accessToken", newAccessToken, cookieOptions)

    return res.status(200).json({
        message: "New access token generated successfully",
        error: false,
        success: true,
        data: { accessToken: newAccessToken },
    })
})

// get login user details controller

const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.userId   // auth middelware

    const user = await User.findById(userId).select('-password -refresh_token')

    return res.status(200).json({
        message: "User details fetched successfully",
        data: user,
        error: false,
        success: true
    })
})

export {
    registerUser,
    loginUser,
    verifyUserEmail,
    logoutUser,
    updateUserAvatar,
    updateAccountDetails,
    forgotPassword,
    verifyForgotPasswordOtp,
    resetPassword,
    refreshAccessToken,
    getCurrentUser
}