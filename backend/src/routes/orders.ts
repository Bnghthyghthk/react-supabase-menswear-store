import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentResult,
  getOrderStats
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';
import { validateOrder } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.post('/', validateOrder, createOrder);
router.get('/', getOrders);
router.get('/stats', authorize('admin'), getOrderStats);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('admin'), updateOrderStatus);
router.put('/:id/payment', updatePaymentResult);

export default router;