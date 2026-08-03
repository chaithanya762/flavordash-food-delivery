import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './FoodInspectorModal.css';

export default function FoodInspectorModal({ dish, onClose }) {
  const [selectedSpice, setSelectedSpice] = useState(dish.spiceLevel || 3);
  const [selectedAddon, setSelectedAddon] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [steamActive, setSteamActive] = useState(true);

  const { addToCart, cart } = useCart() || { addToCart: () => {}, cart: [] };
  const { showToast } = useToast() || { showToast: () => {} };

  if (!dish) return null;

  const totalCartCount = cart ? cart.reduce((sum, i) => sum + i.quantity, 0) : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        ...dish,
        customSpice: selectedSpice,
        customAddon: selectedAddon
      });
    }
    showToast(`Added ${quantity}x ${dish.name} (${selectedAddon}) to order 🍽️`, 'success');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      onClose();
    }
  };

  // Ingredient list based on dish
  const getIngredients = () => {
    if (dish.category === 'Rice & Biryani') {
      return ['Kashmiri Saffron', 'Long-Grain Basmati', 'Desi Ghee', 'Golden Shallots', 'Star Anise', 'Cardamom'];
    }
    if (dish.category === 'Sweets' || dish.category === 'Drinks') {
      return ['Farm-Fresh Cream', 'Green Cardamom', 'Slivered Pistachios', 'Pure Khoya', 'Rose Water', 'Kesar'];
    }
    if (dish.category === 'Breads') {
      return ['Whole Wheat Flour', 'Desi Ghee', 'Minced Garlic', 'Fresh Coriander', 'Yellow Butter'];
    }
    return ['Hand-Ground Spices', 'Tomato Cashew Reduction', 'Churned Butter', 'Fenugreek Leaves', 'Charcoal Smoke'];
  };

  // Recommendations
  const getPairingRecommendations = () => {
    if (dish.category === 'Main Dishes') {
      return [
        { name: 'Garlic Butter Naan', price: 79, icon: '🫓' },
        { name: 'Desi Ghee Jeera Rice', price: 179, icon: '🍛' }
      ];
    }
    if (dish.category === 'Rice & Biryani') {
      return [
        { name: 'Punjabi Sweet Malai Lassi', price: 129, icon: '🥤' },
        { name: 'Royal Shahi Gulab Jamun', price: 159, icon: '🍬' }
      ];
    }
    return [
      { name: 'Royal Butter Chicken', price: 389, icon: '🥘' },
      { name: 'Kesar Pista Rasmalai', price: 199, icon: '🍮' }
    ];
  };

  const ingredients = getIngredients();
  const pairings = getPairingRecommendations();

  return (
    <div className="inspector-backdrop fade-in" onClick={handleBackdropClick}>
      <div className="inspector-modal-card glass-luxury-card slide-up-page" onClick={(e) => e.stopPropagation()}>
        
        {/* STICKY TOP BAR: BACK BUTTON + CART STATUS + CLOSE */}
        <header className="details-sticky-topbar">
          <button type="button" className="btn-back-details" onClick={onClose}>
            ← Back to Menu
          </button>

          <div className="topbar-right-actions">
            {totalCartCount > 0 && (
              <span className="cart-pill-topbar">
                🛒 Cart ({totalCartCount})
              </span>
            )}
            <button type="button" className="details-close-icon" onClick={onClose} title="Close">
              ✕
            </button>
          </div>
        </header>

        <div className="details-scrollable-body">
          {/* TOP SECTION: LARGE HERO IMAGE STAGE */}
          <div className="details-hero-stage">
            {/* Steam Overlay */}
            {steamActive && dish.steam !== false && (
              <div className="details-steam-overlay">
                <span className="steam-cloud c1">☁️</span>
                <span className="steam-cloud c2">☁️</span>
                <span className="steam-cloud c3">☁️</span>
              </div>
            )}

            <button 
              type="button" 
              className={`btn-steam-overlay-toggle ${steamActive ? 'active' : ''}`}
              onClick={() => setSteamActive(!steamActive)}
            >
              ☁️ Steam {steamActive ? 'ON' : 'OFF'}
            </button>

            <img 
              src={dish.imageUrl} 
              alt={dish.name} 
              className="details-hero-img"
            />

            <div className="hero-badge-overlay">
              <span className={`diet-tag-pill ${dish.isVeg ? 'veg' : 'nonveg'}`}>
                {dish.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
              </span>
              <span className="rating-tag-pill">⭐ {dish.rating || '4.9'}</span>
              <span className="prep-tag-pill">⏱️ {dish.prepTime || '20 min'}</span>
            </div>
          </div>

          {/* MAIN CONTENT SECTION */}
          <div className="details-content-container">
            {/* DISH TITLE, RESTAURANT & PRICE */}
            <div className="details-header-block">
              <div className="res-meta-line">
                <span className="res-badge">🏪 {dish.restaurantName}</span>
                <span className="cat-badge">🏷️ {dish.category}</span>
              </div>

              <h1 className="details-dish-title gradient-text">{dish.name}</h1>

              <div className="details-price-row">
                <span className="currency-symbol">₹</span>
                <span className="price-amount">{dish.price}</span>
                {dish.highlight && (
                  <span className="texture-highlight-chip">✨ {dish.highlight}</span>
                )}
              </div>

              <p className="details-dish-description">{dish.description}</p>
            </div>

            {/* SECTION 1: INGREDIENTS */}
            <div className="details-section-box">
              <h3 className="section-heading">🥗 Authentic Ingredients</h3>
              <div className="ingredients-flex-cluster">
                {ingredients.map((ing, idx) => (
                  <span key={idx} className="ingredient-chip">
                    🌿 {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* SECTION 2: CUSTOMIZATIONS (SPICE & ACCOMPANIMENTS) */}
            <div className="details-section-box">
              <h3 className="section-heading">⚙️ Customizations & Spice Level</h3>
              
              <div className="custom-options-group">
                <div className="custom-option-sub">
                  <span className="custom-sub-label">Select Heat Intensity:</span>
                  <div className="spice-selector-row">
                    {[
                      { level: 1, label: 'Mild Spice 🌿' },
                      { level: 3, label: 'Medium Spice 🔥' },
                      { level: 5, label: 'Extra Spicy 🔥🔥' }
                    ].map(s => (
                      <button
                        key={s.level}
                        type="button"
                        className={`spice-chip-btn ${selectedSpice === s.level ? 'active' : ''}`}
                        onClick={() => setSelectedSpice(s.level)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="custom-option-sub">
                  <span className="custom-sub-label">Select Pairing Accompaniment:</span>
                  <div className="addon-selector-row">
                    {['Standard', 'Extra Mint Chutney (+₹20)', 'Fresh Raita (+₹30)'].map(addon => (
                      <button
                        key={addon}
                        type="button"
                        className={`addon-chip-btn ${selectedAddon === addon ? 'active' : ''}`}
                        onClick={() => setSelectedAddon(addon)}
                      >
                        {addon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: CHEF'S RECOMMENDATIONS */}
            <div className="details-section-box">
              <h3 className="section-heading">✨ Recommended Chef Pairings</h3>
              <div className="pairings-grid">
                {pairings.map((pair, idx) => (
                  <div key={idx} className="pairing-card-item">
                    <span className="pair-icon">{pair.icon}</span>
                    <div className="pair-info">
                      <span className="pair-name">{pair.name}</span>
                      <span className="pair-price">₹{pair.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STICKY FOOTER: QUANTITY STEPPER & ADD TO CART */}
        <footer className="details-sticky-footer">
          <div className="footer-total-price">
            <span className="total-label">Total Amount</span>
            <span className="total-value">₹{dish.price * quantity}</span>
          </div>

          <div className="details-qty-stepper">
            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span className="qty-count">{quantity}</span>
            <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <button type="button" className="btn-add-to-cart-details" onClick={handleAddToCart}>
            🛒 Add {quantity} to Cart • ₹{dish.price * quantity}
          </button>
        </footer>
      </div>
    </div>
  );
}
