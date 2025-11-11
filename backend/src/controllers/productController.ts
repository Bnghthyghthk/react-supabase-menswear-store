import { Request, Response } from 'express';
import Product from '../models/Product';
import { IAuthRequest, IProductData } from '../types';

export const createProduct = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const productData: IProductData = req.body;

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating product'
    });
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const {
      category,
      brand,
      minPrice,
      maxPrice,
      featured,
      sortBy,
      sortOrder
    } = req.query;

    const filter: any = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
    }

    const sortOptions: any = {};
    const sortField = sortBy as string || 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;
    sortOptions[sortField] = order;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          productsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching products'
    });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        product
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching product'
    });
  }
};

export const updateProduct = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const productData: Partial<IProductData> = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    Object.assign(product, productData);
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating product'
    });
  }
};

export const deleteProduct = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    await Product.deleteOne({ _id: product._id });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting product'
    });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 8;

    const products = await Product.find({ featured: true })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        products
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching featured products'
    });
  }
};

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q: query, category, brand } = req.query;

    if (!query && !category && !brand) {
      res.status(400).json({
        success: false,
        message: 'At least one search parameter is required'
      });
      return;
    }

    const searchFilter: any = {};

    if (query) {
      searchFilter.$text = { $search: query as string };
    }

    if (category) {
      searchFilter.category = category;
    }

    if (brand) {
      searchFilter.brand = brand;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find(searchFilter, { score: { $meta: 'textScore' } })
      .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(searchFilter);

    res.status(200).json({
      success: true,
      data: {
        products,
        total,
        query,
        category,
        brand
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while searching products'
    });
  }
};