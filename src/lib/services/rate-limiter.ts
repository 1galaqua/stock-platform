const providerQueues = new Map<string, Promise<void>>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRateLimit<T>(
  provider: string,
  minIntervalMs: number,
  task: () => Promise<T>,
): Promise<T> {
  const previous = providerQueues.get(provider) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });

  providerQueues.set(
    provider,
    previous.then(() => gate),
  );

  await previous;
  await sleep(minIntervalMs);

  try {
    return await task();
  } finally {
    release();
  }
}

export const RATE_LIMITS = {
  yahoo: 250,
  finnhub: 1100,
  alphaVantage: 12_500,
} as const;
