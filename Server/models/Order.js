import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  /**
   * ADDED: This top-level 'admin' field is crucial.
   * It assigns the entire order document to a specific admin (seller),
   * which fixes both the query for fetching admin-specific orders and
   * the logic for preventing duplicate orders.
   */
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10,}$/, 'Enter a valid contact number'],
  },
  deliveryAddress: {
    type: String,
    required: true,
    trim: true
  },
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  stripeSessionId: {
    type: String,
    required: true,
    // Note: A unique index on stripeSessionId alone is not correct if one session
    // can create multiple orders (one per admin). The idempotency logic in the
    // router now handles this correctly by checking both session and admin ID.
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    adminId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
        type: Number,
        required: true,
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'delivered'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Create a compound index to ensure a session ID is unique PER ADMIN.
// This is a robust database-level guarantee against duplicate orders.
orderSchema.index({ stripeSessionId: 1, admin: 1 }, { unique: true });

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;
