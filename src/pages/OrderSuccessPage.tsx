import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your order. We've received your order and will begin processing it right away.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">#ORD-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">Credit Card</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-blue-600">Processing</span>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-gray-600 text-sm">You'll receive an order confirmation email shortly.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Order Processing</p>
                    <p className="text-gray-600 text-sm">We'll process your order within 1-2 business days.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Shipping</p>
                    <p className="text-gray-600 text-sm">Your order will be shipped and you'll receive tracking information.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center transition duration-200"
              >
                <Package className="mr-2 h-5 w-5" />
                Continue Shopping
              </Link>
              <button
                onClick={() => navigate('/orders')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center transition duration-200"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                View My Orders
              </button>
            </div>

            {/* Customer Support */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-medium mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                If you have any questions about your order, please don't hesitate to contact our customer support.
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="mailto:support@menswear.com"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  support@menswear.com
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="tel:1-800-123-4567"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  1-800-123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;