# 🏛️ WealthFlow — Wealth Management Platform

WealthFlow is a high-fidelity portfolio tracking and market intelligence platform. The application is built as a single responsive web application that natively supports both mobile and desktop screens.

---

## 💻 Tech Stack

- **Core Library**: React (v18.3.1)
- **Programming Language**: TypeScript (v5.5.4)
- **Routing Engine**: React Router DOM (v6.14.2)
- **Style System**: Vanilla CSS with modern custom property design systems (variables, micro-animations, glassmorphism, responsive grid systems)
- **Build Tool**: Vite (v5.4.1)

---

## 🎨 Design System & Aesthetics

WealthFlow is styled with a highly curated, premium finance theme:
- **Color Palette**: Slate and cobalt blue gradients, accented by emerald green (`#10b981`) for market gains/buy signals, amber gold (`#f59e0b`) for holds, and rose red (`#ef4444`) for market indices under pressure.
- **Glassmorphism & Depth**: Multi-layer shadows (`--shadow-premium`, `--radius-xl`) and crisp borders create distinct dashboard containers.
- **Micro-Animations**: Smooth cubic-bezier `fade-up` animations stagger elements on load to give a premium, responsive feel.
- **Mobile Responsive Design**: Breakpoints at `1024px`, `900px`, `640px`, and `480px` adjust margins, font sizes, and layout columns. All tabular data is wrapped in swipeable scrolling containers (`.table-responsive`).

---

## ⚙️ Features & Functionalities

### 1. Finance Professional Navigation
- **Desktop Navbar**: Clean horizontal layout grouping links into logical drop-down menus (e.g., **Investments** for Equities, Mutual Funds, Debt, International; and **Markets** for Global Indexes).
- **Mobile Side-Drawer**: Hamburger toggle opens an overlay panel with blur backdrop. Emojis and structured categories provide finger-friendly touch navigation.

### 2. Interactive SVG Portfolio Dashboard
- **Asset Allocation Donut Chart**: Rendered in pure SVG segments. Hovering over a segment dynamically isolates that asset class, updating the center value labels and adjusting segment widths on-hover.
- **Summary Metrics**: Displays net worth, YTD yield average gains, and allocation distributions.
- **Sandbox Metadata & Developer Insight**: Displays portfolio sandbox tags (`Account: Demo Portfolio`, `Data: Simulated Feed`) and includes developer insights highlighting that this growth portfolio is a simulated showcase built by Khavish to demonstrate responsive data binding.

### 3. Technical Market Signal Tiles
- **NSE Swing Trading Picks**: Displays top Indian stocks for short-term swing positions.
  - *Interactivity*: Filter holdings by signal (Strong Buy, Buy, Hold) and search by symbol or company name.
  - *Data representation*: Support/resistance thresholds, dynamic positive/negative trend colors, and hoverable rationale text.
- **Top Performers (30 Days)**: Displays monthly leaders. Includes automatic inline SVG **Sparklines** showing price movement trends.
- **Global Market Pulse**: Horizontal live ticker bar with live-pulsing indicators and cache controllers.

### 4. Dynamic Cache-Aware Data Service
- **24-Hour Cache**: Market data is cached locally in the browser's `localStorage` to avoid unnecessary API loading.
- **Cache Refreshing**: Automatically clears expired entries once daily, or manual force refresh via the 🔄 banner buttons.
- **Data Fallbacks**: Smoothly displays local mock backups in the event of an API or connection failure.

---

## 🏃 Run the Web Application

1. Navigate to the web folder:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the local development server:
   ```bash
   npm run dev
   ```

---

## 🚀 GitHub Pages Deployment

This workspace features an automated GitHub Actions deployment workflow:
- The pipeline (`.github/workflows/deploy-web.yml`) runs on push events to the default branch.
- It compiles TypeScript types, builds the production bundle in `web/dist`, and deploys it to GitHub Pages.
- Deployment target URL: `https://kurmaraopalli.github.io/wealth-management-app`.
