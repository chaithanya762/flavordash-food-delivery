import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_DISHES } from '../data/dishes';
import FoodCard3D from '../components/FoodCard3D';
import FoodInspectorModal from '../components/FoodInspectorModal';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart() || { addToCart: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };

  // Filter 3D Hero dishes
  const heroDishes = ALL_DISHES.slice(0, 6);
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const [inspectedDish, setInspectedDish] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const featuredDish = heroDishes[selectedHeroIndex] || heroDishes[0];

  const categories = ['All', 'Biryani', 'North Indian', 'South Indian', 'Starters', 'Desserts', 'Street Food'];

  const filteredDishes = activeCategory === 'All' 
    ? ALL_DISHES 
    : ALL_DISHES.filter(d => d.category === activeCategory);

  const handleOrderHero = () => {
    addToCart(featuredDish);
    showToast(`Added ${featuredDish.name} to your cart! 🍽️`, 'success');
  };

  return (
    <div className="home-3d-ecosystem fade-in">
      {/* =========================================
          HERO STAGE: CONTINUOUS 3D FOOD WORLD
          ========================================= */}
      <section className="hero-3d-stage">
        {/* Volumetric Spotlight Backdrop */}
        <div className="stage-light-spotlight"></div>

        <div className="hero-stage-container container">
          {/* LEFT: MINIMAL TEXT & GLOWING GLASS CTA */}
          <div className="hero-content-left">
            <div className="experience-badge-pill">
              <span className="sparkle">✨</span> 3D CINEMATIC FOOD ECOSYSTEM
            </div>

            <h1 className="hero-headline-3d gradient-text">
              Taste The Future of Culinary Art
            </h1>

            <p className="hero-subtext-3d">
              Step into an immersive, living food world. Explore 3D floating Indian delicacies, steam physics, and instant doorstep delivery.
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
                🚀 Explore Full 3D Menu
              </button>
            </div>

            {/* Culinary Specs Pill Bar */}
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
                  <span className="spec-lbl">Octane Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: 3D ORBIT STAGE (CENTERPIECE + ORBITING DISHES) */}
          <div className="hero-3d-centerpiece-stage">
            {/* Centerpiece Spotlight Glow */}
            <div className="centerpiece-halo-ring"></div>

            {/* Central Floating Featured 3D Dish (Layer 3) */}
            <div 
              className="central-featured-dish-container"
              onClick={() => setInspectedDish(featuredDish)}
              title="Click to Inspect in 3D"
            >
              {/* Steam Vapor Wisps */}
              {featuredDish.steam !== false && (
                <div className="hero-steam-overlay">
                  <span className="steam-cloud s1">☁️</span>
                  <span className="steam-cloud s2">☁️</span>
                  <span className="steam-cloud s3">☁️</span>
                </div>
              )}

              {/* 3D Artwork */}
              <img 
                src={featuredDish.imageUrl} 
                alt={featuredDish.name}
                className="central-dish-img-3d"
              />

              {/* Contact Shadow */}
              <div className="central-dish-shadow"></div>

              {/* Floating Highlight Label */}
              <div className="central-highlight-badge">
                <span className="sparkle">✨</span> {featuredDish.highlight || featuredDish.texture}
              </div>
            </div>

            {/* ORBITING 3D DISHES SELECTOR RING */}
            <div className="orbiting-dishes-ring">
              {heroDishes.map((dish, idx) => (
                <div 
                  key={dish.id}
                  className={`orbit-node ${idx === selectedHeroIndex ? 'active' : ''}`}
                  onClick={() => setSelectedHeroIndex(idx)}
                  title={`Switch Spotlight to ${dish.name}`}
                >
                  <img src={dish.imageUrl} alt={dish.name} className="orbit-thumb" />
                  <span className="orbit-name-tooltip">{dish.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          DISCOVERY SECTION: FLOATING CATEGORIES & 3D GRID
          ========================================= */}
      <section className="menu-discovery-section container">
        <div className="section-header-3d">
          <h2 className="gradient-text heading-lg">Interactive 3D Menu Grid</h2>
          <p className="text-secondary">Hover and tilt to explore textures, steam, and ingredient depths</p>

          {/* Floating Category Filter Pills */}
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

        {/* 3D FOOD CARDS GRID */}
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
