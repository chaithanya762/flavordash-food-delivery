import React, { useState, useRef, useEffect } from 'react';
import './AIChatOrdering.css';
import { ALL_DISHES } from '../data/dishes';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const DYNAMIC_PROMPTS = [
  '🌶️ Spicy starters under ₹250',
  '💪 High protein gym meals',
  '🍛 Dum Biryani & Raita pairings',
  '🥑 Low Calorie & Keto options',
  '🍬 Royal Sweet Cravings',
  '⚡ Express 15-min delivery'
];

export const AIChatOrdering = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      content: 'Namaste! 🙏 I\'m Chef AI, your FlavorDash Culinary Assistant 👨‍🍳. What are you in the mood for today? Try: "spicy paneer under ₹350" or "protein rich dinner"!'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [contextFilter, setContextFilter] = useState({});
  const messagesEndRef = useRef(null);

  const { addToCart } = useCart() || { addToCart: () => {} };
  const { showToast } = useToast() || { showToast: () => {} };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => setIsOpen(prev => !prev);

  // Advanced AI Parsing Engine with Context Memory
  const parseMessage = (text) => {
    const lowerText = text.toLowerCase();
    let newContext = { ...contextFilter };

    // 1. Budget extraction
    const priceMatch = lowerText.match(/(?:under|below|less than|within|budget of|rs\.?|₹) ?(\d+)/i);
    if (priceMatch) {
      newContext.maxPrice = parseInt(priceMatch[1], 10);
    } else if (lowerText.includes('cheap') || lowerText.includes('budget') || lowerText.includes('pocket friendly')) {
      newContext.maxPrice = 250;
    }

    // 2. Spice Level
    if (lowerText.includes('spicy') || lowerText.includes('hot') || lowerText.includes('fiery') || lowerText.includes('chilli')) {
      newContext.spice = 'high';
    } else if (lowerText.includes('mild') || lowerText.includes('soothing') || lowerText.includes('not spicy')) {
      newContext.spice = 'mild';
    }

    // 3. Dietary preferences
    if (lowerText.includes('non-veg') || lowerText.includes('chicken') || lowerText.includes('mutton') || lowerText.includes('fish')) {
      newContext.isVeg = false;
    } else if (lowerText.includes('pure veg') || lowerText.includes('vegetarian') || lowerText.includes('veg ') || lowerText.includes('paneer')) {
      newContext.isVeg = true;
    }

    if (lowerText.includes('protein') || lowerText.includes('gym') || lowerText.includes('muscle')) {
      newContext.diet = 'High Protein';
    } else if (lowerText.includes('keto') || lowerText.includes('low carb')) {
      newContext.diet = 'Keto';
    } else if (lowerText.includes('low calorie') || lowerText.includes('diet') || lowerText.includes('light')) {
      newContext.diet = 'Low Calorie';
    }

    // 4. Categories & Keywords
    if (lowerText.includes('biryani') || lowerText.includes('rice') || lowerText.includes('pulao')) {
      newContext.category = 'Rice & Biryani';
    } else if (lowerText.includes('curry') || lowerText.includes('gravy') || lowerText.includes('paneer') || lowerText.includes('butter chicken')) {
      newContext.category = 'Main Dishes';
    } else if (lowerText.includes('dosa') || lowerText.includes('idli') || lowerText.includes('south')) {
      newContext.category = 'South Indian';
    } else if (lowerText.includes('sweet') || lowerText.includes('dessert') || lowerText.includes('gulab') || lowerText.includes('jalebi')) {
      newContext.category = 'Sweets';
    } else if (lowerText.includes('bread') || lowerText.includes('naan') || lowerText.includes('roti') || lowerText.includes('paratha')) {
      newContext.category = 'Breads';
    } else if (lowerText.includes('starter') || lowerText.includes('tikka') || lowerText.includes('kabab') || lowerText.includes('street')) {
      newContext.category = 'Street Food';
    }

    setContextFilter(newContext);

    // Filter dishes against updated context
    let results = ALL_DISHES.filter(d => {
      if (newContext.maxPrice && d.price > newContext.maxPrice) return false;
      if (newContext.isVeg !== undefined && d.isVeg !== newContext.isVeg) return false;
      if (newContext.diet && d.dietTag !== newContext.diet && !d.dietTag?.includes(newContext.diet)) return false;
      if (newContext.spice === 'high' && (d.spiceLevel < 3)) return false;
      if (newContext.spice === 'mild' && (d.spiceLevel > 2)) return false;
      if (newContext.category && d.category !== newContext.category && d.cuisine !== newContext.category) return false;
      
      return true;
    });

    // Fallback search if strict filter returns few items
    if (results.length === 0) {
      results = ALL_DISHES.filter(d => 
        d.name.toLowerCase().includes(lowerText) || 
        d.description.toLowerCase().includes(lowerText) ||
        (newContext.maxPrice && d.price <= newContext.maxPrice)
      );
    }

    if (results.length === 0) {
      // Top 3 rated dishes as smart fallback
      return {
        found: false,
        reasoning: "I couldn't find an exact match for that specific combination, but here are our 3 highest-rated crowd favorites you'll love:",
        dishes: [...ALL_DISHES].sort((a, b) => b.rating - a.rating).slice(0, 3)
      };
    }

    // Build intelligent AI reasoning message based on context
    let reasoning = 'Here are my top culinary recommendations for you:';
    if (newContext.diet === 'High Protein') {
      reasoning = '💪 High-protein powerhouses loaded with nutrition & flavor:';
    } else if (newContext.maxPrice) {
      reasoning = `💰 Best budget-friendly delicacies under ₹${newContext.maxPrice}:`;
    } else if (newContext.spice === 'high') {
      reasoning = '🌶️ Fiery & spiced specialties to satisfy your craving:';
    } else if (newContext.isVeg) {
      reasoning = '🟢 Pure vegetarian masterworks prepared with fresh cottage cheese & veggies:';
    }

    return {
      found: true,
      reasoning,
      dishes: results.slice(0, 3)
    };
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', type: 'text', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiResult = parseMessage(query);
      
      const botResponseMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        type: 'text',
        content: aiResult.reasoning
      };

      const botResultsMsg = {
        id: Date.now() + 2,
        sender: 'bot',
        type: 'results',
        dishes: aiResult.dishes
      };

      setMessages(prev => [...prev, botResponseMsg, botResultsMsg]);
    }, 700);
  };

  // Simulate Voice Dictation
  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const voiceSample = "Show me high protein chicken under 400";
      setInputValue(voiceSample);
    }, 1500);
  };

  const handleAddToCart = (dish) => {
    addToCart(dish);
    showToast(`Added ${dish.name} to cart 🍽️`, 'success');
    
    // AI Smart Pairing Suggestion
    setTimeout(() => {
      let pairingMessage = `Added ${dish.name}! 😋`;
      if (dish.category === 'Rice & Biryani') {
        pairingMessage += ` 💡 *Chef tip:* Would you like to add Garlic Naan or Gulab Jamun to complete your feast?`;
      } else if (dish.category === 'Main Dishes') {
        pairingMessage += ` 💡 *Chef tip:* Pairs perfectly with hot Butter Naan or Jeera Rice!`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          type: 'text',
          content: pairingMessage
        }
      ]);
    }, 400);
  };

  return (
    <div className="ai-chat-container">
      {!isOpen && (
        <button className="ai-chat-bubble" onClick={toggleChat} aria-label="Open Chef AI Assistant">
          <span className="bot-avatar-emoji">👨‍🍳</span>
          <span className="ai-badge-indicator">AI</span>
        </button>
      )}

      {isOpen && (
        <div className="ai-chat-panel fade-in">
          {/* HEADER */}
          <div className="ai-chat-header">
            <div className="header-bot-info">
              <div className="bot-avatar-glow">👨‍🍳</div>
              <div>
                <h3>Chef AI ✨</h3>
                <span className="online-status">🟢 Active • Smart Assistant</span>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat} aria-label="Close Chat">✕</button>
          </div>

          {/* MESSAGES BODY */}
          <div className="ai-chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                {msg.type === 'text' && (
                  <div className={`message bubble ${msg.sender}`}>
                    {msg.content}
                  </div>
                )}
                {msg.type === 'results' && (
                  <div className="message-results">
                    {msg.dishes.map(dish => (
                      <div key={dish.id} className="chat-dish-card glass-card">
                        <div className="chat-dish-img-wrapper">
                          <img 
                            src={dish.imageUrl || dish.imageUrl || '/images/butter-chicken.jpg'} 
                            alt={dish.name} 
                            className="chat-dish-img" 
                          />
                          <div className={`chat-veg-indicator ${dish.isVeg ? 'veg' : 'non-veg'}`}>
                            <div className="circle"></div>
                          </div>
                        </div>

                        <div className="chat-dish-info">
                          <div className="chat-dish-title-row">
                            <h4>{dish.name}</h4>
                            <span className="chat-dish-rating">⭐ {dish.rating || 4.8}</span>
                          </div>

                          <div className="chat-dish-badges">
                            <span className="badge-spec">{dish.calories || '450 kcal'}</span>
                            {dish.protein && <span className="badge-spec protein">{dish.protein}</span>}
                            {dish.prepTime && <span className="badge-spec time">⏱️ {dish.prepTime}</span>}
                          </div>

                          <div className="chat-dish-action-row">
                            <span className="chat-price">₹{dish.price}</span>
                            <button className="chat-add-btn" onClick={() => handleAddToCart(dish)}>
                              + Add to Cart 🛒
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="message-wrapper bot">
                <div className="message bubble bot typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK CHIPS & INPUT ROW */}
          <div className="ai-chat-input-area">
            <div className="quick-prompts">
              {DYNAMIC_PROMPTS.map((prompt, idx) => (
                <button 
                  key={idx} 
                  className="prompt-chip" 
                  onClick={() => handleSend(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="input-row">
              <button 
                className={`mic-btn ${isListening ? 'listening' : ''}`}
                onClick={handleVoiceInput}
                title="Voice Search"
              >
                {isListening ? '🎙️...' : '🎙️'}
              </button>

              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening..." : "Ask Chef AI (e.g. spicy paneer under ₹300)..."}
              />

              <button className="send-btn" onClick={() => handleSend()}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatOrdering;
