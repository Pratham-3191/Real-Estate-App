# 🏡 World Estate – MERN Real Estate Website

World Estate is a full‑stack **Real Estate Web Application** built using the **MERN stack**. The platform allows users to browse, create, update, and manage property listings for **rent and sale**, with secure authentication and a modern responsive UI.

---

## 🚀 Features

### 👤 Authentication

* User Signup & Signin (JWT-based)
* Google Authentication
* Secure authentication using **HTTP-only cookies**
* Protected routes using middleware

### 🏘️ Listings

* Create, update, delete property listings (authenticated users only)
* View listings for **Rent / Sale / Offers**
* Fetch single or multiple listings
* User-specific listings dashboard

### 🔐 Security

* JWT authentication stored in **HTTP-only cookies**
* Protected APIs using `verifyToken` middleware
* CORS configured for frontend–backend communication
* Safer than localStorage against **XSS attacks**

### 🎨 Frontend

* Built with **React + Vite**
* Styled using **Tailwind CSS**
* Responsive UI
* Dynamic routing
* Loading & error states handled

### 🧠 Backend

* Node.js + Express.js
* MongoDB with Mongoose
* RESTful API architecture
* Clean route & controller separation

---

## 🛠️ Tech Stack

**Frontend**

* React
* Vite
* Tailwind CSS
* JavaScript (ES6+)
* Redux Toolkit (State Management)

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT

---


## ▶️ Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/world-estate.git
cd world-estate
```

### 2️⃣ Install dependencies

**Backend**

```bash
cd api
npm install
npm run dev
```

**Frontend**

```bash
cd client
npm install
npm run dev
```

---

## 🌍 Deployment

* **Frontend**: Vercel
* **Backend**: Render 
* **Database**: MongoDB Atlas

## 🧪 API Routes Overview

### Auth

* `POST /api/auth/signup`
* `POST /api/auth/signin`
* `POST /api/auth/google`
* `GET /api/auth/signout`

### User

* `GET /api/user/:id` (Protected)
* `GET /api/user/listings/:id` (Protected)
* `POST /api/user/update/:id` (Protected)
* `DELETE /api/user/delete/:id` (Protected)

### Listings

* `POST /api/listing/create` (Protected)
* `POST /api/listing/update/:id` (Protected)
* `DELETE /api/listing/delete/:id` (Protected)
* `GET /api/listing/get/:id`
* `GET /api/listing/get`

---

## 🧠 Key Learnings

* Handling authentication using cookies
* Managing CORS & credentials in production
* Secure JWT handling
* Full MERN stack integration

---

## 👨‍💻 Author

**Pratham Chaudhari**
Frontend / MERN Stack Developer
🔗 LinkedIn: https://www.linkedin.com/in/pratham-chaudhari-9237a0288/

---

## ⭐ Support

If you like this project, don’t forget to ⭐ the repository!

---

Happy Coding 🚀
