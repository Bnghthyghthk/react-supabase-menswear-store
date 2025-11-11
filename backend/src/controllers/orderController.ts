import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { IAuthRequest } from '../types';

export const createOrder = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`
        });
        return;
      }
    }

    const calculatedTotal = orderItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    if (Math.abs(calculatedTotal - totalPrice) > 0.01) {
      res.status(400).json({
        success: false,
        message: 'Total price mismatch'
      });
      return;
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      status: 'pending'
    });

    await order.save();

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating order'
    });
  }
};

export const getOrders = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { status } = req.query;

    const filter: any = {};

    if (req.user?.role !== 'admin') {
      filter.user = req.user?._id;
    }

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders: total,
          ordersPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching orders'
    });
  }
};

export const getOrderById = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    if (req.user?.role !== 'admin' && order.user._id.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        order
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching order'
    });
  }
};

export const updateOrderStatus = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
      return;
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    if (status === 'paid' && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
    }

    if (status === 'delivered' && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    if (status === 'cancelled' && order.isPaid) {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } }
        );
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating order status'
    });
  }
};

export const updatePaymentResult = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentResult } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    order.paymentResult = paymentResult;
    order.status = 'paid';
    order.isPaid = true;
    order.paidAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment result updated successfully',
      data: {
        order
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating payment result'
    });
  }
};

export const getOrderStats = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ isPaid: true });
    const deliveredOrders = await Order.countDocuments({ isDelivered: true });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        paidOrders,
        deliveredOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching order statistics'
    });
  }
};