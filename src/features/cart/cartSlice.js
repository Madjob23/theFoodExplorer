import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.code === newItem.code);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }
      
      state.totalItems += 1;
    },
    removeFromCart: (state, action) => {
      const code = action.payload;
      const itemIndex = state.items.findIndex(item => item.code === code);
      
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.totalItems -= item.quantity;
        state.items.splice(itemIndex, 1);
      }
    },
    updateQuantity: (state, action) => {
      const { code, quantity } = action.payload;
      const item = state.items.find(item => item.code === code);
      
      if (item) {
        const diff = quantity - item.quantity;
        item.quantity = quantity;
        state.totalItems += diff;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;