import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('foodExplorerCart');
    return cartData ? JSON.parse(cartData) : { items: [], totalItems: 0 };
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return { items: [], totalItems: 0 };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('foodExplorerCart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Use loaded data as initial state
const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.code === product.code);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ 
          code: product.code,
          product_name: product.product_name,
          image_url: product.image_url,
          brands: product.brands,
          nutrition_grade_fr: product.nutrition_grade_fr,
          quantity 
        });
      }
      
      // Update total items
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    removeFromCart: (state, action) => {
      const productCode = action.payload;
      state.items = state.items.filter(item => item.code !== productCode);
      
      // Update total items
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    incrementQuantity: (state, action) => {
      const code = action.payload;
      const item = state.items.find(item => item.code === code);
      
      if (item) {
        item.quantity += 1;
        state.totalItems += 1;
      }
    },
    
    decrementQuantity: (state, action) => {
      const code = action.payload;
      const item = state.items.find(item => item.code === code);
      
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalItems -= 1;
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
    }
  }
});

// Export the saveCartToStorage function to use in store
export { saveCartToStorage };

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectItemInCart = (code) => (state) => 
  state.cart.items.find(item => item.code === code);

export default cartSlice.reducer;