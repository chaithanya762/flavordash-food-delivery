import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FoodCard from '../components/FoodCard';
import { ALL_DISHES } from '../data/dishes';
import { productAPI } from '../api/api';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState(ALL_DISHES.slice(0, 8));
  const [loading, setLoading] = useState(false);

  return (
    <div className="home-page fade-in">
      <HeroSection />

      {/* How it Works Section */}
      <section className="how-it-works container">
        <div className="section-header text-center">
          <span className="section-subtitle">SIMPLE STEPS</span>
          <h2 className="section-title gradient-text">How FlavorDash Works</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card glass-card">
            <div className="step-number">01</div>
            <div className="step-icon">🍽️</div>
            <h3>Select Your Dish</h3>
            <p>Browse 30+ top-rated Indian & Global authentic dishes prepared fresh.</p>
          </div>

          <div className="step-card glass-card">
            <div className="step-number">02</div>
            <div className="step-icon">⚡</div>
            <h3>Fast Order & UPI Pay</h3>
            <p>Place your order instantly with GPay, PhonePe, Cards, or Cash on Delivery.</p>
          </div>

          <div className="step-card glass-card">
            <div className="step-number">03</div>
            <div className="step-icon">🚀</div>
            <h3>30-Min Delivery</h3>
            <p>Track your food live as our delivery hero brings it hot to your doorstep.</p>
          </div>
        </div>
      </section>

      {/* Popular Dishes Grid */}
      <section className="popular-dishes container">
        <div className="section-header">
          <div>
            <span className="section-subtitle">TOP RECOMMENDATIONS</span>
            <h2 className="section-title gradient-text">Trending Dishes Near You</h2>
          </div>
        </div>

        <div className="dishes-grid">
          {products.map(product => (
            <FoodCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features Banner */}
      <section className="features-section container">
        <div className="features-grid">
          <div className="feature-item glass-card">
            <span className="feature-icon">🛵</span>
            <div>
              <h4>30-Min Delivery</h4>
              <p>Hot & fresh food delivered to your door guaranteed on time.</p>
            </div>
          </div>
          <div className="feature-item glass-card">
            <span className="feature-icon">🛡️</span>
            <div>
              <h4>Hygiene Sealed</h4>
              <p>100% safety sealed packaging and double-checked kitchens.</p>
            </div>
          </div>
          <div className="feature-item glass-card">
            <span className="feature-icon">💎</span>
            <div>
              <h4>Best Price Perks</h4>
              <p>Exclusive daily discounts, cashback, and free delivery.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
