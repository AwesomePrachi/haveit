import express from "express";
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from 'helmet'
import connectDB from "./config/connectDB.js";
import router from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";
import uploadRouter from "./routes/upload.route.js";
import subCategoryRouter from "./routes/subCategory.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import addressRouter from "./routes/address.route.js";
import orderRouter from "./routes/order.route.js";

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))

app.use(express.json())     // <--- this one parses JSON body
app.use(express.urlencoded({ extended: true }));    // for form-data
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy: false
}))

// here configuration part is done 

// our server run on some sepecific port

const PORT = process.env.PORT || 8000;


// add some routes for checking purpose whether our server is running or not

app.get("/", (request, response) => {
    // server to client
    response.json({
        message: `server is running on PORT number: ${PORT}`
    })
})

// here databse will connect & after that server will run

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running ${PORT}`)
    })
})


app.use('/api/user', router)
app.use('/api/category', categoryRouter)
app.use('/api/file', uploadRouter)
app.use('/api/subcategory', subCategoryRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)