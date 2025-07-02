// redux/slices/productSlice.js
import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
    updateProduct: (state, action) => {
      const updated = action.payload;
      const index = state.items.findIndex(p => p._id === updated._id);
      if (index !== -1) {
        state.items[index] = updated;
      }
    },
    deleteProduct: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(p => p._id !== id);
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
