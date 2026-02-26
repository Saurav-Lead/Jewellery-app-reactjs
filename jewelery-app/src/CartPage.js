import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './JewelryCatalog.css';

const CartPage = ({ cartCount, cart, setCart }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // --- Address Integration States ---
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isCustomAddress, setIsCustomAddress] = useState(false);
  const [saveThisAddress, setSaveThisAddress] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchSavedAddresses(parsedUser.userId);
    }
  }, []);

  // Fetch addresses from your Address Management API
  const fetchSavedAddresses = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/api/addresses/user/${userId}`);
      setSavedAddresses(res.data);
      
      // Auto-select the Primary address if it exists
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
      setIsCustomAddress(true); // Fallback to manual entry
    }
  };

  // --- Cart Helpers (Existing Logic Preserved) ---
  const getPrice = (item) => parseFloat(item.ShelfPrice || item.shelf_price || item.shelfPrice || 0);
  const subtotal = cart.reduce((acc, item) => acc + (getPrice(item) * item.quantity), 0);
  const tax = subtotal * 0.05; 
  const total = subtotal + tax;

  const updateQuantity = (id, amount) => {
    setCart(prev => prev.map(item => 
      item.productId === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    ));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.productId !== id));
  };

  // --- Order Logic ---
  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to complete your purchase.");
      navigate('/login');
      return;
    }

    if (!shippingAddress.trim()) {
      alert("Please enter a shipping address.");
      return;
    }

    setIsProcessing(true);

    // Optional: Save address to Address Management if user checked the box
    if (isCustomAddress && saveThisAddress) {
        try {
            // Adjust this payload to match your Address Entity
            await axios.post(`${API_URL}/api/addresses`, {
                userId: user.userId,
                fullAddress: shippingAddress,
                label: "Checkout Entry",
                isDefault: false
            });
        } catch (e) { console.error("Could not save address to profile", e); }
    }

    const orderData = {
      user: { userId: user.userId },
      totalAmount: total.toFixed(2),
      status: "PENDING",
      shippingAddress: shippingAddress,
      items: cart.map(item => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
        priceAtPurchase: getPrice(item)
      }))
    };
    try {
      
      const response = await axios.post(`${API_URL}/api/orders/place`, orderData);
      if (response.status === 200 || response.status === 201) {
        alert(`Order #${response.data.orderId} placed successfully!`);
        setCart([]);
        navigate('/profile');
      }
    } catch (error) {
      alert("Checkout failed. Please try again.");
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
                  <div className="save-address-checkbox">
                    <input 
                        type="checkbox" 
                        id="saveAddress" 
                        checked={saveThisAddress}
                        onChange={(e) => setSaveThisAddress(e.target.checked)}
                    />
                    <label htmlFor="saveAddress">Save to my profile</label>
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
              {isProcessing ? "Processing..." : user ? "Secure Checkout" : "Login to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;