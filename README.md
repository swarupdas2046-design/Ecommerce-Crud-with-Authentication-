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
* JWT Access Token
* JWT Refresh Token
* Cookie-Based Authentication
* Refresh Token Regeneration
* Protected Routes

### 📦 Product Management

* Create Product
* Get All Products
* Get Product By ID
* Update Product
* Delete Product
* Multiple Image Upload Support

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


# 🔐 Authentication Flow

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
       ▼ (HTTP POST /createProduct with Multipart form-data)
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
* **`File.config.js`**: Initializes **Multer** using `memoryStorage()`. Instead of saving files to the local disk, it keeps them in memory buffers so they can be directly streamed to ImageKit.
* **`imagekit.js`**: Connects to the ImageKit cloud platform. Contains helper functions (`Upload_files` and `Delete_file`) to push buffers to the cloud and remove them when a product is updated or deleted.

### 2. Middlewares & Utilities (`/Middlewares`, `/Utils`)
* **`auth.middleware.js`**: Extracts the `accessToken` from HTTP-only cookies, verifies it using the secret key, and attaches the authenticated user's data to the `req` object for downstream use.
* **`Token.js`**: Centralized logic for signing short-lived Access Tokens and long-lived Refresh Tokens.

### 3. Database Models (`/Models`)
* **`auth.model.js`**: Manages user data. Features a Mongoose `pre('save')` hook that automatically hashes passwords using `bcrypt` before saving them to the database. It also includes a custom instance method `ComparePassword()` for login verification.
* **`product.model.js`**: Defines the product structure (name, price, category, description). Crucially, it handles images as an array of sub-documents containing both the cloud `url` (for frontend display) and the `fileId` (required for deletion from ImageKit).

### 4. Controllers (`/Controllers`)
* **Auth Controllers**: 
  * `UserRegister` & `UserLogin`: Issue both Access and Refresh tokens, storing them securely in cookies.
  * `GetRefreshToken`: Validates an expired session and silently issues a new Access token using the stored Refresh token.
* **Product Controllers**: 
  * `CreateProduct`: Loops through `req.files`, uploads them concurrently using `Promise.all()`, and saves the product.
  * `UpdateProduct` & `DeleteProduct`: Ensure that when a product is modified or removed, the associated images are also permanently deleted from ImageKit cloud storage to prevent orphan files.

---

---

# 🏗 MVC Architecture

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
         Models             ImageKit
             │
             ▼
          MongoDB
```




## 📡 API Endpoints

### 🔐 Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Create a new user account & generate tokens | Public |
| POST | `/login` | Authenticate user & set HTTP-only cookies | Public |
| GET | `/getRefreshToken`| Generate a new access token using refresh token| Public |

### 📦 Product & File Routes (`/api/product`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/createProduct` | Create a product (Uploads max 5 images) | Protected |
| GET | `/getallProducts` | Fetch all products for the logged-in user | Protected |
| GET | `/getProductById/:id` | Fetch specific product details by its ID | Protected |
| PUT | `/UpdateProduct/:id`| Update product details & replace images | Protected |
| DELETE| `/DeleteProduct/:id`| Delete product & remove images from cloud | Protected |

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