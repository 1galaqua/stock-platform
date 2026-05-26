import { env } from "@/lib/env";
import { RATE_LIMITS, withRateLimit } from "@/lib/services/rate-limiter";
import type { RawQuote } from "@/lib/types/stock";

type AlphaGlobalQuoteResponse = {
  "Global Quote"?: {
    "01. symbol"?: string;
    "05. price"?: string;
    "09. change"?: string;
    "10. change percent"?: string;
  };
};

function parsePercent(value?: string): number {
  if (!value) return 0;
  return Number.parseFloat(value.replace("%", "").trim()) || 0;
}

export function isAlphaVantageConfigured(): boolean {
  return Boolean(env.alphaVantageApiKey);
}

export async function fetchAlphaVantageQuote(
  symbol: string,
): Promise<RawQuote | null> {
  if (!env.alphaVantageApiKey) return null;

  return withRateLimit("alpha-vantage", RATE_LIMITS.alphaVantage, async () => {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${env.alphaVantageApiKey}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) return null;

    const payload = (await response.json()) as AlphaGlobalQuoteResponse;
    const quote = payload["Global Quote"];

    if (!quote?.["05. price"]) return null;

    const price = Number.parseFloat(quote["05. price"]);
    if (!Number.isFinite(price) || price <= 0) return null;

    return {
      symbol,
      companyName: quote["01. symbol"] ?? symbol,
      price,
      currency: "USD",
      dailyChangePercent: parsePercent(quote["10. change percent"]),
      provider: "alpha-vantage",
    };
  });
}

export async function fetchAlphaVantageQuotes(
  symbols: string[],
): Promise<Map<string, RawQuote>> {
  const quotes = new Map<string, RawQuote>();
  if (!isAlphaVantageConfigured()) return quotes;

  for (const symbol of symbols) {
    const quote = await fetchAlphaVantageQuote(symbol);
    if (quote) quotes.set(symbol, quote);
  }

  return quotes;
}

export type AlphaVantageOverview = {
  beta?: number;
  peRatio?: number;
  profitMargin?: number;
};

type AlphaOverviewResponse = {
  Beta?: string;
  PERatio?: string;
  ProfitMargin?: string;
};

function parseOptionalNumber(value?: string): number | undefined {
  if (!value || value === "None") return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function fetchAlphaVantageOverview(
  symbol: string,
): Promise<AlphaVantageOverview | null> {
  if (!env.alphaVantageApiKey) return null;

  return withRateLimit("alpha-vantage", RATE_LIMITS.alphaVantage, async () => {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(symbol)}&apikey=${env.alphaVantageApiKey}`;

    try {
      const response = await fetch(url, { next: { revalidate: 86400 } });
      if (!response.ok) return null;

      const payload = (await response.json()) as AlphaOverviewResponse;
      if (!payload.Beta && !payload.PERatio && !payload.ProfitMargin) {
        return null;
      }

      return {
        beta: parseOptionalNumber(payload.Beta),
        peRatio: parseOptionalNumber(payload.PERatio),
        profitMargin: parseOptionalNumber(payload.ProfitMargin),
      };
    } catch {
      return null;
    }
  });
}
