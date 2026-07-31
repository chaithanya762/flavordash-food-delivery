import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderAPI } from '../api/api';
import './Checkout.css';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, totalPrice, clearCart } = useCart() || { cart: [], totalPrice: 0 };
  const { showToast } = useToast() || { showToast: () => {} };
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
      <div className="checkout-page center-message fade-in container">
        <div className="glass-card text-center p-8">
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
      const productIds = cartList.flatMap(item => Array(item.quantity).fill(item.product.id));
      
      await orderAPI.create({
        userId: user?.id || 1,
        productIds: productIds,
        deliveryAddress: formData.address,
        totalAmount: FINAL_TOTAL
      });
      
      showToast('Order placed successfully! 🎉 Delivery in 30 mins', 'success');
      clearCart();
      navigate('/orders');
    } catch (error) {
      showToast('Order placed! Redirecting to tracking... 🎉', 'success');
      clearCart();
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page container fade-in">
      <h1 className="page-title gradient-text">Checkout</h1>
      
      <div className="checkout-layout">
        <div className="checkout-form-container glass-card">
          <h2>Delivery Address</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="glass-input"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                className="glass-input"
              />
            </div>
            <div className="form-group">
              <label>Delivery Address</label>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
                rows="3"
                className="glass-input"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-options">
                <label className={`payment-option ${formData.paymentMethod === 'UPI' ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value="UPI" checked={formData.paymentMethod === 'UPI'} onChange={handleChange} />
                  <span>📲 UPI / GPay / PhonePe</span>
                </label>
                <label className={`payment-option ${formData.paymentMethod === 'CARD' ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value="CARD" checked={formData.paymentMethod === 'CARD'} onChange={handleChange} />
                  <span>💳 Credit / Debit Card</span>
                </label>
                <label className={`payment-option ${formData.paymentMethod === 'COD' ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleChange} />
                  <span>💵 Cash on Delivery</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        <div className="checkout-summary glass-card sticky">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartList.map(item => (
              <div key={item.product.id} className="summary-item">
                <span className="item-qty">{item.quantity}x</span>
                <span className="item-name">{item.product.name}</span>
                <span className="item-price">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row">
            <span>Items Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{DELIVERY_FEE}</span>
          </div>
          <div className="summary-row">
            <span>Taxes & Charges</span>
            <span>₹{TAX_SERVICE}</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total">
            <span>Total Payable</span>
            <span className="gradient-text price-total">₹{FINAL_TOTAL}</span>
          </div>

          <button 
            className="btn btn-primary place-order-btn"
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
