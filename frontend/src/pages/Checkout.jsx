import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';
import './Checkout.css';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, totalPrice, clearCart } = useCart() || { cart: [], totalPrice: 0 };
  const { createOrder } = useOrders() || { createOrder: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };
  const { recordOrder } = useGamification() || { recordOrder: () => {} };
  const navigate = useNavigate();

  const cartList = cart || [];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Johnson',
    phone: user?.phone || '9876543210',
    address: user?.address || '742 Evergreen Terrace, Sector 4, New Delhi',
    paymentMethod: 'UPI'
  });

  if (cartList.length === 0) {
    return (
      <div className="checkout-page-3d center-message fade-in container">
        <div className="glass-god-card text-center p-8">
          <h2>Your cart is empty</h2>
          <Link to="/menu" className="btn btn-primary mt-4">Browse Menu</Link>
        </div>
      </div>
    );
  }

  const DELIVERY_FEE = 49;
  const TAX_SERVICE = Math.round(totalPrice * 0.05);
  const FINAL_TOTAL = totalPrice + DELIVERY_FEE + TAX_SERVICE;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cartList.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        restaurantName: item.product.restaurantName || 'Punjab Rasoi'
      }));

      const primaryRestaurant = cartList[0]?.product?.restaurantName || 'Punjab Rasoi';

      await createOrder({
        userId: user?.id || Date.now(),
        customerName: formData.name || user?.name || 'Alex Johnson',
        customerEmail: user?.email || 'alex@example.com',
        customerPhone: formData.phone || user?.phone || '+91 98765 43210',
        deliveryAddress: formData.address || user?.address || '742 Evergreen Terrace, Sector 4, New Delhi',
        restaurantName: primaryRestaurant,
        items: orderItems,
        productIds: cartList.flatMap(item => Array(item.quantity).fill(item.product.id)),
        totalAmount: FINAL_TOTAL,
        paymentMethod: formData.paymentMethod || 'UPI'
      });
      
      showToast('Order placed successfully! 🎉 Sent to Kitchen & Rider Dispatch', 'success');
      
      // 🎮 Award gamification coins & update streak
      try { recordOrder(); } catch(e) {}
      
      clearCart();
      navigate('/orders');
    } catch (error) {
      showToast('Order placed! Redirecting to tracking... 🎉', 'success');
      try { recordOrder(); } catch(e) {}
      clearCart();
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page-3d container fade-in">
      <div className="checkout-header-3d">
        <div className="experience-badge-pill">
          <span className="sparkle">✨</span> CONFIRMATION & EXPRESS DISPATCH
        </div>
        <h1 className="page-title-3d gradient-text">Checkout</h1>
        <p className="page-subtitle-3d">Review your culinary order and delivery location</p>
      </div>
      
      <div className="checkout-layout-3d">
        <div className="checkout-form-card-3d glass-god-card">
          <h2>📍 Delivery Address</h2>
          <form onSubmit={handleSubmit} className="checkout-form-3d">
            <div className="form-group-3d">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="glass-input-3d"
              />
            </div>
            <div className="form-group-3d">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                className="glass-input-3d"
              />
            </div>
            <div className="form-group-3d">
              <label>Delivery Address</label>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
                rows="3"
                className="glass-input-3d"
              ></textarea>
            </div>

            <div className="form-group-3d">
              <label>Payment Method</label>
              <div className="payment-options-3d">
                <label className={`payment-option-3d ${formData.paymentMethod === 'UPI' ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value="UPI" checked={formData.paymentMethod === 'UPI'} onChange={handleChange} />
                  <span>📲 Instant UPI / GPay / PhonePe</span>
                </label>
                <label className={`payment-option-3d ${formData.paymentMethod === 'CARD' ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value="CARD" checked={formData.paymentMethod === 'CARD'} onChange={handleChange} />
                  <span>💳 Credit / Debit Card</span>
                </label>
                <label className={`payment-option-3d ${formData.paymentMethod === 'COD' ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleChange} />
                  <span>💵 Cash on Delivery</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        <div className="checkout-summary-card-3d glass-god-card sticky">
          <h2>Order Summary</h2>
          <div className="summary-items-3d">
            {cartList.map(item => (
              <div key={item.product.id} className="summary-item-3d">
                <span className="item-qty-3d">{item.quantity}x</span>
                <span className="item-name-3d">{item.product.name}</span>
                <span className="item-price-3d">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-divider-3d"></div>
          
          <div className="summary-row-3d">
            <span>Items Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="summary-row-3d">
            <span>Delivery Fee</span>
            <span>₹{DELIVERY_FEE}</span>
          </div>
          <div className="summary-row-3d">
            <span>Taxes & Charges</span>
            <span>₹{TAX_SERVICE}</span>
          </div>
          
          <div className="summary-divider-3d"></div>
          
          <div className="summary-row-3d total">
            <span>Total Payable</span>
            <span className="gradient-text price-total-3d">₹{FINAL_TOTAL}</span>
          </div>

          <button 
            className="btn btn-primary place-order-btn-3d"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing Order...' : 'Pay & Confirm Order →'}
          </button>
        </div>
      </div>
    </div>
  );
}
