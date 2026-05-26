# Stock Platform

Modern full-stack stock analysis platform with two intelligent dashboards:

- **Global Recommended Stocks** — 20 weekly global picks
- **Israeli Stocks (TASE)** — Tel Aviv exchange dashboard with bilingual names

Built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**.

## Features

- Live quotes, sparklines, and weekly charts (Yahoo Finance + optional Finnhub/Alpha Vantage)
- Composite sentiment from price action, news, and analyst ratings
- AI-generated summaries via OpenAI (rule-based fallback without API key)
- Weekly auto-refresh via Vercel Cron (Sunday 06:00 UTC)
- Refresh logs, health checks, and optional webhook alerts

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Required | Purpose |
|----------|----------|---------|
| `FINNHUB_API_KEY` | Optional | Fallback quotes, analyst ratings, logos |
| `ALPHA_VANTAGE_API_KEY` | Optional | Fallback quotes, beta/fundamentals for risk |
| `OPENAI_API_KEY` | Optional | AI recommendation summaries |
| `OPENAI_MODEL` | Optional | Default: `gpt-4o-mini` |
| `CRON_SECRET` | Production | Secures `/api/cron/refresh` |
| `REFRESH_ALERT_WEBHOOK_URL` | Optional | Slack/Discord alerts on failed refresh |
| `ERROR_REPORTING_WEBHOOK_URL` | Optional | Runtime error reports (falls back to refresh webhook) |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URL for SEO ([stock-platform-mu.vercel.app](https://stock-platform-mu.vercel.app)) |
| `NEXT_PUBLIC_ENABLE_MANUAL_REFRESH` | Optional | Show “Refresh now” button outside dev |

## API routes

| Route | Description |
|-------|-------------|
| `GET /api/stocks/global` | Global recommendations JSON |
| `GET /api/stocks/israel` | Israeli recommendations JSON |
| `GET /api/health` | Platform health and data freshness |
| `GET /api/refresh/status` | Cron schedule, meta, recent refresh logs |
| `POST /api/cron/refresh` | Trigger weekly refresh (Bearer `CRON_SECRET`) |
| `POST /api/monitoring/report` | Client error reporting |

## Weekly refresh

- **Schedule:** Every Sunday at 06:00 UTC (`0 6 * * 0` in `vercel.json`)
- **Manual (dev):** Click “Refresh now” on a dashboard, or:

```bash
curl -X POST "http://localhost:3000/api/cron/refresh?trigger=manual"
```

- **Production:**

```bash
curl -X POST "https://your-app.vercel.app/api/cron/refresh" \
  -H "Authorization: Bearer $CRON_SECRET"
```

Each refresh re-fetches prices, charts, news, sentiment, risk scores, and AI summaries, then persists snapshots under `data/snapshots/`.

## Deploy on Vercel

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Set environment variables in the Vercel dashboard.
4. Deploy — `vercel.json` configures the weekly cron automatically.

After deploy:

- Set `NEXT_PUBLIC_SITE_URL` to your production URL.
- Set `CRON_SECRET` and add it to Vercel Cron authorization.
- Optionally configure `REFRESH_ALERT_WEBHOOK_URL` for failure alerts.

### Post-deploy checks

```bash
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/refresh/status
```

Run Lighthouse in Chrome DevTools on `/`, `/global`, and `/israel` to verify performance, accessibility, and SEO scores.

## Error monitoring

- Server errors are captured via `instrumentation.ts` (`onRequestError`).
- Client error boundaries report to `/api/monitoring/report`.
- Configure `ERROR_REPORTING_WEBHOOK_URL` to forward errors to Slack, Discord, or a logging service.

For full **Sentry** integration, install `@sentry/nextjs` and follow their Next.js setup guide, then set `SENTRY_DSN`.

## Project structure

```
src/
├── app/              # Routes, API, sitemap, robots
├── components/       # UI, dashboards, layout
├── lib/
│   ├── ai/           # OpenAI prompts and client
│   ├── monitoring/   # Error reporting
│   ├── providers/    # Yahoo, Finnhub, news
│   ├── seo/          # Metadata helpers
│   ├── services/     # Dashboard, refresh, enrichment
│   └── storage/      # Snapshot and refresh logs
└── instrumentation.ts
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Disclaimer

Not financial advice. Data and AI summaries are for informational purposes only.
