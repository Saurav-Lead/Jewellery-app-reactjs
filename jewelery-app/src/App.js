import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JewelryCatalog from './JewelryCatalog';
import ProductDetail from './ProductDetail';
import CartPage from './CartPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import VaultPage from './VaultPage';
import AddressManager from './AddressManager';
import AddAddress from './Addaddress';
import ProfileOverview from './ProfileOverview';
import OrderHistory from './OrderHistory';
import Footer from './Footer'; // Import your Footer

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('jewelry_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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
      {/* Wrapper to ensure sticky footer behavior */}
      <div className="app-viewport-wrapper">
        <main className="app-main-content">
          <Routes>
            <Route path="/" element={<JewelryCatalog cartCount={cart.length} />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} cartCount={cart.length} />} />
            <Route path="/cart" element={<CartPage cartCount={cart.length} cart={cart} setCart={setCart} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/vault" element={<VaultPage userId={user?.userId} cartCount={cart.length} />} />
            <Route path="/addresses" element={<AddressManager userId={user?.userId} cartCount={cart.length} />} />
            <Route path="/addresses/new" element={<AddAddress userId={user?.userId} cartCount={cart.length} />} />
            <Route path="/profile" element={<ProfileOverview userId={user?.userId} cartCount={cart.length} />} />
            <Route path="/orders" element={<OrderHistory cartCount={cart.length} />} />
          </Routes>
        </main>
        <Footer /> {/* Footer is now global and visible on all routes */}
      </div>
    </Router>
  );
}

export default App;