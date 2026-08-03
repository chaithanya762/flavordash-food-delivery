import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './FoodInspectorModal.css';

export default function FoodInspectorModal({ dish, onClose }) {
  const [rotation, setRotation] = useState(0);
  const [steamActive, setSteamActive] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart() || { addToCart: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };

  if (!dish) return null;

  const handleRotateLeft = () => setRotation((prev) => prev - 45);
  const handleRotateRight = () => setRotation((prev) => prev + 45);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(dish);
    }
    showToast(`Added ${quantity}x ${dish.name} to your dining order 🍽️`, 'success');
    onClose();
  };

  return (
    <div className="inspector-backdrop fade-in" onClick={onClose}>
      <div className="inspector-modal-card glass-god-card" onClick={(e) => e.stopPropagation()}>
        <button className="inspector-close-btn" onClick={onClose}>✕</button>

        <div className="inspector-grid">
          {/* LEFT: CHEF'S PLATING STAGE */}
          <div className="inspector-3d-stage">
            <div className="stage-controls-top">
              <span className="ar-live-pill">
                <span className="live-dot"></span> Chef's Signature Plating
              </span>

              <button 
                className={`btn-steam-toggle ${steamActive ? 'active' : ''}`}
                onClick={() => setSteamActive(!steamActive)}
              >
                ☁️ Steam {steamActive ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Steam overlay */}
            {steamActive && (
              <div className="inspector-steam-overlay">
                <span className="steam-cloud c1">☁️</span>
                <span className="steam-cloud c2">☁️</span>
                <span className="steam-cloud c3">☁️</span>
              </div>
            )}

            {/* Plated Dish Artwork with Rotation */}
            <div 
              className="inspector-food-wrapper"
              style={{ transform: `rotateY(${rotation}deg)` }}
            >
              <img 
                src={dish.imageUrl} 
                alt={dish.name} 
                className="inspector-food-img"
              />

              {/* Culinary Ingredient Pins */}
              <div className="ingredient-pin pin-1">
                <span className="pin-dot"></span>
                <span className="pin-label">🌿 Hand-Ground Garam Masala</span>
              </div>

              <div className="ingredient-pin pin-2">
                <span className="pin-dot"></span>
                <span className="pin-label">✨ Kashmiri Saffron</span>
              </div>

              <div className="ingredient-pin pin-3">
                <span className="pin-dot"></span>
                <span className="pin-label">🧈 Pure Desi Ghee</span>
              </div>
            </div>

            {/* Contact Shadow */}
            <div className="inspector-contact-shadow"></div>

            {/* Orbit Buttons */}
            <div className="stage-controls-bottom">
              <button className="btn-orbit" onClick={handleRotateLeft}>↺ Rotate Left</button>
              <span className="orbit-angle-text">{rotation}°</span>
              <button className="btn-orbit" onClick={handleRotateRight}>Rotate Right ↻</button>
            </div>
          </div>

          {/* RIGHT: CULINARY METRICS */}
          <div className="inspector-details-stage">
            <div className="inspector-meta-row">
              <span className="res-badge">🏪 {dish.restaurantName}</span>
              <span className="rating-badge">⭐ {dish.rating} Rating</span>
            </div>

            <h2 className="inspector-title gradient-text">{dish.name}</h2>
            <p className="inspector-desc">{dish.description}</p>

            {/* Texture */}
            {dish.texture && (
              <div className="inspector-texture-box">
                <span className="box-label">CULINARY TEXTURE</span>
                <span className="box-value">✨ {dish.texture}</span>
              </div>
            )}

            {/* Spice Rating */}
            <div className="spice-meter-box">
              <span className="meter-label">SPICE PROFILE</span>
              <div className="flame-rating">
                {[1, 2, 3, 4, 5].map((level) => (
                  <span 
                    key={level} 
                    className={`flame-icon ${level <= (dish.spiceLevel || 3) ? 'active' : ''}`}
                  >
                    🔥
                  </span>
                ))}
                <span className="spice-text">({dish.spiceLevel || 3}/5 Spice Rating)</span>
              </div>
            </div>

            {/* Nutrition & Prep Time */}
            <div className="nutrition-grid">
              <div className="nutri-pill">
                <span className="nutri-val">⏱️ {dish.prepTime || '20 min'}</span>
                <span className="nutri-key">Fresh Prep</span>
              </div>
              <div className="nutri-pill">
                <span className="nutri-val">💪 {dish.protein || '25g'}</span>
                <span className="nutri-key">Protein</span>
              </div>
              <div className="nutri-pill">
                <span className="nutri-val">🔥 {dish.calories || '450 kcal'}</span>
                <span className="nutri-key">Calories</span>
              </div>
            </div>

            {/* Price & Quantity Add to Cart */}
            <div className="inspector-footer">
              <div className="inspector-price">
                <span className="curr">₹</span>
                <span className="val">{dish.price * quantity}</span>
              </div>

              <div className="quantity-stepper">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button className="btn btn-primary btn-add-inspector" onClick={handleAddToCart}>
                🛒 Add {quantity} to Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
