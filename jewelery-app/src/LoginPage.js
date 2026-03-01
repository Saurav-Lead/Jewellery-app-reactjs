import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JewelryCatalog.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      
      // The payload keys must match what your backend expects
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: email,
        password: password
      });

      // 1. Log the response to see the token structure
      console.log("Login Success, Token received:", response.data.token);
      
      // 2. Store the JWT Token and Email specifically
      // Standard practice: 'token' for the JWT, 'userEmail' for identification
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", response.data.email);
      
      // 3. Optional: store the whole object if you need other user details later
      localStorage.setItem("authData", JSON.stringify(response.data));
      
      alert(`Login Successful!`);
      navigate('/'); 
      
    } catch (err) {
      console.error("Login Error:", err);
      // Spring Security returns different status codes (401 for bad credentials)
      const errorMsg = err.response?.status === 401 
        ? "Invalid email or password." 
        : "Server is unreachable. Please try again later.";
      alert(errorMsg);
    } finally {
      setLoading(false);
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? "Verifying..." : "Sign In"}
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