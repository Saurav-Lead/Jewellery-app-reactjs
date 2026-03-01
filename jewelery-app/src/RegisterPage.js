import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JewelryCatalog.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Added loading state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      
      // The keys here (fullName, email, password) must match your Java User.java fields exactly
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        fullName: formData.fullName,
        email: formData.email, 
        password: formData.password
      });

      console.log("Registration Successful:", response.data);
      alert("Account created successfully! Welcome to Heritage Gems.");
      navigate('/login');
      
    } catch (err) {
      console.error("Registration Error:", err);
      // Accessing the specific error message sent by your ResponseEntity.badRequest()
      const errorMessage = err.response?.data || "Connection failed. Is the backend running?";
      alert(errorMessage);
    } finally {
      setLoading(false);
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-submit-btn" 
            style={{ 
                background: loading ? '#ccc' : '#ff4d6d',
                cursor: loading ? 'not-allowed' : 'pointer' 
            }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register Now"}
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