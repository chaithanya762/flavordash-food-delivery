import React, { useState, useEffect, useRef } from 'react';
import './SurpriseMe.css';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const SurpriseMe = ({ dishes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [budget, setBudget] = useState(200);
  const [vegPref, setVegPref] = useState('All'); // 'All', 'Veg', 'Non-Veg'
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningDish, setWinningDish] = useState(null);
  const [currentSpinImage, setCurrentSpinImage] = useState('');
  
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const spinInterval = useRef(null);

  const handleSpin = () => {
    // Filter dishes
    const filteredDishes = dishes.filter(dish => {
      const withinBudget = dish.price <= budget;
      const matchesVeg = vegPref === 'All' ? true : (vegPref === 'Veg' ? dish.isVeg : !dish.isVeg);
      return withinBudget && matchesVeg;
    });

    if (filteredDishes.length === 0) {
      showToast('No dishes found for this combination!', 'error');
      return;
    }

    setIsSpinning(true);
    setWinningDish(null);
    
    // Slot machine animation
    let spinCount = 0;
    const maxSpins = 20; // 20 * 100ms = 2s
    
    spinInterval.current = setInterval(() => {
      const randomDish = filteredDishes[Math.floor(Math.random() * filteredDishes.length)];
      setCurrentSpinImage(randomDish.imageUrl || 'placeholder.jpg'); // Fallback if no image
      spinCount++;

      if (spinCount >= maxSpins) {
        clearInterval(spinInterval.current);
        const finalDish = filteredDishes[Math.floor(Math.random() * filteredDishes.length)];
        setWinningDish(finalDish);
        setIsSpinning(false);
      }
    }, 100);
  };

  const handleAddToCart = () => {
    if (winningDish) {
      addToCart(winningDish);
      showToast(`${winningDish.name} added to cart!`, 'success');
      setIsOpen(false);
    }
  };
  
  const handleClose = () => {
    setIsOpen(false);
    setWinningDish(null);
    setIsSpinning(false);
    if (spinInterval.current) {
        clearInterval(spinInterval.current);
    }
  }

  return (
    <>
      <button className="surprise-trigger-btn" onClick={() => setIsOpen(true)}>
        Surprise Me 🎲
      </button>

      {isOpen && (
        <div className="surprise-modal-overlay">
          <div className="surprise-modal">
            <button className="close-btn" onClick={handleClose}>&times;</button>
            <h2>Discover a Dish!</h2>

            {!winningDish && !isSpinning ? (
              <div className="surprise-filters">
                <div className="filter-group">
                  <label>Max Budget: ₹{budget}</label>
                  <input 
                    type="range" 
                    min="100" 
                    max="500" 
                    step="50" 
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="budget-slider"
                  />
                </div>
                
                <div className="filter-group veg-toggle">
                  {['All', 'Veg', 'Non-Veg'].map(pref => (
                    <button 
                      key={pref}
                      className={`pref-btn ${vegPref === pref ? 'active' : ''}`}
                      onClick={() => setVegPref(pref)}
                    >
                      {pref}
                    </button>
                  ))}
                </div>

                <button className="spin-btn" onClick={handleSpin}>Spin!</button>
              </div>
            ) : isSpinning ? (
              <div className="spinning-container">
                <div className="spinning-frame">
                   {currentSpinImage && <img src={currentSpinImage} alt="spinning" className="spin-image blur-transition" />}
                </div>
                <p>Finding your next meal...</p>
              </div>
            ) : winningDish && (
              <div className="result-card">
                <div className="confetti">🎉 🎊 🎉</div>
                <div className="winning-image-container">
                  <img src={winningDish.imageUrl || 'placeholder.jpg'} alt={winningDish.name} className="winning-image" />
                  <span className={`veg-badge ${winningDish.isVeg ? 'veg' : 'non-veg'}`}></span>
                </div>
                <h3>{winningDish.name}</h3>
                <p className="restaurant-name">{winningDish.restaurantName}</p>
                <div className="dish-details">
                  <span className="price">₹{winningDish.price}</span>
                  <span className="rating">⭐ {winningDish.rating}</span>
                </div>
                
                <div className="action-buttons">
                  <button className="add-cart-btn" onClick={handleAddToCart}>
                    Add to Cart 🛒
                  </button>
                  <button className="try-again-btn" onClick={() => setWinningDish(null)}>
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SurpriseMe;
