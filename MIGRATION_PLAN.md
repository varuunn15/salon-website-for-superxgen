# Project Analysis & Migration Plan

## 1. Current Data Flow
The application currently operates as a frontend-only React/Vite application.
- API calls to `/api/...` are intercepted or fall back to an in-memory `_memoryStore` simulating a backend.
- Data structures are hardcoded in `src/data/mockData.js` (Salons, Services, Stylists, Initial Bookings).
- Business logic is handled directly in the frontend service layer (`src/services/api.js`).

## 2. Current Storage Locations
- **`sessionStorage` ('AURA_DEMO_DB')**: Simulates a transient PostgreSQL database (stores users and bookings) that survives page reloads.
- **`localStorage`**:
  - `AURA_JWT_TOKEN`: Dummy JWT tokens (e.g., base64 encoded emails).
  - `AURA_CACHED_SALONS`: Performance cache for the salon list.
  - `AURA_UI_PREFS`: Theme, city selection.
  - `AURA_SEARCH_HIST`: Recent search history.
- **In-Memory/Static Files**: `src/data/mockData.js` holds static salon listings, stylists, services, and default bookings.

## 3. Required Database Entities
To fully replace the mock storage, we need the following normalized tables:
1. **User**: id, name, email, password, role, preferences, diagnostics (JSON).
2. **Salon**: id, name, city, rating, reviewsCount, priceCategory, trending, description, address, workingHours, imageTheme.
3. **Stylist**: id, name, specialty, rating, salonId (FK).
4. **Service**: id, name, category, price, duration, salonId (FK).
5. **Review**: id, author, rating, date, comment, salonId (FK), userId (FK).
6. **Booking**: id, userId (FK), salonId (FK), stylistId (FK), bookingDate, bookingTime, status, totalPrice.
7. **BookingService**: Mapping table between Bookings and Services.
8. **Waitlist**: id, userId (FK), salonId (FK), status.
9. **Favorite**: Mapping between User and Salon.

## 4. Migration Strategy
1. **Database Setup**: Initialize a new `backend` directory. Set up Prisma and configure it to connect to Neon PostgreSQL via `DATABASE_URL` in `.env`.
2. **Schema Definition**: Create `schema.prisma` with the identified entities and relationships. Run migrations.
3. **Backend Architecture**: Build an Express.js server inside `backend/` following the Controller -> Service -> Repository -> Prisma architecture.
4. **Data Seeding**: Create a seed script based on `src/data/mockData.js` to populate the Neon database with initial salons, services, and stylists.
5. **API Refactoring**: Expose RESTful endpoints in the Express server for auth, salons, bookings, waitlist, diagnostics, and favorites.
6. **Frontend Integration**: Update `src/services/api.js` to remove the `_memoryStore` fallback. Make actual HTTP requests to the new local backend (e.g., `http://localhost:5000/api`).

## 5. Potential Risks
- **Data Shape Mismatches**: The frontend expects specific data structures (e.g., nested `services` and `stylists` inside a salon object). The Prisma queries must use `include` to match this exact shape to prevent UI breakage.
- **Authentication**: The current system uses dummy JWTs. A real JWT implementation requires handling tokens correctly on both ends and securing API routes.
- **CORS**: Moving to a real backend requires configuring CORS properly so the Vite dev server can communicate with the Express server.
