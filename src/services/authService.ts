import api from './api';
import { ApiResponse, AuthResponse, RegisterData, LoginData, User } from '../types';

export const authService = {
  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async login(credentials: LoginData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
};