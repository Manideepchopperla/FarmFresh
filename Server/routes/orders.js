import express from 'express';
import Order from "../models/Order.js"
import Product from '../models/Product.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create new order (buyers)
const generateUniqueOrderId = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

router.post('/', authenticateToken, async (req, res) => {
  const { customerName, contactNumber, deliveryAddress, items, orderId } = req.body;

  // Group items by adminId
  const ordersByAdmin = items.reduce((acc, item) => {
    const key = item.adminId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  try {
    const createdOrders = [];

    for (const [adminId, adminItems] of Object.entries(ordersByAdmin)) {
      const totalAmount = adminItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const order = new Order({
        customerName,
        contactNumber,
        deliveryAddress,
        items: adminItems,
        totalAmount,
        status: 'pending',
        orderId: generateUniqueOrderId(), 
        user: req.user.id,
        admin: adminId
      });

      const savedOrder = await order.save();
      const populatedOrder = await savedOrder.populate('items.productId');
      createdOrders.push(populatedOrder);
    }

    res.status(201).json(createdOrders);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});


// Get all orders (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({items: {$elemMatch: {adminId: req.user.id}}})
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get logged-in user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific order by ID (buyer or admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({orderId: req.params.id}).populate('items.productId');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Access control
    if (order.user?.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      {orderId: req.params.id},
      { status },
      { new: true }
    ).populate('items.productId');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/checkout", authenticateToken, async (req, res) => {
  const { products } = req.body; 

  const lineItems = products.map(item => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.product.name,
        images: [item.product.image],
      },
      unit_amount: item.product.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    // success_url: `/success`,
    // cancel_url: `${process.env.CLIENT_URL}/cancel`,
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
  });

  res.json({ id: session.id });

})

export default router;
