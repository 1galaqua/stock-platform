import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME, REFRESH_INTERVAL_DAYS, ROUTES } from "@/lib/config";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createPageMetadata({
  title: "Home",
  description:
    "Weekly global and Israeli TASE stock dashboards with sentiment, risk labels, and AI summaries.",
  path: ROUTES.home,
  keywords: ["TASE", "portfolio watchlist", "weekly stocks"],
});

const dashboards = [
  {
    href: ROUTES.global,
    title: "Global Recommended Stocks",
    description:
      "20 curated picks from Yahoo Finance, Finnhub, NASDAQ, and more — refreshed weekly.",
    badge: "20 stocks",
    accent: "text-accent",
  },
  {
    href: ROUTES.israel,
    title: "Israeli Stocks (TASE)",
    description:
      "Tel Aviv Stock Exchange dashboard with bilingual names, sector filters, and market news.",
    badge: "TASE",
    accent: "text-warning",
  },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-12 max-w-3xl">
        <Badge variant="accent" className="mb-4">
          Weekly refresh
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Intelligent stock analysis, built for clarity
        </h1>
        <p className="mt-4 text-lg text-muted">
          {APP_NAME} delivers two focused dashboards — global market leaders and
          Israeli TASE stocks — with sentiment, risk levels, and AI-powered
          summaries updated every {REFRESH_INTERVAL_DAYS} days.
        </p>
      </section>

      <section
        className="grid gap-6 md:grid-cols-2"
        aria-label="Dashboard entry points"
      >
        {dashboards.map((dashboard) => (
          <Link
            key={dashboard.href}
            href={dashboard.href}
            className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`Open ${dashboard.title}`}
          >
            <Card hover padding="lg" className="h-full">
              <CardHeader className="mb-0">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <CardTitle className="text-xl transition-colors group-hover:text-accent">
                    {dashboard.title}
                  </CardTitle>
                  <Badge variant="outline">{dashboard.badge}</Badge>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {dashboard.description}
                </CardDescription>
              </CardHeader>
              <span
                className={`mt-6 inline-flex items-center gap-2 text-sm font-medium ${dashboard.accent}`}
              >
                Open dashboard
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </Card>
          </Link>
        ))}
      </section>

      <section
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Platform highlights"
      >
        {[
          {
            title: "Market sentiment",
            body: "Bullish, neutral, or bearish signals on every recommendation.",
          },
          {
            title: "Risk-aware picks",
            body: "Low, medium, and high risk labels to match your strategy.",
          },
          {
            title: "Trusted sources",
            body: "Aggregated from Yahoo Finance, Alpha Vantage, Finnhub, and TASE data.",
          },
        ].map((feature) => (
          <Card key={feature.title} padding="md">
            <CardTitle className="mb-2">{feature.title}</CardTitle>
            <CardDescription>{feature.body}</CardDescription>
          </Card>
        ))}
      </section>
    </div>
  );
}
