import React, { useState, useRef, useEffect } from 'react';
import './AIChatOrdering.css';
import { ALL_DISHES } from '../data/dishes';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const QUICK_PROMPTS = [
  'Something spicy 🌶️',
  'Under ₹150',
  'High protein 💪',
  'Sweet cravings 🍬',
  'Quick bite ⚡'
];

export const AIChatOrdering = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      content: 'Hey! 👋 I\'m your FlavorDash AI. Tell me what you\'re craving and I\'ll find the perfect dish! Try: "something spicy under ₹300"'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const { addToCart } = useCart();
  const { addToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => setIsOpen(prev => !prev);

  const parseMessage = (text) => {
    const lowerText = text.toLowerCase();
    let filtered = [...ALL_DISHES];
    let matched = false;

    // Price parsing
    const priceRegex = /(?:under|below|cheaper than|less than) (?:₹|rs\.? ?)?(\d+)/;
    const priceMatch = lowerText.match(priceRegex);
    if (priceMatch) {
      const maxPrice = parseInt(priceMatch[1], 10);
      filtered = filtered.filter(d => d.price <= maxPrice);
      matched = true;
    } else if (lowerText.includes('cheap') || lowerText.includes('budget')) {
      filtered = filtered.filter(d => d.price <= 200);
      matched = true;
    }

    // Spice
    if (lowerText.includes('spicy') || lowerText.includes('hot')) {
      filtered = filtered.filter(d => d.spiceLevel === 'High' || d.spiceLevel === 'Medium');
      matched = true;
    } else if (lowerText.includes('mild')) {
      filtered = filtered.filter(d => d.spiceLevel === 'Low' || !d.spiceLevel);
      matched = true;
    }

    // Diet
    if (lowerText.includes('non-veg') || lowerText.includes('chicken') || lowerText.includes('meat')) {
      filtered = filtered.filter(d => !d.isVeg);
      matched = true;
    } else if (lowerText.includes('veg ') || lowerText.includes('vegetarian')) {
      filtered = filtered.filter(d => d.isVeg);
      matched = true;
    }
    if (lowerText.includes('protein') || lowerText.includes('healthy') || lowerText.includes('low calorie')) {
       // Assuming dietTag exists, otherwise fallback to generic filter
      filtered = filtered.filter(d => d.dietTag === 'High Protein' || d.dietTag === 'Healthy' || (d.isVeg && d.price < 300));
      matched = true;
    }

    // Cuisine/Category
    if (lowerText.includes('biryani')) {
      filtered = filtered.filter(d => d.category === 'Biryani' || d.name.toLowerCase().includes('biryani'));
      matched = true;
    } else if (lowerText.includes('south indian')) {
      filtered = filtered.filter(d => d.category === 'South Indian' || d.name.toLowerCase().includes('dosa') || d.name.toLowerCase().includes('idli'));
      matched = true;
    } else if (lowerText.includes('sweet') || lowerText.includes('dessert') || lowerText.includes('cravings 🍬')) {
      filtered = filtered.filter(d => d.category === 'Desserts' || d.category === 'Sweets');
      matched = true;
    } else if (lowerText.includes('drink') || lowerText.includes('beverage')) {
      filtered = filtered.filter(d => d.category === 'Beverages');
      matched = true;
    } else if (lowerText.includes('bread') || lowerText.includes('roti') || lowerText.includes('naan')) {
      filtered = filtered.filter(d => d.category === 'Breads' || d.name.toLowerCase().includes('naan'));
      matched = true;
    }

    // Mood
    if (lowerText.includes('quick') || lowerText.includes('fast')) {
      filtered = filtered.filter(d => d.prepTime <= 20); // if prepTime exists
      matched = true;
    }

    if (!matched && lowerText.length > 3) {
      // Basic text search if no specific tags matched
      filtered = filtered.filter(d => d.name.toLowerCase().includes(lowerText) || (d.description && d.description.toLowerCase().includes(lowerText)));
    }

    if (filtered.length === 0 || (!matched && filtered.length === ALL_DISHES.length)) {
       // Return top 3 rated dishes if no match
       return {
         found: false,
         dishes: [...ALL_DISHES].sort((a, b) => b.rating - a.rating).slice(0, 3)
       };
    }

    return {
      found: true,
      dishes: filtered.slice(0, 3) // Return top 3 matches
    };
  };

  const handleSend = (text) => {
    const userText = text || inputValue;
    if (!userText.trim()) return;

    const newUserMsg = { id: Date.now(), sender: 'user', type: 'text', content: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const searchResult = parseMessage(userText);
      
      const botResponses = [];
      if (searchResult.found) {
        botResponses.push({
          id: Date.now() + 1,
          sender: 'bot',
          type: 'text',
          content: 'Here are some great options for you:'
        });
      } else {
        botResponses.push({
          id: Date.now() + 1,
          sender: 'bot',
          type: 'text',
          content: 'Hmm, couldn\'t find an exact match. Here are some popular picks:'
        });
      }

      botResponses.push({
        id: Date.now() + 2,
        sender: 'bot',
        type: 'results',
        dishes: searchResult.dishes
      });

      setMessages(prev => [...prev, ...botResponses]);
    }, 800);
  };

  const handleQuickPrompt = (prompt) => {
    handleSend(prompt);
  };

  const handleAddToCart = (dish) => {
    addToCart(dish);
    addToast(`Added ${dish.name} to cart`);
    
    // Add bot message
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          type: 'text',
          content: `Added ${dish.name}! Anything else? 😋`
        }
      ]);
    }, 500);
  };

  return (
    <div className="ai-chat-container">
      {!isOpen && (
        <button className="ai-chat-bubble" onClick={toggleChat} aria-label="Open AI Assistant">
          🤖
        </button>
      )}

      {isOpen && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <h3>FlavorDash AI Assistant 🤖</h3>
            <button className="close-btn" onClick={toggleChat} aria-label="Close Chat">×</button>
          </div>

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
                      <div key={dish.id} className="chat-dish-card">
                        <div className="chat-dish-img-wrapper">
                          <img src={dish.image || 'https://via.placeholder.com/80?text=Dish'} alt={dish.name} className="chat-dish-img" />
                          <div className={`chat-veg-indicator ${dish.isVeg ? 'veg' : 'non-veg'}`}>
                            <div className="circle"></div>
                          </div>
                        </div>
                        <div className="chat-dish-info">
                          <h4>{dish.name}</h4>
                          <div className="chat-dish-meta">
                            <span className="price">₹{dish.price}</span>
                            <span className="rating">★ {dish.rating}</span>
                          </div>
                          <button className="chat-add-btn" onClick={() => handleAddToCart(dish)}>
                            Add 🛒
                          </button>
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

          <div className="ai-chat-input-area">
            <div className="quick-prompts">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button key={idx} className="prompt-chip" onClick={() => handleQuickPrompt(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
            <div className="input-row">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
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
