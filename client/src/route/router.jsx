import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Search from "../pages/Search";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import MobileUserMenu from "../pages/MobileUserMenu";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import Address from "../pages/Address";
import MyOrders from "../pages/MyOrders";
import Category from "../pages/Category";
import SubCategory from "../pages/SubCategory";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermission from "../layouts/AdminPermission";
import ProductList from "../pages/ProductList";
import ProductDetails from "../pages/ProductDetails";
import MobileCart from "../pages/MobileCart";
import Checkout from "../pages/Checkout";
import Success from "../pages/Success";
import OrderCancel from "../pages/OrderCancel";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",   
                element: <Home />
            },
            {
                path: "search",
                element: <Search />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "otp-verification",
                element: <OtpVerification />
            },
            {
                path: "verify-otp",
                element: <OtpVerification />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "user",
                element: <MobileUserMenu />
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path : "profile",
                        element : <Profile />
                    },
                    {
                        path: "myorders",
                        element: <MyOrders />
                    },
                    {
                        path: "address",
                        element: <Address />
                    },
                    {
                        path: "category",
                        element: <AdminPermission> <Category /> </AdminPermission> 
                    },
                    {
                        path: "subcategory",
                        element: <AdminPermission> <SubCategory /> </AdminPermission>
                    },
                    {
                        path: "upload-product",
                        element: <AdminPermission> <UploadProduct /> </AdminPermission>
                    },
                    {
                        path: "product",
                        element: <AdminPermission> <ProductAdmin /> </AdminPermission>
                    }
                ]
            },
            {
                path: ":category",
                children: [
                    {
                        path: ":subcategory",
                        element: <ProductList />
                    }
                ]
            },
            {
                path: "product/:product",
                element: <ProductDetails />
            },
            {
                path: "cart",
                element: <MobileCart />
            },
            {
                path: "checkout",
                element: <Checkout />
            },
            {
                path: "success",
                element: <Success />
            },
            {
                path: "cancel-order",
                element: <OrderCancel />
            }
        ]
    }
])

export default router