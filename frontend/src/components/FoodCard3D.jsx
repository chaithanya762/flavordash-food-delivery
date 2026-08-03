import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './FoodCard3D.css';

export default function FoodCard3D({ dish, onInspect }) {
  const [isHovered, setIsHovered] = useState(false);
  const [pulse, setPulse] = useState(false);
  
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart() || { cart: [], addToCart: () => {}, updateQuantity: () => {}, removeFromCart: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };

  // Find item in cart to drive button morphing
  const cartItem = cart?.find((item) => item.product.id === dish.id);
  const itemQty = cartItem ? cartItem.quantity : 0;

  const handleAddClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(dish);
    setPulse(true);
    setTimeout(() => setPulse(false), 800);
    showToast(`Added ${dish.name} to order 🍽️`, 'success');
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    e.preventDefault();
    updateQuantity(dish.id, itemQty + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (itemQty === 1) {
      removeFromCart(dish.id);
      showToast(`Removed ${dish.name} from order`, 'info');
    } else {
      updateQuantity(dish.id, itemQty - 1);
    }
  };

  const handleInspectClick = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (onInspect) {
      onInspect(dish);
    }
  };

  return (
    <div 
      className={`food-card-3d-wrapper ${isHovered ? 'hovered' : ''} ${pulse ? 'added-pulse' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleInspectClick}
    >
      <div className="food-card-glass-body">
        {/* Glow accent rim */}
        <div className="glow-rim-accent" style={{ background: dish.accentColor || '#D4AF37' }}></div>

        {/* 4:3 STAGE DISH ARTWORK */}
        <div className="food-3d-object-stage">
          {/* Steam Effect */}
          {dish.steam !== false && (
            <div className="steam-vapor-overlay">
              <span className="steam-particle s1">☁️</span>
              <span className="steam-particle s2">☁️</span>
              <span className="steam-particle s3">☁️</span>
            </div>
          )}

          {/* Signature Plating Badge */}
          <span className="ar-badge-pill">
            <span className="ar-pulse-dot"></span> Signature Plating
          </span>

          {/* Veg / Non-Veg Badge */}
          <span className={`diet-tag-pill ${dish.isVeg ? 'veg' : 'nonveg'}`}>
            {dish.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>

          {/* High Res Dish Artwork */}
          <img 
            src={dish.imageUrl} 
            alt={dish.name} 
            className="food-3d-image" 
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
            }}
          />

          <div className="food-contact-shadow"></div>
        </div>

        {/* CONTENT LAYER */}
        <div className="food-card-info-stage">
          <div className="food-restaurant-meta">
            <span className="res-name">🏪 {dish.restaurantName}</span>
            <span className="rating-pill">⭐ {dish.rating}</span>
          </div>

          <h3 className="food-title-3d">{dish.name}</h3>
          
          <p className="food-desc-3d">{dish.description}</p>

          {/* Texture Tag */}
          {(dish.texture || dish.highlight) && (
            <div className="texture-highlight-tag">
              ✨ {dish.highlight || dish.texture}
            </div>
          )}

          {/* FOOTER: PRICE & MORPHING BUTTON */}
          <div className="food-card-footer-3d">
            <div className="price-tag-3d">
              <span className="currency">₹</span>
              <span>{dish.price}</span>
            </div>

            <div className="card-actions-group">
              <button 
                type="button"
                className="btn-inspect-3d"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleInspectClick(e);
                }}
                title="View Dish Details, Ingredients & Customizations"
              >
                Details <span className="arrow-icon">→</span>
              </button>

              {/* MORPHING BUTTON: If item is in cart, morph into Quantity Stepper! */}
              {itemQty > 0 ? (
                <div className="qty-stepper-morphed">
                  <button type="button" className="stepper-btn" onClick={handleDecrement}>-</button>
                  <span className="stepper-count">{itemQty}</span>
                  <button type="button" className="stepper-btn" onClick={handleIncrement}>+</button>
                </div>
              ) : (
                <button 
                  type="button"
                  className="btn-add-3d"
                  onClick={handleAddClick}
                >
                  + Add
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
