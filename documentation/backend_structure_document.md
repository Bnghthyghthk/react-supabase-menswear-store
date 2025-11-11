# Backend Structure Document

## 1. Backend Architecture

**Overview**
Our backend follows a classic three‐tier architecture, splitting responsibilities into:
- **API Layer (Controllers & Routes):** Handles incoming HTTP requests, delegates work to services, and sends responses.
- **Business Logic Layer (Services):** Implements application rules and workflows (e.g., order processing, inventory checks).
- **Data Access Layer (Models & Repositories):** Interacts with MongoDB via Mongoose models and query helpers.

**Frameworks & Patterns**
- **Node.js & Express:** Lightweight web server for defining RESTful routes and middleware.
- **Mongoose ODM:** Maps JavaScript objects to MongoDB documents and provides schema validation.
- **Dependency Injection (simple service registration):** Promotes testability by decoupling controllers from concrete services.
- **Layered (Onion) Pattern:** Keeps controllers, services, and data access code separate for clarity.

**Scalability, Maintainability & Performance**
- **Stateless Services:** Each server instance can scale horizontally behind a load balancer.
- **Modular Structure:** Clear separation of concerns lets teams work on independent features without merge conflicts.
- **Connection Pooling & Indexing:** Mongoose connection pooling and properly indexed collections ensure fast database operations.
- **Asynchronous I/O:** Nonblocking event loop handles many concurrent requests efficiently.

## 2. Database Management

**Database Technology**
- Type: NoSQL document store
- System: MongoDB (hosted on MongoDB Atlas)

**Data Structure & Access**
- **Collections & Documents:** Data stored as JSON‐like documents in collections (`users`, `products`, `orders`, `categories`).
- **Mongoose Schemas:** Enforce field types, required properties, default values, and indexes at the application layer.
- **Connection Handling:** Single shared Mongoose connection with automatic reconnection and pooling.

**Data Management Practices**
- **Indexing:** Create indexes on frequently queried fields (e.g., `email` in `users`, `slug` in `products`).
- **Validation:** Use schema‐level validation (Mongoose) and request‐level validation (Zod) to prevent bad data.
- **Backups & Snapshots:** Automated daily snapshots on MongoDB Atlas for disaster recovery.

## 3. Database Schema

**Users Collection** (stores customers and admins)
- `id` (ObjectId)
- `email` (string, unique, required)
- `passwordHash` (string, required)
- `role` (string: “customer” or “admin”)
- `createdAt`, `updatedAt` (timestamps)

**Products Collection**
- `id` (ObjectId)
- `title` (string, required)
- `description` (string)
- `price` (number, required)
- `categoryId` (ObjectId, references `categories`)
- `images` (array of URLs)
- `inventoryCount` (number)
- `createdAt`, `updatedAt`

**Categories Collection**
- `id` (ObjectId)
- `name` (string, unique)
- `slug` (string, unique)

**Orders Collection**
- `id` (ObjectId)
- `userId` (ObjectId, references `users`)
- `items` (array of objects: `{ productId, quantity, unitPrice }`)
- `totalAmount` (number)
- `status` (string: “pending”, “paid”, “shipped”, “completed”, “canceled”)
- `createdAt`, `updatedAt`

## 4. API Design and Endpoints

**Approach:** RESTful endpoints under `/api` prefix. JSON request/response bodies.

**Authentication**
- `POST /api/auth/register` → Create new user (customer).
- `POST /api/auth/login` → Validate credentials and return JWT.

**Users**
- `GET /api/users/me` → Fetch logged‐in user profile.

**Products**
- `GET /api/products` → List products (supports paging, filtering by category).
- `GET /api/products/:id` → Get product details.
- **Admin endpoints** (protected):
  - `POST /api/products` → Create new product.
  - `PUT /api/products/:id` → Update product.
  - `DELETE /api/products/:id` → Delete product.

**Categories**
- `GET /api/categories` → List categories.
- **Admin:** `POST`, `PUT`, `DELETE` under `/api/categories`.

**Orders**
- `POST /api/orders` → Place a new order (customer).
- `GET /api/orders` → (Admin) list all orders.
- `GET /api/orders/:id` → (Admin or owner) view order details.
- `PUT /api/orders/:id/status` → (Admin) update order status.

## 5. Hosting Solutions

**Cloud Provider:** AWS (Elastic Container Service on Fargate)
- **Docker Containers:** Each service packaged as a Docker image for consistent deployment.
- **Elastic Load Balancer (ALB):** Distributes traffic across running tasks.
- **MongoDB Atlas:** Managed MongoDB cluster with multi‐region replication.

**Benefits**
- **Reliability:** Automatic container health checks and restarts.
- **Scalability:** Fargate auto‐scales based on CPU/memory.
- **Cost-effectiveness:** Pay only for used compute and storage.

## 6. Infrastructure Components

- **Load Balancer (ALB):** Routes HTTP(S) traffic to healthy containers.
- **Caching (Redis via Elasticache):** Speeds up session storage and hot data (e.g., product catalog).
- **Content Delivery Network (CloudFront):** Delivers UI assets (JavaScript/CSS) close to end users.
- **Object Storage (S3):** Stores product images and static uploads.
- **CI/CD (GitHub Actions):** Automated build, test, and deploy pipelines on each push to `main`.

## 7. Security Measures

- **Authentication & Authorization:**
  - JWT tokens for stateless session management.
  - Role-based access control middleware (checks `admin` role for protected routes).
- **Data Encryption:**
  - HTTPS/TLS for all external traffic.
  - MongoDB Atlas encryption at rest and in transit.
- **HTTP Security Headers:** Helmet middleware sets CSP, XSS protection, HSTS.
- **Input Validation:** Zod schemas on API requests to prevent injection attacks.
- **Rate Limiting & CORS:** Limit repeated requests and restrict origins to trusted domains.

## 8. Monitoring and Maintenance

- **Logging:** Centralized logs in AWS CloudWatch (access and application logs).
- **Error Tracking:** Sentry for capturing exceptions and performance issues.
- **Metrics & Alerts:** Prometheus & Grafana (hosted via managed service) track CPU, memory, request latencies. Alerts on threshold breaches.
- **Database Health:** MongoDB Atlas monitors replica set status and alerts on slow queries.
- **Routine Maintenance:**
  - Regular dependency updates via automated Dependabot.
  - Monthly security audits.
  - Database index reviews and aggregation pipeline optimizations.

## 9. Conclusion and Overall Backend Summary

This backend is built as a robust, scalable, and maintainable Node.js service paired with MongoDB Atlas. Its layered architecture, clear separation of concerns, and modern tooling (Express, Mongoose, Redis cache, AWS Fargate, CloudFront, CI/CD) ensure high performance and reliability. Security practices like JWT-based auth, encryption, input validation, and monitoring tools (CloudWatch, Sentry, Prometheus) protect user data and give real-time insight into system health. This setup aligns perfectly with the goal of powering a professional menswear storefront and an organized admin dashboard, delivering a fast, secure, and developer-friendly backend ready for production.