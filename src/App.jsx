import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Header from './components/Header';
import ProductsPage from './features/products/ProductsPage';
import ProductDetail from './features/products/ProductDetail';
import CartPage from './features/cart/CartPage';
import CartButton from './components/CartButton';

function App() {
  return (
    <Provider store={store}>
      <Router basename='/theFoodExplorer'>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/product/:barcode" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
          <CartButton />
        </div>
      </Router>
    </Provider>
  );
}

export default App;