import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveCart = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state));
  } catch {}
};

const initialState = loadCart() || {
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
      saveCart(state);
    },

    removeFromCart: (state, action) => {
      state.items = cleanCartItems(state.items).filter(
        (item) => item.product._id !== action.payload
      );
      saveCart(state);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload || {};
      if (!productId || quantity < 1) return;

      const existingItem = state.items.find((item) => item.product._id === productId);
      if (existingItem) existingItem.quantity = quantity;

      saveCart(state);
    },

    setDeliveryDetails: (state, action) => {
      if (typeof action.payload === 'object') {
        state.deliveryDetails = { ...state.deliveryDetails, ...action.payload };
        saveCart(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.deliveryDetails = { ...initialState.deliveryDetails };
      saveCart(state);
    },

    resetCart: () => {
      const reset = { ...initialState };
      saveCart(reset);
      return reset;
    },

    cleanCart: (state) => {
      state.items = cleanCartItems(state.items);
      saveCart(state);
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
