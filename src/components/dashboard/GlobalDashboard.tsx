"use client";

import { useMemo, useState } from "react";
import type { StockRecommendation } from "@/lib/types/stock";
import { StockCard } from "@/components/dashboard/StockCard";
import { useI18n } from "@/components/providers/LocaleProvider";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { Select } from "@/components/ui/Select";
import {
  applyStockFilters,
  getUniqueSectors,
  type StockSortOption,
} from "@/lib/utils/stocks";

const RISK_FILTERS = [
  { value: "All", labelKey: "dashboard.all" },
  { value: "Low", labelKey: "dashboard.riskLevels.low" },
  { value: "Medium", labelKey: "dashboard.riskLevels.medium" },
  { value: "High", labelKey: "dashboard.riskLevels.high" },
] as const;

const SORT_OPTIONS: Array<{ value: StockSortOption; labelKey: string }> = [
  { value: "dailyChangeDesc", labelKey: "dashboard.sort.dailyChangeDesc" },
  { value: "dailyChangeAsc", labelKey: "dashboard.sort.dailyChangeAsc" },
  { value: "sentiment", labelKey: "dashboard.sort.sentiment" },
  { value: "risk", labelKey: "dashboard.sort.risk" },
  { value: "sector", labelKey: "dashboard.sort.sector" },
  { value: "name", labelKey: "dashboard.sort.name" },
];

type GlobalDashboardProps = {
  stocks: StockRecommendation[];
};

export function GlobalDashboard({ stocks }: GlobalDashboardProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [risk, setRisk] = useState("All");
  const [sort, setSort] = useState<StockSortOption>("dailyChangeDesc");

  const sectors = useMemo(() => ["All", ...getUniqueSectors(stocks)], [stocks]);

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
        searchPlaceholder={t("dashboard.searchGlobal")}
      >
        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("dashboard.sector")}
            </span>
            {sectors.map((item) => (
              <Chip
                key={item}
                selected={sector === item}
                onClick={() => setSector(item)}
              >
                {item === "All" ? t("dashboard.all") : item}
              </Chip>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-muted">
            <span className="shrink-0">{t("dashboard.sortBy")}</span>
            <Select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as StockSortOption)
              }
              aria-label={t("dashboard.sortBy")}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("dashboard.risk")}
          </span>
          {RISK_FILTERS.map((item) => (
            <Chip
              key={item.value}
              selected={risk === item.value}
              onClick={() => setRisk(item.value)}
            >
              {t(item.labelKey)}
            </Chip>
          ))}
        </div>
      </FilterBar>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          {t("dashboard.showing", {
            filtered: filteredStocks.length,
            total: stocks.length,
          })}
        </p>
      </div>

      {stocks.length === 0 ? (
        <EmptyState
          title={t("dashboard.noGlobal")}
          description={t("dashboard.noGlobalDesc")}
        />
      ) : filteredStocks.length === 0 ? (
        <EmptyState
          title={t("dashboard.noMatches")}
          description={t("dashboard.noMatchesDesc")}
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
