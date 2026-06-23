import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Clock, UserCheck, Compass, Info, Heart } from 'lucide-react';
import { INDIAN_CITIES } from '../data/dataGenerator';

// Haversine formula to calculate distance in km
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1)); // Distance in km
}

export default function LocationMap({
  currentCity,
  salons,
  onSelectSalon,
  favorites = [],
  toggleFavorite
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [selectedMapSalon, setSelectedMapSalon] = useState(null);
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'queue' | 'rating'

  // Get active city center
  const cityConfig = INDIAN_CITIES.find(
    (c) => c.name.toLowerCase() === currentCity.toLowerCase()
  ) || INDIAN_CITIES[0];

  // Load Leaflet CSS dynamically
  useEffect(() => {
    const cssId = 'leaflet-css-link';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  // Request browser geolocation
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setTrackingLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setTrackingLoading(false);
        
        // Pan map to user location
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 13);
        }
      },
      (error) => {
        console.error("Error fetching location: ", error);
        alert("Unable to fetch location. Using default city center.");
        setTrackingLoading(false);
        setUserLocation({ lat: cityConfig.lat, lng: cityConfig.lng });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Set default location to city center on mount / city change
  useEffect(() => {
    setUserLocation({ lat: cityConfig.lat, lng: cityConfig.lng });
  }, [currentCity, cityConfig.lat, cityConfig.lng]);

  // Leaflet Map Initialization & Marker Updates
  useEffect(() => {
    if (!mapContainerRef.current || !userLocation) return;

    // Create Map if not exists
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 12,
        zoomControl: true
      });

      // Dark Mode Cyber Theme TileLayer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);
    } else {
      // Pan to location on update
      mapRef.current.setView([userLocation.lat, userLocation.lng], mapRef.current.getZoom());
    }

    // Update User Location Marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      const pulsingIcon = L.divIcon({
        className: 'custom-pulsing-user-marker',
        html: `<div class="pulse-ring"></div><div class="pulse-dot"></div>`,
        iconSize: [20, 20]
      });
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: pulsingIcon })
        .addTo(mapRef.current)
        .bindPopup("Your Location");
    }

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add Salon Markers
    const citySalons = salons.filter(
      (s) => currentCity.toLowerCase() === 'all cities' || s.city.toLowerCase() === currentCity.toLowerCase()
    );

    citySalons.forEach((salon) => {
      const isFav = favorites.includes(salon.id);
      const isLux = salon.priceCategory === '$$$$';
      const markerColor = isLux ? '#D4AF37' : '#66FCF1'; // Gold for luxury, Cyan for standard
      
      const customIcon = L.divIcon({
        className: 'custom-salon-marker-div',
        html: `<div style="background-color: ${markerColor}; border: 2px solid #06070a; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 10px ${markerColor}"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker([salon.coordinates.lat, salon.coordinates.lng], { icon: customIcon })
        .addTo(mapRef.current)
        .on('click', () => {
          setSelectedMapSalon(salon);
          if (mapRef.current) {
            mapRef.current.setView([salon.coordinates.lat, salon.coordinates.lng], 14);
          }
        });

      // Popup
      marker.bindPopup(`
        <div style="color: #fff; font-family: sans-serif; min-width: 150px;">
          <h4 style="margin: 0 0 4px; color: ${markerColor}; font-size: 0.9rem;">${salon.name}</h4>
          <p style="margin: 0 0 6px; font-size: 0.75rem; color: #aaa;">${salon.type} • ${salon.priceCategory}</p>
          <div style="font-size: 0.75rem; color: #fff;">⭐ ${salon.rating} (${salon.reviewsCount} reviews) ${isFav ? '<span style="color:#D4AF37">★ Favorite</span>' : ''}</div>
          <div style="font-size: 0.75rem; color: #66FCF1; margin-top: 4px;">🕒 Queue: ${salon.queueLength} (${salon.waitingTime}m wait)</div>
        </div>
      `);

      markersRef.current.push(marker);
    });

    // Cleanup on destroy
    return () => {
      // Keep map reference persistent across renders, clean up markers only
    };
  }, [userLocation, salons, currentCity, favorites]);

  // Clean up full map on final unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        userMarkerRef.current = null;
      }
    };
  }, []);

  // Filter and Sort Nearby Salons list
  const nearbySalonsList = salons
    .filter((s) => currentCity.toLowerCase() === 'all cities' || s.city.toLowerCase() === currentCity.toLowerCase())
    .map((salon) => {
      const distance = userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, salon.coordinates.lat, salon.coordinates.lng)
        : 1.5;
      const eta = Math.max(3, Math.round((distance / 25) * 60)); // Assumes 25km/h driving
      const totalTime = eta + salon.waitingTime;

      return {
        ...salon,
        distance,
        eta,
        totalTime
      };
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'queue') return a.waitingTime - b.waitingTime;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="location-engine-layout">
      {/* Sidebar Directory */}
      <div className="map-sidebar glass-panel animate-slide-in">
        <div className="sidebar-header" style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 className="font-display gradient-text" style={{ fontSize: '1.4rem', margin: 0 }}>Smart Location Map</h2>
            <button 
              className="btn-primary" 
              onClick={handleLocateUser} 
              disabled={trackingLoading}
              style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '4px' }}
            >
              <Navigation size={12} className={trackingLoading ? 'animate-spin' : ''} />
              {trackingLoading ? 'Locating...' : 'Get Location'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-dropdown"
              style={{ flexGrow: 1, padding: '4px 8px', fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', borderRadius: '6px', color: 'var(--text-primary)' }}
            >
              <option value="distance">Nearest Distance (km)</option>
              <option value="queue">Shortest Waiting Time</option>
              <option value="rating">Highest Ratings</option>
            </select>
          </div>
        </div>

        {/* Nearby list */}
        <div className="sidebar-list" style={{ overflowY: 'auto', flexGrow: 1, padding: '12px' }}>
          {nearbySalonsList.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No businesses found in {currentCity}.
            </div>
          ) : (
            nearbySalonsList.map((salon) => {
              const isFav = favorites.includes(salon.id);
              const isSelected = selectedMapSalon && selectedMapSalon.id === salon.id;

              return (
                <div 
                  key={salon.id}
                  className={`map-salon-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedMapSalon(salon);
                    if (mapRef.current) {
                      mapRef.current.setView([salon.coordinates.lat, salon.coordinates.lng], 14);
                    }
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(102, 252, 241, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '1px solid var(--primary-cyan)' : '1px solid var(--border-light)',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: '600', color: salon.priceCategory === '$$$$' ? 'var(--primary-gold)' : 'var(--text-primary)', margin: 0, paddingRight: '20px' }}>
                      {salon.name}
                    </h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(salon.id); }} 
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isFav ? 'var(--primary-gold)' : 'var(--text-muted)' }}
                    >
                      <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '0 0 6px' }}>{salon.type} • {salon.address}</p>

                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Compass size={11} /> {salon.distance} km away
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} /> ETA: {salon.eta}m
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: salon.queueLength >= 5 ? '#ff4d4d' : salon.queueLength >= 2 ? '#ffaa00' : '#00e676' }}>
                      🟢 Queue: {salon.queueLength} ({salon.waitingTime}m wait)
                    </span>
                    <button 
                      className="btn-primary" 
                      onClick={(e) => { e.stopPropagation(); onSelectSalon(salon); }}
                      style={{ padding: '4px 8px', fontSize: '0.65rem', borderRadius: '4px' }}
                    >
                      Browse Services
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="map-viewport-container" style={{ flexGrow: 1, position: 'relative', height: '100%' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', outline: 'none' }}></div>
        
        {/* Float Details Overlay for Selected Salon */}
        {selectedMapSalon && (
          <div 
            className="glass-panel-glow animate-fade-in"
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              zIndex: 1000,
              padding: '16px',
              background: 'rgba(6, 7, 10, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-glow)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 6px', textTransform: 'uppercase', marginRight: '6px' }}>{selectedMapSalon.type}</span>
                <span className="badge-gold" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>{selectedMapSalon.priceCategory}</span>
                <h3 style={{ fontSize: '1.05rem', margin: '4px 0 0', fontWeight: '600', color: 'var(--text-primary)' }}>{selectedMapSalon.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedMapSalon(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0' }}>📍 {selectedMapSalon.address}</p>
            
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', marginTop: '4px' }}>
              <div>⭐ <strong>{selectedMapSalon.rating}</strong> ({selectedMapSalon.reviewsCount} reviews)</div>
              <div style={{ color: 'var(--primary-teal)' }}>🕒 <strong>Queue Time:</strong> {selectedMapSalon.waitingTime} mins ({selectedMapSalon.queueLength} in queue)</div>
              <div>👥 <strong>Staff Available:</strong> {selectedMapSalon.stylists.length} Experts</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button 
                className="btn-primary" 
                onClick={() => onSelectSalon(selectedMapSalon)} 
                style={{ flexGrow: 1, padding: '8px', fontSize: '0.8rem' }}
              >
                Book Stylist &amp; Services
              </button>
              <a 
                href={`tel:${selectedMapSalon.contactDetails.phone}`}
                className="service-cat-tab"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', fontSize: '0.8rem', textDecoration: 'none', color: 'var(--text-primary)' }}
              >
                📞 Call Salon
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
