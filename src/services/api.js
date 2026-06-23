const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProduction 
  ? 'https://backend-zeta-lac-78.vercel.app/api' 
  : 'http://localhost:5000/api';

/**
 * ============================================================
 * AURA Beauty OS — PostgreSQL Storage Architecture
 * ============================================================
 *
 * All business logic now correctly goes to the PostgreSQL backend.
 * localStorage is strictly kept only for:
 *   - AURA_JWT_TOKEN
 *   - AURA_CACHED_SALONS
 *   - AURA_UI_PREFS
 *   - AURA_SEARCH_HIST
 * ============================================================
 */

// Helper to strip password before returning user to the client (redundant since backend doesn't send password, but keeping for safety)
const _sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('AURA_JWT_TOKEN');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// ─────────────────────────────────────────────────────────────
// UI PREFERENCE HELPERS
// ─────────────────────────────────────────────────────────────
export const uiPrefs = {
  get: (key, fallback = null) => {
    try {
      const prefs = JSON.parse(localStorage.getItem('AURA_UI_PREFS') || '{}');
      return prefs[key] !== undefined ? prefs[key] : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    try {
      const prefs = JSON.parse(localStorage.getItem('AURA_UI_PREFS') || '{}');
      prefs[key] = value;
      localStorage.setItem('AURA_UI_PREFS', JSON.stringify(prefs));
    } catch { /* storage full — silently skip */ }
  },
  clear: () => localStorage.removeItem('AURA_UI_PREFS')
};

// ─────────────────────────────────────────────────────────────
// SEARCH HISTORY HELPERS
// ─────────────────────────────────────────────────────────────
export const searchHistory = {
  add: (term) => {
    if (!term || term.trim().length < 2) return;
    try {
      const history = JSON.parse(localStorage.getItem('AURA_SEARCH_HIST') || '[]');
      const updated = [term, ...history.filter(t => t !== term)].slice(0, 10);
      localStorage.setItem('AURA_SEARCH_HIST', JSON.stringify(updated));
    } catch { /* silently skip */ }
  },
  get: () => {
    try {
      return JSON.parse(localStorage.getItem('AURA_SEARCH_HIST') || '[]');
    } catch { return []; }
  },
  clear: () => localStorage.removeItem('AURA_SEARCH_HIST')
};

export const api = {

  // ───── 1. Authenticate user session ─────
  login: async (email, password, role) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Auth failed with status ${response.status}`);
    }

    if (data.token) {
      localStorage.setItem('AURA_JWT_TOKEN', data.token);
    }
    return _sanitizeUser(data.user);
  },

  // ───── 2. Register user account ─────
  signup: async (name, email, password, role, preferences) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, preferences })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Registration failed with status ${response.status}`);
    }

    if (data.token) {
      localStorage.setItem('AURA_JWT_TOKEN', data.token);
    }
    return _sanitizeUser(data.user);
  },

  // ───── 3. Fetch salon list with filters ─────
  getSalons: async (city, category, search, size = 2200) => {
    try {
      const params = new URLSearchParams({
        ...(city ? { city } : {}),
        ...(category && category !== 'all' ? { category } : {}),
        ...(search ? { search } : {}),
        size: size.toString()
      });
      const response = await fetch(`${API_BASE_URL}/salons?${params.toString()}`);
      if (response.ok) {
        const salons = await response.json();
        // Cache for performance
        try {
          localStorage.setItem('AURA_CACHED_SALONS', JSON.stringify(salons));
        } catch (e) {
          console.warn('[AURA] Could not cache salons (storage limit hit):', e.message);
        }
        return salons;
      }
      throw new Error(`Fetch salons failed with status ${response.status}`);
    } catch (err) {
      // Fallback to cache ONLY if network fails completely
      console.warn('[AURA] Network fetch failed, trying local cache...');
      const saved = localStorage.getItem('AURA_CACHED_SALONS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
      throw err;
    }
  },

  // ───── 4. Sync updated salon catalog ─────
  saveSalonsState: async (salons) => {
    try {
      localStorage.setItem('AURA_CACHED_SALONS', JSON.stringify(salons));
    } catch (e) {
      console.warn('[AURA] Could not update salon cache (storage limit hit):', e.message);
    }
    
    const response = await fetch(`${API_BASE_URL}/salons/sync`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ salons })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Sync failed');
    }
  },

  // ───── 5. Create booking ─────
  createBooking: async (bookingPayload) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingPayload)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Booking submission failed with status ${response.status}`);
    }
    return data;
  },

  // ───── 6. Join Waitlist ─────
  joinWaitlist: async (waitlistPayload) => {
    const response = await fetch(`${API_BASE_URL}/waitlist`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(waitlistPayload)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Waitlist submission failed with status ${response.status}`);
    }
    return data;
  },

  // ───── 6.5. Update Booking Status ─────
  updateBookingStatus: async (bookingId, newStatus) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Updating booking failed with status ${response.status}`);
    }
    return data;
  },

  // ───── 7. Save Diagnostics ─────
  saveDiagnostics: async (email, reportData) => {
    // We pass email just in case, but token identifies user on backend
    const response = await fetch(`${API_BASE_URL}/users/diagnostics`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, diagnostics: reportData })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Saving diagnostics failed with status ${response.status}`);
    }
    return data;
  },

  // ───── 8. Get Current User Profile ─────
  getCurrentUser: async () => {
    const token = localStorage.getItem('AURA_JWT_TOKEN');
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        return _sanitizeUser(data.user);
      }
      return null;
    } catch (err) {
      console.warn('[AURA] Failed to get user profile', err.message);
      return null;
    }
  },

  // ───── 9. Get Bookings ─────
  getBookings: async (email) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Fetch bookings failed with status ${response.status}`);
    }
    return data;
  },

  // ───── 10. Get Favorites ─────
  getFavorites: async (email) => {
    const response = await fetch(`${API_BASE_URL}/users/favorites`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Fetch favorites failed with status ${response.status}`);
    }
    return data;
  },

  // ───── 11. Toggle Favorite ─────
  toggleFavorite: async (email, salonId) => {
    const response = await fetch(`${API_BASE_URL}/users/favorites`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, salonId })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Toggle favorite failed with status ${response.status}`);
    }
    return data;
  }
};
