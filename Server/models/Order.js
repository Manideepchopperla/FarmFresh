import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
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
    min:10,
    max:10
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

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;