import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'; // Ensure path is correct
import './JewelryCatalog.css'; // The CSS we just created

const AddressManager = ({ cartCount }) => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Update this to match your Controller's @RequestMapping("/api/addresses")
  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080') + '/api/addresses';

  useEffect(() => {
    if (user?.userId) {
      axios.get(`${API_URL}/user/${user.userId}`)
        .then(res => setAddresses(res.data))
        .catch(err => console.error("Error fetching addresses", err));
    } else {
      // Redirect to login if user session is missing
      navigate('/login');
    }
  }, [user?.userId, API_URL, navigate]);

  const handleSetDefault = (addressId) => {
    axios.patch(`${API_URL}/${addressId}/set-default/user/${user.userId}`)
      .then(() => {
        // Instead of reload, fetch data again for a smoother UX
        return axios.get(`${API_URL}/user/${user.userId}`);
      })
      .then(res => setAddresses(res.data))
      .catch(err => console.error("Error setting default", err));
  };

  const handleDelete = (addressId) => {
    if(window.confirm("Are you sure you want to remove this address?")) {
      axios.delete(`${API_URL}/${addressId}`)
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