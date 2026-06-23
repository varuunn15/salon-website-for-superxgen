# Database Setup & Deployment

## Environment Variables
Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@hostname.neon.tech/dbname?sslmode=require"
JWT_SECRET="aura_super_secret_jwt_key_please_change_in_production"
```

## Setup Instructions

1. **Install Dependencies**
   Navigate to the `backend/` folder and run:
   ```bash
   cd backend
   npm install
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Run Migrations**
   Make sure you have inserted your valid Neon `DATABASE_URL` in the `.env` file before running:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The backend will start at `http://localhost:5000`.

5. **Start Frontend**
   In another terminal, go to the root folder and run:
   ```bash
   npm run dev
   ```

## Database Structure (Prisma Models)

- **User**: Core user data, auth, preferences, diagnostics.
- **Salon**: Salon catalog, address, rating, trending status.
- **Stylist**: Stylists associated with specific salons (Foreign Key to Salon).
- **Service**: Salon services, duration, category, price (Foreign Key to Salon).
- **Booking**: User bookings linked to Salon and optional Stylist. Stores total price, status, date/time.
- **BookingService**: Many-to-many relationship table linking Bookings to Services.
- **Review**: User reviews associated with a Salon.
- **Waitlist**: Waitlist entries for users trying to book at a full salon.

## Deployment to Neon PostgreSQL

1. Sign up/Log in to [Neon](https://neon.tech/).
2. Create a new project and PostgreSQL database.
3. Copy the **Connection String** provided by Neon.
4. Add `?sslmode=require` to the end of the connection string if not already present.
5. Paste it as `DATABASE_URL` in your `.env` (or environment variables in your hosting provider like Vercel/Render).
6. Run `npx prisma db push` or `npx prisma migrate deploy` in your production environment to apply the schema.
