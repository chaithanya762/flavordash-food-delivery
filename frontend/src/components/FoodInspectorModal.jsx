import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './FoodInspectorModal.css';

export default function FoodInspectorModal({ dish, onClose }) {
  const [activeTab, setActiveTab] = useState('plating'); // 'plating' | 'nutrition' | 'recipe'
  const [rotation, setRotation] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [steamActive, setSteamActive] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const { addToCart } = useCart() || { addToCart: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };

  // Auto-spin interval effect
  useEffect(() => {
    let interval;
    if (isAutoSpinning) {
      interval = setInterval(() => {
        setRotation((prev) => (prev + 5) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAutoSpinning]);

  if (!dish) return null;

  const handleRotateLeft = () => setRotation((prev) => prev - 45);
  const handleRotateRight = () => setRotation((prev) => prev + 45);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: (y / rect.height) * -20, y: (x / rect.width) * 20 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(dish);
    }
    showToast(`Added ${quantity}x ${dish.name} to your order 🍽️`, 'success');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      onClose();
    }
  };

  // Derive dynamic ingredients based on dish category
  const getIngredientPins = () => {
    if (dish.category === 'Rice & Biryani') {
      return [
        { icon: '✨', label: 'Kashmiri Saffron Threads' },
        { icon: '🌿', label: 'Fragrant Long-Grain Basmati' },
        { icon: '🧈', label: 'Desi Ghee Caramelized Shallots' }
      ];
    }
    if (dish.category === 'Sweets' || dish.category === 'Drinks') {
      return [
        { icon: '🥛', label: 'Thick Farm-Fresh Cream' },
        { icon: '🌱', label: 'Crushed Green Cardamom' },
        { icon: '🌰', label: 'Slivered Pistachios & Almonds' }
      ];
    }
    return [
      { icon: '🌿', label: 'Hand-Ground Garam Masala' },
      { icon: '✨', label: 'Cashew & Tomato Reduction' },
      { icon: '🧈', label: 'Churned White Butter Gloss' }
    ];
  };

  const pins = getIngredientPins();

  return (
    <div className="inspector-backdrop fade-in" onClick={handleBackdropClick}>
      <div className="inspector-modal-card glass-luxury-card scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="inspector-close-btn" onClick={onClose} title="Close Inspector Modal">✕</button>

        {/* TOP TAB NAVIGATION BAR */}
        <div className="inspector-nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'plating' ? 'active' : ''}`}
            onClick={() => setActiveTab('plating')}
          >
            🍽️ Chef's 3D Plating Stage
          </button>
          <button 
            className={`tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
            onClick={() => setActiveTab('nutrition')}
          >
            📊 Macro Nutrition & Energy
          </button>
          <button 
            className={`tab-btn ${activeTab === 'recipe' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipe')}
          >
            👨‍🍳 Artisanal Culinary Notes
          </button>
        </div>

        <div className="inspector-grid">
          {/* LEFT: 3D INTERACTIVE PLATING STAGE */}
          <div 
            className="inspector-3d-stage"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="stage-controls-top">
              <span className="ar-live-pill">
                <span className="live-dot"></span> Interactive 3D View
              </span>

              <div className="stage-top-actions">
                <button 
                  className={`btn-spin-toggle ${isAutoSpinning ? 'active' : ''}`}
                  onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                >
                  🔄 {isAutoSpinning ? 'Pause Spin' : '360° Auto-Spin'}
                </button>
                <button 
                  className={`btn-steam-toggle ${steamActive ? 'active' : ''}`}
                  onClick={() => setSteamActive(!steamActive)}
                >
                  ☁️ Steam {steamActive ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Steam Overlay */}
            {steamActive && dish.steam !== false && (
              <div className="inspector-steam-overlay">
                <span className="steam-cloud c1">☁️</span>
                <span className="steam-cloud c2">☁️</span>
                <span className="steam-cloud c3">☁️</span>
              </div>
            )}

            {/* Plated Dish Artwork with Mouse Tilt & Rotation */}
            <div 
              className="inspector-food-wrapper"
              style={{ 
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + rotation}deg)` 
              }}
            >
              <img 
                src={dish.imageUrl} 
                alt={dish.name} 
                className="inspector-food-img"
              />

              {/* Dynamic Culinary Ingredient Pins */}
              <div className="ingredient-pin pin-1">
                <span className="pin-dot"></span>
                <span className="pin-label">{pins[0].icon} {pins[0].label}</span>
              </div>

              <div className="ingredient-pin pin-2">
                <span className="pin-dot"></span>
                <span className="pin-label">{pins[1].icon} {pins[1].label}</span>
              </div>

              <div className="ingredient-pin pin-3">
                <span className="pin-dot"></span>
                <span className="pin-label">{pins[2].icon} {pins[2].label}</span>
              </div>
            </div>

            {/* Plating Stage Shadow */}
            <div className="inspector-contact-shadow"></div>

            {/* Orbit Rotation Controls */}
            <div className="stage-controls-bottom">
              <button className="btn-orbit" onClick={handleRotateLeft}>↺ Rotate Left</button>
              <span className="orbit-angle-text">{rotation}° Orbit</span>
              <button className="btn-orbit" onClick={handleRotateRight}>Rotate Right ↻</button>
            </div>
          </div>

          {/* RIGHT: DYNAMIC TAB CONTENT */}
          <div className="inspector-details-stage">
            <div className="inspector-meta-row">
              <span className="res-badge">🏪 {dish.restaurantName}</span>
              <span className="category-badge">🏷️ {dish.category}</span>
              <span className="rating-badge">⭐ {dish.rating} Rating</span>
            </div>

            <h2 className="inspector-title gradient-text">{dish.name}</h2>
            <p className="inspector-desc">{dish.description}</p>

            {/* TAB 1: PLATING & FLAVOR PROFILE */}
            {activeTab === 'plating' && (
              <div className="tab-pane slide-up">
                {/* Culinary Texture */}
                {(dish.texture || dish.highlight) && (
                  <div className="inspector-texture-box">
                    <span className="box-label">CULINARY TEXTURE & FINISH</span>
                    <span className="box-value">✨ {dish.highlight || dish.texture}</span>
                  </div>
                )}

                {/* Spice Meter */}
                <div className="spice-meter-box">
                  <span className="meter-label">SPICE & HEAT RATING</span>
                  <div className="flame-rating">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <span 
                        key={level} 
                        className={`flame-icon ${level <= (dish.spiceLevel || 3) ? 'active' : ''}`}
                      >
                        🔥
                      </span>
                    ))}
                    <span className="spice-text">({dish.spiceLevel || 3}/5 Flame Intensity)</span>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="nutrition-grid">
                  <div className="nutri-pill">
                    <span className="nutri-val">⏱️ {dish.prepTime || '20 min'}</span>
                    <span className="nutri-key">Fresh Preparation</span>
                  </div>
                  <div className="nutri-pill">
                    <span className="nutri-val">💪 {dish.protein || '24g'}</span>
                    <span className="nutri-key">High Protein</span>
                  </div>
                  <div className="nutri-pill">
                    <span className="nutri-val">⚡ {dish.calories || '420 kcal'}</span>
                    <span className="nutri-key">Energy</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MACRO NUTRITION & METRICS */}
            {activeTab === 'nutrition' && (
              <div className="tab-pane slide-up">
                <div className="macro-progress-container">
                  <div className="macro-bar-row">
                    <div className="macro-info">
                      <span>💪 Protein ({dish.protein || '26g'})</span>
                      <span className="macro-pct">75% Daily Rec</span>
                    </div>
                    <div className="macro-track">
                      <div className="macro-fill protein-fill" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div className="macro-bar-row">
                    <div className="macro-info">
                      <span>⚡ Energy ({dish.calories || '450 kcal'})</span>
                      <span className="macro-pct">60% Daily Rec</span>
                    </div>
                    <div className="macro-track">
                      <div className="macro-fill calorie-fill" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  <div className="macro-bar-row">
                    <div className="macro-info">
                      <span>🌾 Complex Carbs & Fiber</span>
                      <span className="macro-pct">45% Daily Rec</span>
                    </div>
                    <div className="macro-track">
                      <div className="macro-fill carb-fill" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="diet-tags-cluster">
                  <span className="diet-chip-badge">🌱 100% Authentic Recipe</span>
                  <span className="diet-chip-badge">🛡️ No Artificial Preservatives</span>
                  {dish.dietTag && <span className="diet-chip-badge highlight">🏷️ {dish.dietTag}</span>}
                </div>
              </div>
            )}

            {/* TAB 3: ARTISANAL CHEF'S RECIPE NOTES */}
            {activeTab === 'recipe' && (
              <div className="tab-pane slide-up">
                <div className="chef-notes-card">
                  <div className="chef-avatar-row">
                    <span className="chef-emoji">👨‍🍳</span>
                    <div>
                      <h4 className="chef-title">Master Chef's Culinary Technique</h4>
                      <span className="chef-sub">{dish.restaurantName} Heritage Kitchen</span>
                    </div>
                  </div>
                  <p className="chef-quote">
                    "This delicacy is prepared fresh to order using slow wood-fire simmering and authentic hand-crushed spices to preserve essential aromas and uncompromised flavor."
                  </p>
                </div>
              </div>
            )}

            {/* FOOTER: PRICE, QUANTITY & ADD TO CART */}
            <div className="inspector-footer">
              <div className="inspector-price">
                <span className="curr">₹</span>
                <span className="val">{dish.price * quantity}</span>
              </div>

              <div className="quantity-stepper">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button type="button" className="btn btn-primary btn-add-inspector" onClick={handleAddToCart}>
                🛒 Add {quantity} to Order — ₹{dish.price * quantity}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
