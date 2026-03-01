import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { VaultService } from './VaultService';
import './Vault.css';
import './JewelryCatalog.css';
import Navbar from './Navbar';
import HeritageSkeleton from './HeritageSkeleton';

const VaultPage = ({ cartCount }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVault = useCallback(async (token) => {
    try {
      console.log("VaultPage: Attempting to fetch vault with token...");
      const data = await VaultService.getUserVault(token);
      setItems(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Vault fetch error details:", err.response || err);
      
      // If the backend rejects the token (401/403), we redirect.
      // If you are redirecting, CHECK YOUR NETWORK TAB for a 403 error.
      if (err.response?.status === 403 || err.response?.status === 401) {
        console.warn("Server rejected token. Redirecting to login.");
        localStorage.removeItem("token");
        navigate('/login');
      } else {
        setLoading(false);
      }
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("VaultPage: No token found in localStorage. Redirecting.");
      navigate('/login');
      return;
    }

    loadVault(token);
  }, [navigate, loadVault]);

  const handleRemove = async (productId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Remove this masterpiece from your vault?")) {
      try {
        await VaultService.removeFromVault(productId, token);
        setItems(prevItems => prevItems.filter(item => item.productId !== productId));
      } catch (err) {
        alert("Action failed. Your session may have expired.");
      }
    }
  };

  return (
    <div className="catalog-container">
      {/* Ensure userEmail is passed if your Navbar expects it */}
      <Navbar cartCount={cartCount} userEmail={localStorage.getItem("userEmail")} />
      
      <div className="vault-wrapper">
        <button className="back-btn" onClick={() => navigate('/')}>
          Back to Collection
        </button>

        <header className="vault-header">
          <h1>Your Private Collection</h1>
          <p>Curated masterpieces saved for your consideration.</p>
        </header>

        {loading ? (
          <div className="vault-grid">
            <HeritageSkeleton type="card" count={4} />
          </div>
        ) : items.length === 0 ? (
          <div className="empty-vault">
            <p>Your vault is currently empty.</p>
            <button className="browse-btn" onClick={() => navigate('/')}>Browse Gems</button>
          </div>
        ) : (
          <div className="vault-grid">
            {items.map((item) => (
              <div key={item.productId || item.vaultItemId} className="vault-item-card">
                <div className="vault-img-wrapper" onClick={() => navigate(`/product/${item.productId}`)}>
                  <img 
                    src={item.imageUrl || 'https://via.placeholder.com/300'} 
                    alt={item.productName} 
                  />
                  <button 
                    className="delete-overlay-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.productId);
                    }}
                  >
                    &times;
                  </button>
                </div>
                
                <div className="vault-item-info">
                  <h3>{item.productName}</h3>
                  <span className="metal-tag">{item.metalType}</span>
                  <p className="vault-item-price">
                    ${Number(item.shelfPrice || item.ShelfPrice || 0).toLocaleString()}
                  </p>
                  <button className="view-product-btn" onClick={() => navigate(`/product/${item.productId}`)}>
                    View Masterpiece
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultPage;