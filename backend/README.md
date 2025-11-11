# Men's Wear Store - Backend API

A comprehensive e-commerce backend API for a men's clothing store built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Product Management**: Full CRUD operations for products with advanced filtering and search
- **Order Management**: Complete order processing system with status tracking
- **Admin Dashboard**: Admin routes for managing users, products, and orders
- **Security**: Rate limiting, CORS, helmet security headers, input validation
- **Data Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts       # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.ts # Authentication controllers
│   │   ├── productController.ts # Product controllers
│   │   └── orderController.ts   # Order controllers
│   ├── middleware/
│   │   ├── auth.ts           # Authentication middleware
│   │   ├── errorHandler.ts   # Error handling middleware
│   │   └── validation.ts     # Input validation middleware
│   ├── models/
│   │   ├── User.ts           # User model
│   │   ├── Product.ts        # Product model
│   │   └── Order.ts          # Order model
│   ├── routes/
│   │   ├── auth.ts           # Authentication routes
│   │   ├── products.ts       # Product routes
│   │   ├── orders.ts         # Order routes
│   │   └── admin.ts          # Admin routes
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── utils/
│   │   └── logger.ts         # Logger utility
│   ├── server.ts             # Main server file
│   └── seed.ts               # Database seeding script
├── .env                      # Environment variables
├── tsconfig.json             # TypeScript configuration
├── nodemon.json              # Nodemon configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🛠️ Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Copy `.env.example` to `.env` and update the following variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d

   # CORS Configuration
   FRONTEND_URL=http://localhost:5173

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Database Setup:**
   - Make sure MongoDB is running or use MongoDB Atlas
   - Update the `MONGODB_URI` in your `.env` file

4. **Seed Database (Optional):**
   ```bash
   npm run seed
   ```
   This will create:
   - An admin user: `admin@menswear.com` / `admin123`
   - Sample products for testing

## 🚀 Running the Server

### Development Mode:
```bash
npm run dev
```

### Production Mode:
```bash
npm run build
npm start
```

## 📚 API Documentation

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Product Routes (`/api/products`)

- `GET /api/products` - Get all products (with filtering & pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Order Routes (`/api/orders`)

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders (Admin gets all orders)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `PUT /api/orders/:id/payment` - Update payment result
- `GET /api/orders/stats` - Get order statistics (Admin only)

### Admin Routes (`/api/admin`)

- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. Login using `/api/auth/login` to get a token
2. Include the token in the Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## 📋 Data Models

### User Model
```typescript
{
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone?: string,
  role: 'user' | 'admin'
}
```

### Product Model
```typescript
{
  name: string,
  description: string,
  price: number,
  category: 'shirts' | 'pants' | 'jackets' | 'shoes' | 'accessories' | 'suits' | 'sportswear' | 'underwear',
  brand: string,
  sizes: string[],
  colors: string[],
  images: string[],
  stock: number,
  featured?: boolean,
  rating: number,
  numReviews: number
}
```

### Order Model
```typescript
{
  user: ObjectId,
  orderItems: [{
    product: ObjectId,
    name: string,
    quantity: number,
    price: number,
    image: string,
    size: string,
    color: string
  }],
  shippingAddress: {
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    postalCode: string,
    country: string,
    phone: string
  },
  paymentMethod: 'credit_card' | 'paypal' | 'stripe',
  totalPrice: number,
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  isPaid: boolean,
  isDelivered: boolean
}
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse and brute force attacks
- **CORS**: Cross-Origin Resource Sharing protection
- **Helmet**: Security headers protection
- **Input Validation**: Comprehensive input sanitization and validation
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access Control**: Different access levels for users and admins

## 🧪 Testing

The API includes comprehensive validation and error handling. Test endpoints using tools like Postman, Insomnia, or curl.

### Example Requests:

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Products:**
```bash
curl -X GET http://localhost:5000/api/products
```

## 📦 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run seed:destroy` - Clear all data from database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.