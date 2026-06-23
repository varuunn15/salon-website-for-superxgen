import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, ShoppingCart, Check, BrainCircuit } from 'lucide-react';
import { SALONS, CITIES } from '../data/mockData';

export default function AIConcierge({ 
  currentCity, 
  addToCart, 
  openCart 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: "Hello! I am your Royal Glow AI. 👑 Tell me what you're looking for! For example:\n• 'A relaxing massage under ₹4000'\n• 'Master haircut in Delhi'\n• 'HydraFacial or gold glow facial'"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [addedItems, setAddedItems] = useState({}); // Track quick-added services in chat

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleQuickPrompt = (promptText) => {
    processUserMessage(promptText);
  };

  const processUserMessage = (text) => {
    // Add user message
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);

    // Simulated typing state
    setMessages(prev => [...prev, { sender: 'bot', text: 'Thinking...', typing: true }]);

    setTimeout(() => {
      const response = generateAIResponse(text);
      setMessages(prev => {
        const filtered = prev.filter(m => !m.typing);
        return [...filtered, response];
      });
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    processUserMessage(text);
  };

  // Rule-based client-side NLP fuzzy recommendation engine
  const generateAIResponse = (query) => {
    const cleanQuery = query.toLowerCase();
    
    // 1. Detect City (default to app city)
    let detectedCity = currentCity;
    for (const city of CITIES) {
      if (cleanQuery.includes(city.toLowerCase())) {
        detectedCity = city;
        break;
      }
    }

    // 2. Detect Budget
    const numberMatches = cleanQuery.match(/\d+/g);
    let budgetLimit = null;
    if (numberMatches) {
      budgetLimit = Math.max(...numberMatches.map(Number));
    }

    // 3. Detect Service Categories
    let category = null;
    if (cleanQuery.includes('hair') || cleanQuery.includes('cut') || cleanQuery.includes('style') || cleanQuery.includes('balayage') || cleanQuery.includes('color')) {
      category = 'hair';
    } else if (cleanQuery.includes('spa') || cleanQuery.includes('massage') || cleanQuery.includes('reflexology') || cleanQuery.includes('therap')) {
      category = 'spa';
    } else if (cleanQuery.includes('nail') || cleanQuery.includes('manicure') || cleanQuery.includes('pedicure') || cleanQuery.includes('extension')) {
      category = 'nails';
    } else if (cleanQuery.includes('facial') || cleanQuery.includes('skin') || cleanQuery.includes('peel') || cleanQuery.includes('cleanse') || cleanQuery.includes('hydra')) {
      category = 'facial';
    } else if (cleanQuery.includes('groom') || cleanQuery.includes('beard') || cleanQuery.includes('shave')) {
      category = 'grooming';
    } else if (cleanQuery.includes('makeup') || cleanQuery.includes('bridal') || cleanQuery.includes('cosmetic')) {
      category = 'makeup';
    }

    // 4. Find all matching salons in the detected city
    const citySalons = SALONS.filter(s => detectedCity.toLowerCase() === 'all cities' || s.city.toLowerCase() === detectedCity.toLowerCase());
    
    if (citySalons.length === 0) {
      return {
        sender: 'bot',
        text: `I couldn't find any partner salons listed in ${detectedCity} yet. Would you like to check one of our active cities like Bangalore, Mumbai, or Delhi?`
      };
    }

    // 5. Gather all services matching constraints
    let matches = [];
    citySalons.forEach(salon => {
      salon.services.forEach(service => {
        let score = 0;
        
        // Category match bonus
        if (category && service.category === category) {
          score += 10;
        }

        // Budget check
        if (budgetLimit && service.price <= budgetLimit) {
          score += 5;
        } else if (budgetLimit && service.price > budgetLimit) {
          score -= 20; // Filter out over budget
        }

        // Name query match
        const serviceTokens = service.name.toLowerCase().split(' ');
        serviceTokens.forEach(token => {
          if (token.length > 2 && cleanQuery.includes(token)) {
            score += 3;
          }
        });

        if (score > 0) {
          matches.push({
            salon,
            service,
            score
          });
        }
      });
    });

    // Sort by score
    matches.sort((a, b) => b.score - a.score);

    if (matches.length === 0) {
      // Return general fallback recommendations for that city
      const featuredSalon = citySalons[0];
      const featuredService = featuredSalon.services[0];
      
      return {
        sender: 'bot',
        text: `I couldn't find a exact match for that budget or service category. Here is a highly recommended signature package at ${featuredSalon.name} in ${detectedCity}:`,
        recommendation: {
          salon: featuredSalon,
          service: featuredService
        }
      };
    }

    // Return best match
    const bestMatch = matches[0];
    let introText = `Based on your request, here is a custom recommendation for you at **${bestMatch.salon.name}** in ${detectedCity}:`;
    if (budgetLimit) {
      introText = `Here is a great option under ₹${budgetLimit} at **${bestMatch.salon.name}** in ${detectedCity}:`;
    }

    return {
      sender: 'bot',
      text: introText,
      recommendation: {
        salon: bestMatch.salon,
        service: bestMatch.service
      }
    };
  };

  const handleQuickBook = (salon, service) => {
    addToCart({
      ...service,
      salonId: salon.id,
      salonName: salon.name,
      city: salon.city
    });
    setAddedItems(prev => ({ ...prev, [service.id]: true }));
    
    // Automatically trigger cart open
    setTimeout(() => {
      openCart();
    }, 500);
  };

  return (
    <>
      {/* Floating Chat Icon Toggle */}
      {!isOpen && (
        <button 
          className="btn-primary" 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            zIndex: 1000,
            boxShadow: '0 8px 30px rgba(197, 168, 128, 0.45)',
            border: '2px solid var(--primary-gold)'
          }}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Concierge"
        >
          <BrainCircuit size={28} />
        </button>
      )}

      {/* Chatbox Window Container */}
      {isOpen && (
        <div 
          className="glass-panel-glow" 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
            borderRadius: '20px',
            animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div 
            style={{
              padding: '16px',
              borderBottom: '1px solid var(--border-light)',
              background: 'linear-gradient(135deg, rgba(197, 168, 128, 0.15), transparent)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                className="logo-symbol" 
                style={{ width: '28px', height: '28px', fontSize: '0.9rem', borderRadius: '8px' }}
              >
                AI
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Royal Glow AI
                  <Sparkles size={12} style={{ color: 'var(--primary-gold)' }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--primary-teal)' }}>Powered by Royal Glow Studio</div>
              </div>
            </div>
            <button 
              className="drawer-close-btn" 
              style={{ position: 'static', width: '28px', height: '28px', background: 'transparent' }}
              onClick={() => setIsOpen(false)}
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages List Area */}
          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map((msg, index) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end' }}>
                  {/* Bubble */}
                  <div 
                    style={{
                      maxWidth: '85%',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      fontSize: '0.85rem',
                      lineHeight: '1.45',
                      whiteSpace: 'pre-line',
                      background: isBot ? 'rgba(255, 255, 255, 0.03)' : 'var(--primary-gold)',
                      color: isBot ? 'var(--text-primary)' : '#06070a',
                      border: isBot ? '1px solid var(--border-light)' : 'none',
                      borderRadiusStyle: isBot ? '0 14px 14px 14px' : '14px 14px 0 14px'
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Recommendation Card Attachment */}
                  {isBot && msg.recommendation && (
                    <div 
                      className="glass-panel" 
                      style={{
                        marginTop: '10px',
                        padding: '12px',
                        width: '100%',
                        background: 'rgba(197, 168, 128, 0.04)',
                        border: '1px solid var(--border-glow)',
                        borderRadius: '12px'
                      }}
                    >
                      <div style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--primary-gold)', marginBottom: '2px' }}>
                        {msg.recommendation.salon.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        📍 {msg.recommendation.salon.address}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '8px' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '500' }}>{msg.recommendation.service.name}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-cyan)' }}>₹{msg.recommendation.service.price}</div>
                        </div>
                        <button
                          className="btn-primary"
                          style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', gap: '4px' }}
                          onClick={() => handleQuickBook(msg.recommendation.salon, msg.recommendation.service)}
                          disabled={addedItems[msg.recommendation.service.id]}
                        >
                          {addedItems[msg.recommendation.service.id] ? (
                            <>
                              <Check size={12} />
                              Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={12} />
                              Quick Book
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '6px', overflowX: 'auto', background: 'rgba(0,0,0,0.1)' }}>
            <button 
              className="service-cat-tab" 
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              onClick={() => handleQuickPrompt('Suggest a relaxing spa under ₹4000')}
            >
              🧖 Spa under ₹4000
            </button>
            <button 
              className="service-cat-tab" 
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              onClick={() => handleQuickPrompt('Haircut by a master stylist')}
            >
              💇 Master Haircut
            </button>
            <button 
              className="service-cat-tab" 
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              onClick={() => handleQuickPrompt('Skin facials in Delhi')}
            >
              ✨ Facials
            </button>
          </div>

          {/* Input Form Footer */}
          <form onSubmit={handleSubmit} style={{ padding: '12px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Ask Royal Glow AI (e.g. Balayage in Mumbai)..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ flexGrow: 1, padding: '8px 12px', fontSize: '0.85rem' }}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', borderRadius: '8px' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
