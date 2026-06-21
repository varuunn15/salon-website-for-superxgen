import React, { useState } from 'react';
import { Star, Heart, ArrowRight } from 'lucide-react';

const getSalonImageUrl = (salon) => {
  const imageIds = {
    hair: [
      '1560066984-138dadb4c035', '1562322140-8baeececf3df', '1593164842264-854604db2260',
      '1622286342621-4bd786c2447c', '1596178060671-7a80dc8059ea', '1600948836101-f9ffda59d250',
      '1503951914875-452162b0f3f1', '1580618672591-eb180b1a973f', '1516975080664-ed2fc6a32937',
      '1522337360788-8b13dee7a37e', '1492106087820-71f1a00d2b11'
    ],
    spa: [
      '1540555700478-4be289fbecef', '1600334089648-b0d9d3028eb2', '1519823551278-64ac92734fb1',
      '1515377905703-c4788e51af15', '1512290923902-8a9f81dc236c', '1519824145371-296894a0daa9',
      '1522335789203-aabd1fc54bc9'
    ],
    massage: [
      '1600334089648-b0d9d3028eb2', '1540555700478-4be289fbecef', '1519823551278-64ac92734fb1',
      '1512290923902-8a9f81dc236c', '1522335789203-aabd1fc54bc9'
    ],
    nails: [
      '1604654894610-df63bc536371', '1607779097040-26e80aa78e66', '1519014816548-bf5fe059798b',
      '1515377905703-c4788e51af15'
    ],
    facial: [
      '1522337360788-8b13dee7a37e', '1512290923902-8a9f81dc236c', '1596178065887-1198b6148b2b',
      '1616394584738-fc6e612e71b9', '1556228720-195a672e8a03', '1598440947619-2c35fc9aa908',
      '1515377905703-c4788e51af15', '1570172619644-dfd03ed5d881'
    ],
    grooming: [
      '1621605815971-fbc98d665033', '1503951914875-452162b0f3f1', '1562322140-8baeececf3df',
      '1596178060671-7a80dc8059ea', '1600948836101-f9ffda59d250'
    ],
    makeup: [
      '1487412720507-e7ab37603c6f', '1522337360788-8b13dee7a37e', '1596462502278-27bfdc403348',
      '1512496015851-a90fb38ba796'
    ],
    tattoo: [
      '1503023345310-bd7c1de61c7d', '1562322140-8baeececf3df', '1593164842264-854604db2260',
      '1622286342621-4bd786c2447c'
    ],
    skinClinic: [
      '1596178065887-1198b6148b2b', '1570172619644-dfd03ed5d881', '1512290923902-8a9f81dc236c'
    ]
  };

  const primaryCat = salon.services && salon.services[0] ? salon.services[0].category : 'hair';
  const categoryList = imageIds[primaryCat] || imageIds.hair;
  
  let hash = 0;
  for (let i = 0; i < salon.id.length; i++) {
    hash += salon.id.charCodeAt(i) * (i + 1);
  }
  const photoId = categoryList[hash % categoryList.length];
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=600&q=80`;
};

export default function SalonCard({ 
  salon, 
  onClick, 
  isFavorite, 
  toggleFavorite 
}) {
  const [cardStyle, setCardStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(salon.id);
  };

  // 3D Parallax Mouse Handlers
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left; // cursor position within element
    const y = e.clientY - box.top;
    
    // Normalize coordinates relative to center (dx and dy from -0.5 to 0.5)
    const xc = box.width / 2;
    const yc = box.height / 2;
    const dx = x - xc;
    const dy = y - yc;
    
    // Calculate tilt angles (max tilt is 6 degrees on X and Y)
    const tiltX = (dy / yc) * -6;
    const tiltY = (dx / xc) * 6;
    
    // Glare position percentage
    const glarePercentX = (x / box.width) * 100;
    const glarePercentY = (y / box.height) * 100;

    setCardStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.025, 1.025, 1.025)`,
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 25px rgba(213, 196, 161, 0.15)',
      transition: 'transform 0.05s ease-out, box-shadow 0.05s ease-out'
    });

    setGlareStyle({
      background: `radial-gradient(circle at ${glarePercentX}% ${glarePercentY}%, rgba(255, 255, 255, 0.18) 0%, transparent 60%)`,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setCardStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      boxShadow: 'none',
      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    });
    setGlareStyle({
      opacity: 0,
      transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    });
  };

  // Group unique service categories for this salon
  const uniqueCategories = [...new Set(salon.services.map(s => s.category))];

  const categoryLabels = {
    hair: 'Hair',
    makeup: 'Makeup',
    spa: 'Spa',
    nails: 'Nails',
    facial: 'Facial',
    grooming: 'Grooming'
  };

  const imageUrl = getSalonImageUrl(salon);

  const startingPrice = salon.services && salon.services.length > 0 
    ? Math.min(...salon.services.map(s => s.price))
    : 0;

  return (
    <div 
      className="salon-card glass-panel" 
      onClick={onClick}
      style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Reflection Glare Overlay */}
      <div 
        className="card-glare-overlay" 
        style={{
          ...glareStyle,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 5,
          borderRadius: 'inherit'
        }}
      />

      <div 
        className="salon-card-image" 
        style={{ position: 'relative', height: '190px', overflow: 'hidden' }}
      >
        <img 
          src={imageUrl} 
          alt={salon.name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transition: 'transform 0.5s ease',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          className="salon-card-img-el"
        />
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)', 
            zIndex: 1 
          }} 
        />
        <div className="salon-image-overlay" style={{ zIndex: 2 }}>
          <span className="salon-badge-city">{salon.city}</span>
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label="Add to favorites"
            style={{ zIndex: 10 }}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="salon-card-image-bg" style={{ zIndex: 2 }}>
          <span className="salon-card-logo">{salon.name.split(' ')[0]}</span>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.7 }}>
            EST. 2020
          </span>
        </div>
      </div>

      <div className="salon-card-body">
        <div className="salon-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <h3 className="salon-card-name" style={{ margin: 0, fontSize: '1.2rem', lineHeight: '1.25' }}>{salon.name}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
            <span className="salon-card-price" style={{ color: '#FF6A88', fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>Starts at ₹{startingPrice}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{salon.priceCategory}</span>
          </div>
        </div>

        <div className="salon-card-meta">
          <div className="salon-card-rating">
            <Star size={14} fill="currentColor" />
            <span>{salon.rating.toFixed(1)}</span>
          </div>
          <span>•</span>
          <span>{salon.reviewsCount} reviews</span>
          <span>•</span>
          <span style={{ color: 'var(--primary-gold)' }}>{salon.workingHours.split(' ')[0]} - {salon.workingHours.split(' ').slice(-2).join(' ')}</span>
        </div>

        <p className="salon-card-desc">{salon.description}</p>

        <div className="salon-card-tags">
          {uniqueCategories.map(cat => (
            <span key={cat} className="salon-tag">
              {categoryLabels[cat] || cat}
            </span>
          ))}
        </div>

        <div className="flex-between mt-4" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{salon.address.split(',')[1] || salon.address}</span>
          <span className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}>
            Book <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}
