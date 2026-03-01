import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './JewelryCatalog.css';

const Navbar = ({ cartCount }) => {
  const navigate = useNavigate();
  // State now stores the auth data (token and email)
  const [authData, setAuthData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // 1. Get the new auth data keys
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const storedAuth = localStorage.getItem("authData");

    if (token && email) {
      // If we saved the full object in login, parse it; otherwise use email
      setAuthData(storedAuth ? JSON.parse(storedAuth) : { email, token });
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // 2. Clear all security-related storage
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authData");
    
    setAuthData(null);
    setProfileOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  // Helper to get a display name or initial
  const displayName = authData?.fullName || authData?.email?.split('@')[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <nav className="navbar">
      <div className="nav-main-row">
        <div className="logo-group">
          <div className="nav-logo" onClick={() => navigate('/')}>
            HERITAGE<span>GEMS</span>
          </div>
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
          {/* 3. Check for authData/token presence */}
          {authData ? (
            <div className="profile-menu-container" ref={dropdownRef}>
              <button 
                className={`user-profile-trigger ${profileOpen ? 'active' : ''}`} 
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="avatar-sm">{initial}</div>
                <div className="welcome-text-group">
                  <span className="welcome-label">Welcome back,</span>
                  <span className="user-name-label">{displayName}</span>
                </div>
                <span className="dropdown-chevron">▾</span>
              </button>

              {profileOpen && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{authData.fullName || 'Member'}</strong>
                    <span>{authData.email}</span>
                  </div>
                  <hr />
                  <button onClick={() => { navigate('/profile'); setProfileOpen(false); }}>
                    👤 Profile Overview
                  </button>
                  <button onClick={() => { navigate('/addresses'); setProfileOpen(false); }}>
                    📍 Saved Addresses
                  </button>
                  <button onClick={() => { navigate('/vault'); setProfileOpen(false); }}>
                    🏛️ My Private Vault
                  </button>
                  <button onClick={() => { navigate('/orders'); setProfileOpen(false); }}>
                    📦 Order History
                  </button>
                  <hr />
                  <button className="logout-link" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
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