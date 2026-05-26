import { env } from "@/lib/env";
import { RATE_LIMITS, withRateLimit } from "@/lib/services/rate-limiter";
import type { RawQuote } from "@/lib/types/stock";

type FinnhubQuoteResponse = {
  c?: number;
  dp?: number;
  pc?: number;
};

type FinnhubProfileResponse = {
  name?: string;
  logo?: string;
  currency?: string;
};

async function fetchFinnhubJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function isFinnhubConfigured(): boolean {
  return Boolean(env.finnhubApiKey);
}

export async function fetchFinnhubQuote(symbol: string): Promise<RawQuote | null> {
  if (!env.finnhubApiKey) return null;

  return withRateLimit("finnhub", RATE_LIMITS.finnhub, async () => {
    const token = env.finnhubApiKey;
    const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${token}`;
    const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${token}`;

    const [quotePayload, profilePayload] = await Promise.all([
      fetchFinnhubJson<FinnhubQuoteResponse>(quoteUrl),
      fetchFinnhubJson<FinnhubProfileResponse>(profileUrl),
    ]);

    if (!quotePayload?.c || quotePayload.c <= 0) return null;

    return {
      symbol,
      companyName: profilePayload?.name ?? symbol,
      price: quotePayload.c,
      currency: profilePayload?.currency ?? "USD",
      dailyChangePercent: quotePayload.dp ?? 0,
      logoUrl: profilePayload?.logo,
      provider: "finnhub",
    };
  });
}

export async function fetchFinnhubQuotes(
  symbols: string[],
): Promise<Map<string, RawQuote>> {
  const quotes = new Map<string, RawQuote>();
  if (!isFinnhubConfigured()) return quotes;

  for (const symbol of symbols) {
    const quote = await fetchFinnhubQuote(symbol);
    if (quote) quotes.set(symbol, quote);
  }

  return quotes;
}

export type FinnhubRecommendationSnapshot = {
  buy: number;
  hold: number;
  sell: number;
  period: string;
  score: number;
};

type FinnhubRecommendationResponse = Array<{
  buy?: number;
  hold?: number;
  sell?: number;
  period?: string;
  symbol?: string;
}>;

export async function fetchFinnhubRecommendation(
  symbol: string,
): Promise<FinnhubRecommendationSnapshot | null> {
  if (!env.finnhubApiKey) return null;

  return withRateLimit("finnhub", RATE_LIMITS.finnhub, async () => {
    const url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${encodeURIComponent(symbol)}&token=${env.finnhubApiKey}`;
    const payload = await fetchFinnhubJson<FinnhubRecommendationResponse>(url);
    const latest = payload?.[0];

    if (!latest) return null;

    const buy = latest.buy ?? 0;
    const hold = latest.hold ?? 0;
    const sell = latest.sell ?? 0;
    const total = buy + hold + sell;

    if (total === 0) return null;

    return {
      buy,
      hold,
      sell,
      period: latest.period ?? "latest",
      score: (buy - sell) / total,
    };
  });
}
