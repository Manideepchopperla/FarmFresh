// src/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  deliveryDetails: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    deliveryDate: '',
  },
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.product._id === action.payload.product._id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity; // Update quantity
      } else {
        state.items.push(action.payload); // Add new item
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.product._id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product._id === productId);
      if (existingItem) {
        existingItem.quantity = quantity; // Update quantity
      }
    },
    setDeliveryDetails: (state, action) => {
      state.deliveryDetails = { ...state.deliveryDetails, ...action.payload };
    },
    clearCart: (state) => {
      state.items = [];
      state.deliveryDetails = initialState.deliveryDetails; // Reset delivery details
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setDeliveryDetails, clearCart } = cartSlice.actions;
export default cartSlice.reducer;