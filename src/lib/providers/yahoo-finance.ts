import { RATE_LIMITS, withRateLimit } from "@/lib/services/rate-limiter";
import type { RawQuote } from "@/lib/types/stock";

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: {
        symbol?: string;
        longName?: string;
        shortName?: string;
        regularMarketPrice?: number;
        chartPreviousClose?: number;
        currency?: string;
      };
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
        }>;
      };
    }>;
  };
};

const YAHOO_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
};

function computeWeeklyChange(closes: number[]): number | undefined {
  if (closes.length < 2) return undefined;
  const first = closes[0];
  const last = closes[closes.length - 1];
  if (!first || !last) return undefined;
  return ((last - first) / first) * 100;
}

function computeDailyChangePercent(
  price: number,
  previousClose: number | undefined,
  closes: number[],
): number {
  if (previousClose && previousClose > 0) {
    return ((price - previousClose) / previousClose) * 100;
  }

  if (closes.length >= 2) {
    const previous = closes[closes.length - 2];
    if (previous > 0) {
      return ((price - previous) / previous) * 100;
    }
  }

  return 0;
}

function normalizeYahooCurrency(currency: string | undefined): {
  currency: string;
  scale: number;
} {
  if (currency === "ILA") {
    return { currency: "ILS", scale: 0.01 };
  }

  return { currency: currency ?? "USD", scale: 1 };
}

async function fetchYahooChart(
  symbol: string,
  range: "5d" | "1mo" = "5d",
): Promise<RawQuote | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=1d`;

  try {
    const response = await fetch(url, {
      headers: YAHOO_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as YahooChartResponse;
    const result = payload.chart?.result?.[0];
    const meta = result?.meta;

    if (!meta?.symbol || typeof meta.regularMarketPrice !== "number") {
      return null;
    }

    const closes =
      result?.indicators?.quote?.[0]?.close?.filter(
        (value): value is number => typeof value === "number",
      ) ?? [];

    const { currency, scale } = normalizeYahooCurrency(meta.currency);
    const price = meta.regularMarketPrice * scale;
    const previousClose = meta.chartPreviousClose
      ? meta.chartPreviousClose * scale
      : undefined;
    const sparkline = closes.map((close) => close * scale);

    return {
      symbol: meta.symbol,
      companyName: meta.longName ?? meta.shortName ?? meta.symbol,
      price,
      currency,
      dailyChangePercent: computeDailyChangePercent(
        price,
        previousClose,
        sparkline,
      ),
      weeklyChangePercent: computeWeeklyChange(sparkline),
      sparkline,
      provider: "yahoo",
    };
  } catch {
    return null;
  }
}

export async function fetchYahooQuote(symbol: string): Promise<RawQuote | null> {
  return withRateLimit("yahoo", RATE_LIMITS.yahoo, () =>
    fetchYahooChart(symbol, "5d"),
  );
}

export async function fetchYahooWeeklySparkline(
  symbol: string,
): Promise<number[] | undefined> {
  const quote = await withRateLimit("yahoo", RATE_LIMITS.yahoo, () =>
    fetchYahooChart(symbol, "1mo"),
  );

  return quote?.sparkline;
}

export async function fetchYahooQuotes(
  symbols: string[],
): Promise<Map<string, RawQuote>> {
  const quotes = new Map<string, RawQuote>();
  const uniqueSymbols = Array.from(new Set(symbols));

  for (const symbol of uniqueSymbols) {
    const quote = await fetchYahooQuote(symbol);
    if (quote) {
      quotes.set(symbol, quote);
    }
  }

  return quotes;
}
