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
const isValidCartItem = (item) =>
  item && item.product && item.product._id && typeof item.quantity === 'number' && item.quantity > 0;

const cleanCartItems = (items) => items.filter(isValidCartItem);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload || {};
      if (!product?._id || typeof product.price !== 'number' || !quantity) return;

      state.items = cleanCartItems(state.items);
      const existingItem = state.items.find((item) => item.product._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const newItem = { product: structuredClone(product), quantity };
        if (isValidCartItem(newItem)) state.items.push(newItem);
      }
    },

    removeFromCart: (state, action) => {
      state.items = cleanCartItems(state.items).filter(
        (item) => item.product._id !== action.payload
      );
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload || {};
      if (!productId || quantity < 1) return;

      const existingItem = state.items.find((item) => item.product._id === productId);
      if (existingItem) existingItem.quantity = quantity;
    },

    setDeliveryDetails: (state, action) => {
      if (typeof action.payload === 'object') {
        state.deliveryDetails = { ...state.deliveryDetails, ...action.payload };
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.deliveryDetails = { ...initialState.deliveryDetails };
    },
    resetCart: () => initialState,

    cleanCart: (state) => {
      state.items = cleanCartItems(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setDeliveryDetails,
  clearCart,
  resetCart,
  cleanCart,
} = cartSlice.actions;

export default cartSlice.reducer;