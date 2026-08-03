import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import './DriverDashboard.css';

export default function DriverDashboard() {
  const { user } = useAuth() || { user: null };
  const { orders, updateOrderStatus } = useOrders() || { orders: [], updateOrderStatus: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };

  const riderName = user?.name || 'Ramesh Kumar (Rider Express)';
  const [driverStatus, setDriverStatus] = useState('ONLINE');
  const [progress, setProgress] = useState(35);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // STRICT FILTERING: Only show active ready/dispatched/cooking/delivered orders for riders!
  const activeRiderOrders = orders.filter(o => ['READY', 'DISPATCHED', 'COOKING', 'DELIVERED', 'RECEIVED'].includes(o.status));

  // Active targeted delivery order (No arbitrary fallback)
  const targetOrder = orders.find(o => String(o.id) === String(selectedOrderId)) || activeRiderOrders[0] || null;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 95 ? 20 : prev + 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus, riderName);
    showToast(`Order #${orderId} status updated to ${newStatus}! 🛵`, 'success');
  };

  return (
    <div className="driver-page container fade-in">
      <div className="driver-header">
        <div>
          <div className="driver-profile-pill">
            <span className="live-dot"></span> RIDER: {riderName.toUpperCase()}
          </div>
          <h1 className="page-title gradient-text">Delivery Hero Dashboard 🛵</h1>
          <p className="page-subtitle">Real-time GPS route navigation and order delivery portal</p>
        </div>

        <div className="driver-duty-toggle glass-card">
          <span className="duty-label">DUTY STATUS</span>
          <button 
            className={`btn-duty ${driverStatus === 'ONLINE' ? 'online' : 'offline'}`}
            onClick={() => setDriverStatus(driverStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE')}
          >
            {driverStatus === 'ONLINE' ? '🟢 On Duty (Receiving Dispatch Tasks)' : '🔴 Off Duty'}
          </button>
        </div>
      </div>

      {/* DISPATCH ORDER QUEUE CAROUSEL / SELECTOR */}
      {activeRiderOrders.length > 0 && (
        <div className="rider-dispatch-queue mb-6">
          <h2 className="queue-title">📦 Available Dispatch Queue ({activeRiderOrders.length} Orders)</h2>
          <div className="dispatch-chips-row">
            {activeRiderOrders.map(o => (
              <button
                key={o.id}
                className={`dispatch-chip-btn ${String(o.id) === String(targetOrder?.id) ? 'active' : ''} ${o.status.toLowerCase()}`}
                onClick={() => setSelectedOrderId(o.id)}
              >
                <span>Order #{o.id}</span>
                <span className="chip-status">[{o.status}]</span>
                <span className="chip-res">{o.restaurantName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {targetOrder ? (
        <div className="driver-layout">
          {/* Live GPS Map Simulation Box */}
          <div className="gps-map-card glass-god-card">
            <div className="map-header">
              <div className="map-title">
                <span className="map-icon">🛰️</span> Live GPS Telemetry Stream (Order #{targetOrder.id})
              </div>
              <span className="eta-badge">⏱️ ETA: 12 mins (3.4 km)</span>
            </div>

            <div className="map-canvas-box">
              <div className="road-path">
                <div className="vehicle-marker" style={{ left: `${progress}%` }}>
                  <span className="rider-emoji">🛵</span>
                  <div className="rider-ping-ring"></div>
                </div>

                <div className="map-point pickup-point">
                  <span>📍 {targetOrder.restaurantName || 'Kitchen'}</span>
                </div>
                <div className="map-point drop-point">
                  <span>🏠 {targetOrder.customerName}</span>
                </div>
              </div>

              <div className="gps-live-coordinates">
                LAT: 28.6139° N | LON: 77.2090° E | SPEED: 38 km/h | RIDER: {riderName}
              </div>
            </div>
          </div>

          {/* Active Order Pickup Info */}
          <div className="delivery-info-card glass-card">
            <div className="delivery-card-header">
              <span className="del-id">Order #{targetOrder.id}</span>
              <span className="del-earnings">Fee: <strong>₹85</strong></span>
            </div>

            <div className="delivery-route-details">
              <div className="route-step">
                <span className="step-icon">🏬</span>
                <div>
                  <span className="step-title">PICKUP RESTAURANT</span>
                  <span className="step-val">{targetOrder.restaurantName || 'Punjab Rasoi'}</span>
                </div>
              </div>

              <div className="route-step">
                <span className="step-icon">🏠</span>
                <div>
                  <span className="step-title">DELIVER TO CUSTOMER</span>
                  <span className="step-val">{targetOrder.customerName} ({targetOrder.customerPhone})</span>
                  <span className="step-sub">{targetOrder.deliveryAddress}</span>
                </div>
              </div>
            </div>

            <div className="delivery-items-box">
              <h4>Order Items ({targetOrder.items?.length || 1}):</h4>
              {targetOrder.items && targetOrder.items.length > 0 ? (
                targetOrder.items.map((item, i) => (
                  <div key={i} className="del-item-name">• {item.quantity}x {item.name} (₹{item.price * item.quantity})</div>
                ))
              ) : (
                <div className="del-item-name">• Signature Plated Delicacies</div>
              )}
            </div>

            <div className="delivery-actions">
              {['READY', 'COOKING', 'RECEIVED'].includes(targetOrder.status) && (
                <button className="btn-del-action pickup" onClick={() => handleStatusChange(targetOrder.id, 'DISPATCHED')}>
                  📦 Accept & Start Route
                </button>
              )}
              {targetOrder.status === 'DISPATCHED' && (
                <button className="btn-del-action complete" onClick={() => handleStatusChange(targetOrder.id, 'DELIVERED')}>
                  ✅ Mark Order Delivered & Collect Payment
                </button>
              )}
              {targetOrder.status === 'DELIVERED' && (
                <div className="delivery-complete-msg">
                  🎉 Delivery Completed! Earning ₹85 Added to Rider Wallet.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-rider-state glass-card text-center p-8">
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🛵</span>
          <h3>No active orders in dispatch queue</h3>
          <p className="text-secondary mt-2">Stay online! Customer orders will appear here as soon as kitchens prepare them.</p>
        </div>
      )}
    </div>
  );
}
