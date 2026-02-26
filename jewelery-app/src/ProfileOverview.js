import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './JewelryCatalog.css'; 

const ProfileOverview = ({ cartCount }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    
    if (storedUser?.userId) {
      axios.get(`${API_URL}/api/auth/${storedUser.userId}`)
        .then(res => {
          setProfile(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching User details", err);
          setLoading(false);
        });
    } else {
      navigate('/login');
    }
  }, [API_URL, navigate]);

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
                <button className="view-btn" onClick={() => {
                  localStorage.removeItem("user");
                  navigate('/login');
                }}>Logout</button>
              </div>
            </div>
          ) : (
            <p>No user data found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;