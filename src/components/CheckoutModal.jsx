import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, CheckCircle, Smartphone, Award, Download, ArrowRight, ShieldCheck, X, Sparkles, RefreshCw } from 'lucide-react';

export default function CheckoutModal({ 
  bookingDetails, 
  onClose, 
  onConfirmBooking,
  glowpassTier // 'Glow' | 'Glow+' | 'Glow Elite'
}) {
  const [step, setStep] = useState('payment'); // 'payment' | 'processing' | 'spin' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [ticketId, setTicketId] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      setTimeout(() => {
        cardRef.current.scrollTo({
          top: cardRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [paymentMethod, step]);

  // Interactive Card Form States
  const [inputNumber, setInputNumber] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputExpiry, setInputExpiry] = useState('');
  const [inputCvv, setInputCvv] = useState('');

  // UPI Timer State
  const [timeLeft, setTimeLeft] = useState(180);

  // Spin the Wheel States
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotateDegrees, setRotateDegrees] = useState(0);
  const [spinResult, setSpinResult] = useState('');

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  const { salon, items, date, time, stylistName } = bookingDetails;

  // Membership discount mapping
  const tierDiscounts = {
    'Glow': 0.05,
    'Glow+': 0.10,
    'Glow Elite': 0.15
  };

  const currentDiscountRate = tierDiscounts[glowpassTier] || 0.05;
  const subtotal = items.reduce((acc, curr) => acc + curr.price, 0);
  const discountAmount = Math.round(subtotal * currentDiscountRate);

  // Coupon Discount Calculation
  let couponDiscountAmount = 0;
  if (appliedCoupon === 'LAKME50') {
    couponDiscountAmount = Math.min(500, subtotal - discountAmount);
  } else if (appliedCoupon === 'LUZOFIRST') {
    couponDiscountAmount = Math.min(300, subtotal - discountAmount);
  } else if (appliedCoupon === 'SUMMER20') {
    couponDiscountAmount = Math.round((subtotal - discountAmount) * 0.2);
  }

  const taxableAmount = subtotal - discountAmount - couponDiscountAmount;
  const tax = Math.max(0, Math.round(taxableAmount * 0.18));
  const convenienceFee = 99;
  const total = taxableAmount + tax + convenienceFee;

  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    setCouponError('');
    const code = couponCode.toUpperCase().trim();
    if (code === 'LAKME50' || code === 'LUZOFIRST' || code === 'SUMMER20') {
      setAppliedCoupon(code);
    } else {
      setCouponError('Invalid coupon code! Try LAKME50, LUZOFIRST, or SUMMER20.');
    }
  };

  const handleRemoveCoupon = (e) => {
    if (e) e.preventDefault();
    setAppliedCoupon('');
    setCouponCode('');
    setCouponError('');
  };

  useEffect(() => {
    // Generate a unique ticket code
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    setTicketId(`BKG-${rand}`);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    if (step !== 'payment' || paymentMethod !== 'upi') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, paymentMethod]);

  const handleRefreshTimer = () => {
    setTimeLeft(180);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePay = (e) => {
    if (e) e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      setStep('spin'); // Go to spin the wheel first!
    }, 2200);
  };

  // Spin the Wheel Logic
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // Choose a random degree to spin (between 1440 and 2880 degrees)
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalSpin = 1800 + extraDegrees; // at least 5 full rotations
    setRotateDegrees(totalSpin);

    // Calculate which segment it landed on based on final degree angle
    const normalizedAngle = (360 - (extraDegrees % 360)) % 360;
    const segmentIndex = Math.floor(normalizedAngle / 60);

    const prizes = [
      "₹150 OFF COUPON",      // Segment 1 (0-60 deg)
      "FREE HAIR WASH",        // Segment 2 (60-120 deg)
      "₹300 OFF ON NEXT BOOKING", // Segment 3 (120-180 deg)
      "₹50 CASHBACK",          // Segment 4 (180-240 deg)
      "15% OFF NEXT SALON SPA",  // Segment 5 (240-300 deg)
      "FREE CHROME NAIL ART"   // Segment 6 (300-360 deg)
    ];

    setTimeout(() => {
      setSpinResult(prizes[segmentIndex]);
      setIsSpinning(false);
    }, 3600); // matches the CSS transition length
  };

  const handleClaimReward = () => {
    setStep('success');
    
    // Confirm booking to global state
    onConfirmBooking({
      id: ticketId,
      salonId: salon.id,
      salonName: salon.name,
      city: salon.city,
      stylistName: stylistName || "Any Stylist",
      services: items.map(i => ({ name: i.name, price: i.price })),
      totalPrice: total,
      bookingDate: date,
      bookingTime: time,
      status: 'Confirmed',
      canReview: false,
      couponWon: spinResult
    });
  };

  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setInputNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setInputExpiry(val);
  };

  const handleDownload = () => {
    const textReceipt = `
========================================
       ROYAL GLOW STUDIO RECEIPT
========================================
Ticket ID: ${ticketId}
Salon: ${salon.name}
City: ${salon.city}
Address: ${salon.address}
Date: ${date}
Time: ${time}
Stylist: ${stylistName || 'Any Stylist'}
----------------------------------------
Services Booked:
${items.map(item => `- ${item.name}: ₹${item.price}`).join('\n')}
----------------------------------------
Subtotal: ₹${subtotal}
Royal Glow Tier Discount (${glowpassTier}): -₹${discountAmount}
GST (18%): ₹${tax}
Convenience Fee: ₹99
Total Paid: ₹${total}
========================================
Thank you for booking with Royal Glow Studio!
Please display the QR code at the salon.
========================================
    `;

    const blob = new Blob([textReceipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `royal_glow_receipt_${ticketId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal-card glass-panel-glow" style={{ overflowY: 'auto', maxHeight: '90vh' }} ref={cardRef}>
        
        {step === 'payment' && (
          <button 
            className="drawer-close-btn" 
            style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px' }} 
            onClick={onClose}
          >
            <X size={14} />
          </button>
        )}

        {/* STEP 1: PAYMENT FORM */}
        {step === 'payment' && (
          <div className="animate-fade-in" style={{ textAlign: 'left' }}>
            <h2 className="font-display text-glow-gold" style={{ fontSize: '1.8rem', color: 'var(--primary-gold)', marginBottom: '6px' }}>
              Secure Checkout
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Apply membership discounts and complete scheduling.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600' }}>{salon.name}</span>
                <span style={{ color: 'var(--primary-gold)', fontWeight: '600' }}>₹{total}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {items.length} Services • {date} • {time} • Stylist: <strong>{stylistName || 'Any Stylist'}</strong>
              </p>
            </div>

            {/* Selector Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <button
                className={`service-cat-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => setPaymentMethod('upi')}
              >
                <Smartphone size={16} />
                Instant UPI
              </button>
              <button
                className={`service-cat-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={16} />
                Debit/Credit Card
              </button>
            </div>

            {/* UPI SCAN PANEL */}
            {paymentMethod === 'upi' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: '500' }}>
                  Scan using GPay, PhonePe, Paytm or BHIM
                </div>
                
                {/* QR Code Container */}
                <div className="scanner-container">
                  <div className="scanner-laser-line"></div>
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#06070a" strokeWidth="2.2">
                    <path d="M3 3h6v6H3V3zm0 12h6v6H3v-6zm12-12h6v6h-6V3zm0 15h3m-3 3h6m0-6v3M6 6h0M6 18h0M18 6h0" strokeLinecap="round"/>
                  </svg>
                </div>

                <div style={{ fontSize: '0.85rem', color: timeLeft === 0 ? 'var(--danger-red)' : 'var(--primary-gold)', fontWeight: '600', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span>{timeLeft === 0 ? 'QR Expired' : 'Waiting for scan...'}</span>
                  <span className={timeLeft === 0 ? 'badge-danger' : 'badge-cyan'} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                    {formatTime(timeLeft)}
                  </span>
                </div>

                {timeLeft === 0 ? (
                  <button 
                    className="btn-primary mt-4" 
                    style={{ width: '85%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--primary-teal)', borderColor: 'var(--primary-teal)' }}
                    onClick={handleRefreshTimer}
                  >
                    <RefreshCw size={14} /> Regenerate QR Code
                  </button>
                ) : (
                  <button 
                    className="btn-primary mt-4" 
                    style={{ width: '85%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}
                    onClick={handlePay}
                  >
                    Simulate UPI Payment Success
                  </button>
                )}
              </div>
            )}

            {/* CREDIT CARD FORM */}
            {paymentMethod === 'card' && (
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                <div className="credit-card-preview">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="credit-card-chip"></div>
                    <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: '700', opacity: 0.8 }}>
                      ROYAL GLOW {glowpassTier.toUpperCase()}
                    </span>
                  </div>
                  <div className="credit-card-number">{inputNumber || '•••• •••• •••• ••••'}</div>
                  <div className="credit-card-footer">
                    <div>
                      <div style={{ fontSize: '0.55rem', opacity: 0.6 }}>Card Holder</div>
                      <div style={{ fontWeight: '600' }}>{inputName || 'CARDHOLDER NAME'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.55rem', opacity: 0.6 }}>Expires</div>
                      <div style={{ fontWeight: '600' }}>{inputExpiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePay}>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4111 2222 3333 4444" 
                      value={inputNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Card Holder Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Preeti Sinha" 
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={inputExpiry}
                        onChange={handleExpiryChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input 
                        type="password" 
                        placeholder="•••" 
                        value={inputCvv}
                        onChange={(e) => setInputCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary mt-4" 
                    style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                  >
                    Pay Securely • ₹{total}
                  </button>
                </form>
              </div>
            )}

            {/* Coupon Code Entry Form */}
            <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '16px', paddingTop: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Promo Code (e.g. LAKME50)" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={!!appliedCoupon}
                  style={{ flexGrow: 1, padding: '8px 12px', fontSize: '0.85rem', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                {!appliedCoupon ? (
                  <button 
                    onClick={handleApplyCoupon}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap', borderRadius: '8px' }}
                  >
                    Apply
                  </button>
                ) : (
                  <button 
                    onClick={handleRemoveCoupon}
                    className="btn-danger"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap', borderRadius: '8px' }}
                  >
                    Remove
                  </button>
                )}
              </div>
              {couponError && (
                <p style={{ color: 'var(--danger-red)', fontSize: '0.75rem', margin: '4px 0 0 0', textAlign: 'left' }}>{couponError}</p>
              )}
              {appliedCoupon && (
                <p style={{ color: '#10B981', fontSize: '0.75rem', margin: '4px 0 0 0', fontWeight: '600', textAlign: 'left' }}>
                  ✓ Coupon {appliedCoupon} Applied successfully!
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '16px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div className="flex-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex-between" style={{ color: '#FF6A88' }}>
                <span>Royal Glow {glowpassTier} Discount ({Math.round(currentDiscountRate * 100)}%)</span>
                <span>-₹{discountAmount}</span>
              </div>
              {appliedCoupon && (
                <div className="flex-between" style={{ color: '#10B981', fontWeight: '600' }}>
                  <span>Promo Coupon ({appliedCoupon})</span>
                  <span>-₹{couponDiscountAmount}</span>
                </div>
              )}
              <div className="flex-between">
                <span>GST (18%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex-between">
                <span>Convenience Booking Fee</span>
                <span>₹{convenienceFee}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING TIMER */}
        {step === 'processing' && (
          <div className="payment-processing animate-fade-in">
            <div className="spinner"></div>
            <h3 className="font-display" style={{ fontSize: '1.5rem', color: 'var(--primary-gold)' }}>
              Authorizing Payment
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '300px' }}>
              Please do not refresh this page. We are securing your salon booking slot...
            </p>
          </div>
        )}

        {/* STEP 3: GAMIFIED SPIN THE WHEEL */}
        {step === 'spin' && (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', color: 'var(--primary-gold)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Sparkles size={14} />
              Royal Glow Reward Spin
            </div>
            <h2 className="font-display gradient-text" style={{ fontSize: '1.8rem', marginTop: '6px', marginBottom: '8px' }}>
              Spin &amp; Win Rewards
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 16px auto' }}>
              Your booking is confirmed! Spin the wheel to unlock exclusive discount credits for your next visit.
            </p>

            {/* Spin Wheel SVG Visual */}
            <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 20px auto' }}>
              {/* Target Arrow Pin */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '-10px', 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  width: '0', 
                  height: '0', 
                  borderLeft: '10px solid transparent', 
                  borderRight: '10px solid transparent', 
                  borderTop: '16px solid var(--danger-red)', 
                  zIndex: 100 
                }}
              ></div>

              {/* The Spinning Circle */}
              <div 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  border: '4px solid var(--primary-gold)', 
                  transform: `rotate(${rotateDegrees}deg)`, 
                  transition: isSpinning ? 'transform 3.5s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none', 
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* SVG Pizza Wheel with 6 Slices */}
                <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: 'rotate(-30deg)' }}>
                  {/* Colors: Gold (#C5A880), Dark (#121319), Teal (#45A29E) */}
                  
                  {/* Slice 1: 0 - 60 */}
                  <path d="M50,50 L50,0 A50,50 0 0,1 93.3,25 Z" fill="#C5A880" />
                  {/* Slice 2: 60 - 120 */}
                  <path d="M50,50 L93.3,25 A50,50 0 0,1 93.3,75 Z" fill="#121319" />
                  {/* Slice 3: 120 - 180 */}
                  <path d="M50,50 L93.3,75 A50,50 0 0,1 50,100 Z" fill="#45A29E" />
                  {/* Slice 4: 180 - 240 */}
                  <path d="M50,50 L50,100 A50,50 0 0,1 6.7,75 Z" fill="#C5A880" />
                  {/* Slice 5: 240 - 300 */}
                  <path d="M50,50 L6.7,75 A50,50 0 0,1 6.7,25 Z" fill="#121319" />
                  {/* Slice 6: 300 - 360 */}
                  <path d="M50,50 L6.7,25 A50,50 0 0,1 50,0 Z" fill="#45A29E" />

                  {/* Labels placed inside segments */}
                  <text x="60" y="24" fill="#06070a" fontSize="5" fontWeight="700" transform="rotate(30, 60, 24)">₹150 Off</text>
                  <text x="75" y="52" fill="#fff" fontSize="5" fontWeight="700" transform="rotate(90, 75, 52)">Free Wash</text>
                  <text x="60" y="76" fill="#fff" fontSize="5" fontWeight="700" transform="rotate(150, 60, 76)">₹300 Off</text>
                  <text x="28" y="76" fill="#06070a" fontSize="5" fontWeight="700" transform="rotate(210, 28, 76)">₹50 Cash</text>
                  <text x="12" y="52" fill="#fff" fontSize="5" fontWeight="700" transform="rotate(270, 12, 52)">15% Off</text>
                  <text x="28" y="24" fill="#fff" fontSize="5" fontWeight="700" transform="rotate(330, 28, 24)">Free Nail</text>
                  
                  <circle cx="50" cy="50" r="8" fill="#06070a" stroke="var(--primary-gold)" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            {/* Spin button controls */}
            {!spinResult ? (
              <button 
                className="btn-primary"
                style={{ width: '180px', justifyContent: 'center' }}
                onClick={handleSpinWheel}
                disabled={isSpinning}
              >
                <RefreshCw size={14} className={isSpinning ? 'animate-spin' : ''} />
                {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
              </button>
            ) : (
              <div className="animate-fade-in" style={{ padding: '10px' }}>
                <div style={{ color: 'var(--primary-cyan)', fontSize: '1.25rem', fontWeight: '700', textShadow: '0 0 10px rgba(102, 252, 241, 0.4)' }}>
                  🎉 YOU WON: {spinResult}!
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '16px' }}>
                  The reward coupon has been credited to your active pass.
                </div>
                <button 
                  className="btn-primary"
                  style={{ width: '220px', justifyContent: 'center' }}
                  onClick={handleClaimReward}
                >
                  Claim &amp; Get Ticket
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: SUCCESS TICKET VIEW */}
        {step === 'success' && (
          <div className="checkout-success-view animate-fade-in">
            <div className="success-check-icon">
              <CheckCircle size={32} />
            </div>
            
            <h2 className="font-display gradient-teal" style={{ fontSize: '2.1rem', marginBottom: '6px' }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Your seat has been reserved successfully.
            </p>

            {/* Premium Digital Ticket Card */}
            <div className="digital-receipt-container text-left" style={{ '--checkout-modal-card-bg': '#121319' }}>
              <div className="receipt-header">
                <span className="receipt-salon-name">{salon.name}</span>
                <span className="receipt-badge-status">CONFIRMED</span>
              </div>
              <div className="receipt-body">
                <div className="receipt-info-grid">
                  <div>
                    <div className="receipt-info-label">TICKET CODE</div>
                    <div className="receipt-info-value">{ticketId}</div>
                  </div>
                  <div>
                    <div className="receipt-info-label">CITY</div>
                    <div className="receipt-info-value">{salon.city}</div>
                  </div>
                  <div>
                    <div className="receipt-info-label">DATE</div>
                    <div className="receipt-info-value">{date}</div>
                  </div>
                  <div>
                    <div className="receipt-info-label">TIME SLOT</div>
                    <div className="receipt-info-value">{time}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '12px' }}>
                  <div className="receipt-info-label">STYLIST</div>
                  <div className="receipt-info-value" style={{ color: 'var(--primary-gold)' }}>{stylistName || 'Any Stylist'}</div>
                </div>

                <div className="receipt-items-list">
                  {items.map((item, index) => (
                    <div key={index} className="receipt-item-row">
                      <span>{item.name}</span>
                      <span style={{ fontWeight: '500' }}>₹{item.price}</span>
                    </div>
                  ))}
                  
                  {/* Discount line on pass */}
                  <div className="receipt-item-row" style={{ color: 'var(--primary-gold)', fontSize: '0.8rem' }}>
                    <span>Royal Glow Discount ({glowpassTier})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                </div>

                <div className="receipt-total-row">
                  <span>Total Paid (incl. tax)</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="receipt-footer-pass">
                <div className="receipt-instructions">
                  <div style={{ fontWeight: '600', color: 'var(--primary-gold)', marginBottom: '4px', fontSize: '0.8rem' }}>
                    ROYAL GLOW TICKET PASS
                  </div>
                  Show this QR code at the desk. Claimed coupon: <strong>{spinResult}</strong>
                </div>
                <div className="receipt-qr-placeholder">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                    <path d="M3 3h6v6H3V3zm0 12h6v6H3v-6zm12-12h6v6h-6V3zm0 15h3m-3 3h6m0-6v3M6 6h0M6 18h0M18 6h0" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
              <button 
                className="btn-secondary" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleDownload}
              >
                <Download size={16} />
                Download Ticket
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={onClose}
              >
                Back to Explore
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
