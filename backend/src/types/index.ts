import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  featured: boolean;
  rating: number;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: IPaymentResult;
  totalPrice: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  image: string;
  size: string;
  color: string;
}

export interface IShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface IPaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface IAuthRequest extends Request {
  user?: IUser;
}

export interface IRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  featured?: boolean;
}