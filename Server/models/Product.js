import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    maxlength: 250,
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetable', 'fruit']
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: val => val.startsWith('http'),
      message: 'Image must be a valid URL'
    }
  }
}, {
  timestamps: true
});

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;