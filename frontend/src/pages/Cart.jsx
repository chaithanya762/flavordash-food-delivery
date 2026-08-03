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
      <div className="cart-page-3d empty fade-in container">
        <div className="empty-cart-state-3d glass-god-card">
          <div className="empty-cart-emoji-3d">🛒</div>
          <h2 className="gradient-text">Your 3D Culinary Cart is Empty</h2>
          <p>Explore floating Indian delicacies and add them to your order!</p>
          <Link to="/menu" className="btn btn-primary btn-explore-3d mt-4">🚀 Browse 3D Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-3d container fade-in">
      <div className="cart-page-header-3d">
        <div>
          <div className="experience-badge-pill">
            <span className="sparkle">✨</span> 3D ECOSYSTEM ORDER STAGE
          </div>
          <h1 className="page-title-3d gradient-text">Your Cart ({cartList.length} Items) 🛒</h1>
          <p className="page-subtitle-3d">Fresh authentic dishes ready for 30-min express delivery</p>
        </div>
        
        <div className="cart-header-actions-3d">
          <button 
            className="btn-group-cart-3d" 
            onClick={() => setIsGroupModalOpen(true)}
          >
            👥 Group Order & UPI Split
          </button>
          <button className="btn-clear-all-3d" onClick={handleClearAll}>
            🗑️ Clear Cart
          </button>
        </div>
      </div>
      
      <div className="cart-layout-3d">
        <div className="cart-items-list-3d">
          {cartList.map((item) => (
            <div key={item.product.id} className="cart-item-card-3d glass-card fade-in">
              <div className="cart-item-image-3d">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} />
                ) : (
                  <div className="fallback-emoji-3d">🍽️</div>
                )}
                {item.product.steam !== false && <span className="cart-steam-wisp">☁️</span>}
              </div>

              <div className="cart-item-info-3d">
                <h3>{item.product.name}</h3>
                <span className="restaurant-tag-3d">📍 {item.product.restaurantName || 'Kitchen'}</span>
                <div className="cart-item-price-3d">₹{item.product.price} each</div>
              </div>
              
              <div className="cart-item-actions-3d">
                <div className="qty-controls-3d">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                </div>

                <div className="line-total-price-3d">
                  ₹{item.product.price * item.quantity}
                </div>

                <button 
                  className="btn-remove-3d"
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
        <div className="cart-summary-card-3d glass-god-card sticky">
          <h3>Bill Breakdown</h3>
          <div className="summary-row-3d">
            <span>Items Total</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="summary-row-3d">
            <span>Express Delivery Fee</span>
            <span>₹{DELIVERY_FEE}</span>
          </div>
          <div className="summary-row-3d">
            <span>GST & Service Charge</span>
            <span>₹{TAX_SERVICE}</span>
          </div>
          
          <div className="summary-divider-3d"></div>
          
          <div className="summary-row-3d total">
            <span>Total Payable</span>
            <span className="gradient-text price-total-3d">₹{FINAL_TOTAL}</span>
          </div>
          
          <button 
            className="btn btn-primary checkout-btn-3d"
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
