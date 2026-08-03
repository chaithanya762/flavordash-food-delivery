import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './FoodInspectorModal.css';

export default function FoodInspectorModal({ dish, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart } = useCart() || { addToCart: () => {}, cart: [] };
  const { showToast } = useToast() || { showToast: () => {} };

  if (!dish) return null;

  const totalCartCount = cart ? cart.reduce((sum, i) => sum + i.quantity, 0) : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(dish);
    }
    showToast(`Added ${quantity}x ${dish.name} to order 🍽️`, 'success');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <div className="inspector-backdrop fade-in" onClick={handleBackdropClick}>
      <div className="inspector-zero-scroll-card glass-luxury-panel scale-fast" onClick={(e) => e.stopPropagation()}>
        
        {/* TOP BAR (FIXED) */}
        <header className="zero-topbar">
          <button type="button" className="zero-back-btn" onClick={onClose}>
            ← Back
          </button>
          
          <span className="zero-topbar-title">{dish.name}</span>

          <div className="zero-topbar-right">
            {totalCartCount > 0 && (
              <span className="zero-cart-chip">
                🛒 {totalCartCount}
              </span>
            )}
            <button type="button" className="zero-close-btn" onClick={onClose} title="Close">
              ✕
            </button>
          </div>
        </header>

        {/* ZERO SCROLL MAIN CONTAINER */}
        <div className="zero-scroll-container">
          
          {/* LEFT / TOP: COMPACT IMAGE STAGE */}
          <div className="zero-image-stage">
            <img 
              src={dish.imageUrl} 
              alt={dish.name} 
              className="zero-food-img"
            />
            <div className="zero-image-shadow"></div>
          </div>

          {/* RIGHT / BOTTOM: CONDENSED CONTENT & ACTION AREA */}
          <div className="zero-content-panel">
            
            {/* META ROW: RESTAURANT & RATING */}
            <div className="zero-meta-row">
              <span className="zero-res-badge">🏪 {dish.restaurantName}</span>
              <span className="zero-rating-badge">⭐ {dish.rating || '4.9'}</span>
            </div>

            {/* TITLE & PRICE */}
            <div className="zero-title-price-block">
              <h1 className="zero-dish-title">{dish.name}</h1>
              <div className="zero-price-tag">
                <span className="curr">₹</span>
                <span className="val">{dish.price}</span>
              </div>
            </div>

            {/* CONDENSED 1-2 LINE DESCRIPTION */}
            <p className="zero-short-desc">
              {dish.description}
            </p>

            {/* KEY INFO ROW (HORIZONTAL CHIPS) */}
            <div className="zero-key-info-row">
              <span className={`zero-chip ${dish.isVeg ? 'veg' : 'nonveg'}`}>
                {dish.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
              </span>
              
              <span className="zero-chip spice">
                🌶️ {dish.spiceLevel || 3}/5 Spice
              </span>

              <span className="zero-chip prep">
                ⏱️ {dish.prepTime || '20 min'}
              </span>

              {dish.protein && (
                <span className="zero-chip protein">
                  💪 {dish.protein}
                </span>
              )}
            </div>

            {/* ACTION AREA (QUANTITY + PRIMARY CTA) */}
            <div className="zero-action-area">
              <div className="zero-qty-stepper">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span className="zero-qty-val">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button type="button" className="zero-btn-add-primary" onClick={handleAddToCart}>
                🛒 Add to Order — ₹{dish.price * quantity}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
