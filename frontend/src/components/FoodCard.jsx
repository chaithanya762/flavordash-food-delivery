import React from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './FoodCard.css';

const FoodCard = ({ product }) => {
  const { addToCart, updateQuantity, cart } = useCart() || { addToCart: () => {}, updateQuantity: () => {}, cart: [] };
  const { showToast, addToast } = useToast() || { showToast: () => {} };

  const triggerToast = showToast || addToast || (() => {});

  const cartItem = cart?.find(item => item.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const originalPrice = Math.round(product.price * 1.3);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (product.available !== false) {
      addToCart(product);
      triggerToast(`Added ${product.name} to cart! 😋`, 'success');
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    updateQuantity(product.id, inCartQty + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(product.id, inCartQty - 1);
  };

  return (
    <div className={`food-card-god ${product.available === false ? 'sold-out' : ''}`}>
      <div className="food-card-image-box">
        {/* Veg / Non-Veg Indicator Badge */}
        <div className={`veg-indicator ${product.isVeg ? 'veg' : 'non-veg'}`} title={product.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}>
          <div className="veg-dot"></div>
        </div>

        {/* Offer Discount Tag */}
        <div className="offer-tag-badge">
          <span>50% OFF</span>
        </div>

        {/* Dish Image */}
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="food-card-img" 
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
            }}
          />
        ) : (
          <div className="food-placeholder">🍽️</div>
        )}
        <div className="image-vignette-gradient"></div>
        
        {/* Rating & Prep Time Bar */}
        <div className="image-overlay-info">
          <span className="star-rating">⭐ {product.rating || '4.9'}</span>
          <span className="prep-time">⏱️ {product.prepTime || '20 min'}</span>
        </div>

        {product.available === false && (
          <div className="sold-out-banner">Sold Out</div>
        )}
      </div>

      <div className="food-card-body">
        <div className="title-section">
          <h3 className="dish-name">{product.name}</h3>
          <span className="restaurant-label">📍 {product.restaurantName || 'Kitchen'}</span>
        </div>

        {/* AI Calorie & Protein Macro Badge */}
        {(product.protein || product.calories) && (
          <div className="macro-nutrients-badge">
            {product.protein && <span className="macro-item protein">💪 {product.protein}</span>}
            {product.calories && <span className="macro-item calories">⚡ {product.calories}</span>}
            {product.dietTag && <span className="macro-item diet-tag">{product.dietTag}</span>}
          </div>
        )}

        <p className="dish-desc">{product.description}</p>

        <div className="food-card-action-bar">
          <div className="price-container">
            <span className="price-current">₹{product.price}</span>
            <span className="price-original">₹{originalPrice}</span>
          </div>

          {/* Stepper or Add Button */}
          {inCartQty > 0 ? (
            <div className="card-qty-stepper">
              <button onClick={handleDecrement}>-</button>
              <span>{inCartQty}</span>
              <button onClick={handleIncrement}>+</button>
            </div>
          ) : (
            <button 
              className="btn-add-god"
              onClick={handleAdd}
              disabled={product.available === false}
            >
              + ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
