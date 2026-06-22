import React, { useState, useEffect } from 'react';
import { X, Shield, User, Lock, Mail, Sparkles, CheckSquare, Square } from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('user'); // 'user' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPrefs, setSelectedPrefs] = useState([]); // ['hair', 'facial', 'spa']
  const [isLoading, setIsLoading] = useState(false);

  // Core preferences checkboxes pool
  const PREFERENCE_OPTIONS = [
    { id: 'hair', label: 'Hair Care & Fades' },
    { id: 'facial', label: 'Skincare & Facials' },
    { id: 'spa', label: 'Spa & Body Massage' },
    { id: 'nails', label: 'Nail Styling & Arts' },
    { id: 'makeup', label: 'Bridal & Party Makeup' }
  ];

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTogglePref = (prefId) => {
    setSelectedPrefs(prev => 
      prev.includes(prefId)
        ? prev.filter(id => id !== prefId)
        : [...prev, prefId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let user;
      if (isSignUp) {
        // Signup — delegates to PostgreSQL via api.js (never touches localStorage for user data)
        user = await api.signup(name, email, password, role, selectedPrefs);
        alert(`Account created successfully for ${user.name}! Welcome to Aura.`);
      } else {
        // Login — delegates to PostgreSQL via api.js
        user = await api.login(email, password, role);
      }

      onLoginSuccess(user);
      onClose();
    } catch (err) {
      alert(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="aura-overlay-container animate-fade-in" 
      style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '60px 20px'
      }}
    >
      {/* Auth Card Box */}
      <div 
        className="luxury-float-card animate-slide-in"
        style={{
          width: '420px',
          padding: '30px',
          background: 'rgba(6, 7, 10, 0.95)',
          border: '1px solid var(--border-glow)',
          borderRadius: '24px',
          position: 'relative',
          marginBottom: '40px'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              margin: '0 auto 10px', 
              color: 'var(--primary-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="6" style={{ filter: 'drop-shadow(0 0 6px rgba(213, 196, 161, 0.3))' }}>
              <path d="M 50 12 L 90 88 L 75 88 L 50 38 L 25 88 L 10 88 Z" fill="currentColor" stroke="none" />
              <path d="M 33 72 L 67 72" stroke="var(--bg-darker)" strokeWidth="7" />
            </svg>
          </div>
          <h2 className="font-display" style={{ fontSize: '1.8rem', color: '#fff', margin: 0 }}>
            {isSignUp ? 'Establish Aura Key' : 'Access Aura OS'}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isSignUp ? 'Initialize your custom diagnostics settings' : 'Unlock your curated styling marketplace'}
          </p>
        </div>

        {/* Role Toggle Switch */}
        <div 
          style={{ 
            display: 'flex', 
            background: 'rgba(0,0,0,0.3)', 
            border: '1px solid var(--border-light)', 
            borderRadius: '10px', 
            padding: '4px',
            marginBottom: '20px'
          }}
        >
          <button 
            type="button"
            onClick={() => setRole('user')}
            style={{
              flexGrow: 1,
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              background: role === 'user' ? 'var(--primary-gold)' : 'transparent',
              color: role === 'user' ? '#000' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <User size={12} />
            Customer
          </button>
          <button 
            type="button"
            onClick={() => setRole('admin')}
            style={{
              flexGrow: 1,
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              background: role === 'admin' ? 'var(--primary-gold)' : 'transparent',
              color: role === 'admin' ? '#000' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Shield size={12} />
            Administrator
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {isSignUp && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Rohan Deshmukh" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '36px', width: '100%', fontSize: '0.8rem' }}
                  required
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email Coordinates</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="name@aura.io" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '36px', width: '100%', fontSize: '0.8rem' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Access Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '36px', width: '100%', fontSize: '0.8rem' }}
                required
              />
            </div>
          </div>

          {/* Preferences Multi-Select during Signup */}
          {isSignUp && role === 'user' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                Preferred Styling Choices (Select all that apply)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                {PREFERENCE_OPTIONS.map(opt => {
                  const isChecked = selectedPrefs.includes(opt.id);
                  return (
                    <div 
                      key={opt.id}
                      onClick={() => handleTogglePref(opt.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', cursor: 'pointer', color: isChecked ? 'var(--primary-gold)' : 'var(--text-secondary)' }}
                    >
                      {isChecked ? <CheckSquare size={14} style={{ color: 'var(--primary-gold)' }} /> : <Square size={14} />}
                      <span>{opt.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit */}
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '10px' }}
            disabled={isLoading}
          >
            <Sparkles size={14} />
            {isLoading ? 'Processing...' : (isSignUp ? 'Register Monolith Account' : 'Authenticate Session')}
          </button>
        </form>

        {/* Demo Helper box */}
        <div style={{ marginTop: '16px', padding: '10px', background: 'rgba(213,196,161,0.03)', border: '1px dashed var(--border-glow)', borderRadius: '8px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          💡 **Quick Test Accounts:**
          <div style={{ marginTop: '4px' }}>• **User:** `user@aura.io` / `user123`</div>
          <div>• **Admin:** `admin@aura.io` / `admin123`</div>
        </div>

        {/* Toggle Signup/Signin link */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {isSignUp ? 'Already registered on Aura?' : 'First time establishing credentials?'}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'transparent', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', fontWeight: 'bold', marginLeft: '4px' }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
