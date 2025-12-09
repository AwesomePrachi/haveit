export const baseURL = import.meta.env.VITE_API_BASE_URL;

const SummaryApi = {
    register: {
        url: "/api/user/register",
        method: "post"
    },
    login: {
        url: "/api/user/login",
        method: "post"
    },
    forgot_password: {
        url: "/api/user/forgot-password",
        method: "put"
    },
    verify_otp: {
        url: "/api/user/verify-forgot-password-otp",
        method: "put"
    },
    reset_password: {
        url: "/api/user/reset-password",
        method: "put"
    },
    refresh_token: {
        url: "/api/user/refresh-token",
        method: "post"
    },
    current_user: {
        url: "/api/user/current-user",
        method: "get"
    },
    logout: {
        url: "/api/user/logout",
        method: "get"
    },
    upload_avatar: {
        url: "/api/user/upload-avatar",
        method: "put"
    },
    update_account: {
        url: "/api/user/update-account",
        method: "put"
    },
    add_category: {
        url: "/api/category/add-category",
        method: "post"
    },
    upload_image: {
        url: "/api/file/upload",
        method: "post"
    },
    get_category: {
        url: "/api/category/get-category",
        method: "get"
    },
    update_category: {
        url: "/api/category/update-category",
        method: "put"
    },
    delete_category: {
        url: "/api/category/delete-category",
        method: "delete"
    },
    add_subcategory: {
        url: "/api/subcategory/add-sub-category",
        method: "post"
    },
    get_subcategory: {
        url: "/api/subcategory/get-sub-category",
        method: "post"
    },
    update_subcategory: {
        url: "/api/subcategory/update-sub-category",
        method: "put"
    },
    delete_subcategory: {
        url: "/api/subcategory/delete-sub-category",
        method: "delete"
    },
    add_product: {
        url: "/api/product/add-product",
        method: "post"
    },
    get_product: {
        url: "/api/product/get-product",
        method: "post"
    },
    get_product_by_category: {
        url: "/api/product/get-product-by-category",
        method: "post"
    },
    list_products_by_category_subcategory: {
        url: "/api/product/list-products-by-category-subcategory",
        method: "post"
    },
    get_product_details: {
        url: "/api/product/get-product-details",
        method: "post"
    },
    update_product_details: {
        url: "/api/product/update-product-details",
        method: "put"
    },
    delete_product: {
        url: "/api/product/delete-product",
        method: "delete"
    },
    search_product: {
        url: "/api/product/search-product",
        method: "post"
    },
    add_to_cart: {
        url:"/api/cart/add-to-cart",
        method: "post"
    },
    get_cart_items: {
        url: "/api/cart/get-cart-items",
        method: "get"
    },
    update_cart_qty: {
        url: "/api/cart/update-cart-qty",
        method: "put"
    },
    remove_from_cart: {
        url: "/api/cart/remove-from-cart",
        method: "delete"
    },
    create_address: {
        url: "/api/address/create-address",
        method: "post"
    },
    get_address: {
        url: "/api/address/get-address",
        method: "get"
    },
    update_address: {
        url: "/api/address/update-address",
        method: "put"
    },
    delete_address: {
        url: "/api/address/delete-address",
        method: "delete"
    },
    cash_on_delivery: {
        url: "/api/order/cash-on-delivery-payment",
        method: "post"
    },
    online_payment: {
        url: "/api/order/online-payment",
        method: "post"
    },
    get_order_items: {
        url: "/api/order/order-list",
        method: "get"
    }
}

export default SummaryApi