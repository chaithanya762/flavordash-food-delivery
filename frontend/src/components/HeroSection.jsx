import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src="/hero-banner.jpg" alt="Gourmet Feast" className="hero-img" />
        <div className="hero-gradient-overlay"></div>
      </div>

      <div className="hero-content container">
        <div className="hero-text-block">
          <div className="hero-badge">
            <span className="pulse-dot"></span> ⚡ FASTEST FOOD DELIVERY IN TOWN
          </div>
          
          <h1 className="hero-headline">
            Craving Delicious Food? <br />
            <span className="gradient-text">Delivered In 30 Mins.</span>
          </h1>
          
          <p className="hero-subtitle">
            Order authentic Biryanis, Butter Chicken, Gourmet Burgers & Wood-fired Pizzas from the finest top-rated restaurants near you.
          </p>

          <div className="hero-cta-buttons">
            <Link to="/menu" className="btn btn-primary btn-hero">
              Order Now 🍽️
            </Link>
            <Link to="/menu" className="btn btn-secondary btn-hero">
              Explore Menu
            </Link>
          </div>
        </div>

        {/* Floating Dish Badge Highlights */}
        <div className="floating-dish-card dish-card-1 glass-card">
          <span className="dish-icon">🍗</span>
          <div>
            <span className="dish-title">Butter Chicken</span>
            <span className="dish-rating">⭐ 4.9 (1.2k+)</span>
          </div>
        </div>

        <div className="floating-dish-card dish-card-2 glass-card">
          <span className="dish-icon">🍚</span>
          <div>
            <span className="dish-title">Dum Biryani</span>
            <span className="dish-rating">⭐ 4.8 (2.4k+)</span>
          </div>
        </div>
      </div>

      {/* Bottom Stats Banner */}
      <div className="hero-stats-banner container">
        <div className="stats-card glass-card">
          <div className="stat-number">500+</div>
          <div className="stat-label">Partner Restaurants</div>
        </div>
        <div className="stats-card glass-card">
          <div className="stat-number">30 Mins</div>
          <div className="stat-label">Average Delivery</div>
        </div>
        <div className="stats-card glass-card">
          <div className="stat-number">4.9 ★</div>
          <div className="stat-label">Customer Rating</div>
        </div>
        <div className="stats-card glass-card">
          <div className="stat-number">100k+</div>
          <div className="stat-label">Happy Foodies</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
