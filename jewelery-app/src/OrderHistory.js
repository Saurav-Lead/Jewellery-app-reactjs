import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './JewelryCatalog.css';
import Navbar from './Navbar';

const OrderHistory = ({ cartCount }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // SECURITY CHANGE: Get token instead of the user object
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // Memoized fetch function
  const fetchOrders = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // SECURITY CHANGE: 
      // 1. URL changed from /user/${userId} to /history
      // 2. Added Authorization header with Bearer token
      const response = await axios.get(`${API_URL}/api/orders/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching order history:", error);
      // If unauthorized (403), force a login
      if (error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [token, API_URL, navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="catalog-container">
      <Navbar cartCount={cartCount} />
      
      <div className="order-history-container">
        <button className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
           Back
        </button>

        <h2 className="section-title">Order History</h2>
         
        {loading ? (
          <div className="loader">Loading your vault history...</div>
        ) : orders.length === 0 ? (
          <div className="empty-history">
            <p>No treasures found in your history yet.</p>
            <button className="view-btn" onClick={() => navigate('/')}>Start Shopping</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <div className="order-meta">
                    <span className="order-id">Order #{order.orderId}</span>
                    <span className="order-date">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={`order-status status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.items.map((item, index) => (
                    <div key={index} className="history-item-row">
                      <span>Product ID: {item.productId}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>${parseFloat(item.priceAtPurchase).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="shipping-info">
                    <strong>Shipped to:</strong> 
                    <p>{order.shippingAddress}</p>
                  </div>
                  <div className="order-total-box">
                    <span className="total-label">Grand Total: </span>
                    <span className="total-value">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;