import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();


const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI); // || 'mongodb://localhost:27017/agrofix'
  }

export default connectDB;
