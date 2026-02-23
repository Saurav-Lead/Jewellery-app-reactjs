import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JewelryCatalog.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Send login credentials to Spring Boot
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: email,
        password: password
      });

      // 2. Handle successful login
      console.log("Login Successful:", response.data);
      
      // Store user info in localStorage to keep them logged in
      localStorage.setItem("user", JSON.stringify(response.data));
      
      alert(`Welcome back, ${response.data.fullName}!`);
      navigate('/'); // Redirect to Catalog
      
    } catch (err) {
      // 3. Handle Errors (401 Unauthorized, 404 Not Found)
      const errorMsg = err.response?.data || "Login failed. Please check your credentials.";
      alert(errorMsg);
    }
  };

  return (
    <div className="catalog-container login-wrapper">
      <nav className="navbar">
        <div className="nav-main-row">
        <div className="nav-logo" onClick={() => navigate('/')}>
          HERITAGE<span>GEMS</span>
        </div>
        </div>
      </nav>
      <div className="login-card-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Member Login</h2>
          <p>Access your vault and orders</p>
        </div>
       
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-submit-btn">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>New to Heritage Gems? <span onClick={() => navigate('/register')}>Create Account</span></p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default LoginPage;