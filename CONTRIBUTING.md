# Contributing Guidelines – Aura Beauty OS

Thank you for contributing to **Aura Beauty OS**. To maintain high engineering standards, review and adhere to the guidelines documented below.

---

## 🌳 Branching Strategy

We follow a structured branch naming convention to isolate releases and prevent deployment stability issues:

- `main` $\rightarrow$ Production-ready branch. Direct commits are restricted.
- `develop` $\rightarrow$ Active development aggregation.
- `feature/*` $\rightarrow$ Individual features or diagnostic panels. Example: `feature/face-mesh`.
- `bugfix/*` $\rightarrow$ Bug fixes. Example: `bugfix/cart-subtotal`.
- `hotfix/*` $\rightarrow$ Urgent patches to production. Example: `hotfix/leaflet-ssl`.
- `release/*` $\rightarrow$ Release prep, version increment, and changelog updates.

---

## 💬 Commit Message Policy (Semantic Commits)

We enforce semantic commit formats to auto-generate changelogs and maintain clean timelines. 

### Format:
```
<type>(<scope>): <short description in lowercase>
```

### Approved Types:
- `feat`: A new feature (e.g. `feat(auth): integrate admin role logic`).
- `fix`: A bug fix (e.g. `fix(map): resolve coordinate drift`).
- `refactor`: Restructuring code without changing behavior (e.g. `refactor(three): optimize animation loops`).
- `docs`: README, API, or architecture file updates (e.g. `docs(readme): add environment setups`).
- `style`: Layout styling adjustments, CSS files (e.g. `style(index): refine gold gradients`).
- `perf`: Code changes improving memory or GPU load (e.g. `perf(three): unmount unused canvases`).

### Avoid:
- `update`
- `fixed bugs`
- `done`
- `final commit`

---

## 🎨 Coding Standards

### 1. Styling Discipline
- All layout changes, colors, glassmorphism filters, and animations must be written inside [index.css](file:///c:/Users/Asus/Downloads/salon-website-for-superxgen-main/src/index.css) using pre-defined design tokens.
- Do not dump inline styling or introduce Tailwind CSS utilities.

### 2. Component Layout
- Component sizes should not exceed **400 lines** where possible. Split complex cards and drawers into dedicated files in `src/components`.
- Always implement clean loading and empty state representations for grids and profiles.
- Keep all HTML semantic (`<nav>`, `<header>`, `<main>`) for clean screen-reader accessibility.
