/**
 * Server-side environment variables.
 * Client-safe values should not be read here without the NEXT_PUBLIC_ prefix.
 */

function optional(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

export const env = {
  alphaVantageApiKey: optional("ALPHA_VANTAGE_API_KEY"),
  finnhubApiKey: optional("FINNHUB_API_KEY"),
  openaiApiKey: optional("OPENAI_API_KEY"),
  cronSecret: optional("CRON_SECRET"),
  databaseUrl: optional("DATABASE_URL"),
} as const;

export function hasMarketDataKeys(): boolean {
  return Boolean(env.alphaVantageApiKey || env.finnhubApiKey);
}
