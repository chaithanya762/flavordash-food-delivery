import React, { useState } from 'react';
import FoodCard from '../components/FoodCard';
import { ALL_DISHES } from '../data/dishes';
import './Menu.css';

const CUISINES = [
  'ALL',
  'North Indian',
  'South Indian',
  'Biryani',
  'Starters',
  'Street Food',
  'Fast Food',
  'Desserts',
  'Ice Creams',
  'Beverages'
];

const DIET_TAGS = ['ALL', 'High Protein', 'Keto', 'Jain Friendly', 'Low Calorie'];

export default function Menu() {
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('ALL');
  const [vegFilter, setVegFilter] = useState('ALL'); // ALL, VEG, NON_VEG
  const [dietFilter, setDietFilter] = useState('ALL');

  const filteredProducts = ALL_DISHES.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.description?.toLowerCase().includes(search.toLowerCase()) ||
                          product.restaurantName?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCuisine = selectedCuisine === 'ALL' || 
                           product.category === selectedCuisine || 
                           product.cuisine === selectedCuisine;
    
    const matchesVeg = vegFilter === 'ALL' || 
                       (vegFilter === 'VEG' && product.isVeg) || 
                       (vegFilter === 'NON_VEG' && !product.isVeg);

    const matchesDiet = dietFilter === 'ALL' || product.dietTag === dietFilter;

    return matchesSearch && matchesCuisine && matchesVeg && matchesDiet;
  });

  return (
    <div className="menu-page container fade-in">
      <div className="menu-header">
        <h1 className="page-title gradient-text">Explore Our Culinary Menu 🍽️</h1>
        <p className="page-subtitle">Authentic North Indian, South Indian, Biryanis, Sweets & AI Macro Filters</p>

        {/* Search Bar & Veg Filters Row */}
        <div className="menu-controls-row">
          <div className="search-box glass-card">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search Butter Chicken, Biryani, Dosa, Gulab Jamun..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="clear-search" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="veg-toggle-group glass-card">
            <button 
              className={`veg-toggle-btn ${vegFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setVegFilter('ALL')}
            >
              All
            </button>
            <button 
              className={`veg-toggle-btn veg ${vegFilter === 'VEG' ? 'active' : ''}`}
              onClick={() => setVegFilter('VEG')}
            >
              🟢 Veg Only
            </button>
            <button 
              className={`veg-toggle-btn non-veg ${vegFilter === 'NON_VEG' ? 'active' : ''}`}
              onClick={() => setVegFilter('NON_VEG')}
            >
              🔴 Non-Veg
            </button>
          </div>
        </div>

        {/* AI Diet & Macro Filter Row */}
        <div className="diet-filter-row">
          <span className="diet-label">🧠 AI Macro Filters:</span>
          {DIET_TAGS.map(diet => (
            <button
              key={diet}
              className={`diet-chip ${dietFilter === diet ? 'active' : ''}`}
              onClick={() => setDietFilter(diet)}
            >
              {diet === 'High Protein' && '💪 '}
              {diet === 'Keto' && '🥑 '}
              {diet === 'Jain Friendly' && '🌿 '}
              {diet === 'Low Calorie' && '⚡ '}
              {diet}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="category-scroll-container">
          <div className="category-pills">
            {CUISINES.map(cuisine => (
              <button
                key={cuisine}
                className={`category-pill ${selectedCuisine === cuisine ? 'active' : ''}`}
                onClick={() => setSelectedCuisine(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Count Indicator */}
      <div className="results-count">
        Showing <strong>{filteredProducts.length}</strong> delicious dishes
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-results glass-card">
          <span className="empty-icon">🔍</span>
          <h3>No dishes found matching your criteria</h3>
          <p>Try clearing your search term or switching cuisine/macro filters.</p>
          <button className="btn btn-primary" onClick={() => { setSearch(''); setSelectedCuisine('ALL'); setVegFilter('ALL'); setDietFilter('ALL'); }}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="dishes-grid">
          {filteredProducts.map(product => (
            <FoodCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
