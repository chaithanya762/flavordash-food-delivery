import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import './RewardsPanel.css';

const RewardsPanel = () => {
  const { coins, streak, totalOrders, getRewardTiers } = useGamification();
  const [isOpen, setIsOpen] = useState(false);
  const [displayCoins, setDisplayCoins] = useState(0);
  
  const tiers = getRewardTiers();

  useEffect(() => {
    if (isOpen) {
      let start = displayCoins;
      const end = coins;
      if (start === end) return;
      
      const duration = 1000;
      let startTimestamp = null;
      
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        setDisplayCoins(Math.floor(progress * (end - start) + start));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [isOpen, coins]);

  return (
    <div className="gamification-container">
      <button 
        className={`badge-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Rewards Panel"
      >
        <span className="badge-coin">🪙</span>
        <span>{coins}</span>
        <span className="badge-divider">|</span>
        <span className="badge-streak">🔥</span>
        <span>{streak}d</span>
      </button>

      {isOpen && (
        <div className="rewards-dropdown">
          <div className="rewards-header">
            <h3>Your Rewards Dashboard</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>&times;</button>
          </div>

          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-value">{totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-box">
              <span className="stat-value streak-value">🔥 {streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat-box">
              <span className="stat-value coin-value">🪙 {displayCoins}</span>
              <span className="stat-label">Total Coins</span>
            </div>
          </div>

          <div className="tiers-list">
            {tiers.map(tier => {
              const progress = Math.min((coins / tier.requiredCoins) * 100, 100);
              
              return (
                <div 
                  key={tier.id} 
                  className={`reward-card ${tier.unlocked ? 'unlocked' : 'locked'}`}
                  style={{ '--tier-color': tier.color }}
                >
                  <div className="reward-card-header">
                    <h4 style={{ color: tier.color }}>{tier.name}</h4>
                    {tier.unlocked && <span className="unlocked-icon">✓</span>}
                  </div>
                  <p className="reward-desc">{tier.reward}</p>
                  
                  <div className="progress-container">
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${progress}%`, backgroundColor: tier.color }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {tier.unlocked ? (
                        <span>Unlocked!</span>
                      ) : (
                        <span>{tier.requiredCoins - coins} more coins needed</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPanel;
