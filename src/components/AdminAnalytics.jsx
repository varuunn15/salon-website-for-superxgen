import React from 'react';
import { TrendingUp, Users, ShieldAlert, Award, Calendar, DollarSign } from 'lucide-react';

export default function AdminAnalytics({
  bookings,
  salons
}) {
  // Compute analytics metrics
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'Completed').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const waitlistedBookings = bookings.filter(b => b.status === 'Waitlisted').length;

  const totalRevenue = bookings
    .filter(b => b.status === 'Completed' || b.status === 'Confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // Category splits
  const categoryCount = {};
  salons.forEach(s => {
    s.services?.forEach(svc => {
      categoryCount[svc.category] = (categoryCount[svc.category] || 0) + 1;
    });
  });

  // Calculate average occupancy
  const totalQueue = salons.reduce((sum, s) => sum + (s.queueLength || 0), 0);
  const avgWaitTime = Math.round(salons.reduce((sum, s) => sum + (s.waitingTime || 0), 0) / salons.length);

  return (
    <div className="admin-analytics-view glass-panel animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
        <h1 className="font-display gradient-text" style={{ fontSize: '2rem', margin: '0 0 4px' }}>Marketplace Admin Intelligence</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
          Real-time diagnostics tracking salon bookings, marketplace revenues, regional wait times, and category distributions across Indian cities.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gross Booking Value</span>
            <DollarSign size={16} style={{ color: 'var(--primary-gold)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '8px', color: '#fff' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
          <span style={{ fontSize: '0.65rem', color: '#00e676' }}>▲ +18.4% this week</span>
        </div>

        <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Ticket Bookings</span>
            <Calendar size={16} style={{ color: 'var(--primary-cyan)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '8px', color: '#fff' }}>{totalBookings}</div>
          <span style={{ fontSize: '0.65rem', color: 'var(--primary-teal)' }}>{confirmedBookings} Confirmed • {waitlistedBookings} Waitlisted</span>
        </div>

        <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active Marketplace Queue</span>
            <Users size={16} style={{ color: 'var(--primary-teal)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '8px', color: '#fff' }}>{totalQueue} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>people</span></div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Avg. wait time: {avgWaitTime} mins</span>
        </div>

        <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Registered Businesses</span>
            <Award size={16} style={{ color: 'var(--primary-gold)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '8px', color: '#fff' }}>{salons.length}</div>
          <span style={{ fontSize: '0.65rem', color: 'var(--primary-cyan)' }}>Spanning 12 major cities</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Category Share Chart (CSS Bars) */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={16} style={{ color: 'var(--primary-cyan)' }} />
            Marketplace Service Offerings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(categoryCount).map(([cat, val]) => {
              const maxVal = Math.max(...Object.values(categoryCount));
              const pct = (val / maxVal) * 100;
              return (
                <div key={cat} style={{ fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{cat} Services</span>
                    <strong>{val}</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary-cyan)', borderRadius: '4px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Transaction Ledger Logs */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={16} style={{ color: 'var(--primary-gold)' }} />
            Active Transaction Audit Feed
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '240px' }}>
            {bookings.slice().reverse().map((b, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '0.75rem', 
                  padding: '8px 10px', 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: '6px',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--primary-gold)' }}>{b.id}</strong> - {b.salonName}
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>Customer: {b.customerName || "Walk-in Guest"} • City: {b.city}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>₹{b.totalPrice}</strong>
                  <div 
                    style={{ 
                      fontSize: '0.65rem', 
                      color: b.status === 'Completed' ? '#00e676' : b.status === 'Confirmed' ? 'var(--primary-cyan)' : '#ff3b30',
                      textTransform: 'uppercase',
                      fontWeight: 'bold'
                    }}
                  >
                    {b.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
