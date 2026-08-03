import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './FoodCard3D.css';

export default function FoodCard3D({ dish, onInspect }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart() || { addToCart: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 8; // Gentle tilt
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(dish);
    setIsAdded(true);
    showToast(`Added ${dish.name} to your dining order 🍽️`, 'success');
    setTimeout(() => setIsAdded(false), 800);
  };

  return (
    <div 
      className={`food-card-3d-wrapper ${isHovered ? 'hovered' : ''} ${isAdded ? 'added-pulse' : ''}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onInspect && onInspect(dish)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`
      }}
    >
      <div className="food-card-glass-body">
        {/* Subtle Accent Rim */}
        <div 
          className="glow-rim-accent"
          style={{ background: dish.accentColor || '#FF9933' }}
        ></div>

        {/* PLATED DISH STAGE */}
        <div className="food-3d-object-stage">
          {/* Steam Overlay */}
          {dish.steam !== false && (
            <div className="steam-vapor-overlay">
              <span className="steam-particle s1">☁️</span>
              <span className="steam-particle s2">☁️</span>
              <span className="steam-particle s3">☁️</span>
            </div>
          )}

          {/* Table Contact Shadow */}
          <div className="food-contact-shadow"></div>

          {/* Dish Plating Image */}
          <img 
            src={dish.imageUrl} 
            alt={dish.name} 
            className="food-3d-image" 
            loading="lazy"
          />

          {/* Signature Plating Badge */}
          <span className="ar-badge-pill">
            <span className="ar-pulse-dot"></span> Signature Plating
          </span>

          {/* Diet Tag */}
          <span className={`diet-tag-pill ${dish.isVeg ? 'veg' : 'nonveg'}`}>
            {dish.isVeg ? '🟢 Vegetarian' : '🔴 Non-Veg'}
          </span>
        </div>

        {/* CARD INFO */}
        <div className="food-card-info-stage">
          <div className="food-restaurant-meta">
            <span className="res-name">🏪 {dish.restaurantName}</span>
            <span className="rating-pill">⭐ {dish.rating}</span>
          </div>

          <h3 className="food-title-3d">{dish.name}</h3>
          
          <p className="food-desc-3d">{dish.description}</p>

          {/* Culinary Texture */}
          {dish.texture && (
            <div className="texture-highlight-tag">
              <span className="sparkle-icon">✨</span> {dish.texture}
            </div>
          )}

          {/* Price & Actions */}
          <div className="food-card-footer-3d">
            <div className="price-tag-3d">
              <span className="currency">₹</span>
              <span className="amount">{dish.price}</span>
            </div>

            <div className="card-actions-group">
              <button 
                className="btn-inspect-3d"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspect && onInspect(dish);
                }}
                title="View Culinary Details"
              >
                🔍 Details
              </button>

              <button 
                className={`btn-add-3d ${isAdded ? 'added' : ''}`}
                onClick={handleAddToCart}
                title="Add to Order"
              >
                {isAdded ? '✓ Added' : '🛒 Add'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
