import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VaultService } from './VaultService';
import './Vault.css';
import './JewelryCatalog.css';

const VaultPage = ({ cartCount }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Sync User Session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const currentUser = JSON.parse(savedUser);
      setUser(currentUser);
      loadVault(currentUser.userId);
    } else {
      // If no user, redirect to login
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/');
  };

  if (loading) return <div className="loader">Opening your private vault...</div>;

  return (
    <div className="catalog-container">
      {/* --- SHARED NAVBAR --- */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate('/')}>
          HERITAGE<span>GEMS</span>
        </div>
        
        <div className="nav-actions">
          {user ? (
            <div className="user-nav-section">
              <span className="welcome-msg">Hi, {user.fullName.split(' ')[0]}</span>
              <button className="view-vault-nav-btn active">🏛️ My Vault</button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
          )}

          <div className="cart-icon" onClick={() => navigate('/cart')}>
            🛒 <span className="cart-count">{cartCount}</span>
          </div>
        </div>
      </nav>

      {/* --- VAULT CONTENT --- */}
      <div className="vault-wrapper">
        <button className="back-btn" onClick={() => navigate('/')}>
          Back to Collection
        </button>

        <header className="vault-header">
          <h1>Your Private Collection</h1>
          <p>Curated masterpieces saved for your consideration.</p>
        </header>

        {items.length === 0 ? (
          <div className="empty-vault">
            <p>Your vault is currently empty.</p>
            <button className="browse-btn" onClick={() => navigate('/')}>Browse Gems</button>
          </div>
        ) : (
          <div className="vault-grid">
            {items.map((item) => (
              <div key={item.vaultItemId} className="vault-item-card">
                <div className="vault-img-wrapper" onClick={() => navigate(`/product/${item.productId}`)}>
                  <img src={item.imageUrl} alt={item.productName} />
                  <button 
                    className="delete-overlay-btn" 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents navigating to product detail
                      handleRemove(item.productId);
                    }}
                  >
                    &times;
                  </button>
                </div>
                
                <div className="vault-item-info">
                  <h3>{item.productName}</h3>
                  <span className="metal-tag">{item.metalType}</span>
                  <p className="vault-item-price">${item.ShelfPrice?.toLocaleString()}</p>
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