import express from 'express';
import ProductModel from '../models/Product.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new product (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { name, price, description, category, image } = req.body;

  try {
    const newProduct = new ProductModel({ name, price, description, category, image,user: req.user.id });
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get logged-in admin's products
router.get('/my-products', authenticateToken, isAdmin, async (req, res) => {
  try {
    const products = await ProductModel.find({ user: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { name, price, description, category, image } = req.body;

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { name, price, description, category, image },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
