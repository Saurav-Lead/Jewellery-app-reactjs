import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { VaultService } from './VaultService'; 
import './JewelryCatalog.css';
import './Vault.css';
import Navbar from './Navbar';
import HeritageSkeleton from './HeritageSkeleton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import GemQRCode from './GemQRCode';

const ProductDetail = ({ addToCart, cartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  
  // SECURITY CHANGE: Check for token instead of 'user' object
  const token = localStorage.getItem("token");
  
  const [isSaved, setIsSaved] = useState(false);
  const [vaultLoading, setVaultLoading] = useState(false);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    
    // 1. Fetch Product Data (Public)
    axios.get(`${API_URL}/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        // 2. Only check vault status if we have a token
        if (token) {
          checkVaultStatus(id);
        }
      })
      .catch(err => console.error("Product not found", err));
  }, [id, token]);

  const checkVaultStatus = async (productId) => {
    try {
      // SECURITY CHANGE: Pass token, not userId
      const vaultItems = await VaultService.getUserVault(token);
      const exists = vaultItems.some(item => item.productId === parseInt(productId));
      setIsSaved(exists);
    } catch (err) {
      console.error("Error checking vault status", err);
      // If token is invalid, don't redirect here, just let them view the product
    }
  };

  const handleAddToVault = async () => {
    // SECURITY CHANGE: Gatekeep using the token
    if (!token) {
      alert("Please login to save items to your vault.");
      navigate('/login');
      return;
    }

    setVaultLoading(true);
    try {
      // SECURITY CHANGE: We no longer send userId. The backend gets it from the token.
      await VaultService.addToVault(product.productId, token);
      setIsSaved(true);
      alert("Added to your private vault!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Could not save to vault. Please try logging in again.");
    } finally {
      setVaultLoading(false);
    }
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="catalog-container"> 
     <Navbar cartCount={cartCount} />
      <button className="back-btn" onClick={() => navigate(-1)}>
        Back to Collection
      </button>
      
      <div className="product-detail-layout">
        {!product ? (
          <>
            <div className="product-image-showcase">
              <HeritageSkeleton type="card" count={1} />
            </div>
            <div className="product-info-panel">
              <Skeleton width={100} height={20} />
              <Skeleton width="80%" height={40} style={{ margin: '15px 0' }} />
              <Skeleton width={120} height={35} />
              <div className="specs-grid-detail" style={{ marginTop: '20px' }}>
                <Skeleton width={80} height={40} />
                <Skeleton width={80} height={40} />
                <Skeleton width={80} height={40} />
              </div>
              <div style={{ marginTop: '20px' }}>
                <HeritageSkeleton type="text" count={1} />
              </div>
            </div>
          </>
        ) : (
          <>
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
                 ${Number(product.shelfPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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

              <div className="qr-section" style={{ background: '#f9f9f9', borderRadius: '8px', marginTop: '20px' }}>
                <GemQRCode productId={product.productId} productName={product.productName} />
                <button 
                  className="view-btn" 
                  onClick={() => window.print()} 
                  style={{ margin: '0 auto 20px', display: 'block' }}
                >
                  Print Certificate QR
                </button>
              </div>

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
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;