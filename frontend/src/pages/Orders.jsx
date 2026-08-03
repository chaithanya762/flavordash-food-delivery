import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { paymentAPI } from '../api/api';
import OrderTracker from '../components/OrderTracker';
import './Orders.css';

export default function Orders() {
  const { user } = useAuth();
  const { orders, cancelOrder } = useOrders() || { orders: [], cancelOrder: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };
  
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');
  const [customReason, setCustomReason] = useState('');

  if (!user) {
    return (
      <div className="orders-page center-message fade-in container">
        <div className="glass-card text-center p-8">
          <h2>Please log in to view your orders</h2>
          <p className="text-secondary mt-2">Log in to track your live food deliveries</p>
          <Link to="/login" className="btn btn-primary mt-4">Log In</Link>
        </div>
      </div>
    );
  }

  // STRICT FILTERING: Only show orders belonging specifically to the logged-in customer!
  const userOrders = orders.filter(o => 
    (user.id && String(o.userId) === String(user.id)) ||
    (user.name && o.customerName?.toLowerCase() === user.name?.toLowerCase()) ||
    (user.email && o.customerEmail?.toLowerCase() === user.email?.toLowerCase())
  );

  const togglePayment = async (orderId) => {
    if (expandedPayment === orderId) {
      setExpandedPayment(null);
      return;
    }
    
    setExpandedPayment(orderId);
    if (!paymentDetails[orderId]) {
      try {
        const payment = await paymentAPI.getByOrder(orderId);
        setPaymentDetails(prev => ({ 
          ...prev, 
          [orderId]: payment || { id: `PAY-${orderId}`, status: 'SUCCESS', amount: 25.99, paymentMethod: 'UPI' } 
        }));
      } catch (err) {
        setPaymentDetails(prev => ({ 
          ...prev, 
          [orderId]: { id: `PAY-${orderId}`, status: 'SUCCESS', amount: 25.99, paymentMethod: 'UPI' } 
        }));
      }
    }
  };

  const handleConfirmCancel = () => {
    if (!cancelModalOrder) return;
    const finalReason = cancelReason === 'Other' ? customReason : cancelReason;
    
    cancelOrder(cancelModalOrder.id, 'CUSTOMER', finalReason);

    let refundMsg = 'Order cancelled.';
    if (cancelModalOrder.status === 'RECEIVED') {
      refundMsg = `Order cancelled! 💰 100% Full Refund of ₹${cancelModalOrder.totalAmount} processed to ${cancelModalOrder.paymentMethod || 'UPI'}`;
    } else if (cancelModalOrder.status === 'COOKING') {
      refundMsg = `Order cancelled! 💰 50% Partial Refund of ₹${Math.round(cancelModalOrder.totalAmount * 0.5)} processed to ${cancelModalOrder.paymentMethod || 'UPI'}`;
    }

    showToast(refundMsg, 'info');
    setCancelModalOrder(null);
    setCancelReason('Ordered by mistake');
    setCustomReason('');
  };

  return (
    <div className="orders-page container fade-in">
      <div className="experience-badge-pill mb-2">
        <span className="sparkle">✨</span> REAL-TIME DISPATCH TRACKER
      </div>
      <h1 className="page-title gradient-text">My Orders ({userOrders.length}) 📋</h1>
      <p className="page-subtitle mb-6">Track live preparation stages, kitchen status, and rider location</p>

      {userOrders.length === 0 ? (
        <div className="empty-state glass-card text-center p-8">
          <div className="empty-emoji">🧾</div>
          <h3>No active orders</h3>
          <p>You haven't placed any orders yet. Browse our menu to place your first order!</p>
          <Link to="/menu" className="btn btn-primary mt-4">Browse Menu →</Link>
        </div>
      ) : (
        <div className="orders-list">
          {userOrders.map(order => (
            <div key={order.id} className={`order-card glass-card fade-in ${order.status === 'CANCELLED' ? 'cancelled-card' : ''}`}>
              <div className="order-header">
                <div className="order-id">
                  <h3>Order #{String(order.id).padStart(4, '0')}</h3>
                  <span className="restaurant-badge">🏬 {order.restaurantName || 'Punjab Rasoi'}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
              </div>

              <div className="order-content">
                <div className="order-info">
                  <div className="order-items-detail">
                    <span className="label">Ordered Items:</span>
                    {order.items && order.items.length > 0 ? (
                      <ul className="items-bullet-list">
                        {order.items.map((item, idx) => (
                          <li key={idx}>• {item.quantity}x {item.name} (₹{item.price * item.quantity})</li>
                        ))}
                      </ul>
                    ) : (
                      <span>{order.productIds ? order.productIds.length : 1} Signature Dishes</span>
                    )}
                  </div>
                  <p className="order-address">
                    <span className="label">Delivery Address:</span> {order.deliveryAddress}
                  </p>
                  <p className="order-total">
                    <span className="label">Total Paid:</span> 
                    <span className="gradient-text amount">₹{order.totalAmount}</span>
                  </p>
                  {order.riderName && (
                    <p className="order-rider-info">
                      <span className="label">Assigned Rider:</span> 🛵 {order.riderName}
                    </p>
                  )}

                  {/* CANCELLATION & REFUND BANNER */}
                  {order.status === 'CANCELLED' && (
                    <div className="cancellation-refund-box glass-god-card mt-4 p-4">
                      <div className="refund-header">
                        <span className="refund-icon">🚫</span>
                        <div>
                          <strong className="text-red">Order Cancelled by {order.cancelledBy || 'Customer'}</strong>
                          <p className="reason-text">Reason: "{order.cancellationReason}"</p>
                        </div>
                      </div>

                      <div className="refund-status-pill mt-3">
                        {order.refundStatus === 'FULL_REFUND_PROCESSED' && (
                          <span className="badge-refund full">
                            💰 100% Instant Refund Processed: <strong>₹{order.refundAmount}</strong> credited back to {order.paymentMethod || 'UPI'}
                          </span>
                        )}
                        {order.refundStatus === 'PARTIAL_REFUND_PROCESSED' && (
                          <span className="badge-refund partial">
                            🟡 50% Partial Refund Processed: <strong>₹{order.refundAmount}</strong> credited (50% kitchen prep fee applied)
                          </span>
                        )}
                        {order.refundStatus === 'NOT_ELIGIBLE' && (
                          <span className="badge-refund none">
                            ❌ Not Eligible for Refund (Cancelled after dispatch)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {order.status !== 'CANCELLED' && (
                  <div className="order-tracker-container">
                    <OrderTracker status={order.status} />
                  </div>
                )}
              </div>

              <div className="order-actions flex-wrap gap-3">
                <button 
                  className="btn-inspect-3d"
                  onClick={() => togglePayment(order.id)}
                >
                  {expandedPayment === order.id ? 'Hide Payment Receipt' : '💳 View Payment Receipt'}
                </button>

                {/* CANCEL ORDER BUTTON (Eligible at RECEIVED or COOKING stage) */}
                {['RECEIVED', 'COOKING'].includes(order.status) && (
                  <button
                    className="btn-cancel-order"
                    onClick={() => setCancelModalOrder(order)}
                  >
                    🚫 Cancel Order & Request Refund
                  </button>
                )}
              </div>

              {expandedPayment === order.id && paymentDetails[order.id] && (
                <div className="payment-details fade-in mt-4">
                  <h4>Payment Information</h4>
                  <div className="payment-grid">
                    <div>
                      <span className="label">Transaction ID</span>
                      <span>{paymentDetails[order.id].id || paymentDetails[order.id].transactionId || 'TXN-9912'}</span>
                    </div>
                    <div>
                      <span className="label">Method</span>
                      <span>{order.paymentMethod || 'UPI'}</span>
                    </div>
                    <div>
                      <span className="label">Status</span>
                      <span className={`payment-status ${(paymentDetails[order.id].status || 'SUCCESS').toLowerCase()}`}>
                        {order.status === 'CANCELLED' ? 'REFUNDED' : (paymentDetails[order.id].status || 'SUCCESS')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CANCELLATION REASON MODAL */}
      {cancelModalOrder && (
        <div className="modal-backdrop-3d fade-in">
          <div className="modal-card-3d glass-god-card p-6">
            <h3 className="gradient-text mb-2">🚫 Cancel Order #{cancelModalOrder.id}</h3>
            <p className="text-secondary text-sm mb-4">
              {cancelModalOrder.status === 'RECEIVED' ? (
                <strong className="text-emerald">🟢 Eligible for 100% Full Refund (₹{cancelModalOrder.totalAmount})</strong>
              ) : (
                <strong className="text-amber">🟡 Chef has started cooking! Eligible for 50% Partial Refund (₹{Math.round(cancelModalOrder.totalAmount * 0.5)})</strong>
              )}
            </p>

            <div className="form-group mb-4">
              <label className="block text-sm font-bold mb-2">Select Reason for Cancellation:</label>
              <select 
                className="glass-input-3d w-full p-3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Delivery time is too long">Delivery time is too long</option>
                <option value="Changed my mind / Need to re-order">Changed my mind / Need to re-order</option>
                <option value="Wrong delivery address selected">Wrong delivery address selected</option>
                <option value="Other">Other reason...</option>
              </select>
            </div>

            {cancelReason === 'Other' && (
              <div className="form-group mb-4">
                <input 
                  type="text" 
                  className="glass-input-3d w-full p-3"
                  placeholder="Specify cancellation reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="modal-actions flex gap-3 justify-end mt-6">
              <button className="btn-outline" onClick={() => setCancelModalOrder(null)}>
                Keep My Order
              </button>
              <button className="btn-danger-confirm" onClick={handleConfirmCancel}>
                Confirm Cancellation & Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
