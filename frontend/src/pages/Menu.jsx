import React, { useState } from 'react';
import FoodCard3D from '../components/FoodCard3D';
import FoodInspectorModal from '../components/FoodInspectorModal';
import SurpriseMe from '../components/SurpriseMe';
import HealthDashboard from '../components/HealthDashboard';
import { ALL_DISHES } from '../data/dishes';
import './Menu.css';

const CUISINES = [
  'ALL',
  'Main Dishes',
  'Rice & Biryani',
  'Breads',
  'South Indian',
  'Street Food',
  'Sweets',
  'Drinks'
];

const DIET_TAGS = ['ALL', 'High Protein', 'Keto', 'Jain Friendly', 'Low Calorie'];

export default function Menu() {
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('ALL');
  const [vegFilter, setVegFilter] = useState('ALL');
  const [dietFilter, setDietFilter] = useState('ALL');
  const [inspectedDish, setInspectedDish] = useState(null);
  const [healthFilter, setHealthFilter] = useState(null);
  const [activeHealthFilterName, setActiveHealthFilterName] = useState(null);

  const handleHealthFilter = (config) => {
    setHealthFilter(config);
    setActiveHealthFilterName(config ? config.filter : null);
  };

  let filteredProducts = ALL_DISHES.filter(product => {
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

  // Apply health filters on top
  if (healthFilter) {
    filteredProducts = filteredProducts.filter(product => {
      if (healthFilter.dietTags && healthFilter.dietTags.length > 0) {
        if (!healthFilter.dietTags.includes(product.dietTag)) return false;
      }
      if (healthFilter.maxCalories) {
        const cal = parseInt(product.calories) || 999;
        if (cal > healthFilter.maxCalories) return false;
      }
      if (healthFilter.maxSpice && product.spiceLevel > healthFilter.maxSpice) return false;
      if (healthFilter.excludeCategories && healthFilter.excludeCategories.includes(product.category)) return false;
      if (healthFilter.preferVeg && !product.isVeg) return false;
      return true;
    });

    // Apply sorting
    if (healthFilter.sortBy === 'protein') {
      filteredProducts.sort((a, b) => (parseInt(b.protein) || 0) - (parseInt(a.protein) || 0));
    }
  }

  return (
    <div className="menu-3d-page container fade-in">
      <div className="menu-header-3d">
        <div className="experience-badge-pill">
          <span className="sparkle">✨</span> ARTISANAL CULINARY LIBRARY
        </div>

        <h1 className="page-title-3d gradient-text">Explore Regional Delicacies</h1>
        <p className="page-subtitle-3d">Authentic Indian curries, rich dum biryanis, hot tandoori breads, crispy dosas, and royal sweets</p>

        {/* 💪 SMART HEALTH & DIET DASHBOARD */}
        <HealthDashboard 
          onHealthFilter={handleHealthFilter}
          activeFilter={activeHealthFilterName}
        />

        {/* Search Bar & Veg Filters Row */}
        <div className="menu-controls-row">
          <div className="search-box-3d glass-card">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search Butter Chicken, Dum Biryani, Garlic Naan, Jalebi..."
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

        {/* Dietary Filters */}
        <div className="diet-filter-row-3d">
          <span className="diet-label-3d">🧠 Dietary Filters:</span>
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

        {/* STICKY CATEGORY SCROLL BAR */}
        <div className="category-scroll-container-3d">
          <div className="category-pills-3d">
            {CUISINES.map(cuisine => (
              <button
                key={cuisine}
                className={`category-pill-3d ${selectedCuisine === cuisine ? 'active' : ''}`}
                onClick={() => setSelectedCuisine(cuisine)}
              >
                {cuisine === 'ALL' && '✨ All Delicacies'}
                {cuisine === 'Main Dishes' && '🥘 Main Dishes'}
                {cuisine === 'Rice & Biryani' && '🍛 Rice & Biryani'}
                {cuisine === 'Breads' && '🫓 Breads'}
                {cuisine === 'South Indian' && '🥞 South Indian'}
                {cuisine === 'Street Food' && '🍢 Street Food'}
                {cuisine === 'Sweets' && '🍬 Sweets'}
                {cuisine === 'Drinks' && '🥤 Drinks'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Count Indicator */}
      <div className="results-count-3d">
        Showing <strong>{filteredProducts.length}</strong> signature delicacies
        {healthFilter && <span className="health-filter-active"> • {healthFilter.filter} mode active</span>}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-results-3d glass-card">
          <span className="empty-icon">🔍</span>
          <h3>No delicacies found matching your criteria</h3>
          <p>Try resetting search or switching cuisine/dietary filters.</p>
          <button className="btn btn-primary" onClick={() => { setSearch(''); setSelectedCuisine('ALL'); setVegFilter('ALL'); setDietFilter('ALL'); setHealthFilter(null); setActiveHealthFilterName(null); }}>
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

      {/* 🎁 SURPRISE ME BUTTON */}
      <SurpriseMe dishes={ALL_DISHES} />

      {/* INSPECTOR MODAL */}
      {inspectedDish && (
        <FoodInspectorModal 
          dish={inspectedDish} 
          onClose={() => setInspectedDish(null)} 
        />
      )}
    </div>
  );
}
