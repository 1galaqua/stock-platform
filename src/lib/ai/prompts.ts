import type {
  MarketSentiment,
  RiskLevel,
  StockRecommendation,
  UniverseEntry,
} from "@/lib/types/stock";

export type StockSummaryInput = {
  kind: "global" | "israel";
  entry: UniverseEntry;
  stock: Pick<
    StockRecommendation,
    | "companyName"
    | "companyNameHe"
    | "displayTicker"
    | "price"
    | "currency"
    | "dailyChangePercent"
    | "weeklyChangePercent"
    | "sentiment"
    | "riskLevel"
    | "sector"
    | "sentimentFactors"
  >;
  newsHeadlines: string[];
  analystSummary?: string;
};

export function buildStockSummaryPrompt(input: StockSummaryInput): string {
  const weeklyChange =
    typeof input.stock.weeklyChangePercent === "number"
      ? `${input.stock.weeklyChangePercent.toFixed(2)}%`
      : "n/a";

  const factors = input.stock.sentimentFactors;
  const factorLines = factors
    ? [
        `- Price action: ${factors.priceAction}`,
        `- News tone: ${factors.news}`,
        `- Analyst consensus: ${factors.analyst}`,
      ].join("\n")
    : "- Signals unavailable";

  const headlines =
    input.newsHeadlines.length > 0
      ? input.newsHeadlines.map((line) => `- ${line}`).join("\n")
      : "- No recent headlines available";

  return `You are a financial analyst writing concise weekly stock recommendation blurbs.

Write ONE short paragraph (2-3 sentences, max 320 characters) explaining why this stock is on the watchlist this week.
Be factual, neutral-professional, and avoid hype or guaranteed return language.
Do not invent metrics that were not provided.

Stock:
- Market: ${input.kind === "israel" ? "Tel Aviv Stock Exchange (TASE)" : "Global equities"}
- Ticker: ${input.stock.displayTicker}
- Company: ${input.stock.companyName}${input.stock.companyNameHe ? ` / ${input.stock.companyNameHe}` : ""}
- Sector: ${input.stock.sector}
- Price: ${input.stock.price} ${input.stock.currency}
- Daily change: ${input.stock.dailyChangePercent.toFixed(2)}%
- Weekly change: ${weeklyChange}
- Composite sentiment: ${input.stock.sentiment}
- Risk level: ${input.stock.riskLevel}

Sentiment breakdown:
${factorLines}

Analyst notes:
${input.analystSummary ?? "No analyst consensus data available"}

Recent headlines:
${headlines}

Return only the summary paragraph.`;
}

export function buildBatchSummarySystemPrompt(): string {
  return "You produce concise, compliance-safe stock recommendation summaries for a dashboard. Never promise returns.";
}

export const SENTIMENT_LABELS: Record<MarketSentiment, string> = {
  bullish: "Bullish",
  neutral: "Neutral",
  bearish: "Bearish",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
