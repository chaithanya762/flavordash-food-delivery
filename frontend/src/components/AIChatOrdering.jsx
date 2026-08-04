import React, { useState, useRef, useEffect } from 'react';
import './AIChatOrdering.css';
import { ALL_DISHES } from '../data/dishes';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const DYNAMIC_PROMPTS = [
  '🌶️ Spicy starters under ₹250',
  '💪 High protein gym dinner',
  '🍛 Dum Biryani & Lassi combo',
  '🥑 Low Calorie & Keto options',
  '🍷 Reserve a Table for 4',
  '🍬 Royal Sweets & Desserts'
];

const AI_MODES = [
  { id: 'chef', label: '👨‍🍳 Smart Chef', desc: 'Personalized food recommendations' },
  { id: 'health', label: '💪 Fitness & Kcal', desc: 'Calorie & protein optimized meals' },
  { id: 'party', label: '🎉 Party Combo', desc: 'Multi-person feast combinations' }
];

export const AIChatOrdering = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('chef');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      content: 'Namaste! 🙏 I\'m Chef AI, your FlavorDash Master Culinary Guide 👨‍🍳. What are you craving today? Ask me for "high protein chicken", "spicy paneer under ₹350", or "reserve table at Punjab Rasoi"!'
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

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        type: 'text',
        content: `Chat history cleared 🧹. I am in ${AI_MODES.find(m => m.id === currentMode)?.label} mode. How may I assist your culinary choices?`
      }
    ]);
    setContextFilter({});
    showToast('Chef AI chat reset', 'info');
  };

  // Real Speech Recognition + Fallback
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        // fallback
        setInputValue("Show me high protein biryani under 400");
      };

      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const voiceSample = "Show me high protein chicken under 400";
        setInputValue(voiceSample);
      }, 1200);
    }
  };

  // Advanced AI Parsing Engine
  const parseMessage = (text) => {
    const lowerText = text.toLowerCase();
    let newContext = { ...contextFilter };

    // Check for Reservation trigger
    if (lowerText.includes('table') || lowerText.includes('reserve') || lowerText.includes('booking') || lowerText.includes('hotel')) {
      return {
        found: true,
        type: 'reservation',
        reasoning: "🍷 Table Reservation Assistant: I can help you secure a VIP dining table at our finest partner restaurants (*Punjab Rasoi*, *Haveli North Indian*, *Kashmiri Zaika*)!",
        actionType: 'RESERVE_TABLE'
      };
    }

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

    // 3. Dietary preferences & Mode influence
    if (lowerText.includes('non-veg') || lowerText.includes('chicken') || lowerText.includes('mutton')) {
      newContext.isVeg = false;
    } else if (lowerText.includes('pure veg') || lowerText.includes('vegetarian') || lowerText.includes('paneer')) {
      newContext.isVeg = true;
    }

    if (currentMode === 'health' || lowerText.includes('protein') || lowerText.includes('gym') || lowerText.includes('muscle')) {
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
    } else if (lowerText.includes('starter') || lowerText.includes('tikka') || lowerText.includes('street') || lowerText.includes('lassi')) {
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

    if (results.length === 0) {
      results = ALL_DISHES.filter(d => 
        d.name.toLowerCase().includes(lowerText) || 
        d.description.toLowerCase().includes(lowerText) ||
        (newContext.maxPrice && d.price <= newContext.maxPrice)
      );
    }

    if (results.length === 0) {
      return {
        found: false,
        type: 'dishes',
        reasoning: "I couldn't find an exact match, but here are our 3 highest-rated crowd favorites you'll love:",
        dishes: [...ALL_DISHES].sort((a, b) => b.rating - a.rating).slice(0, 3)
      };
    }

    let reasoning = 'Here are my top culinary recommendations for you:';
    if (newContext.diet === 'High Protein') {
      reasoning = '💪 High-protein powerhouses loaded with nutrition & flavor:';
    } else if (newContext.maxPrice) {
      reasoning = `💰 Best budget-friendly delicacies under ₹${newContext.maxPrice}:`;
    } else if (newContext.spice === 'high') {
      reasoning = '🌶️ Fiery & spiced specialties to satisfy your craving:';
    } else if (newContext.isVeg) {
      reasoning = '🟢 Pure vegetarian masterworks prepared with fresh ingredients:';
    }

    return {
      found: true,
      type: 'dishes',
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

      if (aiResult.type === 'reservation') {
        const botActionMsg = {
          id: Date.now() + 2,
          sender: 'bot',
          type: 'reservation_action'
        };
        setMessages(prev => [...prev, botResponseMsg, botActionMsg]);
      } else {
        const botResultsMsg = {
          id: Date.now() + 2,
          sender: 'bot',
          type: 'results',
          dishes: aiResult.dishes
        };
        setMessages(prev => [...prev, botResponseMsg, botResultsMsg]);
      }
    }, 600);
  };

  const handleAddToCart = (dish) => {
    addToCart(dish);
    showToast(`Added ${dish.name} to cart 🍽️`, 'success');
  };

  const handleAddAllCombo = (dishes) => {
    dishes.forEach(d => addToCart(d));
    showToast(`Added entire combo (${dishes.length} items) to cart! 🛍️`, 'success');
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
                <span className="online-status">🟢 Active • Master Culinary AI</span>
              </div>
            </div>
            <div className="header-actions">
              <button className="icon-header-btn" onClick={clearChat} title="Clear Chat History">🧹</button>
              <button className="close-btn" onClick={toggleChat} aria-label="Close Chat">✕</button>
            </div>
          </div>

          {/* AI MODE SWITCHER BAR */}
          <div className="ai-mode-bar">
            {AI_MODES.map(mode => (
              <button 
                key={mode.id}
                className={`ai-mode-chip ${currentMode === mode.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentMode(mode.id);
                  showToast(`Switched to ${mode.label}`, 'info');
                }}
                title={mode.desc}
              >
                {mode.label}
              </button>
            ))}
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

                {msg.type === 'reservation_action' && (
                  <div className="reservation-action-card glass-card">
                    <h4>🍷 Book Table at Partner Hotels</h4>
                    <p>Select date, time slot, & guests with instant SMS confirmation!</p>
                    <button 
                      className="btn-reserve-chat"
                      onClick={() => {
                        toggleChat();
                        // Trigger table modal if available or inform user
                        window.dispatchEvent(new CustomEvent('OPEN_TABLE_RESERVATION'));
                      }}
                    >
                      📅 Open Table Booking Form
                    </button>
                  </div>
                )}

                {msg.type === 'results' && (
                  <div className="message-results">
                    {msg.dishes.map(dish => (
                      <div key={dish.id} className="chat-dish-card glass-card">
                        <div className="chat-dish-img-wrapper">
                          <img 
                            src={dish.imageUrl || '/images/butter-chicken.jpg'} 
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
                              + Add 🛒
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {msg.dishes.length > 1 && (
                      <button className="combo-add-all-btn" onClick={() => handleAddAllCombo(msg.dishes)}>
                        🛍️ Add Entire Combo to Cart (₹{msg.dishes.reduce((a, c) => a + c.price, 0)})
                      </button>
                    )}
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
                title="Voice Search (Click & Speak)"
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
