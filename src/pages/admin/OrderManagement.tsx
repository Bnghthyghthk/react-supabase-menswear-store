import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import {
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Truck
} from 'lucide-react';

const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-orders', currentPage, selectedStatus],
    queryFn: () => orderService.getOrders(currentPage, 10, selectedStatus || undefined),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const handleStatusUpdate = (id: string, status: Order['status']) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredOrders = data?.data?.items?.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const statusOptions: Order['status'][] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Total Orders: {data?.data?.pagination?.totalOrders || 0}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 inline-flex items-center"
          >
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error loading orders</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <OrderRow
                      key={order._id}
                      order={order}
                      onStatusUpdate={handleStatusUpdate}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="p-8 text-center">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No orders found</p>
              </div>
            )}

            {/* Pagination */}
            {data?.data?.pagination && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {((data.data.pagination.currentPage - 1) * 10) + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(data.data.pagination.currentPage * 10, data.data.pagination.totalOrders || 0)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{data.data.pagination.totalOrders}</span>{' '}
                  orders
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={!data.data.pagination.hasPrevPage}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <span className="px-4 py-1 text-sm">
                    Page {data.data.pagination.currentPage} of {data.data.pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!data.data.pagination.hasNextPage}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface OrderRowProps {
  order: Order;
  onStatusUpdate: (id: string, status: Order['status']) => void;
  getStatusIcon: (status: Order['status']) => React.ReactNode;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, onStatusUpdate, getStatusIcon }) => {
  const [showActions, setShowActions] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusOptions: Order['status'][] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {order.orderNumber || `ORD-${order._id.slice(-8).toUpperCase()}`}
          </div>
          <div className="text-sm text-gray-500">
            {order.orderItems.length} items
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
        </div>
        <div className="text-sm text-gray-500">
          {order.shippingAddress.email || 'N/A'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${order.totalPrice.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
            {order.status}
          </span>
          {getStatusIcon(order.status)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="text-gray-400 hover:text-gray-600"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>

        {showActions && (
          <div className="absolute right-6 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="py-1">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 inline-flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </button>
              <button
                onClick={() => {
                  setShowActions(false);
                  setShowStatusUpdate(true);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Update Status
              </button>
            </div>
          </div>
        )}

        {showStatusUpdate && (
          <div className="absolute right-6 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Update Status</h4>
              <select
                value={order.status}
                onChange={(e) => {
                  onStatusUpdate(order._id, e.target.value as Order['status']);
                  setShowStatusUpdate(false);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};

export default OrderManagement;