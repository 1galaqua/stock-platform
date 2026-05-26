import { env } from "@/lib/env";
import { RATE_LIMITS, withRateLimit } from "@/lib/services/rate-limiter";
import type { MarketNewsItem, UniverseEntry } from "@/lib/types/stock";

type FinnhubNewsItem = {
  id?: number;
  headline?: string;
  source?: string;
  url?: string;
  datetime?: number;
  related?: string;
};

const YAHOO_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/xml, */*",
};

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseRssItems(xml: string, relatedTicker?: string): MarketNewsItem[] {
  const items: MarketNewsItem[] = [];
  const itemPattern = /<item>([\s\S]*?)<\/item>/g;
  let match = itemPattern.exec(xml);

  while (match) {
    const block = match[1];
    const title = decodeXml(
      block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "",
    );
    const link = decodeXml(
      block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "",
    );
    const pubDate = decodeXml(
      block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? "",
    );

    if (title && link) {
      const publishedAt = pubDate
        ? new Date(pubDate).toISOString()
        : new Date().toISOString();

      items.push({
        id: `${relatedTicker ?? "market"}-${link}`,
        title,
        url: link,
        source: relatedTicker
          ? `Yahoo Finance · ${relatedTicker}`
          : "Yahoo Finance",
        publishedAt,
        relatedTicker,
      });
    }

    match = itemPattern.exec(xml);
  }

  return items;
}

async function fetchYahooHeadlines(
  symbol: string,
): Promise<MarketNewsItem[]> {
  const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}&region=US&lang=en-US`;

  try {
    const response = await fetch(url, {
      headers: YAHOO_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const xml = await response.text();
    return parseRssItems(xml, symbol.replace(".TA", ""));
  } catch {
    return [];
  }
}

async function fetchFinnhubCompanyNews(
  symbol: string,
): Promise<MarketNewsItem[]> {
  if (!env.finnhubApiKey) return [];

  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 7);

  const fromDate = from.toISOString().slice(0, 10);
  const toDate = to.toISOString().slice(0, 10);
  const url = `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(symbol)}&from=${fromDate}&to=${toDate}&token=${env.finnhubApiKey}`;

  return withRateLimit("finnhub", RATE_LIMITS.finnhub, async () => {
    try {
      const response = await fetch(url, { next: { revalidate: 3600 } });
      if (!response.ok) return [];

      const payload = (await response.json()) as FinnhubNewsItem[];

      return payload
        .filter((item) => item.headline && item.url)
        .map((item) => ({
          id: String(item.id ?? `${symbol}-${item.url}`),
          title: item.headline!,
          url: item.url!,
          source: item.source ?? "Finnhub",
          publishedAt: new Date(
            (item.datetime ?? Date.now()) * 1000,
          ).toISOString(),
          relatedTicker: symbol.replace(".TA", ""),
        }));
    } catch {
      return [];
    }
  });
}

function dedupeNews(items: MarketNewsItem[]): MarketNewsItem[] {
  const seen = new Set<string>();
  const unique: MarketNewsItem[] = [];

  for (const item of items) {
    const key = item.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  return unique;
}

export async function fetchIsraelMarketNews(
  universe: UniverseEntry[],
  limit = 12,
): Promise<MarketNewsItem[]> {
  const headlineSymbols = universe.slice(0, 5).map((entry) => entry.yahooSymbol);
  const batches = await Promise.all(
    headlineSymbols.flatMap((symbol) => [
      fetchYahooHeadlines(symbol),
      fetchFinnhubCompanyNews(symbol),
    ]),
  );

  return dedupeNews(batches.flat())
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() -
        new Date(left.publishedAt).getTime(),
    )
    .slice(0, limit);
}
