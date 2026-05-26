import { generateStockSummaries } from "@/lib/ai/openai";
import type { StockSummaryInput } from "@/lib/ai/prompts";
import { fetchAlphaVantageOverview } from "@/lib/providers/alpha-vantage";
import {
  fetchFinnhubRecommendation,
  isFinnhubConfigured,
} from "@/lib/providers/finnhub";
import { isOpenAiConfigured } from "@/lib/env";
import { deriveCompositeRiskLevel } from "@/lib/services/risk-engine";
import { fetchTickerHeadlines } from "@/lib/providers/israel-news";
import {
  buildAnalystSummary,
  buildRuleBasedSummary,
  deriveCompositeSentiment,
  getRelatedNewsHeadlines,
} from "@/lib/services/sentiment-engine";
import type {
  DashboardKind,
  MarketNewsItem,
  StockRecommendation,
  UniverseEntry,
} from "@/lib/types/stock";

function buildSummaryAttribution(
  summarySource: StockRecommendation["summarySource"],
): string {
  const parts = ["Yahoo Finance"];

  if (isFinnhubConfigured()) parts.push("Finnhub");
  if (summarySource === "openai") parts.push("OpenAI");

  return parts.join(" · ");
}

export async function enrichDashboardStocks(
  stocks: StockRecommendation[],
  universe: UniverseEntry[],
  kind: DashboardKind,
  news: MarketNewsItem[] = [],
): Promise<{
  stocks: StockRecommendation[];
  usedOpenAi: boolean;
}> {
  const entryMap = new Map(universe.map((entry) => [entry.ticker, entry]));
  const enriched: StockRecommendation[] = [];
  const summaryInputs: StockSummaryInput[] = [];

  for (const stock of stocks) {
    const entry = entryMap.get(stock.ticker);
    if (!entry) {
      enriched.push(stock);
      continue;
    }

    const symbol = entry.finnhubSymbol ?? entry.yahooSymbol;
    const [analyst, overview] = await Promise.all([
      fetchFinnhubRecommendation(symbol),
      fetchAlphaVantageOverview(entry.ticker),
    ]);

    const newsHeadlines =
      kind === "israel"
        ? getRelatedNewsHeadlines(stock, news)
        : await fetchTickerHeadlines(entry.yahooSymbol);
    const { sentiment, factors } = deriveCompositeSentiment({
      dailyChangePercent: stock.dailyChangePercent,
      weeklyChangePercent: stock.weeklyChangePercent,
      newsHeadlines,
      analyst,
    });
    const riskLevel = deriveCompositeRiskLevel({
      sector: stock.sector,
      dailyChangePercent: stock.dailyChangePercent,
      weeklyChangePercent: stock.weeklyChangePercent,
      overview,
    });
    const analystSummary = buildAnalystSummary(analyst);

    const baseStock: StockRecommendation = {
      ...stock,
      sentiment,
      riskLevel,
      sentimentFactors: factors,
      summarySource: "rules",
      summaryAttribution: buildSummaryAttribution("rules"),
      summary: buildRuleBasedSummary(
        { ...stock, sentiment, riskLevel },
        factors,
        analystSummary,
      ),
    };

    enriched.push(baseStock);
    summaryInputs.push({
      kind,
      entry,
      stock: {
        companyName: baseStock.companyName,
        companyNameHe: baseStock.companyNameHe,
        displayTicker: baseStock.displayTicker,
        price: baseStock.price,
        currency: baseStock.currency,
        dailyChangePercent: baseStock.dailyChangePercent,
        weeklyChangePercent: baseStock.weeklyChangePercent,
        sentiment: baseStock.sentiment,
        riskLevel: baseStock.riskLevel,
        sector: baseStock.sector,
        sentimentFactors: factors,
      },
      newsHeadlines,
      analystSummary,
    });
  }

  if (!isOpenAiConfigured()) {
    return { stocks: enriched, usedOpenAi: false };
  }

  const aiSummaries = await generateStockSummaries(summaryInputs);

  const withAi = enriched.map((stock) => {
    const aiSummary = aiSummaries.get(stock.ticker);
    if (!aiSummary) return stock;

    return {
      ...stock,
      summary: aiSummary,
      summarySource: "openai" as const,
      summaryAttribution: buildSummaryAttribution("openai"),
    };
  });

  return {
    stocks: withAi,
    usedOpenAi: aiSummaries.size > 0,
  };
}
