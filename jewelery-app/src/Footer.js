import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JewelryCatalog.css';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="heritage-footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Vision */}
          <div className="footer-column">
            <div className="logo-group">
          <div className="nav-logo" onClick={() => navigate('/')}>
            HERITAGE<span>GEMS</span>
          </div>
        </div>
            <p className="footer-description">
              Preserving the natural beauty of the earth through timeless jewelry and authentic gemstones. 
              Our collection is a tribute to legacy and nature.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-column">
            <h4>The Collection</h4>
            <ul>
              <li onClick={() => navigate('/')}>All Jewelry</li>
              <li>Rare Gemstones</li>
              <li>Fossils & Minerals</li>
              <li>New Arrivals</li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-column">
            <h4>Care & Support</h4>
            <ul>
              <li onClick={() => navigate('/orders')}>Track Order</li>
              <li onClick={() => navigate('/addresses')}>Saved Addresses</li>
              <li>Authenticity Guide</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="footer-column">
            <h4>Connect With Us</h4>
            <div className="social-pills">
              <span>Instagram</span>
              <span>Facebook</span>
              <span>TikTok</span>
            </div>
            <p className="contact-email">contact@heritagegems.com</p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>&copy; {new Date().getFullYear()} Heritage Gems. Crafted with nature in mind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;