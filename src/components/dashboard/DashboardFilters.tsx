"use client";

import { useMemo, useState } from "react";
import type { StockRecommendation } from "@/lib/types/stock";
import { StockCard } from "@/components/dashboard/StockCard";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { filterStocks, getUniqueSectors } from "@/lib/utils/stocks";

type DashboardFiltersProps = {
  kind: "global" | "israel";
  stocks?: StockRecommendation[];
};

export function DashboardFilters({
  kind,
  stocks = [],
}: DashboardFiltersProps) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");

  const sectors = useMemo(
    () => ["All", ...getUniqueSectors(stocks)],
    [stocks],
  );

  const searchPlaceholder =
    kind === "israel"
      ? "Search by ticker, English or Hebrew name…"
      : "Search by ticker or company name…";

  const filteredStocks = useMemo(
    () =>
      filterStocks(stocks, {
        query,
        sector,
        risk: "All",
      }),
    [stocks, query, sector],
  );

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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredStocks.map((stock) => (
            <StockCard key={stock.id} stock={stock} />
          ))}
        </div>
      )}
    </div>
  );
}
