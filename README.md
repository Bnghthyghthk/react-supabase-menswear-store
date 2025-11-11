# Men's Wear E-Commerce Store

A full-stack e-commerce application for men's clothing built with React, Node.js, and MongoDB.

## 🚀 Features

### Customer Experience
- **Product Catalog**: Browse and search through a comprehensive collection of men's fashion
- **Product Details**: View detailed product information with image galleries
- **Shopping Cart**: Add, remove, and update quantities of items
- **Multi-step Checkout**: Secure and streamlined checkout process
- **Order Management**: Track orders and view order history
- **User Authentication**: Register, login, and manage account
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Admin Dashboard
- **Dashboard Overview**: Real-time analytics and sales metrics
- **Product Management**: Full CRUD operations for products
- **Order Management**: View, update, and manage customer orders
- **User Management**: Manage customer accounts
- **Sales Analytics**: Comprehensive charts and reports
- **Inventory Management**: Track stock levels and low-stock alerts

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **TanStack Query** for server state management
- **Zustand** for client-side state management
- **Tailwind CSS** for styling
- **React Hook Form** with Zod for form validation
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript**
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Rate Limiting** for API protection

## 📁 Project Structure

```
menswear-store/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── config/            # Database and server configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── types/             # TypeScript definitions
│   │   ├── utils/             # Utility functions
│   │   └── server.ts          # Main server file
│   ├── package.json
│   └── tsconfig.json
├── src/                       # React frontend
│   ├── components/            # Reusable UI components
│   ├── contexts/              # React contexts
│   ├── pages/                 # Page components
│   │   ├── admin/             # Admin-specific pages
│   ├── services/              # API service layer
│   ├── store/                 # State management
│   ├── types/                 # TypeScript types
│   └── App.tsx                # Main app component
├── public/                    # Static assets
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd menswear-store
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ..
   npm install
   ```

4. **Environment Setup**

   Backend (backend/.env):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

5. **Seed the database (optional)**
   ```bash
   cd backend
   npm run seed
   ```
   This will create sample products and an admin user.

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend application**
   ```bash
   cd ..
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:5173/admin

## 👥 Default Admin User

When you run the seed script, an admin user is created:
- **Email**: admin@menswear.com
- **Password**: admin123

## 📊 Admin Dashboard Features

The admin dashboard includes:
- Revenue tracking and sales metrics
- Order statistics and management
- Product performance analytics
- Customer management
- Interactive charts and graphs
- Inventory management with low-stock alerts
- Real-time order status updates

## Tech Stack

- **Framework:** [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- **Database:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Data Management:** [TanStack Query](https://tanstack.com/query)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Validation:** [Zod](https://zod.dev/)

## Prerequisites

Before you begin, ensure you have the following:

- Node.js 18+ installed
- A [Supabase](https://supabase.com/) account for database
- Generated project documents from [CodeGuide](https://codeguide.dev/) for best development experience

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd codeguide-vite-supabase
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Variables Setup**

   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in the environment variables in `.env` (see Configuration section below)

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.**

## Configuration

### Supabase Setup

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Go to Project Settings > API
4. Copy the `Project URL` as `VITE_SUPABASE_URL`
5. Copy the `anon` public key as `VITE_SUPABASE_ANON_KEY`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features

- 📦 Supabase Database Integration
- 🎨 Modern UI with Tailwind CSS and Radix UI
- 🚀 Fast Development with Vite
- 🔄 Data Fetching with TanStack Query
- 📱 Responsive Design
- 🎭 Beautiful Animations with Framer Motion
- 📝 Type-Safe Forms with React Hook Form and Zod

## Project Structure

```
codeguide-vite-supabase/
├── src/                # Source files
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   ├── hooks/        # Custom hooks
│   └── types/        # TypeScript types
├── public/            # Static assets
└── documentation/     # Generated documentation from CodeGuide
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Documentation Setup

To implement the generated documentation from CodeGuide:

1. Create a `documentation` folder in the root directory:

   ```bash
   mkdir documentation
   ```

2. Place all generated markdown files from CodeGuide in this directory:

   ```bash
   # Example structure
   documentation/
   ├── project_requirements_document.md
   ├── app_flow_document.md
   ├── frontend_guideline_document.md
   └── backend_structure_document.md
   ```

3. These documentation files will be automatically tracked by git and can be used as a reference for your project's features and implementation details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
