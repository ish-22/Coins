# CoinPlus — Frontend Foundation

CoinPlus is a professional cryptocurrency trading platform interface built with **React**, **TypeScript**, **Tailwind CSS**, **React Router**, and **Lucide Icons**, implementing a premium black-and-gold design system.

---

## 🎨 Design System Palette

The application strictly adheres to the requested high-contrast institutional trading color system:

| Role | Variable | Hex / Value |
| :--- | :--- | :--- |
| **Main Background** | `bg-cp-bg` | `#080B12` |
| **Card Background** | `bg-cp-card` | `#101824` |
| **Elevated Background** | `bg-cp-elevated` | `#141E2B` |
| **Gold Brand** | `text-cp-gold` / `bg-cp-gold` | `#F0B93A` |
| **Primary Text** | `text-cp-text-primary` | `#F4F6FA` |
| **Secondary Text** | `text-cp-text-secondary` | `#98A5B7` |
| **Border Color** | `border-cp-border` | `#243042` |
| **Positive Green** | `text-cp-positive` | `#00D6A0` |
| **Negative Red** | `text-cp-negative` | `#FF5364` |

---

## 📁 Architecture & Folder Structure

```
src/
├── assets/                  # SVG assets & logos
│   ├── logo.svg
│   └── favicon.svg
├── components/              # Modular UI components
│   ├── common/
│   │   ├── Badge/           # Status signals with pulse dots
│   │   ├── Button/          # Primary gold, trading buy/sell, outline, sizes
│   │   ├── Card/            # Default, elevated, and gold glow cards
│   │   ├── Input/           # Inputs with crypto suffixes (USDT, BTC) & selects
│   │   ├── Logo/            # Geometric CoinPlus logo component
│   │   └── Typography/      # Responsive headings, body, and tabular mono tickers
│   └── index.ts
├── layouts/                 # Header, Footer, Sidebar, MainLayout
│   ├── Header.tsx           # Sticky nav with live market ticker
│   ├── Footer.tsx           # Institutional compliance footer
│   ├── Sidebar.tsx          # Collapsible trading navigation
│   ├── MainLayout.tsx       # Root responsive layout wrapper
│   └── index.ts
├── mock/                    # Realistic market ticker data & statistics
│   ├── marketData.ts
│   └── index.ts
├── pages/                   # Application views
│   ├── DesignSystemPreview.tsx # Interactive design system foundation
│   ├── NotFound.tsx         # Placeholder 404
│   └── index.ts
├── routes/                  # React Router configuration
│   └── AppRoutes.tsx
├── styles/                  # Styling & design tokens
│   ├── globals.css          # Tailwind directives, dark scrollbars
│   └── theme.ts             # Programmatic design tokens & constants
├── types/                   # Shared TypeScript definitions
│   └── index.ts
├── utils/                   # Shared utilities (cn)
│   └── cn.ts
├── App.tsx                  # Root application component
└── main.tsx                 # DOM Entry point
```

---

## 🚀 Running the Project

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📌 Status
**Step 1 Complete**: Foundation and design system established. Individual pages (Spot Trading, Futures, Portfolio, Orders) are deferred to subsequent development steps.
