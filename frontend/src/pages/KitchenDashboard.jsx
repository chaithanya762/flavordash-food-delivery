import React, { useState } from 'react';
import { ALL_DISHES } from '../data/dishes';
import { useToast } from '../context/ToastContext';
import './KitchenDashboard.css';

export default function KitchenDashboard() {
  const { showToast } = useToast() || { showToast: () => {} };
  
  const [kitchenOrders, setKitchenOrders] = useState([
    { id: 401, customer: 'Alex Johnson', items: ['Butter Chicken Special x2', 'Garlic Naan x4'], total: 956, status: 'RECEIVED', time: '2 mins ago', table: 'Delivery #001' },
    { id: 402, customer: 'Priya Sharma', items: ['Hyderabadi Dum Biryani x1', 'Punjabi Lassi x2'], total: 567, status: 'COOKING', time: '7 mins ago', table: 'Delivery #002' },
    { id: 403, customer: 'Rahul Verma', items: ['Mysore Masala Dosa x2', 'Filter Coffee x2'], total: 556, status: 'READY', time: '14 mins ago', table: 'Delivery #003' },
  ]);

  const [dishesStock, setDishesStock] = useState(ALL_DISHES.slice(0, 10));

  const updateOrderStatus = (orderId, newStatus) => {
    setKitchenOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    showToast(`Order #${orderId} updated to ${newStatus}! 👨‍🍳`, 'success');
  };

  const toggleStock = (dishId) => {
    setDishesStock(prev => prev.map(dish => 
      dish.id === dishId ? { ...dish, available: !dish.available } : dish
    ));
    const dish = dishesStock.find(d => d.id === dishId);
    showToast(`${dish.name} status toggled!`, 'info');
  };

  return (
    <div className="kitchen-page container fade-in">
      <div className="kitchen-header">
        <div>
          <div className="status-live-badge">
            <span className="live-dot"></span> LIVE KITCHEN DESK (PUNJAB RASOI & CO)
          </div>
          <h1 className="page-title gradient-text">Chef Kitchen & Inventory Portal 👨‍🍳</h1>
          <p className="page-subtitle">Manage incoming orders, preparation pipelines, and stock status</p>
        </div>

        <div className="kitchen-analytics glass-card">
          <div className="analytic-stat">
            <span className="stat-label">TODAY'S REVENUE</span>
            <span className="stat-val gradient-text">₹24,890</span>
          </div>
          <div className="analytic-stat">
            <span className="stat-label">ACTIVE ORDERS</span>
            <span className="stat-val text-amber">{kitchenOrders.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Orders Pipeline vs Stock Control */}
      <div className="kitchen-layout">
        {/* Incoming Orders Pipeline */}
        <div className="kitchen-orders-section">
          <h2>Active Kitchen Pipeline</h2>
          <div className="kitchen-orders-list">
            {kitchenOrders.map(order => (
              <div key={order.id} className={`kitchen-order-card glass-card ${order.status.toLowerCase()}`}>
                <div className="k-card-header">
                  <div>
                    <span className="k-order-id">Order #{order.id}</span>
                    <span className="k-customer-name">👤 {order.customer} ({order.table})</span>
                  </div>
                  <span className={`k-status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="k-items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="k-item-row">
                      <span>• {item}</span>
                    </div>
                  ))}
                </div>

                <div className="k-card-footer">
                  <span className="k-total-price">₹{order.total}</span>
                  <div className="k-action-btns">
                    {order.status === 'RECEIVED' && (
                      <button className="btn-k-action cook" onClick={() => updateOrderStatus(order.id, 'COOKING')}>
                        👨‍🍳 Start Cooking
                      </button>
                    )}
                    {order.status === 'COOKING' && (
                      <button className="btn-k-action ready" onClick={() => updateOrderStatus(order.id, 'READY')}>
                        📦 Mark Ready
                      </button>
                    )}
                    {order.status === 'READY' && (
                      <button className="btn-k-action dispatch" onClick={() => updateOrderStatus(order.id, 'DISPATCHED')}>
                        🛵 Dispatch Rider
                      </button>
                    )}
                    {order.status === 'DISPATCHED' && (
                      <span className="dispatched-label">Rider En Route 🚀</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Stock Manager */}
        <div className="kitchen-stock-section glass-card">
          <h2>Inventory Stock Control</h2>
          <p className="stock-subtitle">Toggle dish availability to update frontend menu instantly</p>

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
