import React, { useState } from 'react';
import { Gift, Copy, Check, Users, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function ReferralHub() {
  const [copied, setCopied] = useState(false);
  const referralCode = "AURA-GOLD-9982";
  const referralLink = `https://aura.beauty/invite?code=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralsList = [
    { name: "Karan Joseph", service: "Precision Haircut", date: "2026-06-18", status: "Completed", reward: "₹500 Credited" },
    { name: "Rhea Chhabra", service: "Hydrafacial MD", date: "2026-06-15", status: "Completed", reward: "₹500 Credited" },
    { name: "Marc de Fontaine", service: "French Balayage", date: "2026-06-12", status: "Completed", reward: "₹500 Credited" },
    { name: "Sneha Sen", service: "Spa Massage", date: "2026-06-20", status: "Pending", reward: "₹500 Pending" },
    { name: "Amit Verma", service: "Beard Trim", date: "2026-06-19", status: "Pending", reward: "₹500 Pending" }
  ];

  return (
    <div className="referral-hub-view glass-panel animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
        <h1 className="font-display gradient-text" style={{ fontSize: '2.2rem', margin: '0 0 4px' }}>Aura Monolith Referrals</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Invite your circle to preeminent styling and wellness spaces. Earn premium credit tokens for each successful booking.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Left Column: Code Display and Referral Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Gold Card */}
          <div 
            className="luxury-float-card" 
            style={{ 
              padding: '24px', 
              background: 'linear-gradient(135deg, rgba(213, 196, 161, 0.05) 0%, rgba(15, 15, 20, 0.95) 100%)',
              border: '2px solid var(--border-glow)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="badge-gold" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Aura Monolith Invite</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '6px 0 0', color: '#fff' }}>Share Aura, Get Credits</h2>
              </div>
              <div 
                style={{ 
                  width: '45px', 
                  height: '45px', 
                  borderRadius: '12px', 
                  background: 'rgba(213, 196, 161, 0.1)', 
                  color: 'var(--primary-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Gift size={22} />
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: '1.45' }}>
              Give your friends **₹500** off their first booking. You will receive **₹500** in credits once their styling appointment is completed.
            </p>

            {/* Copy Field */}
            <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '8px 12px', alignItems: 'center' }}>
              <div style={{ flexGrow: 1 }}>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)' }}>YOUR SHARE LINK</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary-gold)', wordBreak: 'break-all' }}>{referralLink}</span>
              </div>
              <button 
                onClick={handleCopyLink}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.75rem', gap: '6px', borderRadius: '6px' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* How It Works Steps */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '16px', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> How it Works
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0 }}>1</div>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 2px' }}>Send Invitation Link</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>Copy and share your invite link with your close circle via WhatsApp or Email.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0 }}>2</div>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 2px' }}>Friend books a service</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>Your friend gets ₹500 flat off their first appointment at any of our 2,200+ partner salons.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0 }}>3</div>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 2px' }}>Receive credit rewards</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>Once their appointment status updates to "Completed", ₹500 credits are loaded onto your profile.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Earnings Summary & Invites Ledger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Credits Summary Card */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total Referral Balance</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '6px', color: 'var(--primary-gold)', display: 'flex', alignItems: 'baseline' }}>
                ₹1,500
              </div>
              <span style={{ fontSize: '0.6rem', color: 'var(--primary-teal)' }}>Ready to redeem at checkout</span>
            </div>

            <div className="glass-panel" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total Successful Invites</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '6px', color: '#fff', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                3 <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>Friends</span>
              </div>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>2 invites currently pending</span>
            </div>
          </div>

          {/* Invites Ledger Logs */}
          <div className="glass-panel" style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} style={{ color: 'var(--primary-gold)' }} />
              Referral Invite Ledger
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flexGrow: 1 }}>
              {referralsList.map((ref, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '0.75rem', 
                    padding: '10px 12px', 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid var(--border-light)', 
                    borderRadius: '8px',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ color: '#fff' }}>{ref.name}</strong>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>Service: {ref.service} • {ref.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span 
                      style={{ 
                        fontSize: '0.65rem', 
                        color: ref.status === 'Completed' ? '#00e676' : '#ffaa00',
                        fontWeight: 'bold',
                        display: 'block',
                        textTransform: 'uppercase',
                        marginBottom: '2px'
                      }}
                    >
                      {ref.status}
                    </span>
                    <strong style={{ color: ref.status === 'Completed' ? 'var(--primary-gold)' : 'var(--text-muted)' }}>
                      {ref.reward}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
