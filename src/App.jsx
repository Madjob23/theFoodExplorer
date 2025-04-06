import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Header from './components/Header';
import ProductsPage from './features/products/ProductsPage';
import ProductDetail from './features/products/ProductDetail';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/product/:barcode" element={<ProductDetail />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;