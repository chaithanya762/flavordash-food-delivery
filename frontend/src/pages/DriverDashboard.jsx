import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import './DriverDashboard.css';

export default function DriverDashboard() {
  const { showToast } = useToast() || { showToast: () => {} };
  const [driverStatus, setDriverStatus] = useState('ONLINE');
  const [progress, setProgress] = useState(45);

  const [activeDelivery, setActiveDelivery] = useState({
    id: 'DEL-9918',
    customer: 'Alex Johnson',
    phone: '+91 98765 43210',
    pickup: 'Punjab Rasoi, Connaught Place',
    dropoff: '742 Evergreen Terrace, Sector 62',
    distance: '3.4 km',
    estTime: '12 mins',
    earnings: '₹85',
    status: 'EN_ROUTE_CUSTOMER',
    items: ['Butter Chicken Special x2', 'Garlic Naan x4']
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 95 ? 20 : prev + 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (newStatus) => {
    setActiveDelivery(prev => ({ ...prev, status: newStatus }));
    showToast(`Delivery status updated to ${newStatus}! 🛵`, 'success');
  };

  return (
    <div className="driver-page container fade-in">
      <div className="driver-header">
        <div>
          <div className="driver-profile-pill">
            <span className="live-dot"></span> RIDER: RAMESH KUMAR (ID #8821)
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
            {driverStatus === 'ONLINE' ? '🟢 On Duty (Receiving Orders)' : '🔴 Off Duty'}
          </button>
        </div>
      </div>

      <div className="driver-layout">
        {/* Live GPS Map Simulation Box */}
        <div className="gps-map-card glass-god-card">
          <div className="map-header">
            <div className="map-title">
              <span className="map-icon">🛰️</span> Live GPS Telemetry Stream
            </div>
            <span className="eta-badge">⏱️ ETA: {activeDelivery.estTime} ({activeDelivery.distance})</span>
          </div>

          <div className="map-canvas-box">
            <div className="road-path">
              <div className="vehicle-marker" style={{ left: `${progress}%` }}>
                <span className="rider-emoji">🛵</span>
                <div className="rider-ping-ring"></div>
              </div>

              <div className="map-point pickup-point">
                <span>📍 Pickup</span>
              </div>
              <div className="map-point drop-point">
                <span>🏠 Customer</span>
              </div>
            </div>

            <div className="gps-live-coordinates">
              LAT: 28.6139° N | LON: 77.2090° E | SPEED: 38 km/h
            </div>
          </div>
        </div>

        {/* Active Order Pickup Info */}
        <div className="delivery-info-card glass-card">
          <div className="delivery-card-header">
            <span className="del-id">{activeDelivery.id}</span>
            <span className="del-earnings">Payer Fee: <strong>{activeDelivery.earnings}</strong></span>
          </div>

          <div className="delivery-route-details">
            <div className="route-step">
              <span className="step-icon">🏬</span>
              <div>
                <span className="step-title">PICKUP FROM</span>
                <span className="step-val">{activeDelivery.pickup}</span>
              </div>
            </div>

            <div className="route-step">
              <span className="step-icon">🏠</span>
              <div>
                <span className="step-title">DELIVER TO</span>
                <span className="step-val">{activeDelivery.customer}</span>
                <span className="step-sub">{activeDelivery.dropoff}</span>
              </div>
            </div>
          </div>

          <div className="delivery-items-box">
            <h4>Order Items:</h4>
            {activeDelivery.items.map((item, i) => (
              <div key={i} className="del-item-name">• {item}</div>
            ))}
          </div>

          <div className="delivery-actions">
            {activeDelivery.status === 'EN_ROUTE_KITCHEN' && (
              <button className="btn-del-action pickup" onClick={() => handleStatusChange('EN_ROUTE_CUSTOMER')}>
                📦 Mark Order Picked Up
              </button>
            )}
            {activeDelivery.status === 'EN_ROUTE_CUSTOMER' && (
              <button className="btn-del-action complete" onClick={() => handleStatusChange('DELIVERED')}>
                ✅ Complete Delivery & Collect Cash/UPI
              </button>
            )}
            {activeDelivery.status === 'DELIVERED' && (
              <div className="delivery-complete-msg">
                🎉 Delivery Completed! Earning Added to Wallet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
