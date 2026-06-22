import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Star, Heart, Award, CheckCircle, MessageSquare, Sparkles, QrCode, Shield, Gift, Camera, User } from 'lucide-react';

export default function UserDashboard({ 
  bookings, 
  salons, 
  favorites, 
  onSelectSalon, 
  toggleFavorite, 
  onAddReview,
  glowpassTier,
  setGlowpassTier,
  currentUser,
  setActiveTab
}) {
  const [activeSubTab, setActiveSubTab] = useState('bookings'); // 'bookings' | 'favorites' | 'glowpass'
  
  const userName = currentUser ? currentUser.name : "Guest User";
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Filter out favorites
  const favoriteSalons = salons.filter(s => favorites.includes(s.id));

  const handleOpenReviewModal = (booking) => {
    setReviewBooking(booking);
    setReviewRating(5);
    setReviewComment('');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewBooking) return;

    onAddReview(reviewBooking.salonId, {
      author: currentUser ? `${currentUser.name} (You)` : 'Anonymous',
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment
    }, reviewBooking.id);

    setReviewBooking(null);
  };

  // GAMIFICATION BADGES UNLOCK CHECKS:
  const isEliteCritic = bookings.some(b => b.reviewed);
  
  const isTrendsetter = bookings.some(b => {
    const s = salons.find(sal => sal.id === b.salonId);
    return s && s.trending;
  });

  const isLoyalPatron = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed').length >= 3;

  // Streak Count calculation
  const monthlyBookingsCount = bookings.filter(b => b.status === 'Completed' || b.status === 'Confirmed').length;
  const streakPercent = Math.min((monthlyBookingsCount / 3) * 100, 100);

  // Extract won coupons
  const activeCoupons = bookings
    .filter(b => b.couponWon)
    .map(b => ({ ticketId: b.id, reward: b.couponWon }));

  return (
    <div className="dashboard-layout animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* User profile card */}
      <div className="dashboard-user-card glass-panel-glow">
        <div className="user-avatar">{userInitials}</div>
        <div className="user-info-text">
          <h3 className="font-display">{userName}</h3>
          <p>{currentUser ? (currentUser.role === 'admin' ? 'Aura Administrator' : `Royal Glow ${glowpassTier} Member`) : 'Aura Guest'} • Joined June 2026</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
            <span className="badge-cyan" style={{ fontSize: '0.7rem' }}>
              {bookings.filter(b => b.status === 'Confirmed').length} Active Bookings
            </span>
            <span className="badge-gold" style={{ fontSize: '0.7rem' }}>
              Royal Glow {glowpassTier} Tier Active
            </span>
            <span className="badge-gold" style={{ fontSize: '0.7rem', borderColor: 'var(--primary-cyan)', color: 'var(--primary-cyan)' }}>
              🔥 Streak: {monthlyBookingsCount}/3 visits
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="filter-row-strip" style={{ marginTop: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '0' }}>
        <div className="quick-filter-selects">
          <button 
            className={`service-cat-tab ${activeSubTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('bookings')}
            style={{ borderRadius: '8px 8px 0 0', padding: '12px 20px', border: 'none', borderBottom: activeSubTab === 'bookings' ? '2px solid var(--primary-gold)' : '2px solid transparent' }}
          >
            My Appointments ({bookings.length})
          </button>
          <button 
            className={`service-cat-tab ${activeSubTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('favorites')}
            style={{ borderRadius: '8px 8px 0 0', padding: '12px 20px', border: 'none', borderBottom: activeSubTab === 'favorites' ? '2px solid var(--primary-gold)' : '2px solid transparent' }}
          >
            Favorite Salons ({favoriteSalons.length})
          </button>
          <button 
            className={`service-cat-tab ${activeSubTab === 'membership' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('membership')}
            style={{ 
              borderRadius: '8px 8px 0 0', 
              padding: '12px 20px', 
              border: 'none', 
              borderBottom: activeSubTab === 'membership' ? '2px solid var(--primary-gold)' : '2px solid transparent',
              color: activeSubTab === 'membership' ? 'var(--primary-gold)' : 'var(--primary-cyan)',
              fontWeight: 'bold',
              textShadow: '0 0 8px rgba(102, 252, 241, 0.2)'
            }}
          >
            ✨ Royal Glow Membership
          </button>
          <button 
            className={`service-cat-tab ${activeSubTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('profile')}
            style={{ 
              borderRadius: '8px 8px 0 0', 
              padding: '12px 20px', 
              border: 'none', 
              borderBottom: activeSubTab === 'profile' ? '2px solid var(--primary-gold)' : '2px solid transparent',
              color: activeSubTab === 'profile' ? 'var(--primary-gold)' : 'var(--text-secondary)'
            }}
          >
            🔮 AI Beauty Profile
          </button>
        </div>
      </div>

      {/* Content tabs router */}
      <div style={{ marginTop: '20px' }}>
        
        {/* SUBTAB 1: BOOKINGS LIST */}
        {activeSubTab === 'bookings' && (
          <div className="bookings-list">
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <Calendar size={36} style={{ strokeWidth: 1, marginBottom: '12px' }} />
                <p>No salon appointments scheduled yet.</p>
              </div>
            ) : (
              bookings.slice().reverse().map(bkg => {
                const isConfirmed = bkg.status === 'Confirmed';
                const isCompleted = bkg.status === 'Completed';
                const isCancelled = bkg.status === 'Cancelled';
                const isWaitlisted = bkg.status === 'Waitlisted';

                return (
                  <div key={bkg.id} className="booking-history-card glass-panel" style={{ borderLeft: isWaitlisted ? '3px solid var(--danger-red)' : undefined }}>
                    <div className="booking-info-details">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="booking-salon-name">{bkg.salonName}</span>
                        <span className={`booking-badge-status ${
                          isConfirmed ? 'status-confirmed' : isCompleted ? 'status-completed' : isCancelled ? 'status-cancelled' : 'status-confirmed'
                        }`} style={{ background: isWaitlisted ? 'rgba(255, 74, 90, 0.08)' : undefined, color: isWaitlisted ? 'var(--danger-red)' : undefined, border: isWaitlisted ? '1px solid rgba(255,74,90,0.2)' : undefined }}>
                          {bkg.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="booking-info-meta">
                        <span className="booking-meta-item">
                          <Calendar size={13} style={{ color: 'var(--primary-gold)' }} />
                          {bkg.bookingDate}
                        </span>
                        <span className="booking-meta-item">
                          <Clock size={13} style={{ color: 'var(--primary-gold)' }} />
                          {bkg.bookingTime}
                        </span>
                        <span>•</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Ticket: <strong style={{ color: 'var(--text-primary)' }}>{bkg.id}</strong>
                        </span>
                        <span>•</span>
                        <span style={{ color: 'var(--primary-gold)', fontWeight: '600' }}>
                          ₹{bkg.totalPrice}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        <strong>Services:</strong> {bkg.services.map(s => s.name).join(', ')}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <strong>Specialist Stylist:</strong> {bkg.stylistName || 'Any Stylist'}
                      </div>
                    </div>

                    <div className="booking-history-actions">
                      {isCompleted && !bkg.reviewed && (
                        <button 
                          className="btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                          onClick={() => handleOpenReviewModal(bkg)}
                        >
                          <MessageSquare size={13} />
                          Rate &amp; Review
                        </button>
                      )}
                      {isCompleted && bkg.reviewed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--primary-cyan)' }}>
                          <CheckCircle size={14} />
                          Reviewed ({bkg.reviewRating} ★)
                        </div>
                      )}
                      {isConfirmed && (
                        <span className="badge-gold" style={{ fontSize: '0.75rem' }}>
                          Ready to Visit
                        </span>
                      )}
                      {isWaitlisted && (
                        <span className="badge-gold" style={{ fontSize: '0.75rem', color: 'var(--danger-red)', borderColor: 'rgba(255, 74, 90, 0.3)' }}>
                          Queue position: #{bookings.filter(b => b.status === 'Waitlisted').findIndex(b => b.id === bkg.id) + 1}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* SUBTAB 2: FAVORITE SALONS */}
        {activeSubTab === 'favorites' && (
          <div>
            {favoriteSalons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <Heart size={36} style={{ strokeWidth: 1, marginBottom: '12px' }} />
                <p>Your favorites list is empty. Heart salons to see them here.</p>
              </div>
            ) : (
              <div className="salons-grid">
                {favoriteSalons.map(salon => (
                  <div key={salon.id} className="salon-card glass-panel" onClick={() => onSelectSalon(salon)}>
                    <div 
                      className="salon-card-image" 
                      style={{ background: salon.imageTheme || 'linear-gradient(135deg, #1f2833, #0b0c10)', height: '140px' }}
                    >
                      <div className="salon-image-overlay">
                        <span className="salon-badge-city">{salon.city}</span>
                        <button 
                          className="favorite-btn active"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(salon.id);
                          }}
                        >
                          <Heart size={14} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                    <div className="salon-card-body" style={{ padding: '16px' }}>
                      <div className="salon-card-header">
                        <h4 className="salon-card-name" style={{ fontSize: '1.1rem' }}>{salon.name}</h4>
                        <span className="salon-card-price">{salon.priceCategory}</span>
                      </div>
                      <div className="salon-card-meta" style={{ marginBottom: '0', fontSize: '0.8rem' }}>
                        <div className="salon-card-rating">
                          <Star size={12} fill="currentColor" />
                          <span>{salon.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{salon.city}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 3: DYNAMIC MEMBERSHIP TIER PORTAL & BADGES */}
        {activeSubTab === 'membership' && (
          <div className="animate-fade-in dashboard-membership-grid">
            
            {/* Left: Gold metallic Glowpass Member Card */}
            <div>
              <div 
                className="glass-panel-glow" 
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  borderRadius: '20px',
                  background: glowpassTier === 'Glow Elite' 
                    ? 'linear-gradient(135deg, #1e1b15 0%, #a67c33 50%, #d4af37 100%)'
                    : glowpassTier === 'Glow+' 
                    ? 'linear-gradient(135deg, #0f1c24 0%, #17585c 50%, #45a29e 100%)'
                    : 'linear-gradient(135deg, #13141f 0%, #202236 100%)',
                  border: '2px solid var(--primary-gold)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                  padding: '28px',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                  marginPosition: 'relative'
                }}
              >
                {/* Decorative glow lines */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)', zIndex: 1 }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8, fontWeight: '700' }}>
                      EXCLUSIVE MEMBER PASS
                    </span>
                    <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginTop: '2px' }}>
                      {glowpassTier === 'Glow Elite' ? 'ROYAL GLOW ELITE' : glowpassTier === 'Glow+' ? 'ROYAL GLOW PLUS' : 'ROYAL GLOW BASIC'}
                    </h2>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <QrCode size={40} style={{ strokeWidth: 1.5 }} />
                  </div>
                </div>

                <div style={{ zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.55rem', opacity: 0.6, textTransform: 'uppercase' }}>Member ID</div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                      RG-{currentUser ? Math.abs(currentUser.email.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0) % 9000 + 1000) : '0000'}-2026
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--primary-cyan)', marginTop: '4px' }}>
                      {glowpassTier === 'Glow Elite' ? '✓ 15% VIP Discount Applied' : glowpassTier === 'Glow+' ? '✓ 10% Plus Discount Applied' : '✓ 5% Basic Discount Applied'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.55rem', opacity: 0.6, textTransform: 'uppercase' }}>Expires</div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>06/2027</div>
                  </div>
                </div>
              </div>

              {/* Tiers Switcher */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Select Membership Tier (Real-time Checkout sync):
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <button 
                    className={`time-slot-btn ${glowpassTier === 'Glow' ? 'active' : ''}`}
                    onClick={() => setGlowpassTier('Glow')}
                  >
                    Basic (5% off)
                  </button>
                  <button 
                    className={`time-slot-btn ${glowpassTier === 'Glow+' ? 'active' : ''}`}
                    onClick={() => setGlowpassTier('Glow+')}
                  >
                    Plus (10% off)
                  </button>
                  <button 
                    className={`time-slot-btn ${glowpassTier === 'Glow Elite' ? 'active' : ''}`}
                    onClick={() => setGlowpassTier('Glow Elite')}
                  >
                    Elite (15% off)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Streaks and Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* visit Streaks tracker */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 className="font-display" style={{ fontSize: '1.2rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Gift size={16} style={{ color: 'var(--primary-gold)' }} />
                  Monthly Visit Streak
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>{monthlyBookingsCount} of 3 bookings completed</span>
                  <span style={{ color: 'var(--primary-gold)', fontWeight: '600' }}>{streakPercent}%</span>
                </div>
                
                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ width: `${streakPercent}%`, height: '100%', background: 'linear-gradient(to right, var(--primary-gold-light), var(--primary-gold))', borderRadius: '4px', boxShadow: '0 0 10px rgba(197, 168, 128, 0.4)' }}></div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {monthlyBookingsCount >= 3 
                    ? "🎉 Congratulations! Streak complete! You unlocked a free Moroccanoil Spa Add-on voucher." 
                    : `Book ${3 - monthlyBookingsCount} more salon visits this month to unlock a free Moroccanoil Spa Add-on coupon.`
                  }
                </p>
              </div>

              {/* Badges Locker Grid */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 className="font-display" style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} style={{ color: 'var(--primary-gold)' }} />
                  Unlocked Achievements
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
                  {/* Badge 1: Loyal Patron */}
                  <div style={{ opacity: isLoyalPatron ? 1 : 0.4, transition: 'var(--transition-fast)' }}>
                    <div style={{ margin: '0 auto 6px auto', width: '44px', height: '44px', borderRadius: '50%', background: isLoyalPatron ? 'rgba(197,168,128,0.1)' : 'rgba(255,255,255,0.03)', border: isLoyalPatron ? '1px solid var(--primary-gold)' : '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifycontent: 'center', justifyContent: 'center', color: isLoyalPatron ? 'var(--primary-gold)' : 'var(--text-muted)' }}>
                      <Shield size={20} />
                    </div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600' }}>Loyal Patron</span>
                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)' }}>3+ bookings</span>
                  </div>

                  {/* Badge 2: Trendsetter */}
                  <div style={{ opacity: isTrendsetter ? 1 : 0.4, transition: 'var(--transition-fast)' }}>
                    <div style={{ margin: '0 auto 6px auto', width: '44px', height: '44px', borderRadius: '50%', background: isTrendsetter ? 'rgba(102,252,241,0.1)' : 'rgba(255,255,255,0.03)', border: isTrendsetter ? '1px solid var(--primary-cyan)' : '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifycontent: 'center', justifyContent: 'center', color: isTrendsetter ? 'var(--primary-cyan)' : 'var(--text-muted)' }}>
                      <Sparkles size={20} />
                    </div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600' }}>Trendsetter</span>
                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)' }}>Trending Salon</span>
                  </div>

                  {/* Badge 3: Elite Critic */}
                  <div style={{ opacity: isEliteCritic ? 1 : 0.4, transition: 'var(--transition-fast)' }}>
                    <div style={{ margin: '0 auto 6px auto', width: '44px', height: '44px', borderRadius: '50%', background: isEliteCritic ? 'rgba(197,168,128,0.1)' : 'rgba(255,255,255,0.03)', border: isEliteCritic ? '1px solid var(--primary-gold)' : '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifycontent: 'center', justifyContent: 'center', color: isEliteCritic ? 'var(--primary-gold)' : 'var(--text-muted)' }}>
                      <MessageSquare size={20} />
                    </div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600' }}>Elite Critic</span>
                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)' }}>Review left</span>
                  </div>
                </div>
              </div>

              {/* Coupons display */}
              {activeCoupons.length > 0 && (
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h3 className="font-display" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>
                    Active Coupons Won
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeCoupons.map((coupon, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', border: '1px dashed var(--border-glow)', background: 'rgba(197,168,128,0.02)', fontSize: '0.8rem' }}>
                        <span>Code: <strong>{coupon.ticketId}</strong></span>
                        <span style={{ color: 'var(--primary-cyan)', fontWeight: '600' }}>{coupon.reward}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* SUBTAB 4: AI BEAUTY PROFILE */}
        {activeSubTab === 'profile' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Preferred Styling Choices */}
            <div className="glass-panel" style={{ padding: '24px' }}>
               <h3 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--primary-gold)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 🏷️ Your Curated Styling Preferences
               </h3>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                 These are the choices you preferred during account establishment. Aura uses this to pre-filter and prioritize treatments matching your taste.
               </p>
               <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                 {currentUser?.preferences && currentUser.preferences.length > 0 ? (
                   currentUser.preferences.map(pref => {
                     const labelMap = {
                       hair: 'Hair Care & Fades',
                       facial: 'Skincare & Facials',
                       spa: 'Spa & Body Massage',
                       nails: 'Nail Styling & Arts',
                       makeup: 'Bridal & Party Makeup'
                     };
                     return (
                       <span key={pref} className="badge-cyan" style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: '20px' }}>
                         {labelMap[pref] || pref}
                       </span>
                     );
                   })
                 ) : (
                   <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No choices configured yet. Update your preferences in settings.</span>
                 )}
               </div>
            </div>

            {/* AI Diagnostics Scanner Metrics */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--primary-cyan)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎭 Face Diagnostics & Recommendation Profile
              </h3>

              {currentUser?.diagnostics ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Left: Metrics Matrix */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff', marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
                      Diagnostic Scan Values
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Object.entries(currentUser.diagnostics.metrics).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.03)', paddingBottom: '4px' }}>
                          <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <strong style={{ color: '#fff' }}>{val}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Curated Recommendations */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--primary-gold)', marginBottom: '8px' }}>
                        💇 Styling Recommendations
                      </h4>
                      <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div>🟢 **Recommended Cut:** {currentUser.diagnostics.recommendations.bestHairstyle}</div>
                        <div style={{ color: '#ff4d4d' }}>❌ **Avoid Style:** {currentUser.diagnostics.recommendations.avoidHairstyle}</div>
                        <div>🧔 **Beard:** {currentUser.diagnostics.recommendations.bestBeard} ({currentUser.diagnostics.recommendations.bestMustache})</div>
                        <div>⚡ **Fade:** {currentUser.diagnostics.recommendations.fade}</div>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--primary-cyan)', marginBottom: '8px' }}>
                        🧴 Skincare Routine
                      </h4>
                      <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div>✨ **Routine:** {currentUser.diagnostics.recommendations.skincare}</div>
                        <div>🏥 **Treatment:** {currentUser.diagnostics.recommendations.facialText || currentUser.diagnostics.recommendations.facial}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <Sparkles size={40} style={{ strokeWidth: 1.2, color: 'var(--primary-gold)', marginBottom: '14px' }} />
                  <p style={{ fontWeight: '500', color: '#fff', fontSize: '1rem', marginBottom: '6px' }}>No face diagnostics scanned on file.</p>
                  <p style={{ fontSize: '0.8rem', marginBottom: '20px' }}>
                    Unlock curated, hyper-personalized haircuts, beard trims, and facial treatments by executing an AI Face Scan.
                  </p>
                  <button 
                    className="btn-primary" 
                    onClick={() => setActiveTab('scan')}
                    style={{ margin: '0 auto', display: 'flex', gap: '8px', cursor: 'pointer' }}
                  >
                    <Camera size={14} /> Begin AI Face Scan
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      {reviewBooking && (
        <div className="checkout-modal-overlay">
          <div className="checkout-modal-card rating-modal-card glass-panel-glow" style={{ overflowY: 'auto', maxHeight: '90vh' }}>
            <h3 className="font-display text-glow-gold" style={{ fontSize: '1.5rem', color: 'var(--primary-gold)', marginBottom: '8px' }}>
              Rate Your Experience
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              How was your service at <strong>{reviewBooking.salonName}</strong>?
            </p>

            <form onSubmit={handleSubmitReview}>
              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Tap Stars to Rate
                </div>
                <div className="stars-rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={star <= reviewRating ? 'active' : ''}
                      onClick={() => setReviewRating(star)}
                    >
                      <Star size={30} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                    </span>
                  ))}
                </div>
                <div style={{ color: 'var(--primary-gold)', fontWeight: '600', fontSize: '0.95rem' }}>
                  {reviewRating === 5 ? 'Excellent! 5/5' : 
                   reviewRating === 4 ? 'Very Good! 4/5' : 
                   reviewRating === 3 ? 'Good! 3/5' : 
                   reviewRating === 2 ? 'Fair! 2/5' : 'Poor! 1/5'}
                </div>
              </div>

              <div className="form-group">
                <label>Write Your Review</label>
                <textarea 
                  rows="3" 
                  placeholder="Share your thoughts about the stylist, ambiance, or services..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setReviewBooking(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
