import React, { useState } from 'react';
import { ShoppingBag, MapPin, Scissors, Calendar, User, Crown, Map, Camera, CircleDollarSign, LineChart, Sparkles } from 'lucide-react';
import { CITIES } from '../data/mockData';

export default function Header({ 
  currentCity, 
  setCurrentCity, 
  activeTab, 
  setActiveTab,
  onSetTab,
  cartCount, 
  toggleCart,
  favoritesCount,
  currentUser,
  onOpenAuth,
  onSignOut
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-container" onClick={() => setActiveTab('browse')}>
          <div 
            className="logo-symbol" 
            style={{ 
              background: 'transparent', 
              color: 'var(--primary-gold)',
              boxShadow: 'none',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0'
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="6" style={{ filter: 'drop-shadow(0 0 6px rgba(213, 196, 161, 0.3))' }}>
              <path d="M 50 12 L 90 88 L 75 88 L 50 38 L 25 88 L 10 88 Z" fill="currentColor" stroke="none" />
              <path d="M 33 72 L 67 72" stroke="var(--bg-darker)" strokeWidth="7" />
            </svg>
          </div>
          <div>
            <div className="logo-text" style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', fontSize: '1.2rem', letterSpacing: '0.08em', color: '#fff', lineHeight: '1.1' }}>
              AURA
            </div>
            <div className="logo-subtitle" style={{ color: 'var(--primary-gold)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: '600' }}>
              BEAUTY OS
            </div>
          </div>
        </div>

        <nav className="header-nav">
          <span 
            className={`nav-link ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => onSetTab('browse')}
          >
            <Scissors size={16} />
            Explore
          </span>
          <span 
            className={`nav-link ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => onSetTab('map')}
          >
            <Map size={16} />
            Smart Map
          </span>

          {/* Customer-only Navigation Tabs — hidden from guests */}
          {currentUser && currentUser.role === 'user' && (
            <>
              <span 
                className={`nav-link ${activeTab === 'scan' ? 'active' : ''}`}
                onClick={() => onSetTab('scan')}
              >
                <Camera size={16} />
                Face Scan
              </span>
              <span 
                className={`nav-link ${activeTab === 'budget' ? 'active' : ''}`}
                onClick={() => onSetTab('budget')}
              >
                <CircleDollarSign size={16} />
                Budget Plan
              </span>
              <span 
                className={`nav-link ${activeTab === 'referrals' ? 'active' : ''}`}
                onClick={() => onSetTab('referrals')}
              >
                <Sparkles size={16} style={{ color: 'var(--primary-gold)' }} />
                Refer &amp; Earn
              </span>
              <span 
                className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => onSetTab('bookings')}
              >
                <Calendar size={16} />
                My Dashboard
                {favoritesCount > 0 && (
                  <span className="badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 6px', marginLeft: '4px', background: 'rgba(255, 224, 130, 0.1)', color: '#FFE082', borderColor: 'rgba(255, 224, 130, 0.3)' }}>
                    {favoritesCount} ★
                  </span>
                )}
              </span>
            </>
          )}

          {/* Admin-only Navigation Tabs — only shown to authenticated admins */}
          {currentUser && currentUser.role === 'admin' && (
            <>
              <span 
                className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => onSetTab('admin')}
              >
                <LineChart size={16} />
                Admin Panel
              </span>
              <span 
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onSetTab('dashboard')}
              >
                <User size={16} />
                Partner
              </span>
            </>
          )}
        </nav>

        <div className="header-actions">
          <div className="header-city-selector">
            <MapPin size={16} style={{ color: '#FFE082' }} />
            <select 
              value={currentCity} 
              onChange={(e) => setCurrentCity(e.target.value)}
              style={{ color: '#FFE082' }}
            >
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="cart-trigger" onClick={toggleCart}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="cart-badge animate-fade-in" style={{ background: '#FFE082', color: '#06070a' }}>{cartCount}</span>
            )}
          </div>

          {/* User authentication states dropdown */}
          {!currentUser ? (
            <button 
              className="btn-primary" 
              onClick={onOpenAuth}
              style={{ padding: '6px 14px', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid var(--primary-gold)', cursor: 'pointer' }}
            >
              Access OS
            </button>
          ) : (
            <div className="user-profile-menu-container" style={{ position: 'relative' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}
              >
                <User size={14} style={{ color: 'var(--primary-gold)' }} />
                <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              {isProfileOpen && (
                <div 
                  className="luxury-float-card animate-slide-in"
                  style={{
                    position: 'absolute',
                    top: '44px',
                    right: 0,
                    width: '280px',
                    padding: '20px',
                    background: 'rgba(6, 7, 10, 0.98)',
                    border: '1px solid var(--border-glow)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    textAlign: 'left'
                  }}
                >
                  {/* Top user meta */}
                  <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '12px' }}>
                    <h4 className="font-display" style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>{currentUser.name}</h4>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{currentUser.email}</p>
                    <span 
                      className="badge-gold" 
                      style={{ 
                        display: 'inline-block', 
                        fontSize: '0.55rem', 
                        padding: '1px 6px', 
                        marginTop: '6px',
                        textTransform: 'uppercase',
                        borderColor: currentUser.role === 'admin' ? 'var(--primary-cyan)' : 'var(--primary-gold)',
                        color: currentUser.role === 'admin' ? 'var(--primary-cyan)' : 'var(--primary-gold)'
                      }}
                    >
                      {currentUser.role === 'admin' ? 'OS Admin' : 'Client Profile'}
                    </span>
                  </div>

                  {/* Profile diagnostic or preferences snippet */}
                  {currentUser.role === 'user' && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>
                        🎭 **Face Shape:** <span style={{ color: 'var(--primary-gold)' }}>{currentUser.diagnostics?.metrics?.faceShape || 'Not Scanned'}</span>
                      </div>
                      <div>
                        🏷️ **Style Choices:** <span style={{ color: 'var(--text-primary)' }}>{currentUser.preferences && currentUser.preferences.length > 0 ? currentUser.preferences.join(', ') : 'None selected'}</span>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentUser.role === 'user' && (
                      <button 
                        className="btn-primary" 
                        onClick={() => {
                          setActiveTab('bookings');
                          setIsProfileOpen(false);
                        }}
                        style={{ padding: '6px 12px', fontSize: '0.75rem', width: '100%', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        My Dashboard
                      </button>
                    )}
                    {currentUser.role === 'admin' && (
                      <button 
                        className="btn-primary" 
                        onClick={() => {
                          setActiveTab('admin');
                          setIsProfileOpen(false);
                        }}
                        style={{ padding: '6px 12px', fontSize: '0.75rem', width: '100%', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        Admin Panel
                      </button>
                    )}
                    <button 
                      className="btn-secondary" 
                      onClick={() => {
                        onSignOut();
                        setIsProfileOpen(false);
                      }}
                      style={{ padding: '6px 12px', fontSize: '0.75rem', width: '100%', justifyContent: 'center', borderColor: 'rgba(255, 74, 90, 0.3)', color: '#ff4d4d', cursor: 'pointer' }}
                    >
                      Sign Out Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
