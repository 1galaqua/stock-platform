import type {
  MarketNewsItem,
  MarketSentiment,
  SentimentFactors,
  StockRecommendation,
} from "@/lib/types/stock";
import { deriveSentiment } from "@/lib/services/normalize";
import type { FinnhubRecommendationSnapshot } from "@/lib/providers/finnhub";

const BULLISH_KEYWORDS = [
  "surge",
  "gain",
  "gains",
  "rise",
  "rally",
  "beat",
  "upgrade",
  "growth",
  "record",
  "strong",
  "outperform",
  "profit",
  "bullish",
];

const BEARISH_KEYWORDS = [
  "fall",
  "falls",
  "drop",
  "plunge",
  "loss",
  "miss",
  "downgrade",
  "decline",
  "weak",
  "cut",
  "bearish",
  "slump",
  "warning",
];

const SENTIMENT_SCORE: Record<MarketSentiment, number> = {
  bullish: 1,
  neutral: 0,
  bearish: -1,
};

function scoreToSentiment(score: number): MarketSentiment {
  if (score >= 0.35) return "bullish";
  if (score <= -0.35) return "bearish";
  return "neutral";
}

export function scoreNewsHeadlines(headlines: string[]): MarketSentiment {
  if (headlines.length === 0) return "neutral";

  let score = 0;

  for (const headline of headlines) {
    const normalized = headline.toLowerCase();

    for (const keyword of BULLISH_KEYWORDS) {
      if (normalized.includes(keyword)) score += 1;
    }

    for (const keyword of BEARISH_KEYWORDS) {
      if (normalized.includes(keyword)) score -= 1;
    }
  }

  const normalizedScore = score / Math.max(headlines.length, 1);
  if (normalizedScore >= 0.5) return "bullish";
  if (normalizedScore <= -0.5) return "bearish";
  return "neutral";
}

export function scoreAnalystRecommendation(
  recommendation: FinnhubRecommendationSnapshot | null,
): MarketSentiment {
  if (!recommendation) return "neutral";
  if (recommendation.score >= 0.25) return "bullish";
  if (recommendation.score <= -0.25) return "bearish";
  return "neutral";
}

export function buildAnalystSummary(
  recommendation: FinnhubRecommendationSnapshot | null,
): string | undefined {
  if (!recommendation) return undefined;

  return `${recommendation.buy} buy / ${recommendation.hold} hold / ${recommendation.sell} sell (${recommendation.period})`;
}

export function deriveCompositeSentiment(input: {
  dailyChangePercent: number;
  weeklyChangePercent?: number;
  newsHeadlines: string[];
  analyst: FinnhubRecommendationSnapshot | null;
}): { sentiment: MarketSentiment; factors: SentimentFactors } {
  const priceAction = deriveSentiment(input.dailyChangePercent);
  const weeklyAction =
    typeof input.weeklyChangePercent === "number"
      ? deriveSentiment(input.weeklyChangePercent)
      : priceAction;
  const news = scoreNewsHeadlines(input.newsHeadlines);
  const analyst = scoreAnalystRecommendation(input.analyst);

  const blendedPrice =
    typeof input.weeklyChangePercent === "number"
      ? scoreToSentiment(
          SENTIMENT_SCORE[priceAction] * 0.6 +
            SENTIMENT_SCORE[weeklyAction] * 0.4,
        )
      : priceAction;

  const weightedScore =
    SENTIMENT_SCORE[blendedPrice] * 0.5 +
    SENTIMENT_SCORE[news] * 0.25 +
    SENTIMENT_SCORE[analyst] * 0.25;

  return {
    sentiment: scoreToSentiment(weightedScore),
    factors: {
      priceAction: blendedPrice,
      news,
      analyst,
    },
  };
}

export function getRelatedNewsHeadlines(
  stock: StockRecommendation,
  news: MarketNewsItem[] = [],
  limit = 4,
): string[] {
  return news
    .filter(
      (item) =>
        item.relatedTicker?.toUpperCase() === stock.ticker.toUpperCase() ||
        item.title.toUpperCase().includes(stock.ticker) ||
        item.title.includes(stock.companyName),
    )
    .slice(0, limit)
    .map((item) => item.title);
}

export function buildRuleBasedSummary(
  stock: StockRecommendation,
  factors: SentimentFactors,
  analystSummary?: string,
): string {
  const direction =
    stock.dailyChangePercent >= 0 ? "positive momentum" : "recent softness";
  const analystLine = analystSummary
    ? ` Analyst coverage shows ${factors.analyst} bias.`
    : "";

  return `${stock.companyName} remains a ${stock.sector} watchlist name with ${factors.priceAction} price action, ${factors.news} news tone, and ${stock.sentiment} composite sentiment after ${direction}.${analystLine}`;
}
