import React from 'react';
import { Search, MapPin, Scissors, Palette, Flower2, Sparkles, Heart, Smile } from 'lucide-react';
import { CITIES, SERVICES_CATEGORIES } from '../data/mockData';
import GsapAvatarSection from './GsapAvatarSection';

const IconMap = {
  Scissors: Scissors,
  Palette: Palette,
  Flower2: Flower2,
  Sparkles: Sparkles,
  Heart: Heart,
  Smile: Smile
};

export default function Hero({ 
  currentCity, 
  setCurrentCity, 
  searchTerm, 
  setSearchTerm, 
  activeCategory, 
  setActiveCategory 
}) {
  return (
    <section className="hero-section animate-fade-in" style={{ position: 'relative', overflow: 'hidden', padding: '70px 24px', borderRadius: '24px' }}>
      
      {/* Background Soft Gradients (Lakme / LUZO light pink/blue aesthetic) */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(255, 230, 235, 0.4) 0%, rgba(230, 240, 255, 0.4) 50%, rgba(245, 235, 255, 0.4) 100%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      <div className="hero-grid-container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Left Side: Content & Search */}
        <div className="hero-left-col">
          <div className="hero-subtitle" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(213, 196, 161, 0.25)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(213, 196, 161, 0.4)', fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: 600, color: '#b89445' }}>
            <Sparkles size={12} style={{ color: '#b89445' }} />
            LAKME & ROYAL LUXURY STYLING PARTNER
          </div>
          
          <h1 className="hero-title font-display" style={{ textTransform: 'none', textAlign: 'left', marginTop: '16px', color: '#1A1D20', fontSize: '3.6rem', fontWeight: '700', lineHeight: '1.15' }}>
            Experience Luxury <br />
            <span className="gradient-text" style={{ display: 'inline', background: 'linear-gradient(135deg, #FF6A88 0%, #FF99AC 50%, #76AFFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Beauty &amp; Wellness</span>
          </h1>
          
          <p className="hero-desc" style={{ margin: '0 0 32px 0', textAlign: 'left', maxWidth: '100%', color: '#4B5563', fontSize: '1.1rem' }}>
            Book and avail exclusive offers at your nearest luxury spas, premium salons, and award-winning styling clinics. 
            Select your city, search for services, and check out instantly.
          </p>

          {/* Modern Integrated Search Bar */}
          <div className="search-container glass-panel-glow" style={{ width: '100%', margin: '0 0 20px 0', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.85)', boxShadow: '0 12px 35px rgba(255, 106, 136, 0.08), 0 0 15px rgba(255, 255, 255, 0.5)', border: '1px solid rgba(255, 106, 136, 0.12)' }}>
            <div className="search-select-wrapper" style={{ borderRight: '1px solid rgba(0,0,0,0.06)' }}>
              <MapPin size={18} style={{ color: '#FF6A88' }} />
              <select 
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                className="search-select"
                style={{ color: '#FF6A88', fontWeight: '600' }}
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="search-input-wrapper">
              <Search size={18} style={{ color: '#9CA3AF' }} />
              <input 
                type="text" 
                placeholder="Search salons, services (e.g. Balayage, Massage, HydraFacial)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ color: '#1F2937' }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: GSAP interactive floating avatar and orbit tools */}
        <div className="hero-right-col" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: '400px' }}>
          <GsapAvatarSection />
        </div>

      </div>

      {/* Circular Category Quick-Filters */}
      <div className="categories-container" style={{ marginTop: '36px', position: 'relative', zIndex: 2 }}>
        {SERVICES_CATEGORIES.map(category => {
          const IconComponent = IconMap[category.icon] || Sparkles;
          const isActive = activeCategory === category.id;

          return (
            <div 
              key={category.id} 
              className={`category-card ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(255, 106, 136, 0.15) 0%, rgba(255, 255, 255, 0.95) 100%)' : 'rgba(255, 255, 255, 0.65)',
                borderColor: isActive ? '#FF6A88' : 'rgba(0,0,0,0.06)'
              }}
            >
              <div 
                className="category-icon-wrapper"
                style={{
                  background: isActive ? '#FF6A88' : 'rgba(0,0,0,0.03)',
                  color: isActive ? '#FFFFFF' : '#4B5563'
                }}
              >
                <IconComponent size={20} />
              </div>
              <span className="category-name" style={{ color: isActive ? '#FF6A88' : '#4B5563' }}>{category.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
