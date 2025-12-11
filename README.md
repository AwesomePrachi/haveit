# 🛒 Haveit – Full-Stack Grocery & E-Commerce Platform

Haveit is a full-stack Blinkit-style grocery delivery web application that enables users to browse products, manage their carts, place orders, make online payments using Stripe Checkout, and order via Cash on Delivery.  
The application includes both **User** and **Admin** interfaces, authentication flows, product/category management, order management, and responsive mobile layouts.

---

## 🎬 Demo

<p align="center">
  <video src="https://github.com/user-attachments/assets/XXXXX/video.mp4"
         width="100%" 
         controls>
  </video>
</p>

---

## ✨ Key Features

### User Features
- User Registration & Login (JWT Authentication)  
- Forgot Password & Reset Password via OTP  
- Browse Categories & Subcategories  
- Product Listing & Product Details Page  
- Add to Cart + Update Quantities  
- Mobile-Friendly Cart & User Menu  
- Checkout with Address Selection  
- Two Payment Methods:
  - **Stripe Checkout (Online Payment)**
  - **Cash on Delivery**
- Order Tracking & Order History  
- Profile & Address Management  

### Admin Features
- Admin Role-Based Access  
- Category & Subcategory Management  
- Product Upload / Update with Cloudinary  
- Product Listing & Image Management  
- Order Dashboard  
- Automatic order creation via **Stripe Webhooks**  

---

## 💳 Payment Integration

### Stripe Checkout Flow
- Secure Stripe Checkout integration  
- Redirects on success → `/success?session_id=...`  
- Redirects on failure → `/cancel-order`  
- Backend verifies payment using:
  - Stripe Webhooks (server-side)
  - Client verification (UX)  

---

## 🔧 Tech Stack

- **Frontend:** React, React Router DOM, Redux Toolkit, TailwindCSS, Axios, Sweet Alert2, Stripe.js   
- **Backend:**  Node.js, Express.js, MongoDB, Mongoose, Resend API, Stripe API, Cloudinary, JWT Authentication
- **Other:** dotenv for environment variables, CORS

---

## 📦 Installation & Local Setup

### 1️. Clone Repository
```bash
git clone https://github.com/AwesomePrachi/haveit.git
cd haveit
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `/` directory:
```env
PORT=8000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

STRIPE_SECRET_KEY=sk_test_****
STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY=whsec_****
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```
Server runs at [http://localhost:8000](http://localhost:8000)

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Add .env file
```bash
VITE_API_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```
App runs at [http://localhost:5173](http://localhost:5173)

---

## 🚀 Deployment Setup

- **Frontend (Vercel)**
- **Backend (Render)**

---

## License

[MIT](./LICENSE)

---

⭐ If you like this project, consider giving it a star on GitHub!
