# Roxiler Store Rating App


A Full Stack Web Application that allows users to submit and manage ratings for stores. The platform supports role-based access for Admins, Normal Users, and Store Owners.

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Context API

### Backend
- Express.js
- JWT Authentication
- bcrypt.js

### Database
- MySQL

---

## Features

### Authentication
- Login
- Signup
- JWT Authentication
- Password Validation
- Role-Based Access Control

### Admin Dashboard
- View Total Users
- View Total Stores
- View Total Ratings
- Manage Users
- Manage Stores

### User Dashboard
- Search Stores
- Submit Ratings
- Update Ratings
- View Store Ratings

### Store Owner Dashboard
- View Average Rating
- View Users Who Rated Store

---

##  Screenshots

### Login Page


<img width="1842" height="854" alt="Login" src="https://github.com/user-attachments/assets/59b883a0-0b93-4b8b-99a5-79d7f39f75f9" />

---

### Signup Page


<img width="1805" height="871" alt="signup" src="https://github.com/user-attachments/assets/ac90cfb1-b5ff-4f2c-9f64-042006ebbbd7" />


---

### User Dashboard


<img width="1715" height="917" alt="user dashboard" src="https://github.com/user-attachments/assets/c90b7b00-7eb6-4d09-8f99-531b2d376142" />


---

### Admin Dashboard


<img width="1798" height="875" alt="Admin dashboard" src="https://github.com/user-attachments/assets/8449fb20-7f16-4546-a399-9bb303f48686" />

---

### Store Owner Dashboard


<img width="1683" height="934" alt="store dashboard" src="https://github.com/user-attachments/assets/e12a7ac4-e46d-44ee-ad1f-9664974f7a3f" />

---

##  Project Structure

### Backend

```text
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── storeController.js
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── storeRoutes.js
│   │
│   ├── utils/
│   │   └── jwtHelper.js
│   │
│   └── validations/
│       ├── authValidation.js
│       └── userValidation.js
│
├── .env
├── package.json
├── package-lock.json
└── index.js
```

### Frontend

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── common/
│   │   ├── admin/
│   │   ├── user/
│   │   └── owner/
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── UserDashboard.jsx
│   │   └── StoreOwnerDashboard.jsx
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── userService.js
│   │   └── storeService.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
│
├── package.json
├── package-lock.json
└── vite.config.js
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/store-rating-system.git
cd store-rating-system
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

##  Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=store_rating_db

JWT_SECRET=your_secret_key
```

---

##  Author

**Soundarya Ekbote**
Computer Engineering Student | Full Stack Developer
