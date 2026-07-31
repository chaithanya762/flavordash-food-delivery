import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './FloatingCartStrip.css';

const FloatingCartStrip = () => {
  const { cart, totalItems, totalPrice } = useCart() || { cart: [], totalItems: 0, totalPrice: 0 };
  const navigate = useNavigate();
  const location = useLocation();

  const cartList = cart || [];
  const itemCount = totalItems || cartList.reduce((sum, item) => sum + item.quantity, 0);

  // Hide on Cart and Checkout pages to avoid redundancy
  if (itemCount === 0 || location.pathname === '/cart' || location.pathname === '/checkout') {
    return null;
  }

  return (
    <div className="floating-cart-strip-wrapper fade-in-up">
      <div className="floating-cart-strip glass-god-card" onClick={() => navigate('/cart')}>
        <div className="cart-strip-left">
          <div className="cart-strip-icon-box">
            <span className="cart-strip-icon">🛒</span>
            <span className="cart-strip-count">{itemCount}</span>
          </div>
          <div className="cart-strip-info">
            <span className="cart-strip-label">{itemCount} {itemCount === 1 ? 'Item' : 'Items'} Added</span>
            <span className="cart-strip-price">₹{totalPrice}</span>
          </div>
        </div>

        <button className="cart-strip-btn">
          View Cart <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingCartStrip;
