# Aura Beauty OS – Personal AI Beauty Consultant & Operating System

[![Production Status](https://img.shields.io/badge/GitHub%20Pages-Deployed-success?logo=github&logoColor=white&color=181717)](https://varuunn15.github.io/salon-website-for-superxgen/)
[![Vite Version](https://img.shields.io/badge/Vite-8.0-blue?logo=vite)](https://vite.dev)
[![React Version](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev)
[![Vanilla CSS](https://img.shields.io/badge/Styling-Custom%20Vanilla%20CSS-ffd700)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-gold)](file:///C:/Users/Asus/Downloads/salon-website-for-superxgen-main/LICENSE)

Aura is a premium, next-generation **AI-First Beauty Operating System** designed to transform the traditional beauty salon booking experience into a hyper-personalized styling and wellness journey. Leveraging **Three.js/WebGL** for interactive 3D visualizations, **Leaflet** for smart mapping, and browser-native AI diagnostics, Aura serves as a unified digital ecosystem for clients, stylists, and salon administrators.

- **Production Live URL**: [https://varuunn15.github.io/salon-website-for-superxgen/](https://varuunn15.github.io/salon-website-for-superxgen/)
- **Architecture Documentation**: [ARCHITECTURE.md](file:///C:/Users/Asus/Downloads/salon-website-for-superxgen-main/ARCHITECTURE.md)
- **API Documentation**: [API.md](file:///C:/Users/Asus/Downloads/salon-website-for-superxgen-main/API.md)

---

## 📖 Project Overview

### Problem Statement
Traditional salon booking platforms function as static directories. Patrons are forced to browse service lists without knowing if a specific haircut fits their face shape, if a skincare package is within their budget, or how far the nearest location is. Simultaneously, salon managers lack clean, analytical intelligence about repeat customer rates, operational health scorecards, and live waitlists.

### Solution
**Aura Beauty OS** solves this by establishing a premium **Apple- & Tesla-level** dark-mode digital hub centered around a **3D Holographic AI Assistant**. The assistant reacts to user diagnostics, dynamically compiles optimized budget bundles, tracks nearby salon waitlists on an interactive map, and presents business operators with a comprehensive "Salon Health Score" diagnostic dashboard.

---

## ✨ Core Features

### 1. 3D Holographic AI Assistant (`AuraAssistant.jsx`)
- Interactive **Three.js/WebGL** face wireframe mesh.
- Dynamic states: Breathing (idle), Pulsating wave (listening), Shader noise (thinking), and Mouth scale shifting (speaking).
- Voice recognition and Web Speech synthesis for hands-free consults.

### 2. AI Face Diagnostics Scanner (`FaceAnalysis.jsx`)
- Camera video streams or file uploads overlayed with green scan-lines and cybernetic mesh node points.
- Automatically analyzes and logs face shapes, skin tones, acne grades, and textures.
- Suggests styling recommendations and lets users book matched packages directly.

### 3. AI Budget Optimizer (`BudgetOptimizer.jsx`)
- Formulates optimal combinations of services (e.g. hair cut, facials, spa treatments) under a user's strict financial threshold.
- Interactive sliders and instant single-click cart injection.

### 4. Interactive Location Map (`LocationMap.jsx`)
- Custom Leaflet integration styled with dark-mode overlays.
- Displays live queue wait-times, ETAs, and distance in kilometers based on the user's mock coordinate position.

### 5. Tesla-Style Salon Health Scorecard (`PartnerDashboard.jsx`)
- Visualizes key business health metrics with circular SVG diagnostics.
- Tracks *Customer Satisfaction (96%)*, *Cancellation Rate (2%)*, and *Repeat Customers (81%)* with premium glowing status indicators.

### 6. User & Admin Session Authentication (`AuthModal.jsx`)
- Role switches for Customer and Administrator workflows.
- Restructures header links dynamically to hide internal pages from guests, ensuring an uncluttered UI.
- Intercepts checkouts for guests, prompting secure profile creation.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Core** | React 19, Javascript (ES6) | Application reactivity and render scheduling |
| **Styling** | Custom CSS (Variables, HSL Palettes) | Dark luxury styling, glassmorphic filters, and layouts |
| **Graphics** | Three.js (WebGL Renderer) | Cyber-Face 3D holographic wireframe renderer |
| **Mapping** | Leaflet JS, OpenStreetMap API | Live mapping, distance scales, and waitlist routing |
| **Backend** | Node.js + Express | REST API server, authentication, business logic |
| **Database** | PostgreSQL | Persistent storage for users, bookings, diagnostics, salons |
| **Auth** | JWT (JSON Web Tokens) | Stateless session authentication |
| **Client Cache** | localStorage (JWT + UI prefs only) | Non-sensitive UX state, performance cache |
| **Icons** | Lucide React | Clean, scalable vector symbols |
| **Build Engine** | Vite 8.0, Rollup | High-speed hot module replacement and bundle compression |

---

## 📂 Folder Structure

```
salon-website-for-superxgen-main/
├── dist/                     # Optimized production bundle outputs
├── public/                   # Static assets (maps, models, global icons)
├── src/
│   ├── assets/               # Local images and CSS stylesheets
│   ├── components/           # Modular component architecture
│   │   ├── AIConcierge.jsx   # Legacy chat interface
│   │   ├── AdminAnalytics.jsx# Financial spreadsheets and charts
│   │   ├── AuraAssistant.jsx # Three.js canvas & speech agent
│   │   ├── AuthModal.jsx     # User & admin credentials modal
│   │   ├── BudgetOptimizer.jsx# Budget combination formulator
│   │   ├── Cart.jsx          # Shopping drawer sidebar
│   │   ├── CheckoutModal.jsx # Invoice calculations and Spin-the-Wheel
│   │   ├── DemoPanel.jsx     # Hackathon walkthrough logs
│   │   ├── FaceAnalysis.jsx  # Cybernetic selfie mesh scanner
│   │   ├── Header.jsx        # Role-based navigation and profile dropdown
│   │   ├── Hero.jsx          # Frontpage branding banner
│   │   ├── LocationMap.jsx   # Leaflet GIS client
│   │   ├── PartnerDashboard.jsx# Business Center & circular SVG diagnostics
│   │   ├── ReferralHub.jsx   # Invite ledgers and sharing links
│   │   ├── SalonCard.jsx     # 3D coordinates tilt card
│   │   ├── SalonDetails.jsx  # Stylist calendar grid & reviews
│   │   ├── ThreeCanvas.jsx   # WebGL container helpers
│   │   └── UserDashboard.jsx # Appointment tracker & AI Beauty Profile
│   ├── data/
│   │   ├── dataGenerator.js  # LCG seed generator (2,200+ Indian salons)
│   │   └── mockData.js       # Base presets and social banner feed
│   ├── App.jsx               # Global state router
│   ├── App.css               # Components layouts styles
│   ├── index.css             # Matte carbon luxury design theme & design tokens
│   └── main.jsx              # DOM client mounting point
├── index.html                # Entry point HTML document
├── package.json              # Dependencies and scripts definitions
├── vite.config.js            # Bundler configurations
├── ARCHITECTURE.md           # Visual module breakdown & states
├── API.md                    # LocalStorage API specs
├── CONTRIBUTING.md           # Developer code guidelines & git policies
└── SECURITY.md               # Safety & secure disclosures policies
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (Version >= 18.0.0)
- npm (Version >= 9.0.0)

### Step-by-Step Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/username/salon-website-for-superxgen.git
   cd salon-website-for-superxgen
   ```
2. **Install Packages**:
   ```bash
   npm install
   ```
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.
4. **Compile Production Bundle**:
   ```bash
   npm run build
   ```
   The production-ready assets will be written to the `/dist` directory.

---

## 🌐 Environment & Deployment Setup

### Vercel Deployment
To deploy the application to Vercel instantly using the CLI:
1. Log in to Vercel:
   ```bash
   npx vercel login
   ```
2. Deploy directly:
   ```bash
   npx vercel --prod --yes
   ```

---

## 🔮 Future Roadmap

- [ ] **Offline PWA support**: Local caching ofLeaflet tiles and user session data for low-connectivity offline bookings.
- [ ] **Native Face Mesh Integration**: Replace simulated video scanners with TensorFlow.js Face Landmark models to draw real-time mesh structures.
- [ ] **Razorpay Sandbox Integration**: Wire dynamic invoice details into live test payments.

---

## 🤝 Contributing
Contributions are welcome. Please refer to our [CONTRIBUTING.md](file:///C:/Users/Asus/Downloads/salon-website-for-superxgen-main/CONTRIBUTING.md) for details on code styles, branching strategies, and semantic commit formats.

---

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](file:///C:/Users/Asus/Downloads/salon-website-for-superxgen-main/LICENSE) file for details.

---

## 💖 Acknowledgements
- Leaflet map tiles provided by OpenStreetMap.
- SVG geometry vectors inspired by high-end automotive styling guides (Tesla/Audi).
- Vector icons by Lucide React.
