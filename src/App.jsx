import React, { useState, useEffect } from 'react';
import { Scissors, Calendar, User, Sparkles } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import SalonCard from './components/SalonCard';
import SalonDetails from './components/SalonDetails';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import UserDashboard from './components/UserDashboard';
import PartnerDashboard from './components/PartnerDashboard';
import AuraAssistant from './components/AuraAssistant';
import LocationMap from './components/LocationMap';
import FaceAnalysis from './components/FaceAnalysis';
import BudgetOptimizer from './components/BudgetOptimizer';
import AdminAnalytics from './components/AdminAnalytics';
import ReferralHub from './components/ReferralHub';
import DemoPanel from './components/DemoPanel';
import AuthModal from './components/AuthModal';
import { SOCIAL_BOOKINGS } from './data/mockData';
import { api } from './services/api';
import './App.css';

export default function App() {
  // Global App States
  const [currentCity, setCurrentCity] = useState('Bangalore');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'bookings' | 'dashboard'
  const [redirectTab, setRedirectTab] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // User Authentication State
  // NOTE: We do NOT persist the full user profile to localStorage.
  // AURA_JWT_TOKEN (localStorage) is used only as a session credential to
  // re-authenticate on page load via the backend. The user object lives
  // exclusively in React state so clearing localStorage never corrupts user data.
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Dynamic Datasets in State for Real-time Interaction
  const [dbSize, setDbSize] = useState(2200);
  const [salons, setSalons] = useState([]);
  // Bookings start empty — populated from the backend for the authenticated user.
  // INITIAL_BOOKINGS is only used for the Partner/Admin demo dashboard view.
  const [bookings, setBookings] = useState([]);
  // Favorites start empty — each account has its own independent favorites list.
  const [favorites, setFavorites] = useState([]);
  const [isAuraOpen, setIsAuraOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Glowpass Membership Tier — new accounts default to the entry-level 'Glow' tier.
  const [glowpassTier, setGlowpassTier] = useState('Glow');

  // Sync DB size and filters changes dynamically from API
  useEffect(() => {
    setCurrentPage(1);
    const fetchSalons = async () => {
      setLoading(true);
      try {
        // Fetch ALL salons so global dashboards (Admin, Partner, Favorites) have full context
        const data = await api.getSalons('', 'all', '', dbSize);
        setSalons(data || []);
      } catch (err) {
        console.error("Failed fetching salons from API", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, [dbSize]);

  // Reset pagination when local filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentCity, activeCategory, searchTerm]);

  // Session Restoration / Auto-login on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('AURA_JWT_TOKEN');
      if (!token) return;
      try {
        const user = await api.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          if (user.glowpassTier) {
            setGlowpassTier(user.glowpassTier);
          }
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
      }
    };
    restoreSession();
  }, []);

  // Load user-specific data (Bookings, Favorites) when currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setBookings([]);
      setFavorites([]);
      return;
    }
    
    const fetchUserData = async () => {
      try {
        const [userBookings, userFavs] = await Promise.all([
          api.getBookings(currentUser.email),
          api.getFavorites(currentUser.email)
        ]);
        setBookings(userBookings || []);
        setFavorites(userFavs || []);
      } catch (err) {
        console.error("Failed fetching user-specific data:", err);
      }
    };
    fetchUserData();
  }, [currentUser]);


  // Drawer & Modal States
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState(null);

  // 1. City-wise filtering & Advanced search engine logic
  const filteredSalons = salons.filter(salon => {
    // City match is mandatory
    const matchesCity = salon.city.toLowerCase() === currentCity.toLowerCase();
    if (!matchesCity) return false;

    // Search query matches salon name, description, address, or service names
    const matchesSearch = searchTerm === '' || 
      salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.services.some(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    // Category match
    const matchesCategory = activeCategory === 'all' ||
      salon.services.some(service => service.category === activeCategory);
    return matchesCategory;
  });

  // Pagination Logic
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredSalons.length / itemsPerPage);
  const paginatedSalons = filteredSalons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Intercept tab changes for guest protection
  const handleSetTab = (tabName) => {
    if (!currentUser) {
      const restrictedTabs = ['bookings', 'scan', 'budget', 'referrals', 'dashboard', 'admin'];
      if (restrictedTabs.includes(tabName)) {
        setRedirectTab(tabName);
        setIsAuthOpen(true);
        return;
      }
    } else {
      // Role-based access control
      if (tabName === 'admin' && currentUser.role !== 'admin') {
        alert('Access Denied: Administrator privileges required.');
        setActiveTab('browse');
        return;
      }
      // Partner dashboard is restricted to admin role in this build
      if (tabName === 'dashboard' && currentUser.role !== 'admin') {
        alert('Access Denied: Partner / Business account required.');
        setActiveTab('browse');
        return;
      }
    }
    setActiveTab(tabName);
  };

  // 2. Favorites Toggle
  const toggleFavorite = async (salonId) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    try {
      const updatedFavorites = await api.toggleFavorite(currentUser.email, salonId);
      setFavorites(updatedFavorites);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      // Fallback
      setFavorites(prev => 
        prev.includes(salonId) 
          ? prev.filter(id => id !== salonId) 
          : [...prev, salonId]
      );
    }
  };


  // 3. Cart Operations
  const addToCart = (service) => {
    setCart(prev => [...prev, service]);
  };

  const removeFromCart = (serviceId) => {
    setCart(prev => prev.filter(item => item.id !== serviceId));
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  // Auth Success Handler
  // Resets ALL user-specific state before activating the new session so that
  // a second user logging in never sees data that belonged to the previous user.
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);

    // --- Reset all user-scoped state to a clean slate ---
    setBookings([]);           // No bookings until fetched for this user
    setFavorites([]);          // No favorites until fetched for this user
    setGlowpassTier('Glow');   // Default entry-level tier for every new session
    setCart([]);               // Clear any leftover cart items
    setCheckoutDetails(null);  // Discard any in-progress checkout
    setSelectedSalon(null);    // Close any open salon detail panel
    setIsAuraOpen(false);      // Close AI assistant if open
    setSearchTerm('');         // Reset search
    setActiveCategory('all');  // Reset category filter
    setCurrentPage(1);

    // Navigate to the appropriate view for this role
    if (redirectTab) {
      setActiveTab(redirectTab);
      setRedirectTab(null);
    } else if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('bookings');
    }
  };

  // Sign Out Handler — fully clears all user-specific state so the next user
  // (or a fresh login of the same account) always starts from a clean slate.
  const handleSignOut = () => {
    localStorage.removeItem('AURA_JWT_TOKEN');
    setCurrentUser(null);

    // Reset all user-scoped state
    setBookings([]);
    setFavorites([]);
    setGlowpassTier('Glow');
    setCart([]);
    setCheckoutDetails(null);
    setSelectedSalon(null);
    setIsAuraOpen(false);
    setSearchTerm('');
    setActiveCategory('all');
    setCurrentPage(1);
    setActiveTab('browse');
  };

  // Save Face Scan Diagnostics
  const handleSaveDiagnostics = async (reportData) => {
    if (!currentUser) return;
    try {
      const updatedReport = await api.saveDiagnostics(currentUser.email, reportData);
      // Update React state only — diagnostic data is sensitive and must not
      // be written to localStorage.
      setCurrentUser(prev => ({ ...prev, diagnostics: updatedReport }));
    } catch (err) {
      console.error("Failed to save diagnostics:", err);
    }
  };

  // 4. Booking Checkout Initiation
  const handleProceedToCheckout = (salon, items, date, time, stylistName) => {
    if (!currentUser) {
      alert("Aura Session Expired or Unauthenticated. Please Sign In / Sign Up to proceed with your booking.");
      setIsAuthOpen(true);
      return;
    }
    // Subtotal and membership discounts calculated in CheckoutModal
    setCheckoutDetails({
      salon,
      items,
      date,
      time,
      stylistName: stylistName || "Any Stylist"
    });
    setSelectedSalon(null); // Close the detail drawer
  };

  // 5. Booking Success handler
  const handleConfirmBooking = async (newBooking) => {
    try {
      const savedBooking = await api.createBooking(newBooking);
      setBookings(prev => [...prev, savedBooking]);
      // Clear items booked for this salon from global cart
      setCart(prev => prev.filter(item => item.salonId !== newBooking.salonId));
      setCheckoutDetails(null);
      setActiveTab('bookings'); // Redirect to customer dashboard
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  // 6. Waitlist Request Handler
  const handleJoinWaitlist = async (details) => {
    if (!currentUser) {
      alert("Aura Session Expired or Unauthenticated. Please Sign In / Sign Up to join the waitlist.");
      setIsAuthOpen(true);
      return;
    }
    const { salon, items, date, time, stylistName, total } = details;
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ticketId = `WLT-${rand}`;

    const waitlistBooking = {
      id: ticketId,
      salonId: salon.id,
      salonName: salon.name,
      city: salon.city,
      stylistName: stylistName || "Any Stylist",
      services: items.map(i => ({ name: i.name, price: i.price })),
      totalPrice: total,
      bookingDate: date,
      bookingTime: time,
      status: 'Waitlisted',
      canReview: false
    };

    try {
      const savedWaitlist = await api.joinWaitlist(waitlistBooking);
      setBookings(prev => [...prev, savedWaitlist]);
      setCart(prev => prev.filter(item => item.salonId !== salon.id));
      setActiveTab('bookings');
    } catch (err) {
      console.error("Waitlist request failed:", err);
    }
  };

  // 7. Partner state updates: Edit Booking Status (accept, complete, cancel)
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      setBookings(prev => 
        prev.map(bkg => 
          bkg.id === bookingId 
            ? { ...bkg, status: newStatus, canReview: newStatus === 'Completed' } 
            : bkg
        )
      );
    } catch (err) {
      console.error("Failed to update booking status", err);
    }
  };

  // 8. Partner state updates: Add Service dynamically to salon catalog
  const handleAddServiceToSalon = (salonId, newService) => {
    setSalons(prev => {
      const updated = prev.map(s => 
        s.id === salonId 
          ? { ...s, services: [...s.services, newService] } 
          : s
      );
      api.saveSalonsState(updated);
      return updated;
    });
  };

  // 9. User state updates: Submit Review & Recalculate Ratings dynamically
  const handleAddReview = (salonId, newReview, bookingId) => {
    setSalons(prev => {
      const updated = prev.map(s => {
        if (s.id !== salonId) return s;
        const updatedReviews = [...s.reviews, newReview];
        // Calculate new rating average
        const totalRatingSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAverageRating = Math.round((totalRatingSum / updatedReviews.length) * 10) / 10;
        
        return {
          ...s,
          reviews: updatedReviews,
          rating: newAverageRating,
          reviewsCount: updatedReviews.length
        };
      });
      api.saveSalonsState(updated);
      return updated;
    });

    // Mark the booking as reviewed
    setBookings(prev => 
      prev.map(bkg => 
        bkg.id === bookingId 
          ? { ...bkg, reviewed: true, reviewRating: newReview.rating } 
          : bkg
      )
    );
  };

  return (
    <div className="app-container">
      {/* Background Floating Glow Orbs */}
      <div className="bg-glow-orb orb-1"></div>
      <div className="bg-glow-orb orb-2"></div>

      {/* Global Brand Header */}
      <Header 
        currentCity={currentCity}
        setCurrentCity={setCurrentCity}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSetTab={handleSetTab}
        cartCount={cart.length}
        toggleCart={toggleCart}
        favoritesCount={favorites.length}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Live Social Ticker Feed Banner */}
      {activeTab === 'browse' && (
        <div style={{ background: 'rgba(197, 168, 128, 0.04)', borderBottom: '1px solid var(--border-light)', overflow: 'hidden', whiteSpace: 'nowrap', padding: '12px 0', zIndex: 10, position: 'relative' }}>
          <div className="social-ticker-wrap">
            {SOCIAL_BOOKINGS.concat(SOCIAL_BOOKINGS).map((sb, idx) => (
              <span key={idx} style={{ margin: '0 32px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                🔥 <strong style={{ color: 'var(--text-primary)' }}>{sb.user}</strong> ({sb.city}) {sb.action} at <strong style={{ color: 'var(--primary-gold)' }}>{sb.salonName}</strong> <span style={{ color: 'var(--text-muted)' }}>({sb.time})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <main className="content-wrapper">
        
        {/* VIEW 1: EXPLORE MARKETPLACE */}
        {activeTab === 'browse' && (
          <div>
            <Hero 
              currentCity={currentCity}
              setCurrentCity={setCurrentCity}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />

            {/* Premium Coupons & Offers Banner */}
            <div style={{ margin: '28px 0', padding: '24px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(255, 106, 136, 0.07) 0%, rgba(118, 175, 255, 0.07) 100%)', border: '1px solid rgba(255, 106, 136, 0.15)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <Sparkles size={18} style={{ color: '#FF6A88' }} />
                    Exclusive Offers &amp; Coupon Codes
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#4B5563', margin: '4px 0 0 0' }}>Avail additional discounts on checkout by applying these coupon codes!</p>
                </div>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ padding: '8px 16px', borderRadius: '12px', background: '#FFFFFF', border: '1.5px dashed #FF6A88', textAlign: 'center', boxShadow: '0 4px 12px rgba(255, 106, 136, 0.04)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FF6A88', display: 'block', letterSpacing: '0.05em' }}>LAKME50</span>
                    <span style={{ fontSize: '0.72rem', color: '#4B5563' }}>Flat ₹500 Off</span>
                  </div>
                  <div style={{ padding: '8px 16px', borderRadius: '12px', background: '#FFFFFF', border: '1.5px dashed #3B82F6', textAlign: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.04)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#3B82F6', display: 'block', letterSpacing: '0.05em' }}>LUZOFIRST</span>
                    <span style={{ fontSize: '0.72rem', color: '#4B5563' }}>Flat ₹300 Off</span>
                  </div>
                  <div style={{ padding: '8px 16px', borderRadius: '12px', background: '#FFFFFF', border: '1.5px dashed #10B981', textAlign: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.04)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10B981', display: 'block', letterSpacing: '0.05em' }}>SUMMER20</span>
                    <span style={{ fontSize: '0.72rem', color: '#4B5563' }}>20% Off Services</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Salon List Panel */}
            <div className="salons-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Salons in {currentCity}</h2>
                  <span className="section-subtitle">
                    Displaying {filteredSalons.length} styling &amp; wellness centers
                  </span>
                </div>
                {activeCategory !== 'all' && (
                  <span className="badge-cyan" style={{ textTransform: 'capitalize' }}>
                    Category: {activeCategory}
                  </span>
                )}
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: '16px' }}>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '3px solid rgba(213, 196, 161, 0.15)', 
                    borderTopColor: 'var(--primary-gold)', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite' 
                  }}></div>
                  <span style={{ color: 'var(--primary-gold)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Accessing Aura Registry...
                  </span>
                </div>
              ) : filteredSalons.length === 0 ? (
                <div className="glass-panel text-center" style={{ padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No salons match your search criteria.</p>
                  <p style={{ fontSize: '0.85rem' }}>Try clearing filters, searching for alternative services, or changing your city.</p>
                </div>
              ) : (
                <>
                  <div className="salons-grid animate-fade-in">
                    {paginatedSalons.map(salon => (
                      <SalonCard 
                        key={salon.id}
                        salon={salon}
                        isFavorite={favorites.includes(salon.id)}
                        toggleFavorite={toggleFavorite}
                        onClick={() => setSelectedSalon(salon)}
                      />
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
                      <button 
                        className="btn-secondary" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        style={{ padding: '8px 16px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                      >
                        Previous
                      </button>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Page <strong style={{ color: 'var(--text-primary)' }}>{currentPage}</strong> of {totalPages}
                      </span>
                      <button 
                        className="btn-primary" 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        style={{ padding: '8px 16px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: CUSTOMER DASHBOARD (BOOKINGS & FAVORITES) */}
        {activeTab === 'bookings' && (
          <div>
            <h1 className="font-display gradient-text" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
              My Dashboard
            </h1>
            <UserDashboard 
              bookings={bookings}
              salons={salons}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              onSelectSalon={(salon) => {
                setSelectedSalon(salon);
                setActiveTab('browse');
              }}
              onAddReview={handleAddReview}
              glowpassTier={glowpassTier}
              setGlowpassTier={setGlowpassTier}
              currentUser={currentUser}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {/* VIEW 3: PARTNER DASHBOARD (BUSINESS VIEW) */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="font-display gradient-text" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
              Business Center
            </h1>
            <PartnerDashboard 
              bookings={bookings}
              salons={salons}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onAddServiceToSalon={handleAddServiceToSalon}
            />
          </div>
        )}

        {/* VIEW 4: SMART LOCATION MAP */}
        {activeTab === 'map' && (
          <LocationMap 
            currentCity={currentCity}
            salons={salons}
            onSelectSalon={(salon) => {
              setSelectedSalon(salon);
              handleSetTab('browse');
            }}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}

        {/* VIEW 5: FACE SCAN DIAGNOSTICS */}
        {activeTab === 'scan' && (
          <FaceAnalysis 
            currentCity={currentCity}
            salons={salons}
            addToCart={addToCart}
            openCart={toggleCart}
            onSaveDiagnostics={handleSaveDiagnostics}
          />
        )}

        {/* VIEW 6: BUDGET COMBO OPTIMIZER */}
        {activeTab === 'budget' && (
          <BudgetOptimizer 
            currentCity={currentCity}
            salons={salons}
            addToCart={addToCart}
            openCart={toggleCart}
          />
        )}

        {/* VIEW 7: ADMIN ANALYTICS */}
        {activeTab === 'admin' && (
          <AdminAnalytics 
            bookings={bookings}
            salons={salons}
          />
        )}

        {/* VIEW 8: REFER & EARN HUB */}
        {activeTab === 'referrals' && (
          <ReferralHub currentUser={currentUser} />
        )}

      </main>

      {/* DYNAMIC DRAWERS & MODALS */}

      {/* 1. Salon Details Panel Drawer */}
      {selectedSalon && (
        <SalonDetails 
          salon={selectedSalon}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          onClose={() => setSelectedSalon(null)}
          onProceedToCheckout={handleProceedToCheckout}
          bookings={bookings}
          onJoinWaitlist={handleJoinWaitlist}
        />
      )}

      {/* 2. Cart Drawer Sidebar */}
      <Cart 
        isOpen={isCartOpen}
        onClose={toggleCart}
        cart={cart}
        removeFromCart={removeFromCart}
        onCheckoutSalon={(salonId, items, total) => {
          setIsCartOpen(false);
          const salon = salons.find(s => s.id === salonId);
          const d = new Date();
          const dateStr = d.toISOString().split('T')[0];
          
          handleProceedToCheckout(salon, items, dateStr, '11:30 AM', 'Any Stylist');
        }}
      />

      {/* 3. Checkout Modal Portal */}
      {checkoutDetails && (
        <CheckoutModal 
          bookingDetails={checkoutDetails}
          onClose={() => setCheckoutDetails(null)}
          onConfirmBooking={handleConfirmBooking}
          glowpassTier={glowpassTier}
        />
      )}

      {/* Floating Gold Aura AI Toggle */}
      {!isAuraOpen && !selectedSalon && !isCartOpen && !checkoutDetails && (
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
            zIndex: 999,
            boxShadow: '0 8px 30px rgba(197, 168, 128, 0.45)',
            border: '2px solid var(--primary-gold)'
          }}
          onClick={() => setIsAuraOpen(true)}
          aria-label="Open Aura AI"
        >
          <Sparkles size={24} />
        </button>
      )}

      <AuraAssistant 
        isOpen={isAuraOpen}
        onClose={() => setIsAuraOpen(false)}
        currentCity={currentCity}
        setCurrentCity={setCurrentCity}
        addToCart={addToCart}
        openCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={handleSetTab}
        onSelectSalon={(s) => { setSelectedSalon(s); handleSetTab('browse'); }}
        salons={salons}
        bookings={bookings}
        triggerFaceScan={() => { handleSetTab('scan'); setIsAuraOpen(false); }}
      />

      {/* Guided Hackathon Walkthrough Demo Panel */}
      <DemoPanel 
        activeTab={activeTab}
        setActiveTab={handleSetTab}
        setAuraOpen={setIsAuraOpen}
        dbSize={dbSize}
        setDbSize={setDbSize}
        onTriggerFaceScan={() => handleSetTab('scan')}
        onRunBudgetPreset={() => { handleSetTab('budget'); }}
        onTriggerLocateSalon={() => { handleSetTab('map'); }}
        onSimulateWalkinBooking={() => {
          const randomId = Math.random().toString(36).substring(2, 7).toUpperCase();
          const mockB = {
            id: `TX-${randomId}`,
            salonId: "biz-1",
            salonName: salons[0]?.name || "Aura Hair Studio",
            city: currentCity,
            customerName: "Guest Walkin",
            stylistName: "Vikram Rathore",
            services: [{ name: "Signature Haircut by Master Stylist", price: 1500 }],
            totalPrice: 1500,
            bookingDate: new Date().toISOString().split('T')[0],
            bookingTime: "12:00 PM",
            status: "Confirmed",
            canReview: false
          };
          setBookings(prev => [...prev, mockB]);
        }}
      />

      {/* 4. Authentication Portal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        <button 
          className={`mobile-nav-item ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => handleSetTab('browse')}
        >
          <Scissors size={20} />
          <span>Explore</span>
        </button>
        <button 
          className={`mobile-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => handleSetTab('bookings')}
        >
          <Calendar size={20} />
          <span>Dashboard</span>
        </button>
        <button 
          className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleSetTab('dashboard')}
        >
          <User size={20} />
          <span>Partner</span>
        </button>
      </div>
    </div>
  );
}
