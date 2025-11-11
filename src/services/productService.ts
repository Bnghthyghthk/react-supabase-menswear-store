import api from './api';
import { ApiResponse, PaginatedResponse, Product, ProductFilters, SearchParams } from '../types';

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get(`/products?${params.toString()}`);

    return {
      success: response.data.success,
      data: {
        items: response.data.data.products,
        pagination: response.data.data.pagination
      }
    };
  },

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getFeaturedProducts(limit: number = 8): Promise<ApiResponse<Product[]>> {
    const response = await api.get(`/products/featured?limit=${limit}`);
    return response.data;
  },

  async searchProducts(params: SearchParams): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await api.get(`/products/search?${searchParams.toString()}`);

    return {
      success: response.data.success,
      data: {
        items: response.data.data.products,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: response.data.data.total
        }
      }
    };
  },

  async createProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'inStock'>): Promise<ApiResponse<Product>> {
    const response = await api.post('/products', productData);
    return response.data;
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getCategories(): string[] {
    return ['shirts', 'pants', 'jackets', 'shoes', 'accessories', 'suits', 'sportswear', 'underwear'];
  },

  getBrands(): string[] {
    return ['Premium Style', 'Executive Wear', 'Italian Leather', 'Urban Style', 'Basic Essentials', 'Winter Comfort', 'Urban Sports'];
  }
};