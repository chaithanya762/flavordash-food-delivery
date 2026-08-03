import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './FoodCard3D.css';

export default function FoodCard3D({ dish, onInspect }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart() || { addToCart: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 12; // Max 12deg tilt
    const rotateY = ((x - centerX) / centerX) * 12;

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
    showToast(`Added ${dish.name} to your cart! 🛒`, 'success');
  };

  return (
    <div 
      className={`food-card-3d-wrapper ${isHovered ? 'hovered' : ''}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onInspect && onInspect(dish)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.05 : 1}, ${isHovered ? 1.05 : 1}, 1)`
      }}
    >
      {/* CARD BASE - LAYER 4 GLASS PANEL */}
      <div className="food-card-glass-body">
        {/* Glowing Rim Border Accent */}
        <div 
          className="glow-rim-accent"
          style={{ background: dish.accentColor || '#ff6b35' }}
        ></div>

        {/* 3D FLOATING FOOD CONTAINER (LAYER 3) */}
        <div className="food-3d-object-stage">
          {/* Steam Vapor Wisps */}
          {dish.steam !== false && (
            <div className="steam-vapor-overlay">
              <span className="steam-particle s1">☁️</span>
              <span className="steam-particle s2">☁️</span>
              <span className="steam-particle s3">☁️</span>
            </div>
          )}

          {/* Contact Shadow */}
          <div className="food-contact-shadow"></div>

          {/* 3D Floating Artwork */}
          <img 
            src={dish.imageUrl} 
            alt={dish.name} 
            className="food-3d-image" 
            loading="lazy"
          />

          {/* AR / 3D Tag */}
          <span className="ar-badge-pill">
            <span className="ar-pulse-dot"></span> 3D Octane
          </span>

          {/* Diet Tag */}
          <span className={`diet-tag-pill ${dish.isVeg ? 'veg' : 'nonveg'}`}>
            {dish.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>

        {/* 3D CARD CONTENT LAYER */}
        <div className="food-card-info-stage">
          <div className="food-restaurant-meta">
            <span className="res-name">🏪 {dish.restaurantName}</span>
            <span className="rating-pill">⭐ {dish.rating}</span>
          </div>

          <h3 className="food-title-3d">{dish.name}</h3>
          
          <p className="food-desc-3d">{dish.description}</p>

          {/* Culinary Texture Highlight */}
          {dish.texture && (
            <div className="texture-highlight-tag">
              <span className="sparkle-icon">✨</span> {dish.texture}
            </div>
          )}

          {/* Price & Action Buttons */}
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
                title="Inspect in 3D Depth"
              >
                🔍 Inspect
              </button>

              <button 
                className="btn-add-3d"
                onClick={handleAddToCart}
                title="Add to Cart"
              >
                🛒 Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
