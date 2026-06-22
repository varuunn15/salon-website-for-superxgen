import { generateDatabase } from '../data/dataGenerator';

const API_BASE_URL = '/api';

/**
 * ============================================================
 * AURA Beauty OS — Hybrid Storage Architecture
 * ============================================================
 *
 * PostgreSQL (via Backend API) — Single Source of Truth:
 *   - User accounts, passwords, roles, profiles
 *   - Bookings, waitlists, payment records
 *   - Face scan reports, AI diagnostics, recommendations
 *   - Reviews, ratings, referrals, reward points
 *   - Salon catalog, services, stylist schedules
 *   - Admin analytics, revenue data
 *
 * localStorage — Client-Side UX Cache Only:
 *   - AURA_JWT_TOKEN    : Auth session token (not the user object)
 *   - AURA_CACHED_SALONS: Performance cache for salon listings
 *   - AURA_UI_PREFS     : Theme, selected city, last tab (UI state)
 *   - AURA_SEARCH_HIST  : Recent search queries (convenience)
 *
 * NEVER stored in localStorage:
 *   - Passwords or auth secrets
 *   - Full user profiles / user database
 *   - Booking records
 *   - Face scan / diagnostics reports
 *   - Payment info
 *   - Sensitive personal data
 * ============================================================
 */

// In-memory fallback store for offline/demo mode.
// Simulates PostgreSQL behaviour when the backend is unreachable.
// This is intentionally stored in sessionStorage to survive page refreshes while remaining transient.
const getSessionMemoryStore = () => {
  try {
    const saved = sessionStorage.getItem('AURA_DEMO_DB');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load demo db from sessionStorage', e);
  }
  return {
    users: [
      {
        id: 'usr-001',
        name: 'Rohan Deshmukh',
        email: 'user@aura.io',
        password: 'user123',
        role: 'user',
        preferences: ['hair', 'facial'],
        favorites: [],
        diagnostics: {
          faceShape: 'Oval',
          acne: 'None (Clean)',
          hairline: 'Normal Taper'
        }
      },
      {
        id: 'usr-002',
        name: 'System Administrator',
        email: 'admin@aura.io',
        password: 'admin123',
        role: 'admin',
        preferences: ['hair', 'facial', 'spa', 'makeup'],
        favorites: [],
        diagnostics: null
      }
    ],
    bookings: []
  };
};

const _memoryStore = getSessionMemoryStore();

const saveSessionMemoryStore = () => {
  try {
    sessionStorage.setItem('AURA_DEMO_DB', JSON.stringify(_memoryStore));
  } catch (e) {
    console.warn('Failed to save demo db to sessionStorage', e);
  }
};


// Helper: strip password before returning user to the client
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
// UI PREFERENCE HELPERS  (localStorage is appropriate here)
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
// SEARCH HISTORY HELPERS  (convenience, non-critical)
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

/**
 * REST API Service for AURA Beauty OS.
 *
 * Every endpoint first attempts a real fetch to the PostgreSQL-backed REST API.
 * If the backend is unreachable, it falls back to an in-memory simulation.
 * localStorage is NEVER used for sensitive or business-critical data.
 */
export const api = {

  // ───── 1. Authenticate user session ─────
  login: async (email, password, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      if (response.ok) {
        const data = await response.json();
        // Store only the session token — user profile lives in React state
        if (data.token) {
          localStorage.setItem('AURA_JWT_TOKEN', data.token);
        }
        // Never store raw user object with password
        return _sanitizeUser(data.user);
      }
      throw new Error(`Auth failed with status ${response.status}`);
    } catch (err) {
      console.warn('[AURA] POST /api/auth/login failed — using in-memory fallback:', err.message);

      // In-memory simulation: NO localStorage for user data
      const matchedUser = _memoryStore.users.find(
        u =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password &&
          u.role === role
      );

      if (!matchedUser) {
        throw new Error('Invalid credentials or incorrect role. Please check and try again.');
      }

      // Issue a demo token with email encoded in payload
      const payload = { email: email.toLowerCase() };
      const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify(payload));
      localStorage.setItem('AURA_JWT_TOKEN', dummyToken);

      // Return sanitized user — no password ever leaves this function
      return _sanitizeUser(matchedUser);
    }
  },

  // ───── 2. Register user account ─────
  signup: async (name, email, password, role, preferences) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, preferences })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('AURA_JWT_TOKEN', data.token);
        }
        return _sanitizeUser(data.user);
      }
      throw new Error(`Registration failed with status ${response.status}`);
    } catch (err) {
      console.warn('[AURA] POST /api/auth/signup failed — using in-memory fallback:', err.message);

      // In-memory simulation: user data stays in memory, NOT in localStorage
      if (_memoryStore.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('This email is already registered. Please sign in instead.');
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password, // kept in memory only for this session — never written to localStorage
        role,
        preferences,
        favorites: [],
        diagnostics: null
      };

      _memoryStore.users.push(newUser);
      saveSessionMemoryStore();

      const payload = { email: email.toLowerCase() };
      const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify(payload));
      localStorage.setItem('AURA_JWT_TOKEN', dummyToken);

      return _sanitizeUser(newUser);
    }
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
        return await response.json();
      }
      throw new Error(`Fetch salons failed with status ${response.status}`);
    } catch (err) {
      console.warn('[AURA] GET /api/salons failed — using LCG database fallback:', err.message);

      // Salon listing cache is acceptable in localStorage (non-sensitive, purely for perf)
      let cachedSalons = null;
      try {
        const saved = localStorage.getItem('AURA_CACHED_SALONS');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length === size) {
            cachedSalons = parsed;
          }
        }
      } catch (e) {
        console.error('Failed to parse cached salons:', e);
      }

      if (!cachedSalons) {
        cachedSalons = generateDatabase(size);
        try {
          localStorage.setItem('AURA_CACHED_SALONS', JSON.stringify(cachedSalons));
        } catch (e) {
          console.warn('[AURA] Could not cache salons (storage limit hit):', e.message);
        }
      }

      return cachedSalons.filter(salon => {
        const matchesCity = !city || salon.city.toLowerCase() === city.toLowerCase();
        if (!matchesCity) return false;

        const matchesSearch =
          !search ||
          salon.name.toLowerCase().includes(search.toLowerCase()) ||
          salon.description.toLowerCase().includes(search.toLowerCase()) ||
          salon.address.toLowerCase().includes(search.toLowerCase()) ||
          salon.services.some(service =>
            service.name.toLowerCase().includes(search.toLowerCase())
          );
        if (!matchesSearch) return false;

        const matchesCategory =
          !category ||
          category === 'all' ||
          salon.services.some(service => service.category === category);
        return matchesCategory;
      });
    }
  },

  // ───── 4. Sync updated salon catalog ─────
  saveSalonsState: async (salons) => {
    // Update the performance cache (salon data is non-sensitive)
    try {
      localStorage.setItem('AURA_CACHED_SALONS', JSON.stringify(salons));
    } catch (e) {
      console.warn('[AURA] Could not update salon cache (storage limit hit):', e.message);
    }
    try {
      await fetch(`${API_BASE_URL}/salons/sync`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ salons })
      });
    } catch (err) {
      console.debug('[AURA] Salon sync to backend failed — cached locally.', err.message);
    }
  },

  // ───── 5. Create booking (PostgreSQL primary) ─────
  createBooking: async (bookingPayload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingPayload)
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Booking submission failed with status ${response.status}`);
    } catch (err) {
      console.warn('[AURA] POST /api/bookings failed — in-memory fallback:', err.message);
      
      let email = 'user@aura.io';
      const token = localStorage.getItem('AURA_JWT_TOKEN');
      if (token && token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.')) {
        try {
          const payloadPart = token.split('.')[1];
          const payload = JSON.parse(atob(payloadPart));
          email = payload.email || 'user@aura.io';
        } catch (e) {
          console.error(e);
        }
      }

      const newB = {
        ...bookingPayload,
        userEmail: email,
        status: 'Confirmed',
        canReview: false
      };
      
      _memoryStore.bookings.push(newB);
      saveSessionMemoryStore();
      
      return newB;
    }
  },

  // ───── 6. Join Waitlist (PostgreSQL primary) ─────
  joinWaitlist: async (waitlistPayload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/waitlist`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(waitlistPayload)
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Waitlist submission failed with status ${response.status}`);
    } catch (err) {
      console.warn('[AURA] POST /api/waitlist failed — in-memory fallback:', err.message);
      
      let email = 'user@aura.io';
      const token = localStorage.getItem('AURA_JWT_TOKEN');
      if (token && token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.')) {
        try {
          const payloadPart = token.split('.')[1];
          const payload = JSON.parse(atob(payloadPart));
          email = payload.email || 'user@aura.io';
        } catch (e) {
          console.error(e);
        }
      }

      const newW = {
        ...waitlistPayload,
        userEmail: email,
        status: 'Waitlisted',
        canReview: false
      };

      _memoryStore.bookings.push(newW);
      saveSessionMemoryStore();

      return newW;
    }
  },

  // ───── 6.5. Update Booking Status (PostgreSQL primary) ─────
  updateBookingStatus: async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Updating booking failed with status ${response.status}`);
    } catch (err) {
      console.warn('[AURA] PATCH /api/bookings failed — in-memory fallback:', err.message);
      
      const bIdx = _memoryStore.bookings.findIndex(b => b.id === bookingId);
      if (bIdx !== -1) {
        _memoryStore.bookings[bIdx] = {
          ..._memoryStore.bookings[bIdx],
          status: newStatus,
          canReview: newStatus === 'Completed'
        };
        saveSessionMemoryStore();
      }

      return { id: bookingId, status: newStatus };
    }
  },

  // ───── 7. Save Diagnostics (PostgreSQL primary) ─────
  saveDiagnostics: async (email, reportData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/diagnostics`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, diagnostics: reportData })
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Saving diagnostics failed with status ${response.status}`);
    } catch (err) {
      console.warn('[AURA] PUT /api/users/diagnostics failed — in-memory fallback:', err.message);

      const userIdx = _memoryStore.users.findIndex(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      if (userIdx !== -1) {
        _memoryStore.users[userIdx] = {
          ..._memoryStore.users[userIdx],
          diagnostics: reportData
        };
        saveSessionMemoryStore();
      }

      return reportData;
    }
  },

  // ───── 8. Get Current User Profile (session restoration) ─────
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        return _sanitizeUser(data.user);
      }
      throw new Error(`Fetch profile failed with status ${response.status}`);
    } catch (err) {
      console.warn('[AURA] GET /api/auth/me failed — using in-memory fallback:', err.message);
      
      const token = localStorage.getItem('AURA_JWT_TOKEN');
      if (!token) return null;

      let email = null;
      if (token === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyTokenForAuraOS') {
        email = 'user@aura.io';
      } else if (token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.')) {
        try {
          const payloadPart = token.split('.')[1];
          const payload = JSON.parse(atob(payloadPart));
          email = payload.email;
        } catch (e) {
          console.error('Failed to parse dummy token payload', e);
        }
      }

      if (!email) return null;

      const matchedUser = _memoryStore.users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      return _sanitizeUser(matchedUser);
    }
  },

  // ───── 9. Get Bookings ─────
  getBookings: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings?email=${email}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Fetch bookings failed with status ${response.status}`);
    } catch (err) {
      console.warn('[AURA] GET /api/bookings failed — using in-memory fallback:', err.message);
      return _memoryStore.bookings.filter(
        b => b.userEmail && b.userEmail.toLowerCase() === email.toLowerCase()
      );
    }
  },

  // ───── 10. Get Favorites ─────
  getFavorites: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites?email=${email}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Fetch favorites failed with status ${response.status}`);
    } catch (err) {
      console.warn('[AURA] GET /api/users/favorites failed — using in-memory fallback:', err.message);
      const user = _memoryStore.users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      return user ? (user.favorites || []) : [];
    }
  },

  // ───── 11. Toggle Favorite ─────
  toggleFavorite: async (email, salonId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, salonId })
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Toggle favorite failed with status ${response.status}`);
    } catch (err) {
      console.warn('[AURA] POST /api/users/favorites failed — using in-memory fallback:', err.message);
      
      const userIdx = _memoryStore.users.findIndex(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      if (userIdx !== -1) {
        const user = _memoryStore.users[userIdx];
        const userFavs = user.favorites || [];
        const updatedFavs = userFavs.includes(salonId)
          ? userFavs.filter(id => id !== salonId)
          : [...userFavs, salonId];
        _memoryStore.users[userIdx] = {
          ...user,
          favorites: updatedFavs
        };
        saveSessionMemoryStore();
        return updatedFavs;
      }
      return [];
    }
  }
};
