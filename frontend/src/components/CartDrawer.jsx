import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart } = useCart() || { 
    cartItems: [], updateQuantity: () => {}, removeFromCart: () => {} 
  };

  const getEmoji = (category) => {
    switch (category?.toUpperCase()) {
      case 'PIZZA': return '🍕';
      case 'BURGER': return '🍔';
      case 'SUSHI': return '🍣';
      case 'SALAD': return '🥗';
      case 'DESSERT': return '🍰';
      default: return '☕';
    }
  };

  const subtotal = cartItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="cart-title">Your Cart <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>({cartItems?.length || 0})</span></h2>
          <button className="cart-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cart-body">
          {(!cartItems || cartItems.length === 0) ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything yet.</p>
              <Link to="/menu" className="btn btn-primary" onClick={onClose}>Browse Menu</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-icon">
                  {getEmoji(item.category)}
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">${Number(item.price).toFixed(2)}</div>
                </div>
                <div className="cart-item-controls">
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems && cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary checkout-btn" onClick={onClose}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
