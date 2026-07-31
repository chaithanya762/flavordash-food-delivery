import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import GroupCartModal from '../components/GroupCartModal';
import './Cart.css';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart() || { cart: [], totalPrice: 0 };
  const { showToast } = useToast() || { showToast: () => {} };
  const navigate = useNavigate();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const cartList = cart || [];
  const DELIVERY_FEE = cartList.length > 0 ? 49 : 0;
  const TAX_SERVICE = Math.round(totalPrice * 0.05);
  const FINAL_TOTAL = totalPrice + DELIVERY_FEE + TAX_SERVICE;

  const handleRemove = (productId, name) => {
    removeFromCart(productId);
    showToast(`Removed ${name} from cart`, 'info');
  };

  const handleClearAll = () => {
    clearCart();
    showToast('Cart cleared', 'info');
  };

  if (cartList.length === 0) {
    return (
      <div className="cart-page empty fade-in container">
        <div className="empty-cart-state glass-card">
          <div className="empty-cart-emoji">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Explore our delicious menu and add your favorite dishes!</p>
          <Link to="/menu" className="btn btn-primary mt-4">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container fade-in">
      <div className="cart-page-header">
        <div>
          <h1 className="page-title gradient-text">Your Cart ({cartList.length}) 🛒</h1>
          <p className="page-subtitle">Fresh authentic dishes ready for fast 30-min delivery</p>
        </div>
        
        <div className="cart-header-actions">
          <button 
            className="btn-group-cart" 
            onClick={() => setIsGroupModalOpen(true)}
          >
            👥 Group Order & Split Bill
          </button>
          <button className="btn-clear-all" onClick={handleClearAll}>
            🗑️ Clear Cart
          </button>
        </div>
      </div>
      
      <div className="cart-layout">
        <div className="cart-items-list">
          {cartList.map((item) => (
            <div key={item.product.id} className="cart-item-card glass-card fade-in">
              <div className="cart-item-image">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} />
                ) : (
                  <div className="fallback-emoji">🍽️</div>
                )}
              </div>

              <div className="cart-item-info">
                <h3>{item.product.name}</h3>
                <span className="restaurant-tag">📍 {item.product.restaurantName || 'Kitchen'}</span>
                <div className="cart-item-price">₹{item.product.price} each</div>
              </div>
              
              <div className="cart-item-actions">
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                </div>

                <div className="line-total-price">
                  ₹{item.product.price * item.quantity}
                </div>

                <button 
                  className="btn-remove"
                  onClick={() => handleRemove(item.product.id, item.product.name)}
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="cart-summary-card glass-card sticky">
          <h3>Bill Summary</h3>
          <div className="summary-row">
            <span>Item Total</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{DELIVERY_FEE}</span>
          </div>
          <div className="summary-row">
            <span>Grounded Taxes & Fee</span>
            <span>₹{TAX_SERVICE}</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total">
            <span>To Pay</span>
            <span className="gradient-text price-total">₹{FINAL_TOTAL}</span>
          </div>
          
          <button 
            className="btn btn-primary checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>

      <GroupCartModal 
        isOpen={isGroupModalOpen} 
        onClose={() => setIsGroupModalOpen(false)} 
        cartItems={cartList}
        totalPrice={FINAL_TOTAL}
      />
    </div>
  );
}
