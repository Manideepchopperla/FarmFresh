import express from 'express';
import Order from "../models/Order.js";
import Product from '../models/Product.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const generateUniqueOrderId = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

// Route to create a Stripe checkout session
router.post("/checkout", authenticateToken, async (req, res) => {
    try {
        const { products, deliveryDetails } = req.body;
        const userId = req.user.id;

        if (!products || !deliveryDetails || products.length === 0) {
            return res.status(400).json({ message: "Missing products or delivery details." });
        }

        const lineItems = products.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.product.name,
                    images: item.product.image ? [item.product.image] : [],
                },
                unit_amount: Math.round(item.product.price * 100),
            },
            quantity: item.quantity,
        }));
        
        const minimalCart = products.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/order`,
            metadata: {
                userId,
                cart: JSON.stringify(minimalCart),
                deliveryDetails: JSON.stringify(deliveryDetails),
            }
        });

        res.json({ id: session.id });

    } catch (error) {
        console.error("Stripe checkout error:", error);
        res.status(500).json({ message: "Failed to create checkout session." });
    }
});

// Route to create the order in the database AFTER a successful payment
router.post('/create-order-from-session', authenticateToken, async (req, res) => {
    try {
        const { sessionId } = req.body;
        
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const metadata = session.metadata;
            const minimalCart = JSON.parse(metadata.cart);
            const deliveryDetails = JSON.parse(metadata.deliveryDetails);
            const userId = metadata.userId;

            if (req.user.id !== userId) {
                return res.status(403).json({ message: 'User does not match the one who paid.' });
            }

            const productIds = minimalCart.map(item => item.productId);
            const productsFromDB = await Product.find({ '_id': { $in: productIds } });

            const productMap = productsFromDB.reduce((map, product) => {
                map[product._id.toString()] = product;
                return map;
            }, {});

            const fullCartItems = minimalCart.map(item => {
                const product = productMap[item.productId];
                if (!product) throw new Error(`Product with ID ${item.productId} not found.`);
                return {
                    product: product.toObject(),
                    quantity: item.quantity,
                };
            });

            const ordersByAdmin = fullCartItems.reduce((acc, item) => {
                const adminId = item.product.user.toString();
                if (!acc[adminId]) acc[adminId] = [];
                acc[adminId].push(item);
                return acc;
            }, {});

            const createdOrders = [];
            for (const [adminId, adminItems] of Object.entries(ordersByAdmin)) {
                
                // --- IDEMPOTENCY FIX ---
                // Instead of just creating an order, we use findOneAndUpdate with upsert.
                // This is an atomic operation that will find an order with the given session ID.
                // If it finds one, it does nothing. If it doesn't, it creates the order.
                // This makes it safe to call this endpoint multiple times for the same session.
                
                const totalAmount = adminItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

                const orderPayload = {
                    customerName: deliveryDetails.fullName,
                    contactNumber: deliveryDetails.phone,
                    deliveryAddress: deliveryDetails.address,
                    items: adminItems.map(i => ({
                        productId: i.product._id,
                        adminId: i.product.user,
                        quantity: i.quantity,
                        price: i.product.price,
                    })),
                    totalAmount,
                    status: 'pending',
                    orderId: generateUniqueOrderId(),
                    user: userId,
                    admin: adminId,
                    stripeSessionId: sessionId,
                };

                const order = await Order.findOneAndUpdate(
                    { stripeSessionId: sessionId, admin: adminId }, // Query: find an order for this session AND this admin
                    { $setOnInsert: orderPayload }, // Data to insert ONLY if a new document is created
                    { new: true, upsert: true, runValidators: true } // Options: return the new doc, create if not found, run schema validation
                );
                createdOrders.push(order);
            }
            
            res.status(201).json(createdOrders);
        } else {
            res.status(400).json({ message: 'Payment not successful.' });
        }
    } catch (error) {
        console.error("Error creating order from session:", error);
        res.status(500).json({ message: "Could not create order from session." });
    }
});

// Get all orders (for an admin)
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

// Get logged-in user's own orders
router.get('/my-orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.productId', 'name image price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific order by its ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id }).populate('items.productId');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Access control check
        if (order.user.toString() !== req.user.id && order.admin.toString() !== req.user.id) {
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
            { orderId: req.params.id, admin: req.user.id },
            { status },
            { new: true }
        ).populate('items.productId');
        if (!order) return res.status(404).json({ message: 'Order not found or you do not have permission to update it' });
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
