import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JewelryCatalog.css';

const ProductDetail = ({ addToCart, cartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  
  // 1. Add state for the logged-in user
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 2. Sync user state with localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    axios.get(`${API_URL}/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("Product not found", err));
  }, [id]);

  // 3. Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/');
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  if (!product) return <div className="loader">Loading Masterpiece...</div>;

  return (
    <div className="catalog-container"> 
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate('/')}>
          HERITAGE<span>GEMS</span>
        </div>
        
        <div className="nav-actions">
          {/* 4. Personalized Nav Section */}
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

          <div className="cart-icon" onClick={() => navigate('/cart')}>
            🛒 <span className="cart-count">{cartCount}</span>
          </div>
        </div>
      </nav>

      <button className="back-btn" onClick={() => navigate(-1)}>
        Back to Collection
      </button>
      
      <div className="product-detail-layout">
        <div className="product-image-showcase">
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/500x500?text=Jewelry+Image'} 
            alt={product.productName} 
            className="detail-main-image"
          />
        </div>

        <div className="product-info-panel">
          <span className="category-tag">{product.category?.name || 'Fine Jewelry'}</span>
          <h1 className="detail-title">{product.productName}</h1>
          
          <div className="price-tag-large">
            ${Number(product.ShelfPrice || product.shelf_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>

          <div className="specs-grid-detail">
            <div className="spec-item"><strong>Metal</strong> {product.metalType}</div>
            <div className="spec-item"><strong>Purity</strong> {product.metalPurity}</div>
            <div className="spec-item"><strong>Weight</strong> {product.metalWeightGrams}g</div>
          </div>

          <p className="product-description">
            This exquisite {product.productName} features premium {product.metalType} 
            crafted to {product.metalPurity} standards.
          </p>

          <div className="action-buttons">
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className="add-cart-btn-outline" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;