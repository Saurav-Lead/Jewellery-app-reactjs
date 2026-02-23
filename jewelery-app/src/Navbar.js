import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JewelryCatalog.css';

const Navbar = ({ cartCount }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-main-row">
        <div className="logo-group">
          <div className="nav-logo" onClick={() => navigate('/')}>
            HERITAGE<span>GEMS</span>
          </div>
          
          {/* Welcome message moved here to stay visible after logo */}
          {user && (
            <span className="welcome-msg-inline">
              Hi, {user.fullName.split(' ')[0]}
            </span>
          )}
        </div>

        <div className="nav-mobile-icons">
          <div className="cart-icon" onClick={() => navigate('/cart')}>
            🛒 <span className="cart-count">{cartCount}</span>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <div className={`nav-links-container ${menuOpen ? 'show' : ''}`}>
        <div className="nav-actions">
          {user ? (
            <div className="user-nav-section">
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

          <div className="cart-icon desktop-only" onClick={() => navigate('/cart')}>
            🛒 <span className="cart-count">{cartCount}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;