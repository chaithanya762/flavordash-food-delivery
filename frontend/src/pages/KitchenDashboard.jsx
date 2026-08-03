import React, { useState } from 'react';
import { ALL_DISHES } from '../data/dishes';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import './KitchenDashboard.css';

export default function KitchenDashboard() {
  const { user } = useAuth() || { user: null };
  const { orders, updateOrderStatus } = useOrders() || { orders: [], updateOrderStatus: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };
  
  const currentRestaurant = user?.restaurantName || 'Punjab Rasoi';
  const [restaurantFilter, setRestaurantFilter] = useState('ALL');
  const [dishesStock, setDishesStock] = useState(ALL_DISHES.slice(0, 12));

  // Filter orders for kitchen desk
  const filteredOrders = orders.filter(o => {
    if (restaurantFilter === 'ALL') return true;
    return o.restaurantName?.toLowerCase() === restaurantFilter.toLowerCase();
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} updated to ${newStatus}! 👨‍🍳`, 'success');
  };

  const toggleStock = (dishId) => {
    setDishesStock(prev => prev.map(dish => 
      dish.id === dishId ? { ...dish, available: !dish.available } : dish
    ));
    const dish = dishesStock.find(d => d.id === dishId);
    showToast(`${dish.name} availability updated!`, 'info');
  };

  const uniqueRestaurants = ['ALL', ...new Set(ALL_DISHES.map(d => d.restaurantName))];

  return (
    <div className="kitchen-page container fade-in">
      <div className="kitchen-header">
        <div>
          <div className="status-live-badge">
            <span className="live-dot"></span> KITCHEN DESK: {currentRestaurant.toUpperCase()}
          </div>
          <h1 className="page-title gradient-text">Chef Kitchen & Inventory Portal 👨‍🍳</h1>
          <p className="page-subtitle">Manage live customer orders, kitchen cooking pipelines, and menu availability</p>
        </div>

        <div className="kitchen-analytics glass-card">
          <div className="analytic-stat">
            <span className="stat-label">RESTAURANT</span>
            <span className="stat-val gradient-text">{currentRestaurant}</span>
          </div>
          <div className="analytic-stat">
            <span className="stat-label">ACTIVE ORDERS</span>
            <span className="stat-val text-amber">{filteredOrders.length}</span>
          </div>
        </div>
      </div>

      {/* Restaurant Selector Filter */}
      <div className="restaurant-filter-row mb-6">
        <span className="filter-label">🏪 Select Kitchen View:</span>
        <div className="restaurant-chips-scroll">
          {uniqueRestaurants.map(res => (
            <button
              key={res}
              className={`res-chip-btn ${restaurantFilter === res ? 'active' : ''}`}
              onClick={() => setRestaurantFilter(res)}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Orders Pipeline vs Stock Control */}
      <div className="kitchen-layout">
        {/* Incoming Orders Pipeline */}
        <div className="kitchen-orders-section">
          <h2>Active Kitchen Pipeline ({filteredOrders.length} Orders)</h2>

          {filteredOrders.length === 0 ? (
            <div className="empty-kitchen-state glass-card p-6 text-center">
              <span>👨‍🍳</span>
              <h3>No active orders for this kitchen</h3>
              <p>Waiting for incoming customer orders...</p>
            </div>
          ) : (
            <div className="kitchen-orders-list">
              {filteredOrders.map(order => (
                <div key={order.id} className={`kitchen-order-card glass-card ${order.status.toLowerCase()}`}>
                  <div className="k-card-header">
                    <div>
                      <span className="k-order-id">Order #{order.id}</span>
                      <span className="k-customer-name">👤 {order.customerName}</span>
                      <span className="k-res-name">🏪 {order.restaurantName}</span>
                    </div>
                    <span className={`k-status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="k-items-list">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx} className="k-item-row">
                          <span>• {item.quantity}x {item.name}</span>
                          <span className="k-item-price">₹{item.price * item.quantity}</span>
                        </div>
                      ))
                    ) : (
                      <div className="k-item-row">
                        <span>• {order.productIds ? order.productIds.length : 1} Signature Delicacies</span>
                      </div>
                    )}
                  </div>

                  <div className="k-card-footer">
                    <div className="k-footer-meta">
                      <span className="k-total-price">₹{order.totalAmount}</span>
                      <span className="k-address">📍 {order.deliveryAddress}</span>
                    </div>

                    <div className="k-action-btns">
                      {order.status === 'RECEIVED' && (
                        <button className="btn-k-action cook" onClick={() => handleStatusChange(order.id, 'COOKING')}>
                          👨‍🍳 Start Cooking
                        </button>
                      )}
                      {order.status === 'COOKING' && (
                        <button className="btn-k-action ready" onClick={() => handleStatusChange(order.id, 'READY')}>
                          📦 Mark Ready
                        </button>
                      )}
                      {order.status === 'READY' && (
                        <button className="btn-k-action dispatch" onClick={() => handleStatusChange(order.id, 'DISPATCHED')}>
                          🛵 Dispatch Rider
                        </button>
                      )}
                      {order.status === 'DISPATCHED' && (
                        <span className="dispatched-label">Rider En Route 🚀</span>
                      )}
                      {order.status === 'DELIVERED' && (
                        <span className="delivered-label">✅ Order Delivered</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu Stock Manager */}
        <div className="kitchen-stock-section glass-card">
          <h2>Inventory Stock Control</h2>
          <p className="stock-subtitle">Toggle dish availability to update customer menu instantly</p>

          <div className="stock-dishes-list">
            {dishesStock.map(dish => (
              <div key={dish.id} className="stock-row">
                <div className="stock-dish-info">
                  <span className="stock-dish-name">{dish.name}</span>
                  <span className="stock-dish-price">₹{dish.price}</span>
                </div>
                <button 
                  className={`btn-stock-toggle ${dish.available ? 'in-stock' : 'out-stock'}`}
                  onClick={() => toggleStock(dish.id)}
                >
                  {dish.available ? '🟢 In Stock' : '🔴 Sold Out'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
