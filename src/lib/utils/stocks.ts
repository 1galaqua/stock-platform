import type {
  MarketSentiment,
  RiskLevel,
  StockRecommendation,
} from "@/lib/types/stock";

export type StockSortOption =
  | "dailyChangeDesc"
  | "dailyChangeAsc"
  | "sentiment"
  | "risk"
  | "sector"
  | "name";

export type StockFilters = {
  query: string;
  sector: string;
  risk: string;
  sort: StockSortOption;
};

const SENTIMENT_ORDER: Record<MarketSentiment, number> = {
  bullish: 0,
  neutral: 1,
  bearish: 2,
};

const RISK_ORDER: Record<RiskLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export function getUniqueSectors(stocks: StockRecommendation[]): string[] {
  return Array.from(new Set(stocks.map((stock) => stock.sector))).sort();
}

export function filterStocks(
  stocks: StockRecommendation[],
  filters: Pick<StockFilters, "query" | "sector" | "risk">,
): StockRecommendation[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return stocks.filter((stock) => {
    const matchesSector =
      filters.sector === "All" || stock.sector === filters.sector;
    const matchesRisk =
      filters.risk === "All" ||
      stock.riskLevel === filters.risk.toLowerCase();

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

    return matchesSector && matchesRisk && matchesQuery;
  });
}

export function sortStocks(
  stocks: StockRecommendation[],
  sort: StockSortOption,
): StockRecommendation[] {
  const sorted = [...stocks];

  sorted.sort((left, right) => {
    switch (sort) {
      case "dailyChangeAsc":
        return left.dailyChangePercent - right.dailyChangePercent;
      case "dailyChangeDesc":
        return right.dailyChangePercent - left.dailyChangePercent;
      case "sentiment":
        return (
          SENTIMENT_ORDER[left.sentiment] - SENTIMENT_ORDER[right.sentiment]
        );
      case "risk":
        return RISK_ORDER[left.riskLevel] - RISK_ORDER[right.riskLevel];
      case "sector":
        return left.sector.localeCompare(right.sector);
      case "name":
        return left.companyName.localeCompare(right.companyName);
      default:
        return 0;
    }
  });

  return sorted;
}

export function applyStockFilters(
  stocks: StockRecommendation[],
  filters: StockFilters,
): StockRecommendation[] {
  return sortStocks(filterStocks(stocks, filters), filters.sort);
}
