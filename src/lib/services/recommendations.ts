import { getUniverse } from "@/lib/data/universe";
import {
  fetchAlphaVantageQuote,
  isAlphaVantageConfigured,
} from "@/lib/providers/alpha-vantage";
import {
  fetchFinnhubQuote,
  isFinnhubConfigured,
} from "@/lib/providers/finnhub";
import { fetchIsraelMarketNews } from "@/lib/providers/israel-news";
import {
  fetchYahooQuotes,
  fetchYahooWeeklySparkline,
} from "@/lib/providers/yahoo-finance";
import { enrichDashboardStocks } from "@/lib/services/ai-enrichment";
import { mergeQuote, normalizeRecommendation } from "@/lib/services/normalize";
import { deriveOverallSentiment } from "@/lib/utils/sentiment";
import type {
  DashboardKind,
  DashboardSnapshot,
  ProviderName,
  ProviderStatus,
  UniverseEntry,
} from "@/lib/types/stock";

function emptyProviderStatus(): Record<ProviderName, ProviderStatus> {
  return {
    yahoo: "skipped",
    finnhub: "skipped",
    "alpha-vantage": "skipped",
  };
}

function summarizeProviders(
  statuses: Array<Record<ProviderName, ProviderStatus>>,
): Record<ProviderName, ProviderStatus> {
  const summary = emptyProviderStatus();
  const names: ProviderName[] = ["yahoo", "finnhub", "alpha-vantage"];

  for (const name of names) {
    const values = statuses.map((status) => status[name]);
    if (values.every((value) => value === "skipped")) {
      summary[name] = "skipped";
    } else if (values.some((value) => value === "ok")) {
      summary[name] = values.some((value) => value === "failed")
        ? "degraded"
        : "ok";
    } else if (values.some((value) => value === "degraded")) {
      summary[name] = "degraded";
    } else {
      summary[name] = "failed";
    }
  }

  return summary;
}

async function enrichQuote(
  entry: UniverseEntry,
  yahooBatch: Map<string, import("@/lib/types/stock").RawQuote>,
  kind: DashboardKind,
): Promise<{
  recommendation: ReturnType<typeof normalizeRecommendation> | null;
  providers: Record<ProviderName, ProviderStatus>;
}> {
  const entryProviders = emptyProviderStatus();
  let quote = yahooBatch.get(entry.yahooSymbol) ?? null;
  entryProviders.yahoo = quote ? "ok" : "failed";

  if (!quote && isFinnhubConfigured()) {
    const finnhubSymbol = entry.finnhubSymbol ?? entry.yahooSymbol;
    const finnhubQuote = await fetchFinnhubQuote(finnhubSymbol);
    entryProviders.finnhub = finnhubQuote ? "ok" : "degraded";
    quote = mergeQuote(quote, finnhubQuote);
  } else if (isFinnhubConfigured()) {
    entryProviders.finnhub = "skipped";
  }

  if (!quote && isAlphaVantageConfigured()) {
    const alphaQuote = await fetchAlphaVantageQuote(entry.ticker);
    entryProviders["alpha-vantage"] = alphaQuote ? "ok" : "failed";
    quote = mergeQuote(quote, alphaQuote);
  } else if (isAlphaVantageConfigured()) {
    entryProviders["alpha-vantage"] = "skipped";
  }

  if (!quote) {
    return { recommendation: null, providers: entryProviders };
  }

  let sparklineWeekly = quote.sparklineWeekly;
  if (kind === "israel" && !sparklineWeekly) {
    sparklineWeekly = await fetchYahooWeeklySparkline(entry.yahooSymbol);
    quote = { ...quote, sparklineWeekly };
  }

  return {
    recommendation: normalizeRecommendation(
      entry,
      quote,
      new Date().toISOString(),
      kind,
    ),
    providers: entryProviders,
  };
}

export async function buildDashboardSnapshot(
  kind: DashboardKind,
): Promise<DashboardSnapshot> {
  const universe = getUniverse(kind);
  const updatedAt = new Date().toISOString();
  const providerStatuses: Array<Record<ProviderName, ProviderStatus>> = [];
  const stocks = [];

  const yahooSymbols = universe.map((entry) => entry.yahooSymbol);
  const yahooBatch = await fetchYahooQuotes(yahooSymbols);
  const batchProviderStatus = emptyProviderStatus();
  batchProviderStatus.yahoo = yahooBatch.size > 0 ? "ok" : "failed";
  providerStatuses.push(batchProviderStatus);

  for (const entry of universe) {
    const { recommendation, providers } = await enrichQuote(
      entry,
      yahooBatch,
      kind,
    );
    providerStatuses.push(providers);
    if (recommendation) {
      stocks.push({ ...recommendation, updatedAt });
    }
  }

  const sources = Array.from(
    new Set([
      "Yahoo Finance",
      ...(kind === "israel" ? ["TASE"] : []),
      ...(isFinnhubConfigured() ? ["Finnhub"] : []),
      ...(isAlphaVantageConfigured() ? ["Alpha Vantage"] : []),
    ]),
  );

  const snapshot: DashboardSnapshot = {
    kind,
    updatedAt,
    stocks,
    sources,
    providers: summarizeProviders(providerStatuses),
  };

  if (kind === "israel") {
    snapshot.news = await fetchIsraelMarketNews(universe);
  }

  const enrichment = await enrichDashboardStocks(
    snapshot.stocks,
    universe,
    kind,
    snapshot.news ?? [],
  );

  snapshot.stocks = enrichment.stocks;

  if (enrichment.usedOpenAi && !snapshot.sources.includes("OpenAI")) {
    snapshot.sources.push("OpenAI");
  }

  if (kind === "israel") {
    snapshot.marketSentiment = deriveOverallSentiment(snapshot.stocks);
  }

  return snapshot;
}

export async function buildDashboardSnapshotResilient(
  kind: DashboardKind,
): Promise<DashboardSnapshot> {
  try {
    return await buildDashboardSnapshot(kind);
  } catch (error) {
    console.error(`Failed to build ${kind} snapshot`, error);
    return {
      kind,
      updatedAt: new Date().toISOString(),
      stocks: [],
      sources: ["Yahoo Finance"],
      providers: {
        yahoo: "failed",
        finnhub: isFinnhubConfigured() ? "failed" : "skipped",
        "alpha-vantage": isAlphaVantageConfigured() ? "failed" : "skipped",
      },
    };
  }
}
