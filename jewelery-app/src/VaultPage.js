import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VaultService } from './VaultService';
import './Vault.css';
import './JewelryCatalog.css';
import Navbar from './Navbar';
import HeritageSkeleton from './HeritageSkeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const VaultPage = ({ cartCount }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const currentUser = JSON.parse(savedUser);
      setUser(currentUser);
      loadVault(currentUser.userId);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadVault = async (userId) => {
    try {
      const data = await VaultService.getUserVault(userId);
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch vault items", err);
    } finally {
      // Small timeout can be added here if you want to test the skeleton pulse
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    if (window.confirm("Remove this masterpiece from your vault?")) {
      try {
        const success = await VaultService.removeFromVault(user.userId, productId);
        if (success) {
          setItems(items.filter(item => item.productId !== productId));
        }
      } catch (err) {
        alert("Error removing item.");
      }
    }
  };

  // REMOVED: The "if (loading) return loader" line to allow Skeletons to show below

  return (
    <div className="catalog-container">
      <Navbar cartCount={cartCount} />
      
      <div className="vault-wrapper">
        <button className="back-btn" onClick={() => navigate('/')}>
          Back to Collection
        </button>

        <header className="vault-header">
          <h1>Your Private Collection</h1>
          <p>Curated masterpieces saved for your consideration.</p>
        </header>

        {loading ? (
          /* --- SKELETON STATE --- */
          <div className="vault-grid">
            <HeritageSkeleton type="card" count={4} />
          </div>
        ) : items.length === 0 ? (
          /* --- EMPTY STATE --- */
          <div className="empty-vault">
            <p>Your vault is currently empty.</p>
            <button className="browse-btn" onClick={() => navigate('/')}>Browse Gems</button>
          </div>
        ) : (
          /* --- DATA STATE --- */
          <div className="vault-grid">
            {items.map((item) => (
              <div key={item.vaultItemId} className="vault-item-card">
                <div className="vault-img-wrapper" onClick={() => navigate(`/product/${item.productId}`)}>
                  <img src={item.imageUrl || 'https://via.placeholder.com/300'} alt={item.productName} />
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
                    ${Number(item.ShelfPrice || 0).toLocaleString()}
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