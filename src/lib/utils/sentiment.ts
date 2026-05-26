import type { MarketSentiment, StockRecommendation } from "@/lib/types/stock";
import { deriveSentiment } from "@/lib/services/normalize";

export type SentimentBreakdown = Record<MarketSentiment, number>;

export function countSentiments(
  stocks: StockRecommendation[],
): SentimentBreakdown {
  return stocks.reduce<SentimentBreakdown>(
    (counts, stock) => {
      counts[stock.sentiment] += 1;
      return counts;
    },
    { bullish: 0, neutral: 0, bearish: 0 },
  );
}

export function deriveOverallSentiment(
  stocks: StockRecommendation[],
): MarketSentiment {
  if (stocks.length === 0) return "neutral";

  const averageDailyChange =
    stocks.reduce((sum, stock) => sum + stock.dailyChangePercent, 0) /
    stocks.length;

  return deriveSentiment(averageDailyChange);
}
