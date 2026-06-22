import React, { useState } from 'react';
import { Gift, Copy, Check, Users, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function ReferralHub({ currentUser }) {
  const [copied, setCopied] = useState(false);

  // Generate a stable referral code derived from the user's email
  // so each account gets a unique, consistent code.
  const generateCode = (email) => {
    if (!email) return 'AURA-GUEST-0000';
    const hash = Math.abs(email.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0));
    return `AURA-${email.split('@')[0].toUpperCase().slice(0, 4)}-${(hash % 9000 + 1000)}`;
  };

  const referralCode = generateCode(currentUser?.email);
  const referralLink = `https://aura.beauty/invite?code=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {
      const el = document.createElement('textarea');
      el.value = referralLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // New accounts start with an empty ledger — referrals are earned, not seeded.
  const referralsList = [];
  const completedCount = referralsList.filter(r => r.status === 'Completed').length;
  const pendingCount = referralsList.filter(r => r.status === 'Pending').length;
  const totalCredits = completedCount * 500;

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
                {totalCredits > 0 ? `₹${totalCredits.toLocaleString('en-IN')}` : '₹0'}
              </div>
              <span style={{ fontSize: '0.6rem', color: 'var(--primary-teal)' }}>
                {totalCredits > 0 ? 'Ready to redeem at checkout' : 'Invite friends to earn credits'}
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total Successful Invites</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '6px', color: '#fff', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                {completedCount} <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>Friends</span>
              </div>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                {pendingCount > 0 ? `${pendingCount} invite${pendingCount > 1 ? 's' : ''} currently pending` : 'No pending invites'}
              </span>
            </div>
          </div>

          {/* Invites Ledger Logs */}
          <div className="glass-panel" style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} style={{ color: 'var(--primary-gold)' }} />
              Referral Invite Ledger
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flexGrow: 1 }}>
              {referralsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
                  <Users size={32} style={{ strokeWidth: 1, marginBottom: '10px' }} />
                  <p style={{ fontSize: '0.85rem' }}>No referrals yet. Share your link to start earning!</p>
                </div>
              ) : (
                referralsList.map((ref, idx) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
