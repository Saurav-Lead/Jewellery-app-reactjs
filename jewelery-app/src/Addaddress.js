import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './JewelryCatalog.css'; // Reusing our styles

const AddAddress = ({ cartCount }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080') + '/api/addresses';

  const [formData, setFormData] = useState({
    label: '',
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Endpoint: POST /api/addresses/user/{userId}
      await axios.post(`${API_URL}/user/${user.userId}`, formData);
      alert("Address added to your vault successfully!");
      navigate('/addresses'); // Go back to the list
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Failed to save address. Please try again.");
    }
  };

  return (
    <div className="catalog-container">
      <Navbar cartCount={cartCount} />
      
      <div className="address-page-container">
        <button className="back-btn" onClick={() => navigate('/addresses')}>
          Back to Addresses
        </button>

        <div className="address-header">
          <h2>Add New Shipping Destination</h2>
        </div>

        <form className="address-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Address Label (e.g., Home, Office)</label>
              <input 
                type="text" name="label" placeholder="Home" 
                value={formData.label} onChange={handleChange} required 
              />
            </div>
            <div className="form-group">
              <label>Recipient Full Name</label>
              <input 
                type="text" name="fullName" placeholder="John Doe" 
                value={formData.fullName} onChange={handleChange} required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Street Address</label>
            <input 
              type="text" name="street" placeholder="123 Luxury Lane" 
              value={formData.street} onChange={handleChange} required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input 
                type="text" name="city" value={formData.city} 
                onChange={handleChange} required 
              />
            </div>
            <div className="form-group">
              <label>State/Province</label>
              <input 
                type="text" name="state" value={formData.state} 
                onChange={handleChange} required 
              />
            </div>
            <div className="form-group">
              <label>Zip Code</label>
              <input 
                type="text" name="zipCode" value={formData.zipCode} 
                onChange={handleChange} required 
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <input 
              type="checkbox" name="isDefault" id="isDefault"
              checked={formData.isDefault} onChange={handleChange} 
            />
            <label htmlFor="isDefault">Set as primary shipping address</label>
          </div>

          <button type="submit" className="submit-addr-btn">
            Save to My Vault
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAddress;