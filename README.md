# 🛒 E-Commerce CRUD API with Cloud Storage & Authentication

A highly scalable and secure backend REST API for an E-Commerce platform. This project handles advanced user authentication (Access & Refresh Tokens), robust product management (CRUD), and seamless multiple image uploads using **Multer** and **ImageKit.io**. 

## 🚀 Tech Stack & Libraries
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), Cookies, Bcrypt
* **File Uploads:** Multer (Memory Storage), ImageKit SDK

---

## 🚀 Features

### 🔐 Authentication
* User Registration
* User Login
* Password Hashing using bcrypt
* JWT Access Token & Refresh Token
* Cookie-Based Authentication
* Refresh Token Regeneration
* Protected Routes

### 📦 Product Management
* Create Product
* Get All Products (with Category Filtering)
* Get Product By ID
* Update Product
* Delete Product
* Multiple Image Upload Support (Max 5 images)

### ☁️ Cloud Storage
* Image Upload using ImageKit
* Multiple Images Upload
* Delete Images from ImageKit when Product is Deleted
* Replace Images during Product Update

### 🗄️ Database
* MongoDB
* Mongoose ODM
* Schema Validation
* Timestamps

---

## 🔐 Authentication Flow

```text
User Register/Login
          │
          ▼
Validate Credentials
          │
          ▼
Generate Access Token
          │
          ▼
Generate Refresh Token
          │
          ▼
Store Refresh Token
        In Database
          │
          ▼
Set Tokens In Cookies
          │
          ▼
Authenticated User
```

## 🏗️ System Architecture & Data Flow

Here is how a request flows through the application when a user uploads a new product with images:

```text
[ Client/Frontend ] 
       │
       ▼ (HTTP POST /products with Multipart form-data)
[ Express Routes ] 
       │
       ├─► [ AuthMiddleware ] ──(Verifies JWT Access Token)──► ❌ (401 If Invalid)
       │         │
       │         ▼ (Token Valid)
       ├─► [ Multer (File.config.js) ] ──(Stores max 5 images in memory buffer)
       │         │
       │         ▼
[ Product Controller ] 
       │         │
       │         ├─► [ ImageKit Service ] ──(Uploads buffers to Cloud)
       │         │           │
       │         │           ▼
       │         │    Returns Image URLs & File IDs
       │         ▼
[ Mongoose Models ] ──(Saves Product Details + Image Data + User Email)
       │
       ▼
[ MongoDB Database ]
```

---

## 📂 Folder Structure

```text
ECOMERCE-CRUD/
├── src/
│   ├── Config/
│   │   ├── Database.js          # MongoDB connection logic
│   │   ├── File.config.js       # Multer memory storage configuration
│   │   └── imagekit.js          # ImageKit SDK setup & upload/delete functions
│   ├── Controllers/
│   │   ├── auth.controller.js   # Registration, Login, and Refresh Token logic
│   │   └── product.controller.js# CRUD operations & image upload orchestration
│   ├── Middlewares/
│   │   └── auth.middleware.js   # Protects routes via JWT validation
│   ├── Models/
│   │   ├── auth.model.js        # User schema with pre-save bcrypt hashing
│   │   └── product.model.js     # Product schema supporting array of image objects
│   ├── Routes/
│   │   ├── auth.routes.js       # Authentication endpoints
│   │   └── file.route.js        # Product and file upload endpoints
│   ├── Utils/
│   │   └── Token.js             # Utility to generate Access & Refresh tokens
│   └── app.js                   # Express app initialization & route mounting
├── .env                         # Environment variables
├── package.json                 # Project dependencies
└── server.js                    # Entry point of the application
```

---

## ⚙️ How the Core Modules Work

### 1. Configurations (`/Config`)
* **`Database.js`**: Connects the Express server to the MongoDB database asynchronously using Mongoose.
* **`File.config.js`**: Initializes **Multer** using `memoryStorage()`. Keeps files in memory buffers to stream directly to ImageKit.
* **`imagekit.js`**: Connects to ImageKit cloud. Contains helper functions (`Upload_files`, `Delete_file`) for cloud storage management.

### 2. Middlewares & Utilities (`/Middlewares`, `/Utils`)
* **`auth.middleware.js`**: Extracts the `accessToken` from HTTP-only cookies, verifies it, and attaches the authenticated user's data to the `req` object.
* **`Token.js`**: Centralized logic for signing short-lived Access Tokens and long-lived Refresh Tokens.

### 3. Database Models (`/Models`)
* **`auth.model.js`**: Manages user data with a Mongoose `pre('save')` hook for automatic `bcrypt` password hashing.
* **`product.model.js`**: Defines the product structure (name, price, category, description) and handles images as an array of sub-documents (URL and fileId).

### 4. Controllers (`/Controllers`)
* **Auth Controllers**: Handles registration, login, and silent token regeneration via refresh tokens.
* **Product Controllers**: Orchestrates CRUD operations and ensures ImageKit cloud storage stays in sync when products are updated or deleted (preventing orphan files).

---

## 🏗 MVC Architecture

```text
                Client Request
                       │
                       ▼
                 Routes Layer
                       │
                       ▼
                Controllers Layer
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
         Models              ImageKit
             │
             ▼
          MongoDB
```

---

## 📖 Detailed API Documentation

### 🔐 1. Authentication Routes

#### **Register User**
* **Route:** `/api/auth/register`
* **Method:** `POST`
* **Authentication Required:** No
* **Required Fields:** `name`, `email`, `password`, `mobile`
* **Request Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "mobile": 9876543210
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "message": "User created successfully",
    "user": { ...userData }
  }
  ```
* **Error Responses:** `400 Bad Request` (Missing fields / User already exists), `500 Internal Server Error`.

#### **Login User**
* **Route:** `/api/auth/login`
* **Method:** `POST`
* **Authentication Required:** No
* **Required Fields:** `email`, `password`
* **Success Response (200 OK):** Sets `accessToken` and `refreshToken` in HTTP-only cookies.
  ```json
  {
    "message": "User Login SuccessFully",
    "user": { ...userData }
  }
  ```
* **Error Responses:** `400 Bad Request`, `404 Not Found` (Wrong Password / User not found).

---

### 📦 2. Product Routes

#### **Create a Product**
* **Route:** `/api/product/products`
* **Method:** `POST`
* **Authentication Required:** Yes (JWT via Cookie)
* **Required Fields:** `name`, `price`, `description`, `category`, `image` (Files)
* **Request Format:** `multipart/form-data`
* **Example Request:**
  * `name`: "Wireless Mouse"
  * `price`: 599
  * `category`: "electronics"
  * `description`: "Ergonomic wireless mouse"
  * `image`: [File1.jpg, File2.jpg] (Max 5)
* **Success Response (201 Created):**
  ```json
  {
    "message": "File uploaded successfully",
    "NewCreate": { "_id": "...", "name": "Wireless Mouse", "image": [...] }
  }
  ```
* **Error Responses:** `400 Bad Request` (Missing fields), `401 Unauthorized` (Token invalid).

#### **Get All Products (With Filtering)**
* **Route:** `/api/product/products`
* **Method:** `GET`
* **Authentication Required:** No (Public Route)
* **Query Parameters:** `?category=your_category` (Optional)
* **Example Request:** `GET /api/product/products?category=electronics`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Products Fetched Successfully",
    "View": [ { "name": "Wireless Mouse", "category": "electronics" }, ... ]
  }
  ```

#### **Get Product By ID**
* **Route:** `/api/product/products/:id`
* **Method:** `GET`
* **Authentication Required:** No (Public Route)
* **Success Response (200 OK):** Returns the specific product object.
* **Error Responses:** `500 Internal Server Error` (Invalid ID format).

#### **Update Product**
* **Route:** `/api/product/products/:id`
* **Method:** `PUT`
* **Authentication Required:** Yes (Only creator can update)
* **Request Format:** `multipart/form-data`
* **Success Response (200 OK):**
  ```json
  {
    "message": "File Updated Successfully",
    "Update": { ...updatedProductData }
  }
  ```

#### **Delete Product**
* **Route:** `/api/product/products/:id`
* **Method:** `DELETE`
* **Authentication Required:** Yes (Only creator can delete)
* **Success Response (200 OK):**
  ```json
  {
    "message": "File and Data Deleted Successfully",
    "Delete": { ...deletedProductData }
  }
  ```
* **Error Responses:** `404 Not Found` (Document not found / Unauthorized user).

---

## 🛠️ Installation and Setup

Follow these steps to run the project locally:

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd ECOMERCE-CRUD
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add:
   ```env
   PORT=3000
   MONGODB_URL=your_mongodb_connection_string
   ACCESS_SECRET_KEY=your_jwt_access_secret
   REFRESH_SECRET_KEY=your_jwt_refresh_secret
   PUBLIC_KEY=your_imagekit_public_key
   PRIVATE_KEY=your_imagekit_private_key
   URL_ENDPOINT=your_imagekit_url_endpoint
   ```

4. **Start the Server:**
   ```bash
   npm start
   ```

---

## 👨‍💻 Author Notes

Created by: **Swarup Das** 🎯

This project demonstrates the progression from basic backend development to production-ready code. The implementation showcases how to evolve from simple implementations to scalable, maintainable applications following industry best practices like pre-save hooks, JWT refresh token rotation, and third-party cloud storage integration.

## 🤝 Let's Connect & Collaborate!

If you found this project helpful or interesting, I'd love to hear from you! Whether you want to:
* 💡 Share ideas and suggestions
* 🐛 Report issues or improvements
* 📚 Collaborate on future projects
* 💬 Discuss backend development practices
* 🚀 Work together on exciting initiatives

Feel free to reach out! I'm always happy to connect with fellow developers and explore collaboration opportunities.

**Let's build something amazing together! 🚀**