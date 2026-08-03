import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GamificationContext = createContext(null);

const initialState = {
  coins: 0,
  streak: 0,
  totalOrders: 0,
  lastOrderDate: null,
  rewards: []
};

const init = (initialState) => {
  const stored = localStorage.getItem('flavordash_gamification');
  if (stored) {
    try {
      return { ...initialState, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Failed to parse gamification data', e);
    }
  }
  return initialState;
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_COINS':
      return { ...state, coins: state.coins + action.payload };
    case 'RECORD_ORDER': {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let newStreak = state.streak;
      if (state.lastOrderDate) {
        const lastOrder = new Date(state.lastOrderDate);
        lastOrder.setHours(0, 0, 0, 0);
        
        const diffTime = Math.abs(today - lastOrder);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      let earnedCoins = 10;
      if (newStreak === 3) earnedCoins += 50;
      if (newStreak === 7) earnedCoins += 150;
      if (newStreak === 14) earnedCoins += 300;

      return {
        ...state,
        streak: newStreak,
        coins: state.coins + earnedCoins,
        totalOrders: state.totalOrders + 1,
        lastOrderDate: new Date().toISOString()
      };
    }
    default:
      return state;
  }
};

export const GamificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  useEffect(() => {
    localStorage.setItem('flavordash_gamification', JSON.stringify(state));
  }, [state]);

  const addCoins = (amount) => {
    dispatch({ type: 'ADD_COINS', payload: amount });
  };

  const recordOrder = () => {
    dispatch({ type: 'RECORD_ORDER' });
  };

  const getRewardTiers = () => {
    return [
      { id: 'bronze', name: 'Bronze', requiredCoins: 50, reward: 'Free Dessert Add-on', unlocked: state.coins >= 50, color: '#CD7F32' },
      { id: 'silver', name: 'Silver', requiredCoins: 150, reward: '15% Off Next Order', unlocked: state.coins >= 150, color: '#C0C0C0' },
      { id: 'gold', name: 'Gold', requiredCoins: 300, reward: 'Free Delivery for a Week', unlocked: state.coins >= 300, color: '#FFD700' },
      { id: 'diamond', name: 'Diamond', requiredCoins: 500, reward: 'Buy 1 Get 1 Free', unlocked: state.coins >= 500, color: '#B9F2FF' }
    ];
  };

  return (
    <GamificationContext.Provider value={{ ...state, addCoins, recordOrder, getRewardTiers }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  return useContext(GamificationContext);
};
