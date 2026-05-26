export type MarketSentiment = "bullish" | "neutral" | "bearish";

export type RiskLevel = "low" | "medium" | "high";

export type ProviderName = "yahoo" | "finnhub" | "alpha-vantage";

export type ProviderStatus = "ok" | "degraded" | "skipped" | "failed";

export type StockRecommendation = {
  id: string;
  ticker: string;
  displayTicker: string;
  companyName: string;
  companyNameHe?: string;
  logoUrl?: string;
  price: number;
  currency: string;
  dailyChangePercent: number;
  weeklyChangePercent?: number;
  sentiment: MarketSentiment;
  riskLevel: RiskLevel;
  sector: string;
  summary: string;
  source: string;
  readMoreUrl: string;
  updatedAt: string;
  sparkline?: number[];
};

export type DashboardKind = "global" | "israel";

export type DashboardSnapshot = {
  kind: DashboardKind;
  updatedAt: string;
  stocks: StockRecommendation[];
  sources: string[];
  providers: Record<ProviderName, ProviderStatus>;
};

export type DashboardMeta = {
  globalUpdatedAt: string | null;
  israelUpdatedAt: string | null;
  lastRefreshAttemptAt: string | null;
  lastRefreshStatus: "idle" | "success" | "partial" | "failed";
};

export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export type DashboardHealth = {
  kind: DashboardKind;
  updatedAt: string | null;
  stockCount: number;
  ageHours: number | null;
  fresh: boolean;
  providers: Record<ProviderName, ProviderStatus>;
};

export type PlatformHealth = {
  status: HealthStatus;
  checkedAt: string;
  refreshIntervalDays: number;
  dashboards: Record<DashboardKind, DashboardHealth>;
  providers: Record<ProviderName, ProviderStatus>;
  lastRefresh: Pick<
    DashboardMeta,
    "lastRefreshAttemptAt" | "lastRefreshStatus"
  >;
};

export type RawQuote = {
  symbol: string;
  companyName: string;
  price: number;
  currency: string;
  dailyChangePercent: number;
  weeklyChangePercent?: number;
  sparkline?: number[];
  logoUrl?: string;
  provider: ProviderName;
};

export type UniverseEntry = {
  ticker: string;
  yahooSymbol: string;
  finnhubSymbol?: string;
  companyName: string;
  companyNameHe?: string;
  sector: string;
  source: string;
  readMoreUrl?: string;
};
