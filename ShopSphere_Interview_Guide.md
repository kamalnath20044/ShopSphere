# ShopSphere — Complete Interview Preparation Guide

---

## 1. PROJECT OVERVIEW (The "Tell me about your project" answer)

> **ShopSphere** is a full-stack e-commerce management system that I built using **Java Spring Boot** for the backend, **React.js** for the frontend, and **MySQL** as the database. It simulates a real-world online shopping platform with features like JWT-based authentication, product catalog with search and filtering, shopping cart, order management, wishlist, payment integration, and an admin dashboard with sales analytics.
>
> The backend follows a **layered architecture** (Controller → Service → Repository → Entity) and uses **Spring Security with JWT tokens** for stateless authentication. The frontend is a **Single Page Application (SPA)** built with React, using React Router for navigation and Axios for API communication.

---

## 2. ARCHITECTURE

### High-Level Architecture
```
┌────────────────────┐         ┌────────────────────────┐
│   React Frontend   │  REST   │  Spring Boot Backend   │
│   (Vite + React)   │◄──────►│  (Java 17 + Maven)     │
│   Port: 5173       │  JSON   │  Port: 8080            │
└────────────────────┘         └──────────┬─────────────┘
                                          │ JPA / Hibernate
                                          ▼
                               ┌────────────────────────┐
                               │       MySQL 8.x        │
                               │    shopsphere_db       │
                               └────────────────────────┘
```

### Backend Layered Architecture
```
HTTP Request
    │
    ▼
┌──────────────┐
│  Controller  │  ← Receives HTTP requests, validates input, returns responses
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Service    │  ← Business logic, transaction management
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Repository  │  ← Database operations via Spring Data JPA
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Entity     │  ← JPA entities mapped to MySQL tables
└──────────────┘
```

---

## 3. TECHNOLOGY STACK (Know every tool and WHY you chose it)

| Technology | Purpose | Why I Chose It |
|-----------|---------|----------------|
| **Java 17** | Backend language | Industry standard, strong typing, enterprise-grade, LTS version |
| **Spring Boot 3.2** | Backend framework | Auto-configuration, embedded Tomcat, rapid development |
| **Spring Security** | Authentication & authorization | Industry standard for securing Java apps, integrates with JWT |
| **JWT (JSON Web Tokens)** | Stateless authentication | Scalable, no server-side sessions, works well with REST APIs |
| **Spring Data JPA** | Database access | Eliminates boilerplate SQL, provides repository pattern |
| **Hibernate** | ORM framework | Maps Java objects to database tables automatically |
| **MySQL 8.x** | Relational database | ACID compliance, strong for transactional data like orders |
| **React 18** | Frontend framework | Component-based, virtual DOM for performance, huge ecosystem |
| **Vite** | Build tool | Faster than Webpack, instant hot module replacement |
| **React Router v6** | Client-side routing | SPA navigation without page reloads |
| **Axios** | HTTP client | Promise-based, interceptors for JWT, cleaner than fetch |
| **Recharts** | Charts library | Admin dashboard sales analytics visualization |
| **BCrypt** | Password hashing | One-way hashing with salt, industry standard for passwords |
| **Swagger/OpenAPI** | API documentation | Auto-generated interactive API docs |
| **Docker** | Containerization | Consistent environments, easy deployment |
| **Maven** | Build tool | Dependency management, standardized build lifecycle |

---

## 4. DATABASE DESIGN

### Entity Relationship Summary
```
Users ──────┤ 1:N │──── Orders
  │                        │
  │ N:M                    │ 1:N
  │                        │
Roles                 OrderItems ──── Products
                                        │
Users ──── CartItems ──── Products       │ N:1
                                        │
Users ──── Wishlists ──── Products   Categories
                                        
Orders ──── Payments (1:1)
```

### Tables Created

| Table | Key Columns | Relationships |
|-------|------------|---------------|
| **users** | id, username, email, password (hashed), full_name, address | ManyToMany with roles |
| **roles** | id, name (ROLE_USER, ROLE_ADMIN) | ManyToMany with users |
| **categories** | id, name, description | OneToMany with products |
| **products** | id, name, price, discount_price, stock_quantity, category_id | ManyToOne with category |
| **cart_items** | id, user_id, product_id, quantity | ManyToOne with user & product |
| **orders** | id, order_number, user_id, total_amount, status, shipping details | OneToMany with order_items |
| **order_items** | id, order_id, product_id, quantity, price | ManyToOne with order & product |
| **payments** | id, order_id, method, status, amount, transaction_id | OneToOne with order |
| **wishlists** | id, user_id, product_id | ManyToOne with user & product |

---

## 5. CORE FEATURES — DETAILED EXPLANATION

### 5.1 Authentication & Authorization (JWT)

**How JWT Authentication Works in ShopSphere:**

1. **Registration**: User submits username, email, password → password is hashed with **BCrypt** → saved to database
2. **Login**: User submits credentials → Spring Security's `AuthenticationManager` validates → if correct, **JwtUtils** generates a JWT token → token returned to frontend
3. **Subsequent Requests**: Frontend stores token in `localStorage` → Axios interceptor adds `Authorization: Bearer <token>` header to every request
4. **Server Validation**: `JwtAuthenticationFilter` (extends `OncePerRequestFilter`) extracts token from header → validates signature and expiry → sets `SecurityContext` → request proceeds

**Key Classes:**
- `JwtUtils.java` — generates and validates JWT tokens using HMAC-SHA algorithm
- `JwtAuthenticationFilter.java` — intercepts every request, validates JWT
- `UserDetailsServiceImpl.java` — loads user from database for Spring Security
- `SecurityConfig.java` — configures which endpoints require authentication

**Interview Answer:**
> "I implemented stateless authentication using JWT. When a user logs in, the server generates a signed JWT token containing the username and roles. This token is sent with every subsequent API request in the Authorization header. The server validates the token's signature and expiry without needing to store session state, making it horizontally scalable."

### 5.2 Role-Based Access Control (RBAC)

- **ROLE_USER**: Can browse products, manage cart, place orders, manage wishlist
- **ROLE_ADMIN**: All user permissions + manage products, view all orders, update order status, view analytics

**How it's enforced:**
- `SecurityConfig` → URL-level: `/api/admin/**` requires `ROLE_ADMIN`
- `@PreAuthorize("hasRole('ADMIN')")` → Method-level on AdminController

### 5.3 Product Management

- **Pagination**: `PageRequest.of(page, size, sort)` — returns `Page<Product>` with metadata (totalPages, totalElements)
- **Search**: Custom JPQL query searches across name, description, and brand fields
- **Filtering**: By category using `findByCategoryIdAndActiveTrue()`
- **Sorting**: Dynamic sorting by price, rating, name, or date
- **Soft Delete**: Products are deactivated (`active=false`), not deleted — preserves order history

### 5.4 Shopping Cart

- Cart items are stored in the **database** (not browser), linked to the authenticated user
- Adding a product that's already in cart **increments the quantity**
- Stock validation happens when adding to cart and when placing order
- Cart is cleared automatically after successful order placement

### 5.5 Order Processing

**Order Flow:**
```
Cart Items → Validate Stock → Create Order → Create OrderItems 
→ Deduct Stock → Create Payment Record → Clear Cart → Return Order
```

- **Order Number**: Generated using `UUID` (e.g., `ORD-A1B2C3D4`)
- **Tax Calculation**: 8% tax on subtotal
- **Shipping**: Free for orders over $100, otherwise $9.99
- **Order Status Lifecycle**: PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
- **Cancellation**: Only allowed in PENDING or CONFIRMED status; restores product stock

### 5.6 Admin Dashboard

- **Statistics**: Total users, products, orders, revenue, pending/delivered counts
- **Sales Analytics**: Monthly sales data visualized with bar charts (Recharts)
- **Order Management**: View all orders, update status via dropdown
- **User Management**: View all registered users with roles

### 5.7 Wishlist

- Users can save products for later
- Unique constraint prevents duplicate entries (`user_id + product_id`)
- "Move to Cart" removes from wishlist and adds to cart simultaneously

---

## 6. SECURITY MEASURES

| Feature | Implementation |
|---------|---------------|
| Password Encryption | BCrypt (one-way hash with random salt) |
| JWT Tokens | HMAC-SHA signed, 24-hour expiry |
| CORS Protection | Only `localhost:5173` allowed |
| Input Validation | `@Valid`, `@NotBlank`, `@Email`, `@Size` annotations |
| SQL Injection Prevention | JPA parameterized queries (never concatenates SQL) |
| Role-Based Access | URL-level + method-level authorization |
| Stateless Sessions | `SessionCreationPolicy.STATELESS` — no server-side sessions |
| Global Exception Handling | `@RestControllerAdvice` catches all exceptions uniformly |

---

## 7. COMMON INTERVIEW QUESTIONS & ANSWERS

### General Project Questions

**Q1: "Tell me about your project."**
> "ShopSphere is a full-stack e-commerce platform I built using Spring Boot and React. It features JWT authentication with role-based access control, a product catalog with search and pagination, shopping cart, order management with status tracking, wishlist functionality, and an admin dashboard with sales analytics. The backend follows a layered architecture and uses Spring Data JPA with MySQL. I also containerized it with Docker for easy deployment."

**Q2: "Why did you choose this tech stack?"**
> "I chose Spring Boot because it's the industry standard for Java enterprise applications — it provides auto-configuration, embedded server, and excellent security integration. React was chosen for the frontend because of its component-based architecture and virtual DOM for performance. MySQL was selected because e-commerce data is highly relational — orders reference users and products, which benefits from ACID compliance and foreign key constraints. JWT was chosen for authentication because it enables stateless, scalable API security."

**Q3: "What was the most challenging part?"**
> "Implementing the order processing flow was the most challenging. It involves multiple database operations in a single transaction — validating stock for all cart items, creating the order and order items, deducting inventory, creating the payment record, and clearing the cart. I used Spring's `@Transactional` annotation to ensure atomicity — if any step fails, the entire operation rolls back."

**Q4: "How do you handle errors in your application?"**
> "I implemented a global exception handler using `@RestControllerAdvice`. It catches specific exceptions like `ResourceNotFoundException` (returns 404), `BadRequestException` (returns 400), `BadCredentialsException` (returns 401), and validation errors (returns field-level error messages). This ensures consistent error response format across all API endpoints."

### Technical Questions

**Q5: "How does JWT authentication work in your project?"**
> "When a user logs in with valid credentials, the server generates a JWT token signed with a secret key using HMAC-SHA algorithm. This token contains the username and has a 24-hour expiry. The frontend stores it in localStorage and attaches it to every API request via an Axios interceptor. On the server side, a `OncePerRequestFilter` extracts the token, validates its signature and expiry, loads the user from the database, and sets the Spring Security context."

**Q6: "What is the difference between authentication and authorization?"**
> "Authentication verifies **who you are** (login with username/password → get JWT token). Authorization determines **what you can do** (ROLE_USER can view products and place orders, ROLE_ADMIN can also manage products and view all orders). In my project, authentication is handled by JWT, and authorization is handled by Spring Security's role-based access control."

**Q7: "Explain your database relationships."**
> "Users have a ManyToMany relationship with Roles through a join table `user_roles`. Products have a ManyToOne relationship with Categories. CartItems connect Users and Products with a quantity field. Orders have a ManyToOne with Users and OneToMany with OrderItems. OrderItems reference Products. Payments have a OneToOne relationship with Orders. Wishlists connect Users and Products with a unique constraint."

**Q8: "How do you handle pagination?"**
> "I use Spring Data JPA's `Pageable` interface. The controller accepts `page`, `size`, `sortBy`, and `sortDir` parameters. I create a `PageRequest.of(page, size, Sort.by(sortBy))` object and pass it to the repository. The response includes `content` (the data), `totalPages`, `totalElements`, `number` (current page), and `size`. The frontend uses this metadata to render pagination controls."

**Q9: "What happens if two users try to buy the last item at the same time?"**
> "The `@Transactional` annotation on the `placeOrder` method ensures database-level consistency. When the first transaction reads and deducts the stock, the second transaction will see the updated stock. If stock becomes insufficient, a `BadRequestException` is thrown and the second order fails gracefully with an error message."

**Q10: "Why did you use Spring Data JPA instead of writing raw SQL?"**
> "Spring Data JPA eliminates boilerplate code — I just define an interface extending `JpaRepository` and get CRUD operations automatically. For custom queries, I use method name conventions (like `findByUserIdOrderByCreatedAtDesc`) or JPQL with `@Query`. It also provides built-in pagination, sorting, and transaction management. The parameterized queries prevent SQL injection automatically."

**Q11: "How does your frontend communicate with the backend?"**
> "The React frontend uses Axios as the HTTP client. I created a centralized API service with interceptors — the request interceptor automatically attaches the JWT token from localStorage to every request, and the response interceptor handles 401 errors by redirecting to the login page. All API endpoints are organized into modules: authAPI, productAPI, cartAPI, orderAPI, wishlistAPI, and adminAPI."

**Q12: "Explain the difference between @Controller and @RestController."**
> "@Controller returns view names (for server-side rendered pages). @RestController is @Controller + @ResponseBody combined — it returns data directly as JSON. Since I'm building a REST API consumed by a React frontend, I use @RestController throughout."

**Q13: "What is @Transactional and why is it important?"**
> "@Transactional ensures that a method runs within a database transaction. If any exception occurs during execution, all database changes within that method are rolled back. In my order processing, this is critical — if deducting stock fails for one product, I don't want the order to be partially created."

**Q14: "How did you implement protected routes in React?"**
> "I created a `ProtectedRoute` component that checks if the user is authenticated by reading the AuthContext. If not authenticated, it redirects to `/login` using React Router's `Navigate` component. For admin routes, it additionally checks if the user has `ROLE_ADMIN`. This component wraps protected pages in the route configuration."

**Q15: "Explain the N+1 query problem. Does your project have it?"**
> "The N+1 problem occurs when loading a parent entity triggers N additional queries to load related entities. For example, loading 10 orders might trigger 10 additional queries to load each order's user. I mitigated this by using `FetchType.EAGER` for critical relationships (like Product's Category) and `@JsonIgnore` to prevent circular serialization."

### Architecture & Design Pattern Questions

**Q16: "What design patterns did you use?"**
> "1) **Repository Pattern** — Spring Data JPA repositories abstract database access. 2) **DTO Pattern** — Data Transfer Objects like `LoginRequest`, `JwtResponse` separate API contracts from entities. 3) **Singleton Pattern** — Spring beans are singletons by default. 4) **Filter Chain Pattern** — JWT authentication filter in Spring Security. 5) **Builder Pattern** — JWT token construction using JJWT's builder API."

**Q17: "How would you scale this application?"**
> "The stateless JWT authentication means I can run multiple backend instances behind a load balancer. The database can be scaled with read replicas for product queries. For high traffic, I'd add Redis caching for product listings and categories. The Docker setup already supports horizontal scaling. For the frontend, it's a static SPA that can be served from a CDN."

---

## 8. API ENDPOINTS SUMMARY

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login, returns JWT |
| GET | `/api/products` | None | List products (paginated) |
| GET | `/api/products/{id}` | None | Product details |
| GET | `/api/products/search?keyword=` | None | Search products |
| GET | `/api/products/featured` | None | Featured products |
| GET | `/api/products/{id}/recommendations` | None | Similar products |
| GET | `/api/categories` | None | All categories |
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart/add` | User | Add to cart |
| PUT | `/api/cart/update` | User | Update quantity |
| DELETE | `/api/cart/remove/{id}` | User | Remove item |
| POST | `/api/orders` | User | Place order |
| GET | `/api/orders` | User | Order history |
| POST | `/api/orders/{id}/cancel` | User | Cancel order |
| GET | `/api/wishlist` | User | Get wishlist |
| POST | `/api/wishlist/add` | User | Add to wishlist |
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| POST | `/api/admin/products` | Admin | Create product |
| PUT | `/api/admin/orders/{id}/status` | Admin | Update order status |
| GET | `/api/admin/users` | Admin | List all users |

---

## 9. HOW TO EXPLAIN THE PROJECT FLOW

### User Journey:
1. **User visits homepage** → sees featured products, categories, feature highlights
2. **Browses products** → search by keyword, filter by category, sort by price/rating
3. **Views product detail** → sees description, price, stock, ratings, recommendations
4. **Registers/Logs in** → JWT token stored, protected features unlocked
5. **Adds to cart** → stock validated, quantity adjustable
6. **Proceeds to checkout** → enters shipping info, selects payment method
7. **Places order** → stock deducted, payment record created, cart cleared
8. **Tracks orders** → views status (Confirmed → Processing → Shipped → Delivered)
9. **Admin manages** → views analytics, updates order status, manages inventory

---

## 10. QUICK REVISION — KEY TERMS

| Term | What It Means |
|------|---------------|
| **REST API** | Stateless HTTP interface using GET/POST/PUT/DELETE with JSON |
| **JWT** | Encoded token containing user info, signed with secret key |
| **BCrypt** | Password hashing algorithm with random salt |
| **JPA** | Java Persistence API — standard for ORM in Java |
| **Hibernate** | JPA implementation that maps objects to database tables |
| **Spring Security** | Framework for authentication and authorization |
| **CORS** | Cross-Origin Resource Sharing — allows frontend on different port |
| **SPA** | Single Page Application — one HTML page, JavaScript handles routing |
| **Virtual DOM** | React's in-memory DOM representation for efficient updates |
| **Axios Interceptor** | Middleware that runs before/after every HTTP request |
| **@Transactional** | Ensures all DB operations in a method succeed or all rollback |
| **Pagination** | Loading data in chunks (page 1, page 2...) instead of all at once |

---

## 11. GITHUB REPOSITORY

**URL**: https://github.com/kamalnath20044/ShopSphere

**How to present in resume:**
> **ShopSphere — E-Commerce Management System** | Java, Spring Boot, React, MySQL
> - Developed a full-stack e-commerce platform with JWT authentication, RBAC, and RESTful APIs
> - Implemented product catalog with search, pagination, and sorting using Spring Data JPA
> - Built shopping cart, order management, payment integration, and admin analytics dashboard
> - Designed 9 database tables with JPA entity relationships and Hibernate ORM
> - Containerized with Docker; documented APIs using Swagger/OpenAPI
