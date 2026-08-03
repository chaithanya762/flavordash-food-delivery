import React from 'react';
import './MoodSelector.css';

const MOODS = [
  {
    id: 'Sad',
    emoji: '😔',
    name: 'Sad',
    tagline: 'Comfort',
    config: {
      mood: 'Sad',
      categories: ['Main Dishes', 'Sweets'],
      maxSpice: 2,
      message: 'Feeling low? Warm comfort food to lift your spirits'
    }
  },
  {
    id: 'Happy',
    emoji: '😄',
    name: 'Happy',
    tagline: 'Treat',
    config: {
      mood: 'Happy',
      categories: [],
      message: 'Celebrate your good vibes with something special'
    }
  },
  {
    id: 'Lazy',
    emoji: '😴',
    name: 'Lazy',
    tagline: 'Easy',
    config: {
      mood: 'Lazy',
      categories: ['Street Food', 'Breads'],
      message: 'Low effort, max flavor — perfect for lazy days'
    }
  },
  {
    id: 'Gym Mode',
    emoji: '💪',
    name: 'Gym Mode',
    tagline: 'Protein',
    config: {
      mood: 'Gym Mode',
      categories: [],
      dietTag: 'High Protein',
      message: 'Fuel your gains with protein-packed meals'
    }
  },
  {
    id: 'Celebrating',
    emoji: '🥳',
    name: 'Celebrating',
    tagline: 'Premium',
    config: {
      mood: 'Celebrating',
      categories: [],
      minPrice: 300,
      message: 'Go big! Treat yourself to the finest dishes'
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
      message: 'Warm soup-like comfort to melt your stress away'
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

  const activeMoodObj = MOODS.find(m => m.id === activeMood);

  return (
    <div className="mood-selector-container">
      <div className="mood-header">
        <h2>🧠 How are you feeling today?</h2>
        <p>Let us recommend the perfect meal for your mood</p>
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
        <div className="mood-banner">
          <p>{activeMoodObj.config.message}</p>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;
