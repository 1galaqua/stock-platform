/**
 * App architecture
 *
 * Routes (App Router):
 *   /         — landing with dashboard entry points
 *   /global   — global recommended stocks (Phase 2)
 *   /israel   — TASE Israeli stocks (Phase 3)
 *
 * API layer (Phase 1+):
 *   src/app/api/stocks/global/route.ts
 *   src/app/api/stocks/israel/route.ts
 *   src/app/api/cron/refresh/route.ts
 *
 * Data caching strategy:
 *   - Server Components fetch via lib/services with `fetch(..., { next: { revalidate: 604800 } })` (7 days)
 *   - Weekly cron invalidates tags: `revalidateTag('global-stocks')`, `revalidateTag('israel-stocks')`
 *   - Client search/filter stays local until Phase 2 live data
 */

export const APP_NAME = "Stock Platform";

export const REFRESH_INTERVAL_DAYS = 7;

/** Vercel cron: Sunday 06:00 UTC (`vercel.json`) */
export const REFRESH_CRON_SCHEDULE = "0 6 * * 0";
export const REFRESH_CRON_LABEL = "Every Sunday at 06:00 UTC";

export function getNextScheduledRefreshDate(from = new Date()): Date {
  const next = new Date(from);
  next.setUTCHours(6, 0, 0, 0);

  const day = next.getUTCDay();
  let daysUntilSunday = (7 - day) % 7;

  if (daysUntilSunday === 0 && from.getTime() >= next.getTime()) {
    daysUntilSunday = 7;
  }

  next.setUTCDate(next.getUTCDate() + daysUntilSunday);
  return next;
}

export const ROUTES = {
  home: "/",
  global: "/global",
  israel: "/israel",
} as const;

export type DashboardRoute = (typeof ROUTES)[keyof typeof ROUTES];

export const NAV_ITEMS = [
  {
    href: ROUTES.home,
    label: "Home",
    description: "Platform overview",
  },
  {
    href: ROUTES.global,
    label: "Global Stocks",
    description: "20 weekly global picks",
  },
  {
    href: ROUTES.israel,
    label: "Israeli Stocks",
    description: "TASE market dashboard",
  },
] as const;
