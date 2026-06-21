import React, { useState } from 'react';
import { X, Star, Calendar, Clock, MapPin, Check, Plus, ShoppingCart, UserCheck, HelpCircle, Sparkles } from 'lucide-react';
import { SERVICES_CATEGORIES } from '../data/mockData';

export default function SalonDetails({ 
  salon, 
  onClose, 
  cart, 
  addToCart, 
  removeFromCart,
  onProceedToCheckout,
  bookings, // For conflict checking
  onJoinWaitlist
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedStylist, setSelectedStylist] = useState(''); // Empty string means "Any Stylist"

  if (!salon) return null;

  // Generate dynamic 7-day calendar starting today
  const getNext7Days = () => {
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        dateString: d.toISOString().split('T')[0],
        dayName: weekdays[d.getDay()],
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return days;
  };

  const days = getNext7Days();

  // Set default date to today
  if (!selectedDate && days.length > 0) {
    setSelectedDate(days[0].dateString);
  }

  const timeSlots = [
    "09:30 AM", "10:30 AM", "11:30 AM", 
    "01:00 PM", "02:30 PM", "03:30 PM", 
    "05:00 PM", "06:30 PM", "07:30 PM"
  ];

  // Filter salon services
  const filteredServices = selectedCategory === 'all' 
    ? salon.services 
    : salon.services.filter(s => s.category === selectedCategory);

  // Check if a service is in the cart
  const isServiceSelected = (serviceId) => {
    return cart.some(item => item.id === serviceId && item.salonId === salon.id);
  };

  const handleServiceToggle = (service) => {
    if (isServiceSelected(service.id)) {
      removeFromCart(service.id);
    } else {
      addToCart({
        ...service,
        salonId: salon.id,
        salonName: salon.name,
        city: salon.city
      });
    }
  };

  // Get active cart items for this salon
  const salonCartItems = cart.filter(item => item.salonId === salon.id);
  const salonSubtotal = salonCartItems.reduce((acc, curr) => acc + curr.price, 0);

  // CONFLICT LOGIC:
  // Check if a specific slot is booked for the selected stylist
  const isSlotBooked = (dateStr, timeStr, stylistId) => {
    // If no stylist is selected, we check if ALL stylists are booked for that slot
    if (!stylistId) {
      const activeStylists = salon.stylists || [];
      if (activeStylists.length === 0) return false;
      return activeStylists.every(stylist => 
        bookings.some(bkg => 
          bkg.salonId === salon.id &&
          bkg.bookingDate === dateStr &&
          bkg.bookingTime === timeStr &&
          (bkg.stylistName === stylist.name || bkg.stylistId === stylist.id) &&
          bkg.status !== 'Cancelled'
        )
      );
    }

    // Otherwise check for specific stylist
    const stylist = salon.stylists?.find(s => s.id === stylistId);
    if (!stylist) return false;

    return bookings.some(bkg => 
      bkg.salonId === salon.id &&
      bkg.bookingDate === dateStr &&
      bkg.bookingTime === timeStr &&
      (bkg.stylistName === stylist.name || bkg.stylistId === stylist.id) &&
      bkg.status !== 'Cancelled'
    );
  };

  const selectedStylistName = selectedStylist 
    ? salon.stylists?.find(s => s.id === selectedStylist)?.name 
    : "Any Stylist";

  const isCurrentSlotBooked = selectedDate && selectedTimeSlot && isSlotBooked(selectedDate, selectedTimeSlot, selectedStylist);

  const handleBookingSubmit = () => {
    if (salonCartItems.length === 0) return;
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select a date and time slot for your appointment.");
      return;
    }

    if (isCurrentSlotBooked) {
      // JOIN WAITLIST ACTION
      const confirmed = window.confirm(`This slot with ${selectedStylistName} is fully booked. Would you like to join the digital Waitlist? We will notify you if a slot opens up.`);
      if (confirmed) {
        onJoinWaitlist({
          salon,
          items: salonCartItems,
          date: selectedDate,
          time: selectedTimeSlot,
          stylistName: selectedStylistName,
          total: salonSubtotal
        });
        onClose();
      }
    } else {
      // REGULAR CHECKOUT FLOW
      onProceedToCheckout(
        salon, 
        salonCartItems, 
        selectedDate, 
        selectedTimeSlot,
        selectedStylist ? salon.stylists.find(s => s.id === selectedStylist).name : "Any Stylist"
      );
    }
  };

  const handleStickyProceed = () => {
    if (!selectedDate || !selectedTimeSlot) {
      document.querySelector('.booking-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      handleBookingSubmit();
    }
  };

  // BUNDLE RECOMMENDATION: "Complete the Look"
  // Suggest a facial if they only booked hair, suggest hair spa if they booked cut, etc.
  const getBundleRecommendation = () => {
    const hasHair = salonCartItems.some(item => item.category === 'hair');
    const hasFacial = salonCartItems.some(item => item.category === 'facial');
    const hasSpa = salonCartItems.some(item => item.category === 'spa');

    if (hasHair && !hasFacial) {
      // Find a facial service
      return salon.services.find(s => s.category === 'facial');
    }
    if (hasHair && !hasSpa) {
      // Find a spa service
      return salon.services.find(s => s.category === 'spa');
    }
    // Default fallback to any service not in cart
    return salon.services.find(s => !salonCartItems.some(ci => ci.id === s.id));
  };

  const bundleRec = getBundleRecommendation();

  return (
    <div className="details-overlay" onClick={onClose}>
      <div className="details-drawer" onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close-btn" onClick={onClose} aria-label="Close drawer">
          <X size={20} />
        </button>

        {(() => {
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
          const imageUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1200&q=80`;

          return (
            <div 
              className="details-hero" 
              style={{ 
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(26,29,32,0.85) 100%)',
                  zIndex: 1
                }}
              />
              <div className="details-hero-text" style={{ position: 'relative', zIndex: 3 }}>
                <h2 className="details-hero-logo" style={{ color: '#FFFFFF' }}>{salon.name.split(' ')[0]}</h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary-gold)' }}>
                  <Star size={16} fill="currentColor" />
                  <span style={{ fontWeight: '600', color: '#FFFFFF' }}>{salon.rating} ({salon.reviewsCount} reviews)</span>
                  {salon.trending && (
                    <span className="badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                      🔥 Trending #1
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        <div className="details-content">
          <div className="details-main">
            <div>
              <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: '8px' }}>{salon.name}</h1>
              <div style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                <MapPin size={16} />
                <span>{salon.address}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '0.95rem', marginBottom: '20px' }}>
                {salon.description}
              </p>

              {/* AI Review Summarizer Highlight */}
              <div className="glass-panel-glow" style={{ padding: '16px', background: 'rgba(197,168,128,0.03)', border: '1px solid var(--border-glow)', borderRadius: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary-gold)', fontWeight: '600', fontSize: '0.85rem' }}>
                  <Sparkles size={14} />
                  GlowAI Review Summarizer
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>👍 <strong>What people love:</strong> Stylists are highly skilled in precision cuts, Balayage color blends, and organic scalp wellness spa treatments. Ambiance feels like an elite European salon.</div>
                  <div style={{ opacity: 0.85 }}>🕒 <strong>What to watch:</strong> Prime weekend booking slots (11am-3pm) get reserved quickly. We recommend booking at least 2 days in advance.</div>
                </div>
              </div>

              {/* Styled Vector Map */}
              <div style={{ marginBottom: '10px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Location Map Pinpoint
              </div>
              <div className="salon-vector-map" style={{ marginBottom: '20px' }}>
                <div className="map-park" style={{ top: '20px', left: '30px', width: '110px', height: '60px' }}></div>
                <div className="map-park" style={{ bottom: '15px', right: '40px', width: '130px', height: '50px' }}></div>
                <div className="map-street-line" style={{ top: '90px', left: '0', right: '0', height: '10px' }}></div>
                <div className="map-street-line" style={{ top: '0', bottom: '0', left: '180px', width: '10px' }}></div>
                <div className="map-glow-pin" style={{ top: '89px', left: '179px' }}></div>
              </div>
            </div>

            {/* Service Menu */}
            <div>
              <h3 className="service-menu-title font-display">Service Menu</h3>
              
              <div className="service-categories-filter">
                {SERVICES_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={`service-cat-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="services-list">
                {filteredServices.map(service => {
                  const selected = isServiceSelected(service.id);
                  return (
                    <div key={service.id} className={`service-item ${selected ? 'glass-panel-glow' : ''}`}>
                      <div className="service-item-details">
                        <h4 className="service-item-name">{service.name}</h4>
                        <div className="service-item-meta">
                          <span className="service-item-time">
                            <Clock size={12} />
                            {service.duration} mins
                          </span>
                          <span>•</span>
                          <span className="badge-gold" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                            {service.category.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="service-item-action">
                        <span className="service-item-price">₹{service.price}</span>
                        <button
                          className={selected ? 'btn-primary' : 'btn-secondary'}
                          style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem' }}
                          onClick={() => handleServiceToggle(service)}
                        >
                          {selected ? <Check size={14} /> : <Plus size={14} />}
                          {selected ? 'Added' : 'Add'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complete the Look Bundle */}
            {bundleRec && salonCartItems.length > 0 && (
              <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-glow)', background: 'rgba(69, 162, 158, 0.03)', borderRadius: '14px', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <Sparkles size={14} />
                  Complete the Look (Bundle Discount)
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Add {bundleRec.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Complete your booking and save 15% on this add-on!
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary-gold)', marginTop: '4px' }}>
                      ₹{Math.round(bundleRec.price * 0.85)} <span style={{ textDecoration: 'line-through', fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{bundleRec.price}</span>
                    </div>
                  </div>
                  <button 
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px' }}
                    onClick={() => {
                      addToCart({
                        ...bundleRec,
                        price: Math.round(bundleRec.price * 0.85), // apply bundle price
                        name: `${bundleRec.name} (Bundle Deal)`,
                        salonId: salon.id,
                        salonName: salon.name,
                        city: salon.city
                      });
                    }}
                  >
                    Add Bundle
                  </button>
                </div>
              </div>
            )}

            {/* Customer Reviews */}
            <div className="reviews-section">
              <h3 className="service-menu-title font-display">Customer Reviews</h3>
              {salon.reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews yet. Be the first to book and rate!</p>
              ) : (
                salon.reviews.map((rev, idx) => (
                  <div key={idx} className="review-card">
                    <div className="review-card-header">
                      <span className="review-author">{rev.author}</span>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < rev.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">"{rev.comment}"</p>
                    <div style={{ textAlign: 'right', marginTop: '6px' }}>
                      <span className="review-date">{rev.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Booking Scheduler Widget */}
          <div className="details-sidebar">
            <div className="booking-card glass-panel-glow">
              <h3 className="booking-header font-display">Schedule Booking</h3>
              
              {/* Step 1: Select Date */}
              <div className="booking-step-title">
                <Calendar size={14} />
                1. Select Date
              </div>
              <div className="calendar-slider">
                {days.map(day => {
                  const isActive = selectedDate === day.dateString;
                  return (
                    <div 
                      key={day.dateString}
                      className={`calendar-day-card ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedDate(day.dateString)}
                    >
                      <span className="calendar-weekday">{day.dayName}</span>
                      <span className="calendar-date">{day.dayNum}</span>
                      <span className="calendar-weekday">{day.month}</span>
                    </div>
                  );
                })}
              </div>

              {/* Step 2: Select Stylist */}
              <div className="booking-step-title">
                <UserCheck size={14} />
                2. Select Specialist
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <select
                  value={selectedStylist}
                  onChange={(e) => setSelectedStylist(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-darker)', borderColor: 'var(--border-light)' }}
                >
                  <option value="">Any Stylist (No preference)</option>
                  {salon.stylists?.map(stylist => (
                    <option key={stylist.id} value={stylist.id}>
                      {stylist.name} ({stylist.specialty} • {stylist.rating} ★)
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Select Time */}
              <div className="booking-step-title">
                <Clock size={14} />
                3. Select Time
              </div>
              <div className="time-slots-grid">
                {timeSlots.map(slot => {
                  const isBooked = selectedDate && isSlotBooked(selectedDate, slot, selectedStylist);
                  const isActive = selectedTimeSlot === slot;
                  
                  return (
                    <button
                      key={slot}
                      className={`time-slot-btn ${isActive ? 'active' : ''}`}
                      style={{
                        position: 'relative',
                        borderColor: isBooked ? 'rgba(255, 74, 90, 0.25)' : undefined,
                        opacity: isBooked ? 0.75 : 1
                      }}
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {slot}
                      {isBooked && (
                        <span style={{ display: 'block', fontSize: '0.55rem', color: 'var(--danger-red)', marginTop: '2px', fontWeight: '700' }}>
                          WAITLIST
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Slot Availability Warnings */}
              {selectedDate && selectedTimeSlot && (
                <div style={{ fontSize: '0.8rem', color: isCurrentSlotBooked ? 'var(--danger-red)' : 'var(--primary-cyan)', marginBottom: '16px', fontWeight: '500' }}>
                  {isCurrentSlotBooked 
                    ? `⚠️ Selected slot with ${selectedStylistName} is booked. Clicking submit will add you to the Waitlist.`
                    : `✓ Slot with ${selectedStylistName} is fully open and available!`
                  }
                </div>
              )}

              {/* Step 4: Selected Summary */}
              {salonCartItems.length > 0 && (
                <div className="booking-summary-list">
                  <div className="booking-step-title" style={{ marginBottom: '12px' }}>
                    <ShoppingCart size={14} />
                    Summary ({salonCartItems.length} services)
                  </div>
                  {salonCartItems.map(item => (
                    <div key={item.id} className="booking-summary-item">
                      <span>{item.name}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                  
                  <div className="booking-total-row">
                    <span>Total</span>
                    <span>₹{salonSubtotal}</span>
                  </div>

                  <button 
                    className={isCurrentSlotBooked ? 'btn-danger mt-4' : 'btn-primary mt-4'}
                    style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                    onClick={handleBookingSubmit}
                  >
                    {isCurrentSlotBooked ? 'Request Waitlist Slot' : 'Proceed to Booking'}
                  </button>
                </div>
              )}

              {salonCartItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Select services from the menu to start booking.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar for Mobile/Tablet */}
        {salonCartItems.length > 0 && (
          <div className="sticky-booking-bar">
            <div className="sticky-booking-info">
              <span className="sticky-booking-count">{salonCartItems.length} {salonCartItems.length === 1 ? 'service' : 'services'} selected</span>
              <span className="sticky-booking-total">₹{salonSubtotal}</span>
            </div>
            <button 
              className={`sticky-booking-btn ${isCurrentSlotBooked ? 'btn-danger' : 'btn-primary'}`}
              onClick={handleStickyProceed}
              style={{ border: 'none', cursor: 'pointer' }}
            >
              {isCurrentSlotBooked ? 'Request Waitlist' : (selectedDate && selectedTimeSlot ? 'Proceed to Booking' : 'Select Date & Time')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
