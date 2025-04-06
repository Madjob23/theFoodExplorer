import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productSlice';
import cartReducer, { saveCartToStorage } from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((store) => (next) => (action) => {
      const result = next(action);
      if (action.type?.startsWith('cart/')) {
        saveCartToStorage(store.getState().cart);
      }
      return result;
    })
});