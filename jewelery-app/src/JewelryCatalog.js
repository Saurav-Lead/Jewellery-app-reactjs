import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import './JewelryCatalog.css';
import HeritageSkeleton from './HeritageSkeleton';

const JewelryCatalog = ({ cartCount }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 1. Initialize user from the new storage keys
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const token = localStorage.getItem("token");

  const [filters, setFilters] = useState({
    metalType: "All",
    category: "All",
    maxPrice: 15000
  });
  const [sortOption, setSortOption] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    
    // 2. Fetching products (Public Route)
    // Note: If you lock products behind security later, 
    // you would add { headers: { Authorization: `Bearer ${token}` } }
    axios.get(`${API_URL}/api/products`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Catalog Fetch Error:", err);
        setError("Unable to load collection.");
        setLoading(false);
      });
  }, []);

  const filteredProducts = products
    .filter(item => {
      const price = Number(item.shelfPrice || item.ShelfPrice || 0);
      const matchesSearch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.metalType?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMetal = filters.metalType === "All" || item.metalType === filters.metalType;
      const matchesCategory = filters.category === "All" || item.category?.name === filters.category;
      const matchesPrice = price <= filters.maxPrice;

      return matchesSearch && matchesMetal && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      const priceA = Number(a.shelfPrice || a.ShelfPrice || 0);
      const priceB = Number(b.shelfPrice || b.ShelfPrice || 0);
      if (sortOption === "price-low") return priceA - priceB;
      if (sortOption === "price-high") return priceB - priceA;
      return 0;
    });

  return (
    <div className="catalog-page-wrapper">
      <div className="catalog-container">
        {/* Pass userEmail to Navbar to show "Welcome, [Email]" or Profile icon */}
        <Navbar cartCount={cartCount} userEmail={userEmail} />

        <div className="search-filter-hub">
          {/* ... Search bar and filters remain the same ... */}
          <div className="search-bar-standalone">
            <input 
              type="text" 
              placeholder="Search for gold, diamonds, rings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-pill-container">
            <div className="filter-dropdown-wrapper">
              <select value={filters.metalType} onChange={(e) => setFilters({...filters, metalType: e.target.value})}>
                <option value="All">All Metals</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Platinum">Platinum</option>
              </select>

              <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})}>
                <option value="All">All Categories</option>
                <option value="Rings">Rings</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Earrings">Earrings</option>
              </select>

              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="">Sort: Featured</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
              </select>
            </div>

            <div className="price-slider-pill">
              <span>Under ${Number(filters.maxPrice).toLocaleString()}</span>
              <input 
                type="range" min="500" max="20000" step="500"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
          </div>
        </div>

        {error ? (
           <div className="error-message">{error}</div>
        ) : (
          <div className="product-grid">
            {loading ? (
              <HeritageSkeleton type="card" count={8} />
            ) : (
              filteredProducts.map((item) => (
                <div key={item.productId} className="product-card">
                  <div className="product-image-container">
                    <img 
                      src={item.imageUrl || 'https://via.placeholder.com/300'} 
                      alt={item.productName} 
                      className="product-image"
                    />
                  </div>
                  <div className="metal-badge">{item.metalPurity} {item.metalType}</div>
                  <div className="product-info">
                    <h3>{item.productName}</h3>
                    <p className="category">{item.category?.name || 'Fine Jewelry'}</p>
                    <div className="price-tag">
                      ${Number(item.shelfPrice || item.ShelfPrice || 0).toLocaleString()}
                    </div>
                    <button className="view-btn" onClick={() => navigate(`/product/${item.productId}`)}>
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {filteredProducts.length === 0 && !loading && !error && (
          <p className="no-results">No jewelry matches your refined search.</p>
        )}
      </div>

      
    </div>
  );
};

export default JewelryCatalog;