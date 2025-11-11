import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';
import { validateProduct } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Protected admin routes
router.post('/', authenticate, authorize('admin'), validateProduct, createProduct);
router.put('/:id', authenticate, authorize('admin'), validateProduct, updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default router;