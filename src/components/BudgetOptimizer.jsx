import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Clock, Heart, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react';

export default function BudgetOptimizer({
  currentCity,
  salons,
  addToCart,
  openCart
}) {
  const [budget, setBudget] = useState(2000);
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'hair' | 'spa' | 'skin'
  const [optimizedPackages, setOptimizedPackages] = useState([]);
  const [addedPackages, setAddedPackages] = useState({});

  // Trigger optimization when budget, city, or category filter changes
  useEffect(() => {
    runOptimization();
  }, [budget, currentCity, selectedType, salons]);

  const runOptimization = () => {
    // 1. Filter salons in current city
    const citySalons = salons.filter(
      (s) => s.city.toLowerCase() === currentCity.toLowerCase()
    );

    const packages = [];

    citySalons.forEach((salon) => {
      const services = salon.services || [];
      if (services.length === 0) return;

      // Group services by category to ensure we don't duplicate within same category (e.g. 2 haircuts)
      const categories = {};
      services.forEach((s) => {
        if (!categories[s.category]) {
          categories[s.category] = [];
        }
        categories[s.category].push(s);
      });

      // Simple backtracking or combination drawer to build best combination under budget
      // Categories to combine: hair, spa/massage, facial, nails, grooming
      const catKeys = Object.keys(categories);
      let bestCombo = [];
      let bestSum = 0;
      let bestDuration = 0;

      // Generate combinations (Heuristic: sort services in each category by price descending, try combinations)
      // Since categories is small (5), we can do a simple combination finder
      const tempCombos = [];

      function searchCombos(catIdx, currentCombo, currentSum, currentDuration) {
        if (currentSum > budget) return;

        if (currentSum > 0) {
          tempCombos.push({
            services: [...currentCombo],
            totalPrice: currentSum,
            totalDuration: currentDuration
          });
        }

        if (catIdx >= catKeys.length) return;

        const currentCat = catKeys[catIdx];
        const catServices = categories[currentCat] || [];

        // Option 1: Skip this category
        searchCombos(catIdx + 1, currentCombo, currentSum, currentDuration);

        // Option 2: Choose one service from this category
        for (let i = 0; i < catServices.length; i++) {
          const s = catServices[i];
          searchCombos(
            catIdx + 1,
            [...currentCombo, s],
            currentSum + s.price,
            currentDuration + s.duration
          );
        }
      }

      searchCombos(0, [], 0, 0);

      if (tempCombos.length > 0) {
        // Sort combinations to find the absolute best one for this salon:
        // Prioritize combinations that have more services, utilize more budget, and maximize rating
        tempCombos.sort((a, b) => {
          // 1. Maximize number of services (variety)
          const serviceDiff = b.services.length - a.services.length;
          if (serviceDiff !== 0) return serviceDiff;
          
          // 2. Maximize budget utilization (closer to budget is better)
          return b.totalPrice - a.totalPrice;
        });

        const optimal = tempCombos[0];
        if (optimal && optimal.services.length >= 2) {
          // Calculate score based on rating, utilization %, and count
          const utilization = optimal.totalPrice / budget;
          const auraScore = Math.min(
            99,
            Math.round(
              salon.rating * 15 + // up to 75 points
              utilization * 20 + // up to 20 points
              optimal.services.length * 2 // up to 10 points
            )
          );

          packages.push({
            id: `pkg-${salon.id}`,
            salon,
            services: optimal.services,
            totalPrice: optimal.totalPrice,
            totalDuration: optimal.totalDuration,
            savings: budget - optimal.totalPrice,
            utilization: Math.round(utilization * 100),
            auraScore
          });
        }
      }
    });

    // Sort packages by Aura Score (descending) or price utilization
    packages.sort((a, b) => b.auraScore - a.auraScore);

    setOptimizedPackages(packages.slice(0, 5)); // display top 5 optimized options
  };

  const handleBookPackage = (pkg) => {
    pkg.services.forEach((s) => {
      addToCart({
        ...s,
        salonId: pkg.salon.id,
        salonName: pkg.salon.name,
        city: pkg.salon.city
      });
    });
    setAddedPackages(prev => ({ ...prev, [pkg.id]: true }));
    
    // Open cart drawer
    setTimeout(() => {
      openCart();
    }, 600);
  };

  return (
    <div className="budget-optimizer-view glass-panel animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="font-display gradient-text" style={{ fontSize: '2.2rem', margin: '0 0 4px' }}>AI Budget Combo Optimizer</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Input your maximum budget and Aura will formulate optimized service bundles maximizing variety, value, and salon quality in {currentCity}.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Left Side Inputs */}
        <div className="inputs-panel glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.15)', height: 'fit-content' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--primary-gold)' }}>
              Set Maximum Budget
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', padding: '10px 14px', borderRadius: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-cyan)' }}>₹</span>
              <input 
                type="number" 
                value={budget} 
                onChange={(e) => setBudget(Math.max(500, Number(e.target.value)))}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', width: '100%', outline: 'none' }}
              />
            </div>
            {/* Slider */}
            <input 
              type="range" 
              min="500" 
              max="15000" 
              step="250"
              value={budget} 
              onChange={(e) => setBudget(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-cyan)', cursor: 'pointer' }}
            />
          </div>

          {/* Quick Presets */}
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Popular Presets:</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="service-cat-tab" onClick={() => setBudget(1000)}>₹1,000 (Express)</button>
              <button className="service-cat-tab" onClick={() => setBudget(2500)}>₹2,500 (Grooming)</button>
              <button className="service-cat-tab" onClick={() => setBudget(5000)}>₹5,000 (Pamper)</button>
              <button className="service-cat-tab" onClick={() => setBudget(10000)}>₹10,000 (Luxury)</button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} style={{ color: 'var(--primary-teal)' }} />
              <span>Includes verified dynamic marketplace pricing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} style={{ color: 'var(--primary-gold)' }} />
              <span>Prioritizes highly rated specialists</span>
            </div>
          </div>
        </div>

        {/* Right Side Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
            Top Optimized Bundles
            <span className="badge-cyan" style={{ fontSize: '0.7rem' }}>{optimizedPackages.length} Matches</span>
          </h2>

          {optimizedPackages.length === 0 ? (
            <div className="glass-panel text-center" style={{ padding: '60px 20px', color: 'var(--text-muted)' }}>
              <p>No service combinations could be calculated within ₹{budget}.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Try increasing your budget or checking a different category.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {optimizedPackages.map((pkg, idx) => {
                const isAdded = addedPackages[pkg.id];
                const markerColor = pkg.salon.priceCategory === '$$$$' ? 'var(--primary-gold)' : 'var(--primary-cyan)';

                return (
                  <div 
                    key={pkg.id} 
                    className="glass-panel-glow animate-slide-in"
                    style={{
                      padding: '18px',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.01)',
                      border: idx === 0 ? '1px solid var(--border-glow)' : '1px solid var(--border-light)',
                      position: 'relative'
                    }}
                  >
                    {/* Top Spot Badge */}
                    {idx === 0 && (
                      <span 
                        className="badge-gold" 
                        style={{ position: 'absolute', top: '-10px', right: '20px', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '10px' }}
                      >
                        Aura Pick: Best Value
                      </span>
                    )}

                    {/* Salon Header details */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span className="badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 5px', textTransform: 'uppercase', marginRight: '6px' }}>{pkg.salon.type}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⭐ {pkg.salon.rating} • {pkg.salon.reviewsCount} reviews</span>
                        <h3 style={{ fontSize: '1.1rem', margin: '4px 0 0', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {pkg.salon.name}
                        </h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aura Score</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-cyan)' }}>{pkg.auraScore}<span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>/100</span></div>
                      </div>
                    </div>

                    {/* Services Included List */}
                    <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '10px', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 'bold' }}>SERVICES INCLUDED:</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {pkg.services.map((s, sIdx) => (
                          <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: 'var(--primary-gold)' }}>•</span>
                              <span>{s.name}</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '1px 6px', borderRadius: '4px', textTransform: 'capitalize' }}>{s.category}</span>
                            </div>
                            <strong style={{ color: '#fff' }}>₹{s.price}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Combined Metrics Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
                        <div>⏱️ <strong>Duration:</strong> {pkg.totalDuration} mins</div>
                        <div style={{ color: 'var(--primary-teal)' }}>🎯 <strong>Budget Utilized:</strong> {pkg.utilization}%</div>
                        <div style={{ color: '#00e676' }}>💰 <strong>Saved:</strong> ₹{pkg.savings}</div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ textAlign: 'right', marginRight: '6px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bundle Price</span>
                          <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>₹{pkg.totalPrice}</div>
                        </div>
                        <button 
                          className="btn-primary" 
                          onClick={() => handleBookPackage(pkg)}
                          disabled={isAdded}
                          style={{ padding: '10px 16px', fontSize: '0.8rem', gap: '6px' }}
                        >
                          {isAdded ? (
                            <>
                              <ShieldCheck size={14} /> Booked
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} /> Book Package
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
