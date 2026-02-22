import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. Import Axios
import './JewelryCatalog.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Updated to async to handle the API call
  const handleRegister = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // 3. Make the actual POST request to your Spring Boot Backend
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      // 4. Handle success
      console.log("Server Response:", response.data);
      alert("Account created successfully! Please login.");
      navigate('/login');
      
    } catch (err) {
      // 5. Handle errors (e.g., Email already exists, Server down)
      console.error("Registration Error:", err);
      const errorMessage = err.response?.data || "Server error. Please try again later.";
      alert(errorMessage);
    }
  };

  return (
    <div className="catalog-container login-wrapper">
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate('/')}>
          HERITAGE<span>GEMS</span>
        </div>
      </nav>

      <div className="login-card">
        <div className="login-header">
          <h2>Create Account</h2>
          <p>Join our exclusive circle of collectors</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName"
              required 
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              required 
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              required 
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              required 
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="login-submit-btn" style={{ background: '#ff4d6d' }}>
            Register Now
          </button>
        </form>

        <div className="login-footer">
          <p>Already a member? <span onClick={() => navigate('/login')}>Sign In</span></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;