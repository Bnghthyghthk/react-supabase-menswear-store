import api from './api';
import { ApiResponse, PaginatedResponse, Order, OrderFormData, CartItem } from '../types';

export const orderService = {
  async createOrder(orderData: OrderFormData): Promise<ApiResponse<Order>> {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async getOrders(page: number = 1, limit: number = 10, status?: string): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (status) {
      params.append('status', status);
    }

    const response = await api.get(`/orders?${params.toString()}`);

    return {
      success: response.data.success,
      data: {
        items: response.data.data.orders,
        pagination: response.data.data.pagination
      }
    };
  },

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<ApiResponse<Order>> {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  async updatePaymentResult(id: string, paymentResult: any): Promise<ApiResponse<Order>> {
    const response = await api.put(`/orders/${id}/payment`, { paymentResult });
    return response.data;
  },

  async getOrderStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/orders/stats');
    return response.data;
  },

  calculateOrderTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },

  validateOrderItems(items: CartItem[]): boolean {
    if (!items || items.length === 0) return false;

    return items.every(item =>
      item.product &&
      item.quantity > 0 &&
      item.size &&
      item.color &&
      item.product.stock >= item.quantity
    );
  },

  getOrderStatusColor(status: Order['status']): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  },

  getOrderStatusText(status: Order['status']): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'paid': return 'Paid';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }
};