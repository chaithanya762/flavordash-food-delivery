import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import './DriverDashboard.css';

export default function DriverDashboard() {
  const { user } = useAuth() || { user: null };
  const { orders, updateOrderStatus, cancelOrder } = useOrders() || { orders: [], updateOrderStatus: () => {}, cancelOrder: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };

  const riderName = user?.name || 'Ramesh Kumar (Rider Express)';
  const [driverStatus, setDriverStatus] = useState('ONLINE');
  const [progress, setProgress] = useState(35);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Vehicle Mechanical Failure / Flat Tyre');
  const [customReason, setCustomReason] = useState('');

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

  const handleConfirmRiderCancel = () => {
    if (!cancelModalOrder) return;
    const finalReason = cancelReason === 'Other' ? customReason : cancelReason;

    cancelOrder(cancelModalOrder.id, 'RIDER', finalReason);
    showToast(`Task #${cancelModalOrder.id} cancelled. 💰 100% Full Refund issued to customer!`, 'info');

    setCancelModalOrder(null);
    setCancelReason('Vehicle Mechanical Failure / Flat Tyre');
    setCustomReason('');
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

            <div className="delivery-actions flex-wrap gap-2">
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

              {/* RIDER EMERGENCY CANCEL BUTTON */}
              {targetOrder.status !== 'CANCELLED' && targetOrder.status !== 'DELIVERED' && (
                <button 
                  className="btn-rider-cancel"
                  onClick={() => setCancelModalOrder(targetOrder)}
                >
                  🚫 Emergency Cancel / Reject Task
                </button>
              )}
            </div>

            {targetOrder.status === 'CANCELLED' && (
              <div className="rider-cancelled-note mt-3 p-3 bg-red-900-20 rounded border-red">
                <span className="text-red font-bold">🚫 Cancelled by {targetOrder.cancelledBy}</span>
                <p className="text-xs text-secondary">Reason: "{targetOrder.cancellationReason}"</p>
                <p className="text-xs text-emerald mt-1">💰 Full Refund Issued to Customer (₹{targetOrder.refundAmount})</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="empty-rider-state glass-card text-center p-8">
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🛵</span>
          <h3>No active orders in dispatch queue</h3>
          <p className="text-secondary mt-2">Stay online! Customer orders will appear here as soon as kitchens prepare them.</p>
        </div>
      )}

      {/* RIDER CANCELLATION REASON MODAL */}
      {cancelModalOrder && (
        <div className="modal-backdrop-3d fade-in">
          <div className="modal-card-3d glass-god-card p-6">
            <h3 className="gradient-text mb-2">🚫 Cancel Delivery Task #{cancelModalOrder.id} (Rider Agent)</h3>
            <p className="text-secondary text-sm mb-4">
              Cancelling this task will notify the system and process a <strong className="text-emerald">100% Full Refund (₹{cancelModalOrder.totalAmount})</strong> for the customer.
            </p>

            <div className="form-group mb-4">
              <label className="block text-sm font-bold mb-2">State Reason for Rider Cancellation:</label>
              <select 
                className="glass-input-3d w-full p-3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="Vehicle Mechanical Failure / Flat Tyre">Vehicle Mechanical Failure / Flat Tyre</option>
                <option value="Heavy Rain / Extreme Weather Breakdown">Heavy Rain / Extreme Weather Breakdown</option>
                <option value="Customer Address Unreachable / Wrong Phone">Customer Address Unreachable / Wrong Phone</option>
                <option value="Medical Emergency / Safety Hazard">Medical Emergency / Safety Hazard</option>
                <option value="Other">Other reason...</option>
              </select>
            </div>

            {cancelReason === 'Other' && (
              <div className="form-group mb-4">
                <input 
                  type="text" 
                  className="glass-input-3d w-full p-3"
                  placeholder="Specify rider reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="modal-actions flex gap-3 justify-end mt-6">
              <button className="btn-outline" onClick={() => setCancelModalOrder(null)}>
                Back to Navigation
              </button>
              <button className="btn-danger-confirm" onClick={handleConfirmRiderCancel}>
                Confirm Cancellation & Issue Full Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
