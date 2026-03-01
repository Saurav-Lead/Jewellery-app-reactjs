import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './JewelryCatalog.css'; 

const ProfileOverview = ({ cartCount }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // SECURITY CHANGE: Source of truth is now the Token
  const token = localStorage.getItem("token");
  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080');

  useEffect(() => {
    // If no token exists, the user is definitely not logged in
    if (!token) {
      navigate('/login');
      return;
    }

    // SECURITY CHANGE: 
    // We removed /{userId} from the URL. 
    // The Backend will identify "me" from the Bearer Token.
    axios.get(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setProfile(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching User details", err);
      // If token is invalid or expired (403), clean up and redirect
      if (err.response?.status === 403 || err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate('/login');
      }
      setLoading(false);
    });
  }, [token, API_URL, navigate]);

  const handleLogout = () => {
    // SECURITY CHANGE: Clear all security-related storage
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user"); // Clean up old legacy data if any
    navigate('/login');
  };

  return (
    <div className="catalog-container">
      <Navbar cartCount={cartCount} />
      
      <div className="profile-page-wrapper">
        <div className="profile-card">
          <button className="back-btn" onClick={() => navigate('/')}>
            Back to Collection
          </button>

          <h2 className="profile-title">My Account</h2>
          
          {loading ? (
            <div className="loader">Loading profile...</div>
          ) : profile ? (
            <div className="profile-info-grid">
              <div className="info-group">
                <label>Full Name</label>
                <p>{profile.fullName}</p>
              </div>
              
              <div className="info-group">
                <label>Email Address</label>
                <p>{profile.email}</p>
              </div>

              <div className="profile-actions">
                <button className="view-btn">Edit Profile</button>
                <div className='btn-space'></div>
                <button className="view-btn" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <div className="no-data-msg">
                <p>No user data found.</p>
                <button className="view-btn" onClick={() => navigate('/login')}>Login Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;