# Stock Platform — Build Progress

> Modern full-stack stock analysis platform with a clean dark UI and responsive dashboard design.

**Last updated:** 2026-05-26  
**Overall status:** 🟢 Phase 1 complete — ready for Phase 2

---

## Project Snapshot

| Item | Status |
|------|--------|
| Next.js 16 + React 19 + Tailwind CSS 4 scaffold | ✅ Done |
| Global Recommended Stocks Dashboard | 🟡 Data wired (Phase 2 UI pending) |
| Israeli Stocks Dashboard (TASE) | 🟡 Data wired (Phase 3 UI pending) |
| Weekly auto-refresh pipeline | ✅ Done |
| Dark UI / responsive design system | ✅ Done |
| Financial data integrations | ✅ Done (Yahoo + optional Finnhub/Alpha Vantage) |
| AI-generated summaries | ⬜ Not started |

---

## Phase 0 — Foundation & Design System

- [x] Define app architecture (App Router routes, API layer, data caching strategy)
- [x] Set up dark theme tokens (colors, typography, spacing, card styles)
- [x] Build shared layout (header, nav, footer, mobile drawer)
- [x] Create reusable UI primitives (Card, Badge, Chip, Skeleton, SearchInput, FilterBar)
- [x] Add dashboard navigation (Global ↔ Israeli)
- [x] Configure environment variables (`.env.example` for API keys)
- [x] Set up error/loading/empty states

**Target routes**

| Route | Purpose |
|-------|---------|
| `/` | Landing / redirect to dashboards |
| `/global` | Global Recommended Stocks Dashboard |
| `/israel` | Israeli Stocks Dashboard (TASE) |

---

## Phase 1 — Data Layer & Integrations

### API sources (planned)

| Source | Use case | Status |
|--------|----------|--------|
| Yahoo Finance | Quotes, charts, sparklines | ✅ |
| Alpha Vantage | Fallback quotes | ✅ (optional API key) |
| Finnhub | Fallback quotes, logos | ✅ (optional API key) |
| MarketWatch | Recommendation context | ⬜ Phase 2+ |
| Seeking Alpha | Analyst sentiment | ⬜ Phase 4 |
| NASDAQ | Symbol validation, company info | ⬜ Phase 2+ |
| Reuters | Market news | ⬜ Phase 3 |
| TradingView | Chart widgets / sparklines | ⬜ Phase 2+ |
| TASE / Israeli data source | TASE tickers, Hebrew names | ✅ via Yahoo `.TA` symbols |

### Backend tasks

- [x] Create unified stock data types (`StockRecommendation`, `MarketSentiment`, `RiskLevel`, etc.)
- [x] Build server-side fetch layer with rate limiting and fallbacks
- [x] Normalize data from multiple providers into a single schema
- [x] Cache responses (Next.js `unstable_cache` + ISR, 7-day revalidation)
- [x] Implement weekly refresh job (Vercel Cron + `/api/cron/refresh`)
- [x] Persist last-updated timestamps per dashboard (`data/snapshots/`)
- [x] Add health check endpoint for data freshness (`/api/health`)

**API routes**

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/stocks/global` | GET | Global recommendations JSON |
| `/api/stocks/israel` | GET | Israeli recommendations JSON |
| `/api/health` | GET | Platform + provider health |
| `/api/cron/refresh` | GET/POST | Weekly refresh (Bearer `CRON_SECRET`) |

---

## Phase 2 — Global Recommended Stocks Dashboard

**Goal:** Display 20 recommended global stocks, refreshed weekly.

### Stock card requirements

Each card must include:

- [ ] Company name
- [ ] Company logo
- [ ] Stock ticker symbol
- [ ] Current market price
- [ ] Daily change percentage
- [ ] Mini price graph / sparkline chart
- [ ] Market sentiment (Bullish / Neutral / Bearish)
- [ ] AI-generated short summary (why recommended)
- [ ] Risk level (Low / Medium / High)
- [ ] Sector / category
- [ ] Link to read more about the company
- [ ] Source of recommendation
- [ ] Last updated timestamp

### Dashboard features

- [ ] Grid layout (responsive: 1 → 2 → 3–4 columns)
- [ ] Sort by sentiment, risk, sector, daily change
- [ ] Filter by sector and risk level
- [ ] Search by ticker or company name
- [ ] “Last refreshed” banner with next refresh date
- [ ] Manual refresh trigger (admin/dev only, optional)
- [ ] Loading skeletons while data fetches
- [ ] Empty state when no recommendations available

---

## Phase 3 — Israeli Stocks Dashboard (TASE)

**Goal:** Dedicated dashboard for Tel Aviv Stock Exchange stocks.

### Features checklist

- [ ] Top Israeli stock recommendations
- [ ] TASE ticker symbols (e.g. `TA-35`, `TASE:XXXX`)
- [ ] Hebrew + English company name support (i18n / bilingual display)
- [ ] Price chart (daily + weekly views)
- [ ] Daily and weekly performance metrics
- [ ] Israeli market news feed
- [ ] Market sentiment per stock and overall
- [ ] Sector filters
- [ ] Search (Hebrew and English)

### TASE-specific tasks

- [ ] Identify reliable TASE data provider (official TASE API, Finnhub, or aggregator)
- [ ] Map TASE symbols to global data provider symbols where needed
- [ ] RTL-friendly layout for Hebrew text where appropriate
- [ ] Currency display (ILS / ₪)

---

## Phase 4 — AI & Sentiment Engine

- [ ] Define prompt templates for stock recommendation summaries
- [ ] Integrate LLM provider (OpenAI / Anthropic / local) for weekly batch summaries
- [ ] Derive sentiment from news + analyst ratings + price action
- [ ] Assign risk level from volatility, beta, sector, and fundamentals
- [ ] Store generated content with source attribution
- [ ] Regenerate summaries on weekly refresh (not on every page load)

---

## Phase 5 — Weekly Auto-Refresh

- [ ] Schedule job: every 7 days (document exact day/time, e.g. Sunday 06:00 UTC)
- [ ] Refresh global recommendations (top 20)
- [ ] Refresh Israeli recommendations
- [ ] Re-fetch prices, charts, news, and sentiment
- [ ] Regenerate AI summaries
- [ ] Log refresh success/failure
- [ ] Surface “Last updated” on each dashboard
- [ ] Alert on failed refresh (optional: email / webhook)

---

## Phase 6 — Polish, Performance & Deploy

- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Accessibility audit (contrast, keyboard nav, ARIA labels)
- [ ] SEO metadata per dashboard
- [ ] Image optimization for company logos
- [ ] Lighthouse performance pass
- [ ] Error monitoring (Sentry or similar)
- [ ] Production deployment (Vercel recommended)
- [ ] Document setup in README

---

## Current Codebase State

```
stock_platform/
├── .env.example
├── vercel.json                 ✅ Weekly cron (Sun 06:00 UTC)
├── data/snapshots/             ✅ Local JSON persistence (gitignored)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── stocks/global/route.ts
│   │   │   ├── stocks/israel/route.ts
│   │   │   ├── health/route.ts
│   │   │   └── cron/refresh/route.ts
│   │   ├── global/   (page, loading, error)
│   │   └── israel/   (page, loading, error)
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── dashboard/ (DashboardFilters, DashboardStatusBanner)
│   └── lib/
│       ├── cache/tags.ts
│       ├── data/universe.ts
│       ├── providers/ (yahoo-finance, finnhub, alpha-vantage)
│       ├── services/ (dashboard, recommendations, normalize, rate-limiter)
│       ├── storage/snapshot-store.ts
│       └── types/stock.ts
├── package.json
└── progress.md
```

**Not yet created:** full stock card grid (Phase 2), TASE news feed (Phase 3), AI summaries (Phase 4).

---

## Suggested Build Order

1. **Phase 0** — Dark UI shell + navigation
2. **Phase 1** — Yahoo Finance + Finnhub integration (MVP data)
3. **Phase 2** — Global dashboard with mock → live data
4. **Phase 3** — Israeli dashboard + TASE data
5. **Phase 4** — AI summaries + sentiment
6. **Phase 5** — Weekly cron refresh
7. **Phase 6** — Polish and deploy

---

## Environment Variables (planned)

```env
# Market data
ALPHA_VANTAGE_API_KEY=
FINNHUB_API_KEY=

# AI summaries
OPENAI_API_KEY=

# Optional
CRON_SECRET=
DATABASE_URL=
```

---

## Notes & Decisions

| Topic | Decision | Date |
|-------|----------|------|
| Framework | Next.js 16 App Router | 2026-05-26 |
| Styling | Tailwind CSS 4 | 2026-05-26 |
| Refresh cadence | Weekly | TBD |
| Primary quote provider | Yahoo Finance v8 chart API | 2026-05-26 |
| TASE data provider | Yahoo Finance (`.TA` symbols, ILS normalization) | 2026-05-26 |
| Database | TBD (optional for v1) | TBD |

---

## Changelog

| Date | Milestone |
|------|-----------|
| 2026-05-26 | Project scaffold created (`create-next-app`) |
| 2026-05-26 | `progress.md` created — build tracking initialized |
| 2026-05-26 | Phase 0 complete — dark UI shell, routes, components, env template |
| 2026-05-26 | Phase 1 complete — providers, API routes, caching, cron, health |
