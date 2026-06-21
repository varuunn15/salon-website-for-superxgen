import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Scissors, 
  ShieldAlert, 
  Award, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Download, 
  FileText, 
  BarChart3, 
  DollarSign, 
  Search,
  Filter
} from 'lucide-react';
import { SERVICES_CATEGORIES } from '../data/mockData';
import { KAGGLE_SALES_DATA } from '../data/kaggleData';

// Kaggle scaling factors
const CITY_MULTIPLIERS = {
  'Bangalore': 1.0,
  'Mumbai': 1.3,
  'Delhi': 1.15,
  'Hyderabad': 0.9,
  'Chennai': 0.85,
  'Pune': 0.7
};

const SALON_MULTIPLIERS = {
  '$$$$': 1.4,
  '$$$': 1.1,
  '$$': 0.8
};

export default function PartnerDashboard({ 
  bookings, 
  salons, 
  onUpdateBookingStatus, 
  onAddServiceToSalon 
}) {
  const [selectedSalonId, setSelectedSalonId] = useState(salons[0]?.id || '');
  const [partnerSubTab, setPartnerSubTab] = useState('operations'); // 'operations' | 'analytics'
  
  // Operations Form States
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('45');
  const [newServiceCategory, setNewServiceCategory] = useState('hair');

  // Analytics States
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(11); // Default to December (index 11)
  const [tableSearchTerm, setTableSearchTerm] = useState('');

  const activeSalon = salons.find(s => s.id === selectedSalonId) || salons[0];

  // 1. Calculate operational stats for this specific salon
  const salonBookings = bookings.filter(b => b.salonId === selectedSalonId);
  const totalRevenue = salonBookings
    .filter(b => b.status === 'Confirmed' || b.status === 'Completed')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const completedCount = salonBookings.filter(b => b.status === 'Completed').length;
  const activeCount = salonBookings.filter(b => b.status === 'Confirmed').length;

  // 2. Parse and scale the Kaggle Sales Dataset based on active salon details
  const cityMult = CITY_MULTIPLIERS[activeSalon.city] || 1.0;
  const priceMult = SALON_MULTIPLIERS[activeSalon.priceCategory] || 1.0;
  const finalMultiplier = cityMult * priceMult;

  const getScaledMetric = (metricName) => {
    const baseline = KAGGLE_SALES_DATA.metrics[metricName] || [];
    return baseline.map(val => Math.round(val * finalMultiplier * 100) / 100);
  };

  const scaledMonths = KAGGLE_SALES_DATA.months;
  const scaledGross = getScaledMetric('Gross Sales');
  const scaledReturns = getScaledMetric('Returns');
  const scaledDiscounts = getScaledMetric('Discounts & Comps');
  const scaledNetSales = getScaledMetric('Net Sales');
  const scaledTax = getScaledMetric('Tax');
  const scaledTips = getScaledMetric('Tip');
  const scaledFees = getScaledMetric('Fees');
  const scaledNetTotal = getScaledMetric('Net Total');

  const handleCreateService = (e) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice || !selectedSalonId) return;

    onAddServiceToSalon(selectedSalonId, {
      id: `s-new-${Date.now()}`,
      name: newServiceName,
      price: parseInt(newServicePrice),
      duration: parseInt(newServiceDuration),
      category: newServiceCategory
    });

    setNewServiceName('');
    setNewServicePrice('');
    alert(`Service "${newServiceName}" added successfully to ${activeSalon.name}!`);
  };

  // Compile and download CSV Report of Kaggle sales metrics
  const handleDownloadCSV = () => {
    const headers = ['Month', 'Gross Sales', 'Returns', 'Discounts & Comps', 'Net Sales', 'Tax Collected', 'Tips Received', 'Processing Fees', 'Net Total Revenue'];
    const rows = scaledMonths.map((month, idx) => [
      month,
      scaledGross[idx],
      scaledReturns[idx],
      scaledDiscounts[idx],
      scaledNetSales[idx],
      scaledTax[idx],
      scaledTips[idx],
      scaledFees[idx],
      scaledNetTotal[idx]
    ]);

    const csvContent = [
      `ROYAL GLOW STUDIO - FINANCIAL ANALYSIS REPORT (KAGGLE HUB)`,
      `Salon: ${activeSalon.name}`,
      `City: ${activeSalon.city} (City Multiplier: ${cityMult.toFixed(2)}x)`,
      `Tier: ${activeSalon.priceCategory} (Price Multiplier: ${priceMult.toFixed(2)}x)`,
      `Overall Scaling Factor: ${finalMultiplier.toFixed(2)}x`,
      `Generated: ${new Date().toLocaleString()}`,
      `----------------------------------------------------------------------`,
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeSalon.name.toLowerCase().replace(/\s+/g, '_')}_2021_financial_report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Line Chart coordinates calculation
  // Viewport 560 x 180
  const chartWidth = 500;
  const chartHeight = 130;
  const paddingLeft = 40;
  const paddingTop = 20;

  const maxGross = Math.max(...scaledGross);
  const minNetTotal = Math.min(...scaledNetTotal, 0); // Include 0 baseline
  const valueRange = maxGross - minNetTotal;

  const getCoordinates = (dataArray) => {
    return dataArray.map((val, idx) => {
      const x = paddingLeft + (idx * (chartWidth / (dataArray.length - 1)));
      // Normalize Y value within height limits
      const y = paddingTop + chartHeight - ((val - minNetTotal) / valueRange) * chartHeight;
      return { x, y };
    });
  };

  const grossCoords = getCoordinates(scaledGross);
  const netSalesCoords = getCoordinates(scaledNetSales);
  const netTotalCoords = getCoordinates(scaledNetTotal);

  const getPathD = (coords) => {
    if (coords.length === 0) return '';
    return coords.reduce((acc, c, idx) => {
      return idx === 0 ? `M ${c.x},${c.y}` : `${acc} L ${c.x},${c.y}`;
    }, '');
  };

  // Filter months for the metrics table
  const filteredMonthsData = scaledMonths.map((m, idx) => ({
    index: idx,
    name: m,
    gross: scaledGross[idx],
    returns: scaledReturns[idx],
    discounts: scaledDiscounts[idx],
    netSales: scaledNetSales[idx],
    tax: scaledTax[idx],
    tips: scaledTips[idx],
    fees: scaledFees[idx],
    netTotal: scaledNetTotal[idx]
  })).filter(item => item.name.toLowerCase().includes(tableSearchTerm.toLowerCase()));

  return (
    <div className="dashboard-layout animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* Selector for Salon Business */}
      <div className="flex-between glass-panel" style={{ padding: '16px 24px', marginBottom: '16px' }}>
        <div>
          <h3 className="font-display" style={{ fontSize: '1.35rem', color: 'var(--primary-gold)' }}>Partner Center</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Select business location: <strong>{activeSalon.name}</strong> ({activeSalon.city} • {activeSalon.priceCategory})
          </p>
        </div>
        <select 
          value={selectedSalonId} 
          onChange={(e) => setSelectedSalonId(e.target.value)}
          style={{ background: 'var(--bg-darker)', color: 'var(--primary-gold)', fontWeight: '600', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
        >
          {salons.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
          ))}
        </select>
      </div>

      {/* Salon Health Scorecard (Tesla Diagnostics Style) */}
      <div 
        className="luxury-float-card" 
        style={{ 
          padding: '24px', 
          marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(213, 196, 161, 0.02) 0%, rgba(15, 15, 20, 0.9) 100%)',
          border: '1px solid var(--border-glow)'
        }}
      >
        <div className="flex-between" style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--primary-gold)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 'bold' }}>SYSTEM HEALTH INDEX</span>
            <h2 className="font-display" style={{ fontSize: '1.45rem', color: '#fff', margin: '4px 0 0' }}>Salon Diagnostics Scorecard</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', gap: '2px', color: 'var(--primary-gold)', fontSize: '0.9rem', justifyContent: 'flex-end', marginBottom: '2px' }}>
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <span style={{ fontSize: '0.65rem', color: '#00e676', textTransform: 'uppercase', fontWeight: 'bold', background: 'rgba(0, 230, 118, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              GRADE A+ (Excellent)
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center' }}>
          {/* Metric 1: Customer Satisfaction */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="none" />
                <circle cx="40" cy="40" r="34" stroke="#00e676" strokeWidth="6" fill="none" 
                  strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * 96) / 100}
                  strokeLinecap="round" transform="rotate(-90 40 40)" style={{ filter: 'drop-shadow(0 0 4px #00e676)' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.95rem', fontWeight: '800' }}>96%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Customer Satisfaction</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Based on last 100 checkouts</div>
            </div>
          </div>

          {/* Metric 2: Cancellation Rate */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="none" />
                <circle cx="40" cy="40" r="34" stroke="#ff3b30" strokeWidth="6" fill="none" 
                  strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * 2) / 100}
                  strokeLinecap="round" transform="rotate(-90 40 40)" style={{ filter: 'drop-shadow(0 0 4px #ff3b30)' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.95rem', fontWeight: '800' }}>2%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Cancellation Rate</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Standard target &lt; 5%</div>
            </div>
          </div>

          {/* Metric 3: Repeat Customers */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="none" />
                <circle cx="40" cy="40" r="34" stroke="var(--primary-gold)" strokeWidth="6" fill="none" 
                  strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * 81) / 100}
                  strokeLinecap="round" transform="rotate(-90 40 40)" style={{ filter: 'drop-shadow(0 0 4px var(--primary-gold))' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.95rem', fontWeight: '800' }}>81%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Repeat Customers</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Loyalty retention metric</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="partner-stats-row" style={{ marginBottom: '20px' }}>
        <div className="stat-card glass-panel-glow">
          <div className="stat-label">Operational Revenue</div>
          <div className="stat-val">₹{totalRevenue}</div>
          <div className="stat-subtext">Active operational checkout tickets</div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-label">Kaggle Scaling Factor</div>
          <div className="stat-val">{finalMultiplier.toFixed(2)}x</div>
          <div className="stat-subtext">City: {cityMult.toFixed(1)}x • Tier: {priceMult.toFixed(1)}x</div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-label">Kaggle Net Annual Total</div>
          <div className="stat-val">₹{Math.round(scaledNetTotal.reduce((a, b) => a + b, 0)).toLocaleString()}</div>
          <div className="stat-subtext">Based on 2021 Hair 365 dataset</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="filter-row-strip" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '0' }}>
        <div className="quick-filter-selects">
          <button 
            className={`service-cat-tab ${partnerSubTab === 'operations' ? 'active' : ''}`}
            onClick={() => setPartnerSubTab('operations')}
            style={{ borderRadius: '8px 8px 0 0', padding: '12px 20px', border: 'none', borderBottom: partnerSubTab === 'operations' ? '2px solid var(--primary-gold)' : '2px solid transparent' }}
          >
            <Scissors size={14} style={{ marginRight: '6px' }} />
            Operational Management ({salonBookings.length})
          </button>
          <button 
            className={`service-cat-tab ${partnerSubTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setPartnerSubTab('analytics')}
            style={{ 
              borderRadius: '8px 8px 0 0', 
              padding: '12px 20px', 
              border: 'none', 
              borderBottom: partnerSubTab === 'analytics' ? '2px solid var(--primary-gold)' : '2px solid transparent',
              color: partnerSubTab === 'analytics' ? 'var(--primary-gold)' : 'var(--primary-cyan)',
              fontWeight: 'bold'
            }}
          >
            <BarChart3 size={14} style={{ marginRight: '6px' }} />
            Kaggle Financial Analytics
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {partnerSubTab === 'operations' ? (
        <div className="partner-dashboard-grid animate-fade-in">
          {/* Left Column: Appointments List */}
          <div>
            {/* Bookings Queue */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 className="font-display" style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '16px' }}>
                Booking Queue ({salonBookings.length})
              </h3>

              {salonBookings.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '16px 0' }}>No bookings found for this salon.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {salonBookings.slice().reverse().map(bkg => (
                    <div 
                      key={bkg.id} 
                      className="glass-panel" 
                      style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', borderLeft: bkg.status === 'Confirmed' ? '3px solid var(--primary-gold)' : bkg.status === 'Completed' ? '3px solid var(--primary-cyan)' : '3px solid var(--danger-red)' }}
                    >
                      <div className="flex-between" style={{ marginBottom: '6px' }}>
                        <span style={{ fontWeight: '600' }}>{bkg.customerName || 'Walk-in Customer'}</span>
                        <span className="badge-cyan" style={{ fontSize: '0.65rem' }}>{bkg.id}</span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        <strong>Services:</strong> {bkg.services.map(s => s.name).join(', ')}
                      </div>

                      <div className="flex-between">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          🕒 {bkg.bookingDate} at {bkg.bookingTime}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {bkg.status === 'Confirmed' && (
                            <>
                              <button 
                                className="btn-danger"
                                style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '4px', gap: '4px' }}
                                onClick={() => onUpdateBookingStatus(bkg.id, 'Cancelled')}
                              >
                                <XCircle size={12} />
                                Decline
                              </button>
                              <button 
                                className="btn-primary"
                                style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '4px', gap: '4px' }}
                                onClick={() => onUpdateBookingStatus(bkg.id, 'Completed')}
                              >
                                <CheckCircle2 size={12} />
                                Complete
                              </button>
                            </>
                          )}
                          {bkg.status !== 'Confirmed' && (
                            <span className={`badge-gold`} style={{ fontSize: '0.75rem', color: bkg.status === 'Completed' ? 'var(--primary-cyan)' : 'var(--danger-red)' }}>
                              {bkg.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Manage Catalog / Create Services */}
          <div>
            <div className="partner-form-panel glass-panel">
              <h3 className="font-display text-glow-gold" style={{ fontSize: '1.25rem', color: 'var(--primary-gold)', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} />
                Add New Service
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '16px' }}>
                Instantly expand this location's service menu catalog.
              </p>

              <form onSubmit={handleCreateService}>
                <div className="form-group">
                  <label>Service Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Balayage Hair Touchup, Hot Stone Massage" 
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input 
                      type="number" 
                      placeholder="999" 
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (mins)</label>
                    <select 
                      value={newServiceDuration}
                      onChange={(e) => setNewServiceDuration(e.target.value)}
                    >
                      <option value="15">15 mins</option>
                      <option value="30">30 mins</option>
                      <option value="45">45 mins</option>
                      <option value="60">60 mins</option>
                      <option value="90">90 mins</option>
                      <option value="120">120 mins</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={newServiceCategory} 
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                  >
                    {SERVICES_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary mt-4" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Create Service Catalog
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* KAGGLE ANALYTICS VIEW */
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Chart Section */}
          <div className="partner-analytics-panel glass-panel" style={{ padding: '24px' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '20px' }}>
              <h3 className="font-display" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} style={{ color: 'var(--primary-gold)' }} />
                2021 Monthly Revenue Trends (Kaggle Dataset)
              </h3>
              <button 
                className="btn-primary" 
                style={{ padding: '8px 14px', fontSize: '0.8rem', gap: '6px' }}
                onClick={handleDownloadCSV}
              >
                <Download size={14} />
                Export CSV Report
              </button>
            </div>

            {/* SVG Interactive Line Chart */}
            <div style={{ position: 'relative', width: '100%', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              
              {/* Legend */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '12px', fontSize: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '3px', background: 'var(--primary-gold)', display: 'inline-block' }}></span>
                  Gross Sales
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '3px', background: 'var(--primary-teal)', display: 'inline-block' }}></span>
                  Net Sales
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '3px', background: 'var(--primary-cyan)', display: 'inline-block' }}></span>
                  Net Total (Incl. Tips/Fees)
                </span>
              </div>

              {/* Chart Body */}
              <div style={{ position: 'relative', height: '180px' }}>
                {/* Horizontal Guide Lines */}
                <div style={{ position: 'absolute', left: '0', right: '0', top: '15%', borderBottom: '1px dashed rgba(255,255,255,0.04)' }}></div>
                <div style={{ position: 'absolute', left: '0', right: '0', top: '50%', borderBottom: '1px dashed rgba(255,255,255,0.04)' }}></div>
                <div style={{ position: 'absolute', left: '0', right: '0', top: '85%', borderBottom: '1px dashed rgba(255,255,255,0.04)' }}></div>

                {/* SVG Render */}
                <svg viewBox="0 0 560 180" width="100%" height="100%" style={{ overflow: 'visible' }}>
                  
                  {/* Grid Axis Line */}
                  <line x1="40" y1="150" x2="540" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                  {/* Lines Paths */}
                  <path d={getPathD(grossCoords)} fill="none" stroke="var(--primary-gold)" strokeWidth="2.5" strokeLinecap="round" />
                  <path d={getPathD(netSalesCoords)} fill="none" stroke="var(--primary-teal)" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
                  <path d={getPathD(netTotalCoords)} fill="none" stroke="var(--primary-cyan)" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Interactive Circles & Hover targets */}
                  {grossCoords.map((pt, idx) => (
                    <g key={`pts-${idx}`}>
                      {/* Gross point */}
                      <circle cx={pt.x} cy={pt.y} r="3.5" fill="var(--primary-gold)" />
                      {/* Net Total point */}
                      <circle cx={netTotalCoords[idx].x} cy={netTotalCoords[idx].y} r="3.5" fill="var(--primary-cyan)" />
                    </g>
                  ))}

                  {/* Y Axis text markers */}
                  <text x="32" y="25" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹{Math.round(maxGross / 1000)}K</text>
                  <text x="32" y="85" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹{Math.round((maxGross + minNetTotal) / 2000)}K</text>
                  <text x="32" y="150" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹0</text>

                  {/* X Axis text markers */}
                  {scaledMonths.map((m, idx) => (
                    <text 
                      key={`lbl-${idx}`} 
                      x={40 + idx * (chartWidth / 11)} 
                      y="166" 
                      fill="var(--text-muted)" 
                      fontSize="8" 
                      textAnchor="middle"
                    >
                      {m.substring(0, 3)}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Grid Layout for Month Receipt & Metrics Table */}
          <div className="analytics-split-grid">
            
            {/* Left Column: Selected Month Financial Statement Receipt */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div className="flex-between" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <h3 className="font-display" style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} style={{ color: 'var(--primary-gold)' }} />
                  Monthly Statement
                </h3>
                
                <select 
                  value={selectedMonthIndex} 
                  onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))}
                  style={{ background: 'var(--bg-darker)', color: 'var(--primary-cyan)', fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px' }}
                >
                  {scaledMonths.map((m, idx) => (
                    <option key={idx} value={idx}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Digital Statement Card */}
              <div 
                className="digital-receipt-container text-left" 
                style={{ 
                  '--checkout-modal-card-bg': '#121319',
                  background: 'linear-gradient(135deg, rgba(197, 168, 128, 0.05) 0%, rgba(6, 7, 10, 0.95) 100%)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div className="receipt-header" style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: '700', letterSpacing: '0.05em' }}>{scaledMonths[selectedMonthIndex].toUpperCase()} 2021</span>
                  <span className="badge-cyan" style={{ fontSize: '0.65rem' }}>SCALED ({finalMultiplier.toFixed(2)}x)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Gross Sales</span>
                    <span>₹{scaledGross[selectedMonthIndex].toLocaleString()}</span>
                  </div>

                  <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Returns</span>
                    <span style={{ color: 'var(--danger-red)' }}>₹{scaledReturns[selectedMonthIndex].toLocaleString()}</span>
                  </div>

                  <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Discounts &amp; Comps</span>
                    <span style={{ color: 'var(--primary-gold)' }}>₹{scaledDiscounts[selectedMonthIndex].toLocaleString()}</span>
                  </div>

                  <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', fontWeight: '600' }}>
                    <span style={{ color: 'var(--text-primary)' }}>Net Sales</span>
                    <span style={{ color: 'var(--primary-teal)' }}>₹{scaledNetSales[selectedMonthIndex].toLocaleString()}</span>
                  </div>

                  <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tax Collected (18%)</span>
                    <span>₹{scaledTax[selectedMonthIndex].toLocaleString()}</span>
                  </div>

                  <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tips Received</span>
                    <span style={{ color: 'var(--primary-cyan)' }}>+₹{scaledTips[selectedMonthIndex].toLocaleString()}</span>
                  </div>

                  <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Card Processing Fees</span>
                    <span style={{ color: 'var(--danger-red)' }}>₹{scaledFees[selectedMonthIndex].toLocaleString()}</span>
                  </div>

                  <div 
                    className="flex-between" 
                    style={{ 
                      background: 'rgba(102, 252, 241, 0.05)', 
                      padding: '10px 12px', 
                      borderRadius: '6px', 
                      fontWeight: '700', 
                      fontSize: '1.05rem', 
                      border: '1px solid var(--border-glow)' 
                    }}
                  >
                    <span style={{ color: 'var(--primary-cyan)' }}>Net Profit Total</span>
                    <span style={{ color: 'var(--primary-cyan)', textShadow: '0 0 8px rgba(102, 252, 241, 0.3)' }}>
                      ₹{scaledNetTotal[selectedMonthIndex].toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Searchable Comparative Data Table */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div className="flex-between" style={{ marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <h3 className="font-display" style={{ fontSize: '1.15rem' }}>
                  Financial Log Table
                </h3>
                
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Search size={12} style={{ position: 'absolute', left: '8px', color: 'var(--text-secondary)' }} />
                  <input 
                    type="text" 
                    placeholder="Search Month..." 
                    value={tableSearchTerm} 
                    onChange={(e) => setTableSearchTerm(e.target.value)}
                    style={{ 
                      background: 'var(--bg-darker)', 
                      border: '1px solid var(--border-light)', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      padding: '4px 8px 4px 26px', 
                      width: '130px',
                      color: 'var(--text-primary)' 
                    }}
                  />
                </div>
              </div>

              {/* Table Container */}
              <div style={{ overflowX: 'auto', flexGrow: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                      <th style={{ padding: '8px 4px' }}>Month</th>
                      <th style={{ padding: '8px 4px', textAlign: 'right' }}>Gross (₹)</th>
                      <th style={{ padding: '8px 4px', textAlign: 'right' }}>Discounts (₹)</th>
                      <th style={{ padding: '8px 4px', textAlign: 'right' }}>Tips (₹)</th>
                      <th style={{ padding: '8px 4px', textAlign: 'right' }}>Net Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMonthsData.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No months match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredMonthsData.map((row) => (
                        <tr 
                          key={row.index} 
                          style={{ 
                            borderBottom: '1px solid rgba(255,255,255,0.02)',
                            background: row.index === selectedMonthIndex ? 'rgba(197,168,128,0.04)' : 'transparent',
                            cursor: 'pointer'
                          }}
                          onClick={() => setSelectedMonthIndex(row.index)}
                        >
                          <td style={{ padding: '8px 4px', fontWeight: '600' }}>{row.name}</td>
                          <td style={{ padding: '8px 4px', textAlign: 'right' }}>{Math.round(row.gross).toLocaleString()}</td>
                          <td style={{ padding: '8px 4px', textAlign: 'right', color: 'var(--primary-gold)' }}>{Math.round(row.discounts).toLocaleString()}</td>
                          <td style={{ padding: '8px 4px', textAlign: 'right', color: 'var(--primary-cyan)' }}>{Math.round(row.tips).toLocaleString()}</td>
                          <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: '600', color: 'var(--primary-teal)' }}>{Math.round(row.netTotal).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
