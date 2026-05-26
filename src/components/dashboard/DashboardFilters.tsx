"use client";

import { useState } from "react";
import type { StockRecommendation } from "@/lib/types/stock";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { formatPercent, formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const GLOBAL_SECTORS = [
  "All",
  "Technology",
  "Healthcare",
  "Finance",
  "Energy",
  "Consumer",
] as const;

type DashboardFiltersProps = {
  kind: "global" | "israel";
  stocks?: StockRecommendation[];
};

function sentimentVariant(sentiment: StockRecommendation["sentiment"]) {
  return sentiment;
}

function riskVariant(risk: StockRecommendation["riskLevel"]) {
  return risk;
}

export function DashboardFilters({
  kind,
  stocks = [],
}: DashboardFiltersProps) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<string>("All");

  const sectors =
    kind === "israel"
      ? ([
          "All",
          "Technology",
          "Finance",
          "Real Estate",
          "Healthcare",
          "Energy",
          "Consumer",
          "Telecom",
          "Materials",
          "Industrials",
        ] as const)
      : GLOBAL_SECTORS;

  const searchPlaceholder =
    kind === "israel"
      ? "Search by ticker, English or Hebrew name…"
      : "Search by ticker or company name…";

  const normalizedQuery = query.trim().toLowerCase();

  const filteredStocks = stocks.filter((stock) => {
    const matchesSector = sector === "All" || stock.sector === sector;
    const haystack = [
      stock.ticker,
      stock.displayTicker,
      stock.companyName,
      stock.companyNameHe ?? "",
      stock.sector,
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery =
      normalizedQuery.length === 0 || haystack.includes(normalizedQuery);

    return matchesSector && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <FilterBar
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder={searchPlaceholder}
      >
        {sectors.map((item) => (
          <Chip
            key={item}
            selected={sector === item}
            onClick={() => setSector(item)}
          >
            {item}
          </Chip>
        ))}
      </FilterBar>

      {stocks.length === 0 ? (
        <EmptyState
          title={
            kind === "global"
              ? "No global recommendations yet"
              : "No Israeli recommendations yet"
          }
          description="Run a refresh to fetch live market data from Yahoo Finance and optional provider fallbacks."
        />
      ) : filteredStocks.length === 0 ? (
        <EmptyState
          title="No matches found"
          description="Try another ticker, company name, or sector filter."
        />
      ) : (
        <div className="grid gap-4">
          {filteredStocks.map((stock) => (
            <Card key={stock.id} padding="md" hover>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  {stock.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={stock.logoUrl}
                      alt=""
                      className="h-10 w-10 rounded-lg border border-border-subtle bg-surface object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface-hover text-xs font-semibold">
                      {stock.ticker.slice(0, 2)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-foreground">
                        {stock.companyName}
                      </h2>
                      <Badge variant="outline">{stock.displayTicker}</Badge>
                    </div>
                    {stock.companyNameHe ? (
                      <p className="mt-1 text-sm text-muted" dir="rtl">
                        {stock.companyNameHe}
                      </p>
                    ) : null}
                    <p className="mt-2 text-sm text-muted">{stock.summary}</p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
                  <p className="text-lg font-semibold">
                    {formatPrice(stock.price, stock.currency)}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      stock.dailyChangePercent >= 0
                        ? "text-positive"
                        : "text-negative",
                    )}
                  >
                    {formatPercent(stock.dailyChangePercent)} today
                  </p>
                  {typeof stock.weeklyChangePercent === "number" ? (
                    <p className="text-xs text-muted">
                      {formatPercent(stock.weeklyChangePercent)} this week
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={sentimentVariant(stock.sentiment)}>
                      {stock.sentiment}
                    </Badge>
                    <Badge variant={riskVariant(stock.riskLevel)}>
                      {stock.riskLevel} risk
                    </Badge>
                    <Badge variant="outline">{stock.sector}</Badge>
                  </div>
                  <a
                    href={stock.readMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:text-accent-muted"
                  >
                    Read more · {stock.source}
                  </a>
                </div>
              </div>

              {stock.sparkline && stock.sparkline.length > 1 ? (
                <Sparkline values={stock.sparkline} positive={stock.dailyChangePercent >= 0} />
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Sparkline({
  values,
  positive,
}: {
  values: number[];
  positive: boolean;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 240;
  const height = 48;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mt-4 h-12 w-full max-w-xs"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={positive ? "var(--positive)" : "var(--negative)"}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}
