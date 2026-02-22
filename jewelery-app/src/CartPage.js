import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JewelryCatalog.css';

const CartPage = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State for logged-in user

  useEffect(() => {
    // Sync user state with localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/');
  };

  // Helper to update quantity
  const updateQuantity = (id, amount) => {
    setCart(prev => prev.map(item => 
      item.productId === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    ));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.productId !== id));
  };

  const subtotal = cart.reduce((acc, item) => 
    acc + (parseFloat(item.ShelfPrice || item.shelf_price || item.shelfPrice || 0) * item.quantity), 0
  );
  const tax = subtotal * 0.05; 
  const total = subtotal + tax;

  return (
    <div className="catalog-container">
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate('/')}>
          HERITAGE<span>GEMS</span>
        </div>

        <div className="nav-actions">
          {/* Conditional Rendering for User/Login */}
          {user ? (
            <div className="user-nav-section">
              <span className="welcome-msg">Hi, {user.fullName.split(' ')[0]}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="nav-btn" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
          
          <button className="back-btn-nav" onClick={() => navigate(-1)}>Back to Shopping</button>
        </div>
      </nav>

      <div className="cart-layout">
        <div className="cart-items-section">
          <h2>Your Selection ({cart.length})</h2>
          
          {cart.length === 0 ? (
            <div className="empty-cart" style={{ textAlign: 'center', padding: '50px' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Your vault is empty.</p>
              <button className="view-btn" onClick={() => navigate('/')}>Browse Collection</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="cart-item-card">
                <div className="item-details">
                  <h3>{item.productName}</h3>
                  <p>{item.metalType} ({item.metalPurity})</p>
                </div>
                
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.productId, -1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, 1)}>+</button>
                </div>
                
                <div className="item-price">
                  ${(parseFloat(item.ShelfPrice || item.shelf_price || item.shelfPrice || 0) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                
                <button className="remove-btn" onClick={() => removeItem(item.productId)}>×</button>
              </div>
            ))
          )}
        </div>

        <div className="order-summary-card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="summary-row">
            <span>Estimated Tax (5%)</span>
            <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <button 
            className="checkout-btn" 
            disabled={cart.length === 0}
            onClick={() => {
              if(!user) {
                alert("Please login to complete your purchase.");
                navigate('/login');
              } else {
                alert('Proceeding to Secure Payment...');
              }
            }}
          >
            {user ? "Secure Checkout" : "Login to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;