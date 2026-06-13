# NewsPulse 📰⚡

> **Stay informed. Stay ahead.**

A modern, full-featured news aggregation web application built with React, TypeScript, and Vite. Inspired by Google News, Flipboard, and Inshorts — with a clean editorial aesthetic.

---



## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd newspulse
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_NEWS_API_KEY=your_newsapi_key_here
```

Get a free API key at **[newsapi.org](https://newsapi.org)** (free tier: 100 req/day, development only).

> **No API key?** The app runs in **Demo Mode** with sample articles so you can explore the full UI.

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Folder Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navbar.tsx          # Sticky navbar with search
│   ├── NewsCard.tsx         # Article card (3 sizes)
│   ├── HeroNewsCard.tsx     # Breaking news hero
│   ├── CategoryFilter.tsx   # Category tab bar
│   ├── Pagination.tsx       # Page navigation
│   ├── LoadingSkeleton.tsx  # Skeleton loading states
│   ├── ErrorState.tsx       # Error/empty states
│   └── AnalyticsCharts.tsx  # Recharts dashboard
│
├── pages/              # Route-level page components
│   ├── HomePage.tsx         # Hero + headlines grid
│   ├── SearchPage.tsx       # Full-text search + filters
│   ├── TrendingPage.tsx     # Trending topics
│   ├── CategoriesPage.tsx   # Browse by category
│   ├── BookmarksPage.tsx    # Saved articles
│   ├── ArticleDetailsPage.tsx # Full article view + AI
│   ├── SourcesPage.tsx      # News source browser
│   └── AnalyticsPage.tsx    # Dashboard analytics
│
├── hooks/              # Custom React hooks
│   └── index.ts             # useTopHeadlines, useSearch, useBookmarks, etc.
│
├── services/           # API and storage layer
│   ├── newsApi.ts           # NewsAPI integration + mock data
│   └── storage.ts           # LocalStorage (bookmarks, recent, searches)
│
├── context/            # React contexts
│   └── ThemeContext.tsx     # Dark/light mode
│
├── types/              # TypeScript definitions
│   └── index.ts             # Article, Category, Bookmark types
│
├── utils/              # Utility functions
│   └── index.ts             # formatDate, cn, debounce, sharing, etc.
│
├── App.tsx             # Router + layout
├── main.tsx            # Entry point
└── index.css           # Tailwind + custom CSS
```

---

## 🔧 Tech Stack

- **React 18** + **TypeScript** — Component architecture
- **Vite 5** — Lightning-fast dev/build
- **Tailwind CSS 3** — Utility-first styling
- **TanStack Query v5** — Data fetching, caching, error handling
- **React Router v6** — Client-side routing
- **Recharts** — Analytics charts
- **Lucide React** — Icons
- **Axios** — HTTP client
- **date-fns** — Date formatting

---

## 🌐 NewsAPI Endpoints Used

| Endpoint | Usage |
|---|---|
| `GET /v2/top-headlines` | Home page, categories |
| `GET /v2/everything` | Search, trending topics |
| `GET /v2/sources` | News sources page |

**Important:** The free NewsAPI plan only works on `localhost`. For production, you need a paid plan or a backend proxy.

---

## 🤖 AI Summaries (Optional)

Article detail pages include an AI summary button powered by the **Claude API** (Anthropic).

When clicked, it sends the article title, description, and content to Claude and returns:
- A 2–3 sentence summary
- 3 key bullet points

The API call is made directly from the browser. For production, route this through a backend to protect your API key.

---

## 🏗️ Production Build

```bash
npm run build
```

Output in `dist/`. Deploy to:

### Vercel
```bash
npm i -g vercel
vercel
```

Set `VITE_NEWS_API_KEY` in Vercel dashboard → Project Settings → Environment Variables.

### Netlify
Drag the `dist/` folder into [app.netlify.com](https://app.netlify.com) or use the CLI.

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_NEWS_API_KEY` | Optional | NewsAPI key. App runs in demo mode without it. |

---

## 🎨 Design System

**Typography**
- Display: *Playfair Display* (serif) — headlines, titles
- Body: *DM Sans* (geometric sans-serif) — UI text

**Colors**
- Primary: Blue (`#2563eb` / `#60a5fa` dark)
- Accent: Orange (`#f97316` / `#fb923c` dark)
- Background: Slate-50 / `#0a0f1e` dark

**Theme**: Light + Dark mode, persisted in `localStorage`.

---

## 🔑 Key Implementation Details

### Caching
TanStack Query caches all API responses with a 5-minute stale time. Category switches and page changes reuse cached data.

### Demo Mode
When `VITE_NEWS_API_KEY` is absent or set to `"demo"`, the app serves 8 curated mock articles so the full UI is explorable without an API key.

### Bookmarks
Stored as JSON in `localStorage` under key `newspulse_bookmarks`. Persists across page refreshes and browser sessions.

### Recent Articles & Searches
- Last 10 viewed articles in `newspulse_recent`
- Last 8 searches in `newspulse_searches`

---

## 📄 License

MIT — build something great.
