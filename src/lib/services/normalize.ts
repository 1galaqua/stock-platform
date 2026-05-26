import type {
  MarketSentiment,
  RawQuote,
  RiskLevel,
  StockRecommendation,
  UniverseEntry,
} from "@/lib/types/stock";

export function deriveSentiment(dailyChangePercent: number): MarketSentiment {
  if (dailyChangePercent >= 1) return "bullish";
  if (dailyChangePercent <= -1) return "bearish";
  return "neutral";
}

export function deriveRiskLevel(
  dailyChangePercent: number,
  weeklyChangePercent?: number,
): RiskLevel {
  const dailyVolatility = Math.abs(dailyChangePercent);
  const weeklyVolatility = Math.abs(weeklyChangePercent ?? dailyVolatility * 2);

  if (dailyVolatility >= 4 || weeklyVolatility >= 8) return "high";
  if (dailyVolatility >= 2 || weeklyVolatility >= 4) return "medium";
  return "low";
}

export function buildSummary(
  entry: UniverseEntry,
  sentiment: MarketSentiment,
  dailyChangePercent: number,
): string {
  const direction =
    dailyChangePercent >= 0 ? "positive daily momentum" : "recent pullback";

  return `${entry.companyName} is on the ${entry.sector} watchlist with ${sentiment} sentiment and ${direction}. Detailed rationale is generated during weekly refresh.`;
}

export function buildReadMoreUrl(entry: UniverseEntry): string {
  if (entry.readMoreUrl) return entry.readMoreUrl;
  return `https://finance.yahoo.com/quote/${encodeURIComponent(entry.yahooSymbol)}`;
}

export function buildLogoUrl(entry: UniverseEntry, logoUrl?: string): string | undefined {
  if (logoUrl) return logoUrl;
  return `https://assets.parqet.com/logos/symbol/${entry.ticker}?format=png`;
}

export function normalizeRecommendation(
  entry: UniverseEntry,
  quote: RawQuote,
  updatedAt: string,
  kind: "global" | "israel" = "global",
): StockRecommendation {
  const sentiment = deriveSentiment(quote.dailyChangePercent);
  const riskLevel = deriveRiskLevel(
    quote.dailyChangePercent,
    quote.weeklyChangePercent,
  );
  const currency =
    kind === "israel" && quote.currency !== "ILS" ? "ILS" : quote.currency;

  return {
    id: entry.ticker,
    ticker: entry.ticker,
    displayTicker: kind === "israel" ? `TASE:${entry.ticker}` : entry.ticker,
    companyName: quote.companyName || entry.companyName,
    companyNameHe: entry.companyNameHe,
    logoUrl: buildLogoUrl(entry, quote.logoUrl),
    price: quote.price,
    currency,
    dailyChangePercent: quote.dailyChangePercent,
    weeklyChangePercent: quote.weeklyChangePercent,
    sentiment,
    riskLevel,
    sector: entry.sector,
    summary: buildSummary(entry, sentiment, quote.dailyChangePercent),
    summarySource: "rules",
    summaryAttribution: entry.source,
    source: entry.source,
    readMoreUrl: buildReadMoreUrl(entry),
    updatedAt,
    sparkline: quote.sparkline,
    sparklineWeekly: quote.sparklineWeekly,
  };
}

export function mergeQuote(
  primary: RawQuote | null,
  fallback: RawQuote | null,
): RawQuote | null {
  if (!primary && !fallback) return null;
  if (!primary) return fallback;
  if (!fallback) return primary;

  return {
    ...primary,
    companyName: primary.companyName || fallback.companyName,
    price: primary.price || fallback.price,
    currency: primary.currency || fallback.currency,
    dailyChangePercent:
      primary.dailyChangePercent || fallback.dailyChangePercent,
    weeklyChangePercent:
      primary.weeklyChangePercent ?? fallback.weeklyChangePercent,
    sparkline: primary.sparkline ?? fallback.sparkline,
    sparklineWeekly: primary.sparklineWeekly ?? fallback.sparklineWeekly,
    logoUrl: primary.logoUrl ?? fallback.logoUrl,
    provider: primary.provider,
  };
}
