import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './JewelryCatalog.css';

const Navbar = ({ cartCount }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // New state for profile dropdown
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setProfileOpen(false);
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
            <div className="profile-menu-container" ref={dropdownRef}>
              <button 
  className={`user-profile-trigger ${profileOpen ? 'active' : ''}`} 
  onClick={() => setProfileOpen(!profileOpen)}
>
  <div className="avatar-sm">{user.fullName.charAt(0)}</div>
  <div className="welcome-text-group">
    <span className="welcome-label">Welcome back,</span>
    <span className="user-name-label">{user.fullName.split(' ')[0]}</span>
  </div>
  <span className="dropdown-chevron">▾</span>
</button>

              {profileOpen && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user.fullName}</strong>
                    <span>{user.email}</span>
                  </div>
                  <hr />
                  <button onClick={() => { navigate('/profile'); setProfileOpen(false); }}>
                    👤 Profile Overview
                  </button>
                  {/* NEW: Address Management Link */}
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