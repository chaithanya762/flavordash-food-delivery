import React, { useState } from 'react';
import FoodCard3D from '../components/FoodCard3D';
import FoodInspectorModal from '../components/FoodInspectorModal';
import { ALL_DISHES } from '../data/dishes';
import './Menu.css';

const CUISINES = [
  'ALL',
  'North Indian',
  'South Indian',
  'Biryani',
  'Starters',
  'Street Food',
  'Desserts',
  'Beverages'
];

const DIET_TAGS = ['ALL', 'High Protein', 'Keto', 'Jain Friendly', 'Low Calorie'];

export default function Menu() {
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('ALL');
  const [vegFilter, setVegFilter] = useState('ALL'); // ALL, VEG, NON_VEG
  const [dietFilter, setDietFilter] = useState('ALL');
  const [inspectedDish, setInspectedDish] = useState(null);

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
    <div className="menu-3d-page container fade-in">
      <div className="menu-header-3d">
        <div className="experience-badge-pill">
          <span className="sparkle">✨</span> OCTANE 3D CULINARY LIBRARY
        </div>

        <h1 className="page-title-3d gradient-text">Explore Floating 3D Delicacies</h1>
        <p className="page-subtitle-3d">Tilt cards to inspect steam physics, charred embers, syrup reflections, and AI macros</p>

        {/* Search Bar & Veg Filters Row */}
        <div className="menu-controls-row">
          <div className="search-box-3d glass-card">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search Biryani, Butter Chicken, Dosa, Jalebi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input-3d"
            />
            {search && (
              <button className="clear-search-3d" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="veg-toggle-group-3d glass-card">
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
        <div className="diet-filter-row-3d">
          <span className="diet-label-3d">🧠 AI Macro Filters:</span>
          {DIET_TAGS.map(diet => (
            <button
              key={diet}
              className={`diet-chip-3d ${dietFilter === diet ? 'active' : ''}`}
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
        <div className="category-scroll-container-3d">
          <div className="category-pills-3d">
            {CUISINES.map(cuisine => (
              <button
                key={cuisine}
                className={`category-pill-3d ${selectedCuisine === cuisine ? 'active' : ''}`}
                onClick={() => setSelectedCuisine(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Count Indicator */}
      <div className="results-count-3d">
        Showing <strong>{filteredProducts.length}</strong> interactive 3D dishes
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-results-3d glass-card">
          <span className="empty-icon">🔍</span>
          <h3>No 3D delicacies found matching your criteria</h3>
          <p>Try resetting search or switching cuisine/macro filters.</p>
          <button className="btn btn-primary" onClick={() => { setSearch(''); setSelectedCuisine('ALL'); setVegFilter('ALL'); setDietFilter('ALL'); }}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="dishes-grid-3d grid grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <FoodCard3D 
              key={product.id} 
              dish={product} 
              onInspect={(d) => setInspectedDish(d)} 
            />
          ))}
        </div>
      )}

      {/* 3D INSPECTOR MODAL */}
      {inspectedDish && (
        <FoodInspectorModal 
          dish={inspectedDish} 
          onClose={() => setInspectedDish(null)} 
        />
      )}
    </div>
  );
}
