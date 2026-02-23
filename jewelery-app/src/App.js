import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JewelryCatalog from './JewelryCatalog';
import ProductDetail from './ProductDetail';
import CartPage from './CartPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import VaultPage from './VaultPage';


function App() {
  // Load initial cart from localStorage or start with empty array
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('jewelry_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on load
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  // Automatically save to localStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem('jewelry_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<JewelryCatalog cartCount={cart.length} />} />
        <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} cartCount={cart.length} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        <Route path="/" element={<JewelryCatalog cartCount={cart.length} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/vault" element={<VaultPage userId={user?.userId} cartCount={cart.length} />} />
      </Routes>
    </Router>
  );
}

export default App;