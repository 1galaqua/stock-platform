export type MarketSentiment = "bullish" | "neutral" | "bearish";

export type RiskLevel = "low" | "medium" | "high";

export type ProviderName = "yahoo" | "finnhub" | "alpha-vantage";

export type ProviderStatus = "ok" | "degraded" | "skipped" | "failed";

export type MarketNewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  relatedTicker?: string;
};

export type SummarySource = "openai" | "rules";

export type SentimentFactors = {
  priceAction: MarketSentiment;
  news: MarketSentiment;
  analyst: MarketSentiment;
};

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
  summarySource: SummarySource;
  summaryAttribution: string;
  sentimentFactors?: SentimentFactors;
  source: string;
  readMoreUrl: string;
  updatedAt: string;
  sparkline?: number[];
  sparklineWeekly?: number[];
};

export type DashboardKind = "global" | "israel";

export type DashboardSnapshot = {
  kind: DashboardKind;
  updatedAt: string;
  stocks: StockRecommendation[];
  sources: string[];
  providers: Record<ProviderName, ProviderStatus>;
  news?: MarketNewsItem[];
  marketSentiment?: MarketSentiment;
};

export type DashboardMeta = {
  globalUpdatedAt: string | null;
  israelUpdatedAt: string | null;
  lastRefreshAttemptAt: string | null;
  lastRefreshStatus: "idle" | "success" | "partial" | "failed";
  lastRefreshDurationMs: number | null;
  lastRefreshTrigger: RefreshTrigger | null;
  nextScheduledRefreshAt: string | null;
  lastRefreshMessage: string | null;
};

export type RefreshTrigger = "cron" | "manual" | "unknown";

export type RefreshLogEntry = {
  id: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  status: DashboardMeta["lastRefreshStatus"];
  trigger: RefreshTrigger;
  global: {
    stockCount: number;
    updatedAt: string | null;
    aiSummaryCount: number;
  };
  israel: {
    stockCount: number;
    updatedAt: string | null;
    aiSummaryCount: number;
  };
  message: string;
  errors: string[];
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
  refreshSchedule: {
    cron: string;
    label: string;
    nextScheduledAt: string;
  };
  dashboards: Record<DashboardKind, DashboardHealth>;
  providers: Record<ProviderName, ProviderStatus>;
  lastRefresh: Pick<
    DashboardMeta,
    | "lastRefreshAttemptAt"
    | "lastRefreshStatus"
    | "lastRefreshDurationMs"
    | "lastRefreshTrigger"
    | "lastRefreshMessage"
  >;
  latestRefreshLog: RefreshLogEntry | null;
};

export type RawQuote = {
  symbol: string;
  companyName: string;
  price: number;
  currency: string;
  dailyChangePercent: number;
  weeklyChangePercent?: number;
  sparkline?: number[];
  sparklineWeekly?: number[];
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
