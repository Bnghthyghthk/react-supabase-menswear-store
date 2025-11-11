import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Search
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const location = useLocation();

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productService.getProducts({ limit: 5 }),
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: () => orderService.getOrders(1, 5),
  });

  const { data: orderStats, isLoading: statsLoading } = useQuery({
    queryKey: ['order-stats'],
    queryFn: () => orderService.getOrderStats(),
  });

  // Mock data for charts
  const salesData = [
    { name: 'Mon', sales: 4000, orders: 24 },
    { name: 'Tue', sales: 3000, orders: 18 },
    { name: 'Wed', sales: 5000, orders: 30 },
    { name: 'Thu', sales: 2780, orders: 16 },
    { name: 'Fri', sales: 6890, orders: 41 },
    { name: 'Sat', sales: 7390, orders: 44 },
    { name: 'Sun', sales: 5490, orders: 33 },
  ];

  const categoryData = [
    { name: 'Shirts', value: 35, color: '#3B82F6' },
    { name: 'Pants', value: 25, color: '#10B981' },
    { name: 'Jackets', value: 20, color: '#F59E0B' },
    { name: 'Shoes', value: 15, color: '#EF4444' },
    { name: 'Accessories', value: 5, color: '#8B5CF6' },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${orderStats?.data?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: orderStats?.data?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Total Products',
      value: 150,
      icon: Package,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Users',
      value: 1245,
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
  ];

  if (location.pathname === '/admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <nav className="mt-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3B82F6" name="Sales ($)" />
                  <Line type="monotone" dataKey="orders" stroke="#10B981" name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders and Low Stock Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Orders</h3>
                <Link
                  to="/admin/orders"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {ordersLoading ? (
                  <div className="animate-pulse space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : orders?.data?.items?.length > 0 ? (
                  orders.data.items.slice(0, 3).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-gray-600">
                          {order.orderItems.length} items • ${order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No recent orders</p>
                )}
              </div>
            </div>

            {/* Low Stock Products */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Low Stock Products</h3>
                <Link
                  to="/admin/products?filter=lowstock"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {productsLoading ? (
                  <div className="animate-pulse space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : products?.data?.items?.filter(p => p.stock < 10).length > 0 ? (
                  products.data.items
                    .filter(p => p.stock < 10)
                    .slice(0, 3)
                    .map((product) => (
                      <div key={product._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.brand}</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          {product.stock} left
                        </span>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500">No products with low stock</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition duration-200 ${
                location.pathname.startsWith(item.path)
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/products/*" element={<div>Products Management Coming Soon</div>} />
          <Route path="/orders/*" element={<div>Order Management Coming Soon</div>} />
          <Route path="/users/*" element={<div>User Management Coming Soon</div>} />
          <Route path="/analytics/*" element={<div>Analytics Coming Soon</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;