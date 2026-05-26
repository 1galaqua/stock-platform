import type { MarketSentiment, StockRecommendation } from "@/lib/types/stock";
import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { countSentiments } from "@/lib/utils/sentiment";
import { cn } from "@/lib/utils";

type MarketSentimentOverviewProps = {
  stocks: StockRecommendation[];
  overallSentiment?: MarketSentiment;
};

const SENTIMENT_LABELS: Record<MarketSentiment, string> = {
  bullish: "Bullish",
  neutral: "Neutral",
  bearish: "Bearish",
};

export function MarketSentimentOverview({
  stocks,
  overallSentiment = "neutral",
}: MarketSentimentOverviewProps) {
  const breakdown = countSentiments(stocks);
  const total = stocks.length || 1;

  return (
    <Card padding="md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle className="text-lg">TASE market sentiment</CardTitle>
          <CardDescription className="mt-1">
            Aggregated from {stocks.length} recommended Tel Aviv stocks based on
            daily price action.
          </CardDescription>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={overallSentiment}>
              Overall: {SENTIMENT_LABELS[overallSentiment]}
            </Badge>
            <Badge variant="outline">TA-35 focus universe</Badge>
          </div>
        </div>

        <div className="grid w-full max-w-xl grid-cols-3 gap-3">
          {(Object.keys(breakdown) as MarketSentiment[]).map((sentiment) => {
            const count = breakdown[sentiment];
            const width = `${Math.max((count / total) * 100, count > 0 ? 12 : 0)}%`;

            return (
              <div
                key={sentiment}
                className="rounded-lg border border-border-subtle bg-surface p-3"
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {SENTIMENT_LABELS[sentiment]}
                </p>
                <p className="mt-1 text-2xl font-semibold">{count}</p>
                <div className="mt-3 h-1.5 rounded-full bg-surface-hover">
                  <div
                    className={cn(
                      "h-1.5 rounded-full",
                      sentiment === "bullish" && "bg-positive",
                      sentiment === "neutral" && "bg-warning",
                      sentiment === "bearish" && "bg-negative",
                    )}
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
