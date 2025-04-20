import connectDB from './src/config/database.js';
import ProductModel from './src/models/Product.js';

const products = [
    {
      user: '680393cecf84c605f19c651c',
      name: 'Fresh Broccoli',
      price: 45,
      description: 'Organic green broccoli, rich in vitamins and antioxidants.',
      category: 'vegetable',
      image: 'https://images.unsplash.com/photo-1742970520195-bcf1261033eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RnJlc2glMjBCcm9jY29saXxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      user: '680393cecf84c605f19c651c',
      name: 'Red Apples',
      price: 80,
      description: 'Crisp and juicy red apples, straight from the orchard.',
      category: 'fruit',
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce'
    },
    {
      user: '680393cecf84c605f19c651c',
      name: 'Carrots Bunch',
      price: 35,
      description: 'Fresh carrots with green tops, perfect for salads and cooking.',
      category: 'vegetable',
      image: 'https://images.unsplash.com/photo-1582515073490-39981397c445'
    },
    {
      user: '680393cecf84c605f19c651c',
      name: 'Sweet Bananas',
      price: 60,
      description: 'Naturally sweet bananas, great for snacking and smoothies.',
      category: 'fruit',
      image: 'https://plus.unsplash.com/premium_photo-1675731118330-08c71253af17?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFuYW5hfGVufDB8fDB8fHww'
    },
    {
      user: '680393cecf84c605f19c651c',
      name: 'Green Spinach',
      price: 25,
      description: 'Leafy spinach, freshly harvested and ready to cook.',
      category: 'vegetable',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      user: '680393cecf84c605f19c651c',
      name: 'Juicy Oranges',
      price: 90,
      description: 'Citrusy oranges packed with vitamin C and flavor.',
      category: 'fruit',
      image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3Jhbmdlc3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      user: '680393cecf84c605f19c651c',
      name: 'Purple Eggplant',
      price: 40,
      description: 'Glossy eggplants ideal for grilling and stir-frying.',
      category: 'vegetable',
      image: 'https://images.unsplash.com/photo-1659260180173-8d58b38648f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVycGxlJTIwZWdncGxhbnR8ZW58MHx8MHx8fDA%3D'
    },
    {
      user: '680393cecf84c605f19c651c',
      name: 'Fresh Strawberries',
      price: 120,
      description: 'Bright red strawberries bursting with sweetness.',
      category: 'fruit',
      image: 'https://images.unsplash.com/photo-1714386046239-789bd0bd2cb2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3RyYXclMjBiZXJyaWVzfGVufDB8fDB8fHww'
    },
    {
      user: '680393cecf84c605f19c651c',
      name: 'Green Capsicum',
      price: 30,
      description: 'Crunchy capsicum perfect for salads and sautéing.',
      category: 'vegetable',
      image: 'https://images.unsplash.com/photo-1632992468737-54880593aada?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2Fwc2ljdW18ZW58MHx8MHx8fDA%3D'
    },
    {
      user: '680393cecf84c605f19c651c',
      name: 'Mango Delight',
      price: 150,
      description: 'Seasonal ripe mangoes, sweet and juicy.',
      category: 'fruit',
      image: 'https://images.unsplash.com/photo-1519096845289-95806ee03a1a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1hbmdvfGVufDB8fDB8fHww'
    }
  ];

  async function insertData() {
    try {
      await ProductModel.deleteMany({});
      await ProductModel.insertMany(products);
      console.log('Data inserted successfully');
    } catch (err) {
      console.error('Error inserting data:', err);
    }
  }
  
  connectDB()
    .then(() => {
      console.log('MongoDB connected');
      insertData();
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
    });