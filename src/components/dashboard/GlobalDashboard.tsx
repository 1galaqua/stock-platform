"use client";

import { useMemo, useState } from "react";
import type { StockRecommendation } from "@/lib/types/stock";
import { StockCard } from "@/components/dashboard/StockCard";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { Select } from "@/components/ui/Select";
import {
  applyStockFilters,
  getUniqueSectors,
  type StockSortOption,
} from "@/lib/utils/stocks";

const RISK_FILTERS = ["All", "Low", "Medium", "High"] as const;

const SORT_OPTIONS: Array<{ value: StockSortOption; label: string }> = [
  { value: "dailyChangeDesc", label: "Daily change (high → low)" },
  { value: "dailyChangeAsc", label: "Daily change (low → high)" },
  { value: "sentiment", label: "Sentiment (bullish first)" },
  { value: "risk", label: "Risk (low first)" },
  { value: "sector", label: "Sector (A → Z)" },
  { value: "name", label: "Company name (A → Z)" },
];

type GlobalDashboardProps = {
  stocks: StockRecommendation[];
};

export function GlobalDashboard({ stocks }: GlobalDashboardProps) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [risk, setRisk] = useState("All");
  const [sort, setSort] = useState<StockSortOption>("dailyChangeDesc");

  const sectors = useMemo(
    () => ["All", ...getUniqueSectors(stocks)],
    [stocks],
  );

  const filteredStocks = useMemo(
    () =>
      applyStockFilters(stocks, {
        query,
        sector,
        risk,
        sort,
      }),
    [stocks, query, sector, risk, sort],
  );

  return (
    <div className="space-y-6">
      <FilterBar
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search by ticker or company name…"
      >
        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Sector
            </span>
            {sectors.map((item) => (
              <Chip
                key={item}
                selected={sector === item}
                onClick={() => setSector(item)}
              >
                {item}
              </Chip>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-muted">
            <span className="shrink-0">Sort by</span>
            <Select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as StockSortOption)
              }
              aria-label="Sort stocks"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Risk
          </span>
          {RISK_FILTERS.map((item) => (
            <Chip
              key={item}
              selected={risk === item}
              onClick={() => setRisk(item)}
            >
              {item}
            </Chip>
          ))}
        </div>
      </FilterBar>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredStocks.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">{stocks.length}</span>{" "}
          recommendations
        </p>
      </div>

      {stocks.length === 0 ? (
        <EmptyState
          title="No global recommendations yet"
          description="Live market data has not been loaded. Use refresh in development or wait for the weekly cron job."
        />
      ) : filteredStocks.length === 0 ? (
        <EmptyState
          title="No matches found"
          description="Try another ticker, company name, sector, or risk filter."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredStocks.map((stock) => (
            <StockCard key={stock.id} stock={stock} />
          ))}
        </div>
      )}
    </div>
  );
}
