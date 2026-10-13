# ShopSphere — E-Commerce Management System

A full-stack e-commerce platform built with **Java Spring Boot** (backend) and **React.js** (frontend), featuring JWT authentication, product management, shopping cart, order tracking, payment integration, admin dashboard, and more.

## 🚀 Features

### Core Features
- ✅ User Registration & Login with JWT Authentication
- ✅ Product Catalog with Search, Filter, Sort, and Pagination
- ✅ Category Management
- ✅ Shopping Cart (Add, Update, Remove)
- ✅ Order Placement & Tracking
- ✅ Payment Integration (Stripe-ready)
- ✅ Wishlist Functionality
- ✅ Admin Dashboard with Sales Analytics
- ✅ Role-Based Access Control (USER / ADMIN)
- ✅ Product Recommendations
- ✅ Swagger/OpenAPI Documentation

### Tech Stack
| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Axios, Recharts |
| **Backend** | Java 17, Spring Boot 3.2, Spring Security, JPA/Hibernate |
| **Database** | MySQL 8.x |
| **Auth** | JWT (JSON Web Tokens) + BCrypt |
| **API Docs** | Swagger/OpenAPI 3.0 |
| **Payment** | Stripe Integration |

## 📂 Project Structure

```
e-commerce project/
├── backend/                        # Spring Boot API
│   ├── src/main/java/com/shopsphere/
│   │   ├── config/                 # Security, Swagger, Data Seeder
│   │   ├── controller/             # REST Controllers
│   │   ├── dto/                    # Data Transfer Objects
│   │   ├── entity/                 # JPA Entities
│   │   ├── exception/              # Global Exception Handling
│   │   ├── repository/             # Spring Data Repositories
│   │   ├── security/               # JWT Utils, Auth Filter
│   │   └── service/                # Business Logic
│   └── pom.xml
└── frontend/                       # React App
    ├── src/
    │   ├── components/             # Navbar, Footer, ProductCard
    │   ├── context/                # AuthContext, CartContext
    │   ├── pages/                  # All page components
    │   ├── services/               # Axios API client
    │   └── styles/                 # Component CSS
    └── package.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.x
- Maven 3.8+

### Database Setup
1. Install MySQL and start the server
2. Create the database (auto-created by Spring Boot):
```sql
CREATE DATABASE shopsphere_db;
```
### Backend Setup
```bash
cd backend
# Update database credentials in src/main/resources/application.properties
mvn spring-boot:run
```
The backend starts at **http://localhost:8080**
Swagger UI: **http://localhost:8080/swagger-ui.html**

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend starts at **http://localhost:5173**

### Default Admin Account
- **Username:** admin
- **Password:** admin123

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login & get JWT | No |
| GET | `/api/products` | List products (paginated) | No |
| GET | `/api/products/{id}` | Product details | No |
| GET | `/api/products/search` | Search products | No |
| GET | `/api/products/featured` | Featured products | No |
| GET | `/api/categories` | List categories | No |
| GET | `/api/cart` | Get cart items | User |
| POST | `/api/cart/add` | Add to cart | User |
| PUT | `/api/cart/update` | Update quantity | User |
| DELETE | `/api/cart/remove/{id}` | Remove from cart | User |
| POST | `/api/orders` | Place order | User |
| GET | `/api/orders` | Order history | User |
| GET | `/api/wishlist` | Get wishlist | User |
| POST | `/api/wishlist/add` | Add to wishlist | User |
| GET | `/api/admin/dashboard` | Dashboard stats | Admin |
| POST | `/api/admin/products` | Create product | Admin |
| PUT | `/api/admin/orders/{id}/status` | Update order status | Admin |

## 📸 Screenshots

### Homepage
Premium dark-themed landing page with featured products, categories, and CTA sections.

### Product Listing
Grid layout with search, category filters, sorting, and pagination.

### Admin Dashboard
Analytics overview with revenue charts, order management, and user tables.

## 📄 License
MIT License - Free for personal and commercial use.
