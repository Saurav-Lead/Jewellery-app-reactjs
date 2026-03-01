import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './JewelryCatalog.css';

const CartPage = ({ cartCount, cart, setCart }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // --- Security: Source of Truth ---
  const token = localStorage.getItem("token");
  
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isCustomAddress, setIsCustomAddress] = useState(false);
  const [saveThisAddress, setSaveThisAddress] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const fetchSavedAddresses = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/api/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedAddresses(res.data);
      
      const primary = res.data.find(addr => addr.default) || res.data[0];
      if (primary) {
        const fullAddr = `${primary.street}, ${primary.city}, ${primary.state} ${primary.zipCode}`;
        setShippingAddress(fullAddr);
        setIsCustomAddress(false);
      } else {
        setIsCustomAddress(true);
      }
    } catch (err) {
      console.error("Error fetching saved addresses", err);
      setIsCustomAddress(true);
    }
  }, [token, API_URL]);

  useEffect(() => {
    if (token) {
      fetchSavedAddresses();
    } else {
      // If no token, they shouldn't be here anyway
      navigate('/login');
    }
  }, [token, fetchSavedAddresses, navigate]);

  const getPrice = (item) => parseFloat(item.shelfPrice || item.ShelfPrice || 0);
  const subtotal = cart.reduce((acc, item) => acc + (getPrice(item) * item.quantity), 0);
  const total = subtotal + (subtotal * 0.05);

  const updateQuantity = (id, amount) => {
    setCart(prev => prev.map(item => 
      item.productId === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    ));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.productId !== id));
  };

  const handleCheckout = async () => {
    if (!token) {
      alert("Please login to complete your purchase.");
      navigate('/login');
      return;
    }

    if (!shippingAddress.trim()) {
      alert("Please enter a shipping address.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. OPTIONAL: Save address if user checked the box
      if (isCustomAddress && saveThisAddress) {
        const addressParts = shippingAddress.split(','); // Simple split for demo
        await axios.post(`${API_URL}/api/addresses`, {
            fullName: "Default Name", // You might want a field for this
            street: addressParts[0]?.trim() || shippingAddress,
            city: addressParts[1]?.trim() || "",
            state: addressParts[2]?.trim().split(' ')[0] || "",
            zipCode: addressParts[2]?.trim().split(' ')[1] || "",
            label: "Checkout Order Address"
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
      }

      // 2. Prepare Order Data
      const orderData = {
        totalAmount: total.toFixed(2),
        status: "PENDING",
        shippingAddress: shippingAddress,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: getPrice(item)
        }))
      };

      // 3. Post Order
      const response = await axios.post(`${API_URL}/api/orders/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200 || response.status === 201) {
        alert(`Order placed successfully!`);
        setCart([]); // Clear the global cart state
        
        // --- THE FIX ---
        // Ensure we navigate to profile ONLY if we still have the token
        // If your ProfilePage redirects to Login, check its useEffect logic!
        navigate('/profile'); 
      }
    } catch (error) {
      console.error("Checkout error", error);
      if (error.response?.status === 403) {
        alert("Session expired. Please login again.");
        navigate('/login');
      } else {
        alert("Checkout failed. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="catalog-container cart-page-view">
      <Navbar cartCount={cartCount} />
      <div className="cart-content-wrapper">
        <button className="back-btn" onClick={() => navigate(-1)}>Back to Shopping</button>
        <div className="cart-layout">
          <div className="cart-items-section">
            <h2 className="section-title">Your Selection ({cart.length})</h2>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty.</p>
                <button className="view-btn" onClick={() => navigate('/')}>Browse Collection</button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.productId} className="cart-item-card">
                  <div className="item-info">
                    <h3>{item.productName}</h3>
                    <p className="item-meta">{item.metalType} | {item.metalPurity}</p>
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.productId, -1)}>−</button>
                    <span className="qty-number">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)}>+</button>
                  </div>
                  <div className="item-price">${(getPrice(item) * item.quantity).toFixed(2)}</div>
                  <button className="remove-btn" onClick={() => removeItem(item.productId)}>×</button>
                </div>
              ))
            )}
          </div>

          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="shipping-integration-section">
              <label className="summary-label">Shipping Destination</label>
              {savedAddresses.length > 0 && (
                <select 
                  className="address-select-dropdown"
                  value={isCustomAddress ? "new" : shippingAddress}
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setIsCustomAddress(true);
                      setShippingAddress("");
                    } else {
                      setIsCustomAddress(false);
                      setShippingAddress(e.target.value);
                    }
                  }}
                >
                  <option value="" disabled>Select an address</option>
                  {savedAddresses.map(addr => (
                    <option key={addr.id} value={`${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`}>
                      {addr.label || "Address"} {addr.default ? "(Primary)" : ""}
                    </option>
                  ))}
                  <option value="new">+ Use a new address</option>
                </select>
              )}

              {isCustomAddress && (
                <div className="custom-address-entry">
                  <textarea 
                    className="shipping-input"
                    placeholder="Enter full delivery address..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows="3"
                  />
                  <div className="save-address-checkbox" style={{marginTop: '10px'}}>
                    <input 
                        type="checkbox" 
                        id="saveAddr" 
                        checked={saveThisAddress} 
                        onChange={(e) => setSaveThisAddress(e.target.checked)} 
                    />
                    <label htmlFor="saveAddr" style={{marginLeft: '8px', fontSize: '0.9rem'}}>Save to profile</label>
                  </div>
                </div>
              )}
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <button 
              className="checkout-btn" 
              disabled={cart.length === 0 || isProcessing}
              onClick={handleCheckout}
            >
              {isProcessing ? "Processing..." : token ? "Secure Checkout" : "Login to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;