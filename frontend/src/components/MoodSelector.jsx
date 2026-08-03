import React from 'react';
import './MoodSelector.css';

const MOODS = [
  {
    id: 'Sad',
    emoji: '😔',
    name: 'Sad',
    tagline: 'Warm Comfort',
    config: {
      mood: 'Sad',
      categories: ['Main Dishes', 'Sweets'],
      maxSpice: 2,
      message: '🍲 Feeling low? Slow-cooked curries & warm desserts crafted to lift your spirits.'
    }
  },
  {
    id: 'Happy',
    emoji: '😄',
    name: 'Happy',
    tagline: 'Joyful Feast',
    config: {
      mood: 'Happy',
      categories: [],
      message: '✨ Celebrate your good vibes with rich dum biryanis and festive gravies!'
    }
  },
  {
    id: 'Lazy',
    emoji: '😴',
    name: 'Lazy',
    tagline: 'Effortless',
    config: {
      mood: 'Lazy',
      categories: ['Street Food', 'Breads'],
      message: '⚡ Low effort, maximum flavor — hot street treats and freshly baked naan.'
    }
  },
  {
    id: 'Gym Mode',
    emoji: '💪',
    name: 'Gym Mode',
    tagline: 'Pure Protein',
    config: {
      mood: 'Gym Mode',
      categories: [],
      dietTag: 'High Protein',
      message: '🏋️ Fuel your gains with lean tandoori grills, paneer, and protein-rich lentils.'
    }
  },
  {
    id: 'Celebrating',
    emoji: '🥳',
    name: 'Celebrating',
    tagline: 'Royal Luxe',
    config: {
      mood: 'Celebrating',
      categories: [],
      minPrice: 300,
      message: '👑 Go grand! Indulge in artisanal royal specialties and luxury platters.'
    }
  },
  {
    id: 'Stressed',
    emoji: '😰',
    name: 'Stressed',
    tagline: 'Soothing',
    config: {
      mood: 'Stressed',
      categories: ['Main Dishes', 'Drinks', 'Sweets'],
      maxSpice: 2,
      message: '🍵 Smooth velvet Dal Makhani & soothing drinks to melt your stress away.'
    }
  }
];

const MoodSelector = ({ onMoodSelect, activeMood }) => {
  const handleMoodClick = (mood) => {
    if (activeMood === mood.id) {
      onMoodSelect(null);
    } else {
      onMoodSelect({ ...mood.config });
    }
  };

  const handleReset = () => {
    onMoodSelect(null);
  };

  const activeMoodObj = MOODS.find(m => m.id === activeMood);

  return (
    <div className="mood-selector-container glass-luxury-card">
      <div className="mood-header-row">
        <div className="mood-header">
          <div className="section-eyebrow">
            <span className="sparkle">✨</span> AI MOOD GASTRONOMY
          </div>
          <h2>How are you feeling today?</h2>
          <p>Select your mood to discover curated culinary recommendations tailored to your state of mind</p>
        </div>

        {activeMood && (
          <button className="mood-refresh-btn" onClick={handleReset} title="Reset mood filter">
            <span className="refresh-icon">🔄</span> Reset Mood Filter
          </button>
        )}
      </div>
      
      <div className="mood-scroll-wrapper">
        <div className="mood-cards-row">
          {MOODS.map(mood => (
            <button
              key={mood.id}
              className={`mood-card ${activeMood === mood.id ? 'active' : ''}`}
              onClick={() => handleMoodClick(mood)}
              aria-pressed={activeMood === mood.id}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-name">{mood.name}</span>
              <span className="mood-tagline">{mood.tagline}</span>
            </button>
          ))}
        </div>
      </div>

      {activeMoodObj && (
        <div className="mood-banner slide-down">
          <p>{activeMoodObj.config.message}</p>
          <button className="banner-clear-link" onClick={handleReset}>Clear Filter ✕</button>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;
