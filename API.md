# Local Mock API & LocalStorage Interface – Aura OS

This document outlines the interfaces, parameters, and return types for the mock data generation services, booking operations, and local state synchronizations.

---

## 🏗️ LCG Database Generation Service (`dataGenerator.js`)

Aura uses a deterministic Linear Congruential Generator (LCG) to generate a massive, consistent dataset of 2,200+ salons across Indian metropolitan cities without requesting external HTTP resources.

### Function Signature:
```javascript
export function generateDatabase(scaleSize = 2200)
```

#### Parameters:
- `scaleSize` (number): The target size of the database. Supported scales: `500` (Fast testing), `2200` (Default Hackathon target), `5000` (High volume load tests).

#### Returns:
- `Array<Salon>`: List of generated salons with schema:
  - `id` (string): Unique identifier (`biz-1`, `biz-2`, etc.)
  - `name` (string): Curated salon/spa name.
  - `city` (string): Delhi, Bangalore, Mumbai, etc.
  - `rating` (number): Star rating (3.0 to 5.0).
  - `priceCategory` (string): `₹`, `₹₹`, `₹₹₹`
  - `services` (Array<Service>): List of catalog items.
  - `reviews` (Array<Review>): User ratings ledger.
  - `trending` (boolean): High-volume traffic flag.

---

## 🛍️ Checkout & Game Reward State Hooks

When booking, subtotal invoice checks apply discounts based on the user's Glowpass tier:

### Glowpass Tiers:
- **Glow**: 5% Discount
- **Glow+**: 10% Discount
- **Glow Elite**: 15% Discount

### Confirm Booking Callback:
```javascript
const handleConfirmBooking = (newBooking) => { ... }
```
#### Parameters:
- `newBooking` (Object):
  ```json
  {
    "id": "TX-A8F2K",
    "salonId": "biz-1",
    "salonName": "Aura Hair Studio",
    "city": "Bangalore",
    "customerName": "Rohan Deshmukh",
    "stylistName": "Vikram Rathore",
    "services": [{"name": "Precision Fade", "price": 1200}],
    "totalPrice": 1080, // Subtotal after tier discount
    "bookingDate": "2026-06-21",
    "bookingTime": "12:30 PM",
    "status": "Confirmed",
    "canReview": false,
    "couponWon": "FREE_WASH" // Added if spin wheel lands on reward
  }
  ```

---

## 🎭 Face Diagnostics Mapping Events

Invoked immediately after scan simulation or selfie upload completions:

### Function Signature:
```javascript
const handleSaveDiagnostics = (reportData) => { ... }
```

#### Parameters:
- `reportData` (Object): Contains scanned features (`metrics`) and recommendation strings (`recommendations`):
  ```json
  {
    "metrics": {
      "faceShape": "Square",
      "skinTone": "Wheatish / Olive",
      "acne": "Mild (Grade 1)"
    },
    "recommendations": {
      "bestHairstyle": "Slicked Back Undercut",
      "skincare": "Foaming cleanser + serum",
      "facial": "Brightening Medifacial"
    }
  }
  ```

---

## 📈 Ratings Recalculation Engine

Invoked when a customer leaves a rating review on completed appointments:

### Function Signature:
```javascript
const handleAddReview = (salonId, newReview, bookingId) => { ... }
```

#### Calculations:
Recalculates the salon average ratings dynamically:
$$\text{New Rating} = \frac{\sum(\text{Existing Ratings}) + \text{New Review Rating}}{\text{Total Reviews Count} + 1}$$
Updates the target record inside the global salons list, shifting stars, counts, and comments in real-time.
