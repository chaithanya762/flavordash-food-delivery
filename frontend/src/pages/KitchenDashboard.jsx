import React, { useState } from 'react';
import { ALL_DISHES } from '../data/dishes';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import './KitchenDashboard.css';

export default function KitchenDashboard() {
  const { user } = useAuth() || { user: null };
  const { orders, updateOrderStatus, cancelOrder } = useOrders() || { orders: [], updateOrderStatus: () => {}, cancelOrder: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };
  
  const currentRestaurant = user?.restaurantName || 'Punjab Rasoi';
  const [restaurantFilter, setRestaurantFilter] = useState('ALL');
  const [dishesStock, setDishesStock] = useState(ALL_DISHES.slice(0, 12));
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Ingredients Exhausted / Item Out of Stock');
  const [customReason, setCustomReason] = useState('');

  // CLEANUP RULE: Filter orders for kitchen desk to ONLY show active pending orders (Hide DELIVERED and CANCELLED)
  const activeKitchenOrders = orders.filter(o => {
    const isCurrentRes = restaurantFilter === 'ALL' || o.restaurantName?.toLowerCase() === restaurantFilter.toLowerCase();
    const isPendingActive = !['DELIVERED', 'CANCELLED'].includes(o.status);
    return isCurrentRes && isPendingActive;
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} updated to ${newStatus}! 👨‍🍳`, 'success');
  };

  const handleConfirmKitchenCancel = () => {
    if (!cancelModalOrder) return;
    const finalReason = cancelReason === 'Other' ? customReason : cancelReason;

    cancelOrder(cancelModalOrder.id, 'HOTEL_MANAGER', finalReason);
    showToast(`Order #${cancelModalOrder.id} cancelled & removed from active kitchen. 💰 100% Full Refund issued!`, 'info');
    
    setCancelModalOrder(null);
    setCancelReason('Ingredients Exhausted / Item Out of Stock');
    setCustomReason('');
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
          <p className="page-subtitle">Manage active pending customer orders and kitchen stock</p>
        </div>

        <div className="kitchen-analytics glass-card">
          <div className="analytic-stat">
            <span className="stat-label">RESTAURANT</span>
            <span className="stat-val gradient-text">{currentRestaurant}</span>
          </div>
          <div className="analytic-stat">
            <span className="stat-label">ACTIVE KITCHEN ORDERS</span>
            <span className="stat-val text-amber">{activeKitchenOrders.length}</span>
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
        {/* Incoming Active Orders Pipeline */}
        <div className="kitchen-orders-section">
          <h2>Active Kitchen Pipeline ({activeKitchenOrders.length} Orders)</h2>

          {activeKitchenOrders.length === 0 ? (
            <div className="empty-kitchen-state glass-card p-6 text-center">
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>👨‍🍳</span>
              <h3>No pending active orders for this kitchen</h3>
              <p className="text-secondary mt-1">Delivered and cancelled orders are automatically archived.</p>
            </div>
          ) : (
            <div className="kitchen-orders-list">
              {activeKitchenOrders.map(order => (
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

                    <div className="k-action-btns flex-wrap gap-2">
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

                      {/* HOTEL MANAGER REJECT/CANCEL BUTTON */}
                      <button 
                        className="btn-k-cancel"
                        onClick={() => setCancelModalOrder(order)}
                      >
                        🚫 Cancel Order
                      </button>
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

      {/* HOTEL MANAGER CANCELLATION REASON MODAL */}
      {cancelModalOrder && (
        <div className="modal-backdrop-3d fade-in">
          <div className="modal-card-3d glass-god-card p-6">
            <h3 className="gradient-text mb-2">🚫 Cancel Order #{cancelModalOrder.id} (Hotel Manager)</h3>
            <p className="text-secondary text-sm mb-4">
              Cancelling this order will automatically process a <strong className="text-emerald">100% Full Refund (₹{cancelModalOrder.totalAmount})</strong> for the customer and remove it from active kitchen.
            </p>

            <div className="form-group mb-4">
              <label className="block text-sm font-bold mb-2">State Reason for Kitchen Cancellation:</label>
              <select 
                className="glass-input-3d w-full p-3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="Ingredients Exhausted / Item Out of Stock">Ingredients Exhausted / Item Out of Stock</option>
                <option value="Kitchen Peak Hour Overload / Capacity Full">Kitchen Peak Hour Overload / Capacity Full</option>
                <option value="Special Culinary Request Cannot Be Met">Special Culinary Request Cannot Be Met</option>
                <option value="Equipment Failure / Stove Malfunction">Equipment Failure / Stove Malfunction</option>
                <option value="Other">Other reason...</option>
              </select>
            </div>

            {cancelReason === 'Other' && (
              <div className="form-group mb-4">
                <input 
                  type="text" 
                  className="glass-input-3d w-full p-3"
                  placeholder="Specify kitchen reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="modal-actions flex gap-3 justify-end mt-6">
              <button className="btn-outline" onClick={() => setCancelModalOrder(null)}>
                Back to Kitchen Desk
              </button>
              <button className="btn-danger-confirm" onClick={handleConfirmKitchenCancel}>
                Confirm Cancellation & Issue Full Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
