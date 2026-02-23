import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { VaultService } from './VaultService'; 
import './JewelryCatalog.css';
import './Vault.css';

const ProductDetail = ({ addToCart, cartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [vaultLoading, setVaultLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    let currentUser = null;
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
      setUser(currentUser);
    }

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    
    axios.get(`${API_URL}/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        if (currentUser) {
          checkVaultStatus(currentUser.userId, id);
        }
      })
      .catch(err => console.error("Product not found", err));
  }, [id]);

  const checkVaultStatus = async (userId, productId) => {
    try {
      const vaultItems = await VaultService.getUserVault(userId);
      const exists = vaultItems.some(item => item.productId === productId);
      setIsSaved(exists);
    } catch (err) {
      console.error("Error checking vault status", err);
    }
  };

  const handleAddToVault = async () => {
    if (!user) {
      alert("Please login to save items to your vault.");
      navigate('/login');
      return;
    }

    setVaultLoading(true);
    try {
      await VaultService.addToVault(user.userId, product.productId, "Saved from detail page");
      setIsSaved(true);
      alert("Added to your private vault!");
    } catch (err) {
      alert(err.message);
    } finally {
      setVaultLoading(false);
    }
  };

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
          <span className="category-tag">{product.category?.categoryName || 'Fine Jewelry'}</span>
          <h1 className="detail-title">{product.productName}</h1>
          
          <div className="price-tag-large">
             ${Number(product.ShelfPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>

          <div className="specs-grid-detail">
            <div className="spec-item"><strong>Metal</strong> {product.metalType}</div>
            <div className="spec-item"><strong>Purity</strong> {product.metalPurity}</div>
            <div className="spec-item"><strong>Weight</strong> {product.metalWeightGrams}g</div>
          </div>

          <p className="product-description">
            Experience the elegance of the {product.productName}. This piece is meticulously 
            crafted in {product.metalType} ({product.metalPurity}), weighing approximately {product.metalWeightGrams} grams.
          </p>

          <div className="action-buttons">
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className="add-cart-btn-outline" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
            
            <button 
              className={`vault-btn ${isSaved ? 'saved' : ''}`} 
              onClick={handleAddToVault}
              disabled={isSaved || vaultLoading}
            >
              {vaultLoading ? 'Saving...' : isSaved ? '🏛️ In Your Vault' : '✨ Save to Vault'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;