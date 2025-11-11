import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../store/cartStore';
import { orderService } from '../services/orderService';
import { ShippingAddress, OrderFormData } from '../types';
import { ArrowLeft, CreditCard, Truck, Shield, Check } from 'lucide-react';

const shippingAddressSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
});

type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'stripe'>('credit_card');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema),
  });

  const subtotal = getTotalPrice();
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const createOrderMutation = useMutation({
    mutationFn: (orderData: OrderFormData) => orderService.createOrder(orderData),
    onSuccess: () => {
      clearCart();
      navigate('/order-success');
    },
    onError: (error: any) => {
      console.error('Order creation failed:', error);
    },
  });

  const handleShippingSubmit = (data: ShippingAddressFormData) => {
    setShippingAddress(data);
    setCurrentStep(2);
  };

  const handlePlaceOrder = () => {
    if (shippingAddress && items.length > 0) {
      const orderData: OrderFormData = {
        orderItems: items,
        shippingAddress,
        paymentMethod,
      };

      createOrderMutation.mutate(orderData);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className={`ml-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-600'}`}>
                Shipping
              </span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <span className={`ml-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-600'}`}>
                Payment
              </span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                3
              </div>
              <span className={`ml-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-600'}`}>
                Review
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <form onSubmit={handleSubmit(handleShippingSubmit)}>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        {...register('firstName')}
                        type="text"
                        className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.firstName ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        {...register('lastName')}
                        type="text"
                        className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.lastName ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      {...register('address')}
                      type="text"
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.address ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        {...register('city')}
                        type="text"
                        className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.city ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        {...register('postalCode')}
                        type="text"
                        className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.postalCode ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      {...register('country')}
                      type="text"
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.country ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition duration-200"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-4"
                    />
                    <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Credit Card</p>
                      <p className="text-sm text-gray-600">Pay with Visa, Mastercard, or American Express</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-4"
                    />
                    <div className="h-6 w-6 mr-3 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">P</span>
                    </div>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-gray-600">Fast and secure payment with PayPal</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-4"
                    />
                    <div className="h-6 w-6 mr-3 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">S</span>
                    </div>
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-gray-600">Secure payment powered by Stripe</p>
                    </div>
                  </label>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold transition duration-200"
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition duration-200"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && shippingAddress && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Order Review</h2>

                <div className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>
                        {shippingAddress.firstName} {shippingAddress.lastName}
                      </p>
                      <p>{shippingAddress.address}</p>
                      <p>
                        {shippingAddress.city}, {shippingAddress.postalCode}
                      </p>
                      <p>{shippingAddress.country}</p>
                      <p>{shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="capitalize">
                        {paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium mb-2">Order Items ({items.length})</h3>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b">
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-600">
                              Size: {item.size}, Color: {item.color} × {item.quantity}
                            </p>
                          </div>
                          <span className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold transition duration-200"
                  >
                    Back to Payment
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={createOrderMutation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createOrderMutation.isPending ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Truck className="h-4 w-4 text-green-600 mr-2" />
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 text-green-600 mr-2" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;