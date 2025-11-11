import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product, ProductFilters } from '../types';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, Star, Filter, Search } from 'lucide-react';

const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);

  const [filters, setFilters] = useState<ProductFilters>({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12,
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    featured: searchParams.get('featured') === 'true',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
  });

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params.set(k, String(v));
      }
    });
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    updateFilter('page', page);
  };

  const handleAddToCart = (product: Product) => {
    if (product.sizes.length > 0 && product.colors.length > 0) {
      addItem(product, 1, product.sizes[0], product.colors[0]);
    }
  };

  const categories = productService.getCategories();
  const brands = productService.getBrands();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 mr-2" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Category</h3>
                <select
                  value={filters.category || ''}
                  onChange={(e) => updateFilter('category', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Brand</h3>
                <select
                  value={filters.brand || ''}
                  onChange={(e) => updateFilter('brand', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Sort By</h3>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    updateFilter('sortBy', sortBy);
                    updateFilter('sortOrder', sortOrder);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
              </div>

              {/* Featured Filter */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured || false}
                    onChange={(e) => updateFilter('featured', e.target.checked || undefined)}
                    className="mr-2"
                  />
                  <span className="font-medium">Featured Products Only</span>
                </label>
              </div>

              <button
                onClick={() => {
                  setFilters({ page: 1, limit: 12 });
                  setSearchParams({});
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Products</h1>
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                Error loading products. Please try again.
              </div>
            ) : data?.data?.items.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-12 rounded-lg text-center">
                <p className="text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.data?.items.map((product: Product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {data?.data?.pagination && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(Math.max(1, filters.page! - 1))}
                        disabled={!data.data.pagination.hasPrevPage}
                        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2">
                        Page {data.data.pagination.currentPage} of {data.data.pagination.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(filters.page! + 1)}
                        disabled={!data.data.pagination.hasNextPage}
                        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 transition duration-200">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.numReviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={onAddToCart}
            disabled={!product.inStock}
            className={`p-2 rounded-lg ${
              product.inStock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition duration-200`}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
        {!product.inStock && (
          <p className="text-red-600 text-sm mt-2">Out of Stock</p>
        )}
        <div className="mt-2 text-sm text-gray-500">
          Stock: {product.stock} items
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;