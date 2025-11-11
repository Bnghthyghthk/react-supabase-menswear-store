import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, Star, Heart, Share2, ArrowLeft, Plus, Minus } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id!),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product?.data && selectedSize && selectedColor) {
      addItem(product.data, quantity, selectedSize, selectedColor);
    }
  };

  const incrementQuantity = () => {
    if (product?.data) {
      setQuantity(Math.min(quantity + 1, product.data.stock));
    }
  };

  const decrementQuantity = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div>
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-32 bg-gray-300 rounded mb-4"></div>
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product?.data) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const productData = product.data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center mb-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/products" className="text-gray-600 hover:text-blue-600">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{productData.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={productData.images[selectedImage]}
                alt={productData.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productData.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{productData.name}</h1>
              <p className="text-lg text-gray-600">{productData.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(productData.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">{productData.rating} out of 5</span>
              <span className="text-gray-500">({productData.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-gray-900">${productData.price.toFixed(2)}</span>
              {!productData.inStock && (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{productData.description}</p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {productData.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!productData.inStock}
                    className={`py-2 px-4 border-2 rounded-lg font-medium transition duration-200 ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${!productData.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {productData.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    disabled={!productData.inStock}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition duration-200 ${
                      selectedColor === color
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${!productData.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    disabled={!productData.inStock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={!productData.inStock || quantity >= productData.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {productData.stock} items available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!productData.inStock || !selectedSize || !selectedColor}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center transition duration-200 ${
                  productData.inStock && selectedSize && selectedColor
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="ml-2 text-gray-600">{productData.category}</span>
                </div>
                <div>
                  <span className="font-medium">Brand:</span>
                  <span className="ml-2 text-gray-600">{productData.brand}</span>
                </div>
                <div>
                  <span className="font-medium">Stock:</span>
                  <span className="ml-2 text-gray-600">{productData.stock} items</span>
                </div>
                <div>
                  <span className="font-medium">SKU:</span>
                  <span className="ml-2 text-gray-600">{productData._id.slice(-8).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;