import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_DISHES } from '../data/dishes';
import FoodCard3D from '../components/FoodCard3D';
import FoodInspectorModal from '../components/FoodInspectorModal';
import MoodSelector from '../components/MoodSelector';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart() || { addToCart: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };

  const heroDishes = ALL_DISHES.slice(0, 6);
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const [inspectedDish, setInspectedDish] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeMood, setActiveMood] = useState(null);
  const [moodConfig, setMoodConfig] = useState(null);

  const featuredDish = heroDishes[selectedHeroIndex] || heroDishes[0];

  const categories = ['All', 'Biryani', 'North Indian', 'South Indian', 'Starters', 'Desserts', 'Street Food'];

  // Apply mood-based filtering
  const handleMoodSelect = (config) => {
    setMoodConfig(config);
    setActiveMood(config ? config.mood : null);
  };

  let filteredDishes = activeCategory === 'All' 
    ? ALL_DISHES 
    : ALL_DISHES.filter(d => d.category === activeCategory);

  // Apply mood filters on top of category filter
  if (moodConfig) {
    filteredDishes = filteredDishes.filter(d => {
      if (moodConfig.categories && moodConfig.categories.length > 0) {
        if (!moodConfig.categories.includes(d.category)) return false;
      }
      if (moodConfig.dietTag && d.dietTag !== moodConfig.dietTag) return false;
      if (moodConfig.maxSpice && d.spiceLevel > moodConfig.maxSpice) return false;
      if (moodConfig.minPrice && d.price < moodConfig.minPrice) return false;
      return true;
    });
  }

  const handleOrderHero = () => {
    addToCart(featuredDish);
    showToast(`Added ${featuredDish.name} to your dining order 🍽️`, 'success');
  };

  return (
    <div className="home-3d-ecosystem fade-in">
      {/* HERO STAGE */}
      <section className="hero-3d-stage">
        <div className="stage-light-spotlight"></div>

        <div className="hero-stage-container container">
          {/* LEFT: EDITORIAL TEXT & CTA */}
          <div className="hero-content-left">
            <div className="experience-badge-pill">
              <span className="sparkle">✨</span> ARTISANAL CULINARY SELECTION
            </div>

            <h1 className="hero-headline-3d gradient-text">
              Taste The Art of Fine Indian Dining
            </h1>

            <p className="hero-subtext-3d">
              Step into a living culinary showcase. Experience freshly prepared delicacies, traditional slow-cooked aromas, and express doorstep delivery.
            </p>

            {/* Glowing Glass CTA Group */}
            <div className="hero-cta-group">
              <button 
                className="btn btn-primary btn-hero-order-3d"
                onClick={handleOrderHero}
              >
                🍽️ Order {featuredDish.name.split(' ')[0]} — ₹{featuredDish.price}
              </button>

              <button 
                className="btn btn-secondary btn-hero-explore-3d"
                onClick={() => navigate('/menu')}
              >
                🚀 Explore Full Menu
              </button>
            </div>

            {/* Specs Bar */}
            <div className="culinary-specs-bar">
              <div className="spec-item">
                <span className="spec-icon">🔥</span>
                <div>
                  <span className="spec-val">{featuredDish.calories}</span>
                  <span className="spec-lbl">Energy</span>
                </div>
              </div>
              <div className="spec-item">
                <span className="spec-icon">⏱️</span>
                <div>
                  <span className="spec-val">{featuredDish.prepTime}</span>
                  <span className="spec-lbl">Fresh Prep</span>
                </div>
              </div>
              <div className="spec-item">
                <span className="spec-icon">⭐</span>
                <div>
                  <span className="spec-val">{featuredDish.rating} / 5</span>
                  <span className="spec-lbl">Diner Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CENTERPIECE DISH & ORBIT RING */}
          <div className="hero-3d-centerpiece-stage">
            <div className="centerpiece-halo-ring"></div>

            {/* Central Plated Dish */}
            <div 
              className="central-featured-dish-container"
              onClick={() => setInspectedDish(featuredDish)}
              title="Click to view details"
            >
              {featuredDish.steam !== false && (
                <div className="hero-steam-overlay">
                  <span className="steam-cloud s1">☁️</span>
                  <span className="steam-cloud s2">☁️</span>
                  <span className="steam-cloud s3">☁️</span>
                </div>
              )}

              <img 
                src={featuredDish.imageUrl} 
                alt={featuredDish.name}
                className="central-dish-img-3d"
              />

              <div className="central-dish-shadow"></div>

              <div className="central-highlight-badge">
                <span className="sparkle">✨</span> {featuredDish.highlight || featuredDish.texture}
              </div>
            </div>

            {/* Orbit Selector Ring */}
            <div className="orbiting-dishes-ring">
              {heroDishes.map((dish, idx) => (
                <div 
                  key={dish.id}
                  className={`orbit-node ${idx === selectedHeroIndex ? 'active' : ''}`}
                  onClick={() => setSelectedHeroIndex(idx)}
                  title={`Feature ${dish.name}`}
                >
                  <img src={dish.imageUrl} alt={dish.name} className="orbit-thumb" />
                  <span className="orbit-name-tooltip">{dish.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🧠 MOOD-BASED FOOD RECOMMENDATIONS */}
      <section className="mood-section container">
        <MoodSelector 
          onMoodSelect={handleMoodSelect}
          activeMood={activeMood}
        />
      </section>

      {/* DISCOVERY SECTION */}
      <section className="menu-discovery-section container">
        <div className="section-header-3d">
          <h2 className="gradient-text heading-lg">
            {moodConfig ? `${moodConfig.message}` : 'Curated Culinary Collections'}
          </h2>
          <p className="text-secondary">
            {moodConfig 
              ? `Showing ${filteredDishes.length} dishes matched to your mood` 
              : 'Discover hand-crafted regional specialties, rich gravies, and authentic sweets'}
          </p>

          <div className="category-pills-bar">
            {categories.map((cat) => (
              <button 
                key={cat}
                className={`glass-category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'All' && '✨ All Delicacies'}
                {cat === 'Biryani' && '🍛 Dum Biryani'}
                {cat === 'North Indian' && '🧈 North Indian'}
                {cat === 'South Indian' && '🫓 South Indian'}
                {cat === 'Starters' && '🍢 Tandoori Starters'}
                {cat === 'Desserts' && 'Gulab Jamun & Sweets'}
                {cat === 'Street Food' && '🥘 Street Food'}
              </button>
            ))}
          </div>
        </div>

        {/* DISHES GRID */}
        <div className="grid grid-cols-3 gap-8 mt-8">
          {filteredDishes.map((dish) => (
            <FoodCard3D 
              key={dish.id} 
              dish={dish} 
              onInspect={(d) => setInspectedDish(d)}
            />
          ))}
        </div>
      </section>

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
