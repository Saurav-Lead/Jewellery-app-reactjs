import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'; 
import './JewelryCatalog.css';

const AddressManager = ({ cartCount }) => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();
  
  // SECURITY CHANGE: Get token instead of the user object
  const token = localStorage.getItem("token");
  
  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080') + '/api/addresses';

  // Memoized fetch function for re-use after updates
  const fetchAddresses = useCallback(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // SECURITY CHANGE: Removed /user/{userId} from URL
    axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAddresses(res.data))
    .catch(err => {
      console.error("Error fetching addresses", err);
      if (err.response?.status === 403) navigate('/login');
    });
  }, [token, API_URL, navigate]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSetDefault = (addressId) => {
    // SECURITY CHANGE: URL simplified, Token handles identification
    axios.patch(`${API_URL}/${addressId}/set-default`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      fetchAddresses(); // Refresh list for smooth UX
    })
    .catch(err => console.error("Error setting default", err));
  };

  const handleDelete = (addressId) => {
    if (window.confirm("Are you sure you want to remove this address?")) {
      axios.delete(`${API_URL}/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => setAddresses(addresses.filter(a => a.id !== addressId)))
      .catch(err => console.error("Error deleting address", err));
    }
  };

  return (
    <div className="catalog-container">
      <Navbar cartCount={cartCount} />
      
      <div className="address-page-container">
        <button className="back-btn" onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>
          Back to Collection
        </button>

        <div className="address-header">
          <h2>📍 Saved Addresses</h2>
        </div>

        <div className="address-grid">
          {/* Add New Address Placeholder */}
          <div className="address-card add-address-card" onClick={() => navigate('/addresses/new')}>
            <span className="plus-icon">+</span>
            <span>Add New Address</span>
          </div>

          {addresses.length > 0 ? (
            addresses.map(addr => (
              <div key={addr.id} className={`address-card ${addr.default ? 'default' : ''}`}>
                {addr.default && <span className="default-badge">Primary</span>}
                <div className="address-label">{addr.label || "Home"}</div>
                <div className="address-details">
                  <strong>{addr.fullName}</strong><br />
                  {addr.street}<br />
                  {addr.city}, {addr.state} {addr.zipCode}
                </div>
                
                <div className="address-actions">
                  <button className="btn-delete" onClick={() => handleDelete(addr.id)}>Remove</button>
                  {!addr.default && (
                    <button className="btn-set-default" onClick={() => handleSetDefault(addr.id)}>
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="empty-msg">No addresses saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressManager;