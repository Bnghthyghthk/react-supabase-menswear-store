import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const handleQuantityChange = (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
    } else {
      updateQuantity(productId, size, color, Math.min(quantity, 10));
    }
  };

  const shipping = 0;
  const tax = getTotalPrice() * 0.08;
  const total = getTotalPrice() + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
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
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Cart Items</h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-6">
                {items.map((item, index) => (
                  <CartItem
                    key={`${item.product._id}-${item.size}-${item.color}-${index}`}
                    item={item}
                    onQuantityChange={(quantity) =>
                      handleQuantityChange(
                        item.product._id,
                        item.size,
                        item.color,
                        quantity
                      )
                    }
                    onRemove={() =>
                      removeItem(item.product._id, item.size, item.color)
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                  <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
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

              <Link
                to="/checkout"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold text-center block transition duration-200"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold text-center block mt-4 transition duration-200"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Free Shipping</h3>
                <p className="text-blue-800 text-sm">
                  Free shipping on all orders! No minimum purchase required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CartItemProps {
  item: any;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  const incrementQuantity = () => {
    onQuantityChange(item.quantity + 1);
  };

  const decrementQuantity = () => {
    onQuantityChange(item.quantity - 1);
  };

  const itemTotal = item.product.price * item.quantity;

  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
      <img
        src={item.product.images[0]}
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded-lg"
      />

      <div className="flex-1">
        <Link
          to={`/product/${item.product._id}`}
          className="text-lg font-semibold hover:text-blue-600 transition duration-200"
        >
          {item.product.name}
        </Link>
        <p className="text-gray-600 text-sm">{item.product.brand}</p>
        <div className="flex items-center space-x-4 mt-2">
          <span className="text-sm text-gray-500">
            Size: <span className="font-medium">{item.size}</span>
          </span>
          <span className="text-sm text-gray-500">
            Color: <span className="font-medium">{item.color}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={decrementQuantity}
          className="p-1 border border-gray-300 rounded hover:bg-gray-50"
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center font-medium">{item.quantity}</span>
        <button
          onClick={incrementQuantity}
          className="p-1 border border-gray-300 rounded hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="text-right">
        <p className="font-semibold">${itemTotal.toFixed(2)}</p>
        <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
      </div>

      <button
        onClick={onRemove}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CartPage;