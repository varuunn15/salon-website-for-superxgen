import React from 'react';
import { X, Trash, ArrowRight, ShoppingBag } from 'lucide-react';

export default function Cart({ 
  isOpen, 
  onClose, 
  cart, 
  removeFromCart, 
  onCheckoutSalon 
}) {
  if (!isOpen) return null;

  // Group cart items by salon
  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.salonId]) {
      acc[item.salonId] = {
        salonName: item.salonName,
        city: item.city,
        items: []
      };
    }
    acc[item.salonId].items.push(item);
    return acc;
  }, {});

  const salonIds = Object.keys(groupedCart);

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="cart-title">
            <ShoppingBag size={22} style={{ color: 'var(--primary-gold)' }} />
            Your Bookings
          </h2>
          <button className="drawer-close-btn" style={{ position: 'static', width: '30px', height: '30px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart-state animate-fade-in">
            <ShoppingBag size={48} style={{ strokeWidth: 1, color: 'var(--text-muted)' }} />
            <h3>Your Booking Cart is Empty</h3>
            <p style={{ fontSize: '0.85rem', maxWidth: '240px' }}>
              Browse salons and select services to schedule your next appointment.
            </p>
          </div>
        ) : (
          <div className="cart-items-list">
            {salonIds.map(salonId => {
              const salonGroup = groupedCart[salonId];
              const subtotal = salonGroup.items.reduce((sum, item) => sum + item.price, 0);
              const convenienceFee = 99; // Standard 99 INR fee
              const tax = Math.round(subtotal * 0.18); // 18% GST
              const total = subtotal + convenienceFee + tax;

              return (
                <div key={salonId} className="cart-item-card glass-panel" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--primary-gold)' }}>
                        {salonGroup.salonName}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Location: {salonGroup.city}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {salonGroup.items.map(item => (
                      <div key={item.id} className="cart-item-subtext">
                        <span>{item.name} ({item.duration}m)</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '500' }}>₹{item.price}</span>
                          <button 
                            className="cart-item-remove"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-checkout-section" style={{ borderTop: '1px solid var(--border-light)', marginTop: '12px', paddingTop: '12px' }}>
                    <div className="cart-price-table" style={{ gap: '4px', marginBottom: '12px' }}>
                      <div className="price-row" style={{ fontSize: '0.8rem' }}>
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="price-row" style={{ fontSize: '0.8rem' }}>
                        <span>GST (18%)</span>
                        <span>₹{tax}</span>
                      </div>
                      <div className="price-row" style={{ fontSize: '0.8rem' }}>
                        <span>Booking Fee</span>
                        <span>₹{convenienceFee}</span>
                      </div>
                      <div className="price-row total" style={{ fontSize: '0.95rem', paddingTop: '8px', marginTop: '6px' }}>
                        <span>Total Price</span>
                        <span>₹{total}</span>
                      </div>
                    </div>

                    <button 
                      className="btn-primary" 
                      style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.9rem' }}
                      onClick={() => onCheckoutSalon(salonId, salonGroup.items, total)}
                    >
                      Checkout Salon <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
