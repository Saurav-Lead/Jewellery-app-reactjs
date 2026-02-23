import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './JewelryCatalog.css';

const JewelryCatalog = ({ cartCount }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // --- NEW FILTER STATES ---
  const [filters, setFilters] = useState({
    metalType: "All",
    category: "All",
    maxPrice: 15000
  });
  const [sortOption, setSortOption] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    axios.get(`${API_URL}/api/products`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Unable to load collection.");
        setLoading(false);
      });
  }, []);

  // --- INTEGRATED FILTER & SORT LOGIC ---
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

  if (loading) return <div className="loader">Refining Collection...</div>;

  return (
    <div className="catalog-container">
      <Navbar cartCount={cartCount} />

      {/* --- INTEGRATED SEARCH & FILTER HUB --- */}
      <div className="search-filter-hub">
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
      <div className="product-grid">
        {filteredProducts.map((item) => (
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
        ))}
      </div>
      {filteredProducts.length === 0 && <p className="no-results">No jewelry matches your refined search.</p>}
    </div>
  );
};

export default JewelryCatalog;