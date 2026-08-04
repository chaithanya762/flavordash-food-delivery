import React from 'react';
import { useCart } from '../context/CartContext';
import './HealthDashboard.css';

export function getHealthySwap(dish, allDishes) {
  if (!dish || !allDishes) return null;
  const currentCalories = parseInt(dish.calories?.toString().replace(/[^\d]/g, '') || 9999);
  
  const alternatives = allDishes.filter(d => 
      d.id !== dish.id && 
      d.category === dish.category && 
      parseInt(d.calories?.toString().replace(/[^\d]/g, '') || 9999) < currentCalories
  );
  
  if (alternatives.length === 0) return null;
  
  // Return the alternative with the lowest calories
  return alternatives.sort((a, b) => 
      parseInt(a.calories?.toString().replace(/[^\d]/g, '') || 9999) - parseInt(b.calories?.toString().replace(/[^\d]/g, '') || 9999)
  )[0];
}

const filterOptions = [
  { 
    id: 'gym', 
    label: 'Gym Mode', 
    icon: '🏋️', 
    config: { filter: 'Gym Mode', dietTags: ['High Protein'], sortBy: 'proteinDesc' }, 
    color: 'green' 
  },
  { 
    id: 'diabetic', 
    label: 'Diabetic Friendly', 
    icon: '🩺', 
    config: { filter: 'Diabetic Friendly', maxSpice: 2, categories: ['Main Dishes', 'South Indian'], excludeCategories: ['Sweets'] }, 
    color: 'blue' 
  },
  { 
    id: 'pcos', 
    label: 'PCOS Friendly', 
    icon: '💊', 
    config: { filter: 'PCOS Friendly', dietTags: ['Low Calorie', 'High Protein'], preferVeg: true }, 
    color: 'purple' 
  },
  { 
    id: 'keto', 
    label: 'Keto', 
    icon: '🥑', 
    config: { filter: 'Keto', dietTags: ['Keto'] }, 
    color: 'emerald' 
  },
  { 
    id: 'lowcal', 
    label: 'Low Calorie (<350 kcal)', 
    icon: '⚡', 
    config: { filter: 'Low Calorie', maxCalories: 350 }, 
    color: 'amber' 
  }
];

export default function HealthDashboard({ onHealthFilter, activeFilter }) {
  const { cart } = useCart();
  
  const totalCalories = cart.reduce((acc, item) => {
    const cal = parseInt(item.calories?.toString().replace(/[^\d]/g, '') || 0);
    return acc + (cal * item.quantity);
  }, 0);

  const totalProtein = cart.reduce((acc, item) => {
    const pro = parseInt(item.protein?.toString().replace(/[^\d]/g, '') || 0);
    return acc + (pro * item.quantity);
  }, 0);

  const dailyGoal = 2000;
  const calPercent = Math.min((totalCalories / dailyGoal) * 100, 100);
  
  let ringColor = '#4ADE80'; // green (<60%)
  if (calPercent >= 80) ringColor = '#EF4444'; // red (>80%)
  else if (calPercent >= 60) ringColor = '#FACC15'; // yellow (60-80%)

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calPercent / 100) * circumference;

  const handleFilterClick = (option) => {
    if (activeFilter === option.config.filter) {
      onHealthFilter(null);
    } else {
      onHealthFilter(option.config);
    }
  };

  const handleResetKcal = () => {
    onHealthFilter(null);
  };

  return (
    <div className="health-dashboard">
      <div className="health-stats">
        <div className="cal-ring-container" title={`Current Cart: ${totalCalories} / ${dailyGoal} kcal`}>
          <svg className="cal-ring" width="50" height="50">
            <circle
              className="cal-ring-bg"
              cx="25" cy="25" r={radius}
              strokeWidth="4"
            />
            <circle
              className="cal-ring-progress"
              cx="25" cy="25" r={radius}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              stroke={ringColor}
            />
          </svg>
          <div className="cal-text">
            <span className="cal-value">{totalCalories}</span>
            <span className="cal-unit">/ {dailyGoal} kcal</span>
          </div>
        </div>
        
        <div className="protein-stat">
          <span className="stat-label">Protein:</span>
          <span className="stat-value">{totalProtein}g</span>
        </div>
      </div>

      <div className="health-filters-wrapper">
        <div className="health-filters">
          {filterOptions.map(opt => {
            const isActive = activeFilter === opt.config.filter;
            return (
              <button
                key={opt.id}
                className={`health-filter-chip ${isActive ? 'active' : ''} ${opt.color}`}
                onClick={() => handleFilterClick(opt)}
              >
                <span className="chip-icon">{opt.icon}</span>
                <span className="chip-label">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {activeFilter && (
          <button 
            className="health-reset-btn" 
            onClick={handleResetKcal}
            title="Reset Calorie & Health Filter"
          >
            <span className="reset-icon">🔄</span> Reset Kcal Scale
          </button>
        )}
      </div>
    </div>
  );
}
