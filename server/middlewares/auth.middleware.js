import jwt from 'jsonwebtoken'

const auth = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req?.headers?.authorization?.split(" ")[1]    // ["Bearer","token"]
        
        // console.log('token',token)

        if (!token) {
            return res.status(401).json({
                message: "Please log in again.",
                error: true,
                success: false
            })
        }

        const decodeToken = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

        // console.log("decode", decodeToken)

        if (!decodeToken) {
            return res.status(401).json({
                message: "Invalid or malformed token",
                error: true,
                success: false
            })
        }

        req.userId = decodeToken._id
        
        next()
    } catch (error) {
        return res.status(500).json({
            message: "Please log in again",
            error: true,
            success: false
        })
    }
}

export default auth