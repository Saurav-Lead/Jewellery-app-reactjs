import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JewelryCatalog.css';

const JewelryCatalog = ({ cartCount }) => { 
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 1. New state to hold the logged-in user
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // 2. Check if a user is logged in when the component mounts
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    axios.get(`${API_URL}/api/products`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Unable to load collection.");
        setLoading(false);
      });
  }, []);

  // 3. Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/');
  };

  const filteredProducts = products.filter(item =>
    (item.productName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.metalType?.toLowerCase().includes(searchTerm.toLowerCase()))
);

  if (loading) return <div className="loader">Refining Collection...</div>;

  return (
    <div className="catalog-container">
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate('/')}>
          HERITAGE<span>GEMS</span>
        </div>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for gold, diamonds, rings..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="nav-actions">
          {/* 4. Conditional Rendering: Show Name + Logout OR Login button */}
          {user ? (
            <div className="user-nav-section">
              <span className="welcome-msg">Hi, {user.fullName.split(' ')[0]}</span>
              {/* --- NEW VIEW VAULT ACTION --- */}
              <button className="view-vault-nav-btn" onClick={() => navigate('/vault')}>
                🏛️ My Vault
              </button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="nav-btn" onClick={() => navigate('/login')}>
              Login
            </button>
          )}

          <div className="cart-icon" onClick={() => navigate('/cart')}>
            🛒 <span className="cart-count">{cartCount}</span>
          </div>
        </div>
      </nav>

      <header className="catalog-header">
        <h1>{searchTerm ? `Results for "${searchTerm}"` : "The Heritage Collection"}</h1>
      </header>

      <div className="product-grid">
        {filteredProducts.map((item) => (
          <div key={item.productId} className="product-card">
            <div className="product-image-container">
              <img 
                src={item.imageUrl || 'https://via.placeholder.com/300'} 
                alt={item.productName} 
                className="product-image"
              />
            </div>
            <div className="metal-badge">{item.metalPurity} {item.metalType}</div>
            <div className="product-info">
              <h3>{item.productName}</h3>
              <p className="category">{item.category?.name || 'Fine Jewelry'}</p>
              <div className="price-tag">
                ${Number(item.ShelfPrice || item.shelf_price || item.ShelfPrice || 0).toLocaleString()}
              </div>
              <button 
                className="view-btn" 
                onClick={() => navigate(`/product/${item.productId}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredProducts.length === 0 && <p className="no-results">No jewelry matches your search.</p>}
    </div>
  );
};

export default JewelryCatalog;