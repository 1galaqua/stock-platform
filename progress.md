# Stock Platform — Build Progress

> Modern full-stack stock analysis platform with a clean dark UI and responsive dashboard design.

**Last updated:** 2026-05-26  
**Overall status:** 🟢 Phase 6 complete — platform ready for production

---

## Project Snapshot

| Item | Status |
|------|--------|
| Next.js 16 + React 19 + Tailwind CSS 4 scaffold | ✅ Done |
| Global Recommended Stocks Dashboard | ✅ Done |
| Israeli Stocks Dashboard (TASE) | ✅ Done |
| Weekly auto-refresh pipeline | ✅ Done (cron, logs, alerts, status API) |
| Dark UI / responsive design system | ✅ Done |
| Financial data integrations | ✅ Done (Yahoo + optional Finnhub/Alpha Vantage) |
| AI-generated summaries | ✅ Done |

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
| `/api/refresh/status` | GET | Schedule, meta, recent refresh logs |

---

## Phase 2 — Global Recommended Stocks Dashboard

**Goal:** Display 20 recommended global stocks, refreshed weekly.

### Stock card requirements

Each card must include:

- [x] Company name
- [x] Company logo
- [x] Stock ticker symbol
- [x] Current market price
- [x] Daily change percentage
- [x] Mini price graph / sparkline chart
- [x] Market sentiment (Bullish / Neutral / Bearish)
- [x] AI-generated short summary (why recommended)
- [x] Risk level (Low / Medium / High)
- [x] Sector / category
- [x] Link to read more about the company
- [x] Source of recommendation
- [x] Last updated timestamp

### Dashboard features

- [x] Grid layout (responsive: 1 → 2 → 3–4 columns)
- [x] Sort by sentiment, risk, sector, daily change
- [x] Filter by sector and risk level
- [x] Search by ticker or company name
- [x] “Last refreshed” banner with next refresh date
- [x] Manual refresh trigger (admin/dev only, optional)
- [x] Loading skeletons while data fetches
- [x] Empty state when no recommendations available

---

## Phase 3 — Israeli Stocks Dashboard (TASE)

**Goal:** Dedicated dashboard for Tel Aviv Stock Exchange stocks.

### Features checklist

- [x] Top Israeli stock recommendations
- [x] TASE ticker symbols (e.g. `TA-35`, `TASE:XXXX`)
- [x] Hebrew + English company name support (i18n / bilingual display)
- [x] Price chart (daily + weekly views)
- [x] Daily and weekly performance metrics
- [x] Israeli market news feed
- [x] Market sentiment per stock and overall
- [x] Sector filters
- [x] Search (Hebrew and English)

### TASE-specific tasks

- [x] Identify reliable TASE data provider (official TASE API, Finnhub, or aggregator)
- [x] Map TASE symbols to global data provider symbols where needed
- [x] RTL-friendly layout for Hebrew text where appropriate
- [x] Currency display (ILS / ₪)

---

## Phase 4 — AI & Sentiment Engine

- [x] Define prompt templates for stock recommendation summaries
- [x] Integrate LLM provider (OpenAI / Anthropic / local) for weekly batch summaries
- [x] Derive sentiment from news + analyst ratings + price action
- [x] Assign risk level from volatility, beta, sector, and fundamentals
- [x] Store generated content with source attribution
- [x] Regenerate summaries on weekly refresh (not on every page load)

---

## Phase 5 — Weekly Auto-Refresh

- [x] Schedule job: every 7 days (document exact day/time, e.g. Sunday 06:00 UTC)
- [x] Refresh global recommendations (top 20)
- [x] Refresh Israeli recommendations
- [x] Re-fetch prices, charts, news, and sentiment
- [x] Regenerate AI summaries
- [x] Log refresh success/failure
- [x] Surface “Last updated” on each dashboard
- [x] Alert on failed refresh (optional: email / webhook)

---

## Phase 6 — Polish, Performance & Deploy

- [x] Responsive testing (mobile, tablet, desktop)
- [x] Accessibility audit (contrast, keyboard nav, ARIA labels)
- [x] SEO metadata per dashboard
- [x] Image optimization for company logos
- [x] Lighthouse performance pass
- [x] Error monitoring (Sentry or similar)
- [x] Production deployment (Vercel recommended)
- [x] Document setup in README

---

## Current Codebase State

```
stock_platform/
├── .env.example
├── vercel.json                 ✅ Weekly cron (Sun 06:00 UTC)
├── data/snapshots/             ✅ Local JSON persistence (gitignored)
├── src/
│   ├── app/
│   │   ├── sitemap.ts, robots.ts
│   │   ├── api/monitoring/report/route.ts
│   │   │   ├── stocks/global/route.ts
│   │   │   ├── stocks/israel/route.ts
│   │   │   ├── health/route.ts
│   │   │   ├── refresh/status/route.ts
│   │   │   └── cron/refresh/route.ts
│   │   ├── global/   (page, loading, error)
│   │   └── israel/   (page, loading, error)
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── dashboard/ (GlobalDashboard, IsraelDashboard, TaseStockCard, MarketNewsFeed, MarketSentimentOverview, …)
│   └── lib/
│       ├── seo/ (site, metadata)
│       ├── monitoring/ (errors, client)
│   └── instrumentation.ts
├── README.md                   ✅ Setup, deploy, API docs
├── vercel.json                 ✅ Cron + API cache headers
│       ├── cache/tags.ts
│       ├── data/universe.ts
│       ├── providers/ (yahoo-finance, finnhub, alpha-vantage)
│       ├── ai/ (prompts, openai)
│       ├── services/ (refresh, refresh-alerts, ai-enrichment, …)
│       ├── storage/ (snapshot-store, refresh-log-store)
│       └── types/stock.ts
├── package.json
└── progress.md
```

**Platform build complete.** Optional future work: Sentry SDK, email alerts, persistent DB.

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
REFRESH_ALERT_WEBHOOK_URL=
DATABASE_URL=
```

---

## Notes & Decisions

| Topic | Decision | Date |
|-------|----------|------|
| Framework | Next.js 16 App Router | 2026-05-26 |
| Styling | Tailwind CSS 4 | 2026-05-26 |
| Refresh cadence | Weekly — Sunday 06:00 UTC (`0 6 * * 0`) | 2026-05-26 |
| Primary quote provider | Yahoo Finance v8 chart API | 2026-05-26 |
| AI summaries | OpenAI (`gpt-4o-mini` default) with rule-based fallback | 2026-05-26 |
| Sentiment model | Weighted price + news keywords + Finnhub analyst | 2026-05-26 |
| Risk model | Volatility + beta + sector + fundamentals | 2026-05-26 |
| TASE data provider | Yahoo Finance (`.TA` symbols, ILS normalization) | 2026-05-26 |
| Database | Optional — file-based snapshots for v1 | 2026-05-26 |
| Error monitoring | Webhook + instrumentation (`ERROR_REPORTING_WEBHOOK_URL`) | 2026-05-26 |
| SEO | Per-page metadata, sitemap, robots, canonical URLs | 2026-05-26 |
| Deployment | [stock-platform-mu.vercel.app](https://stock-platform-mu.vercel.app) | 2026-05-26 |

---

## Changelog

| Date | Milestone |
|------|-----------|
| 2026-05-26 | Project scaffold created (`create-next-app`) |
| 2026-05-26 | `progress.md` created — build tracking initialized |
| 2026-05-26 | Phase 0 complete — dark UI shell, routes, components, env template |
| 2026-05-26 | Phase 1 complete — providers, API routes, caching, cron, health |
| 2026-05-26 | Phase 2 complete — global dashboard grid, stock cards, sort/filter, refresh banner |
| 2026-05-26 | Phase 3 complete — TASE dashboard, bilingual cards, news, sentiment, weekly charts |
| 2026-05-26 | Phase 4 complete — OpenAI summaries, composite sentiment/risk, attribution |
| 2026-05-26 | Phase 5 complete — refresh logs, schedule metadata, status API, webhook alerts |
| 2026-05-26 | Phase 6 complete — SEO, a11y, performance, monitoring, README, Vercel deploy docs |
