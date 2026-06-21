import React, { useState } from 'react';
import { 
  Sparkles, Play, ChevronRight, ChevronLeft, ShieldCheck, 
  Database, Activity, ArrowUpRight, Zap, RefreshCw 
} from 'lucide-react';

export default function DemoPanel({
  activeTab,
  setActiveTab,
  setAuraOpen,
  dbSize,
  setDbSize,
  onTriggerFaceScan,
  onRunBudgetPreset,
  onTriggerLocateSalon,
  onSimulateWalkinBooking
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "🚀 WOW Intro Moment",
      desc: "Trigger the 3D Holographic Assistant 'Aura' directly with speech introduction.",
      actionLabel: "Launch Aura Assistant",
      run: () => {
        setAuraOpen(true);
      }
    },
    {
      title: "🗣️ Voice Command Navigation",
      desc: "Simulate Aura routing you to the Map or Scanner page automatically.",
      actionLabel: "Voice command to Aura",
      run: () => {
        setAuraOpen(true);
        // We will trigger a voice navigation command
        setTimeout(() => {
          setActiveTab('map');
        }, 1000);
      }
    },
    {
      title: "📸 AI Selfie Face Scan",
      desc: "Simulate scanning facial contours, jawlines, and generating skincare recommendations.",
      actionLabel: "Start Selfie Scan",
      run: () => {
        if (onTriggerFaceScan) onTriggerFaceScan();
      }
    },
    {
      title: "💰 Budget Combo Optimizer",
      desc: "Optimizes combined haircuts, shaves, and spas within ₹2,500 budget constraint.",
      actionLabel: "Optimize ₹2500 Budget",
      run: () => {
        if (onRunBudgetPreset) onRunBudgetPreset(2500);
      }
    },
    {
      title: "🗺️ Leaflet Geolocation Tracking",
      desc: "Plots user location and highlights nearest Indiranagar salons with wait times.",
      actionLabel: "Locate Nearest Salons",
      run: () => {
        if (onTriggerLocateSalon) onTriggerLocateSalon();
      }
    },
    {
      title: "🎟️ Smart Booking & Waitlist",
      desc: "Instantly check out your shopping cart and update local waitlist tickets.",
      actionLabel: "Confirm Smart Booking",
      run: () => {
        setActiveTab('bookings');
      }
    },
    {
      title: "📈 Admin & Partner Analytics",
      desc: "Watch gross booking revenues, total queue metrics, and category shares update.",
      actionLabel: "View Admin Intelligence",
      run: () => {
        setActiveTab('admin');
      }
    }
  ];

  const handleNext = () => {
    const nextStep = (activeStep + 1) % steps.length;
    setActiveStep(nextStep);
    steps[nextStep].run();
  };

  const handlePrev = () => {
    const prevStep = activeStep === 0 ? steps.length - 1 : activeStep - 1;
    setActiveStep(prevStep);
    steps[prevStep].run();
  };

  return (
    <>
      {/* Collapsible toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '90px',
          left: isOpen ? '310px' : '10px',
          zIndex: 9999,
          background: 'var(--primary-gold)',
          color: '#000',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '0 8px 8px 0',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '0.75rem',
          boxShadow: '2px 2px 10px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <Zap size={12} />
        {isOpen ? 'Close Demo' : 'Open Guided Demo'}
      </button>

      {isOpen && (
        <div 
          className="demo-control-panel glass-panel-glow animate-slide-in"
          style={{
            position: 'fixed',
            top: '90px',
            left: '10px',
            width: '290px',
            zIndex: 9998,
            padding: '16px',
            background: 'rgba(6, 7, 10, 0.95)',
            border: '2px solid var(--primary-gold)',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary-gold)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={14} /> Aura Hackathon Demo
            </h3>
            <span style={{ fontSize: '0.65rem', background: 'rgba(102, 252, 241, 0.1)', color: 'var(--primary-cyan)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(102, 252, 241, 0.2)' }}>
              v2.0 Beta
            </span>
          </div>

          {/* Guided Slideshow Controller */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>WALKTHROUGH SLIDES</span>
              <span>{activeStep + 1} / {steps.length}</span>
            </div>
            
            <h4 style={{ fontSize: '0.85rem', margin: '4px 0 2px', fontWeight: 'bold', color: '#fff' }}>{steps[activeStep].title}</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: '1.3' }}>{steps[activeStep].desc}</p>
            
            <button 
              className="btn-primary" 
              onClick={steps[activeStep].run}
              style={{ width: '100%', padding: '6px', fontSize: '0.75rem', gap: '4px', marginBottom: '8px' }}
            >
              <Play size={10} /> {steps[activeStep].actionLabel}
            </button>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
              <button 
                className="service-cat-tab" 
                onClick={handlePrev}
                style={{ flexGrow: 1, padding: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronLeft size={12} /> Prev
              </button>
              <button 
                className="service-cat-tab" 
                onClick={handleNext}
                style={{ flexGrow: 1, padding: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Database Scaler Stress Test */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Database size={12} style={{ color: 'var(--primary-cyan)' }} /> Scale Marketplace size:
              </span>
              <strong style={{ color: 'var(--primary-cyan)' }}>{dbSize.toLocaleString()}</strong>
            </div>

            <input 
              type="range" 
              min="500" 
              max="10000" 
              step="500"
              value={dbSize === 2200 ? 2000 : dbSize} 
              onChange={(e) => {
                const val = Number(e.target.value);
                setDbSize(val === 2000 ? 2200 : val);
              }}
              style={{ width: '100%', accentColor: 'var(--primary-cyan)', cursor: 'pointer', marginBottom: '6px' }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
              <span>500 (Basic)</span>
              <span>2,000 (Target)</span>
              <span>10,000+ (Stress)</span>
            </div>
          </div>

          {/* Real-time actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button 
              className="service-cat-tab" 
              onClick={onSimulateWalkinBooking}
              style={{ fontSize: '0.7rem', padding: '6px', width: '100%', gap: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Activity size={12} /> Inject Simulated Live Booking
            </button>
          </div>
        </div>
      )}
    </>
  );
}
