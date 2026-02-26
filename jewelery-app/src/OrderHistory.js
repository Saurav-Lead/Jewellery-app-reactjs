import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './JewelryCatalog.css';
import Navbar from './Navbar';

const OrderHistory = ({ cartCount }) => { // Destructured cartCount
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (!user || !user.userId) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/orders/user/${user.userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.userId, API_URL, navigate]);

  return (
    <div className="catalog-container"> {/* Main wrapper for consistent styling */}
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
                    <span className="total-value">${parseFloat(order.totalAmount).toFixed(2)}</span>
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