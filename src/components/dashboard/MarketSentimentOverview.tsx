"use client";

import type { MarketSentiment, StockRecommendation } from "@/lib/types/stock";
import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { useI18n } from "@/components/providers/LocaleProvider";
import { countSentiments } from "@/lib/utils/sentiment";
import { cn } from "@/lib/utils";

type MarketSentimentOverviewProps = {
  stocks: StockRecommendation[];
  overallSentiment?: MarketSentiment;
};

export function MarketSentimentOverview({
  stocks,
  overallSentiment = "neutral",
}: MarketSentimentOverviewProps) {
  const { t } = useI18n();
  const breakdown = countSentiments(stocks);
  const total = stocks.length || 1;

  return (
    <Card padding="md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle className="text-lg">{t("taseSentiment.title")}</CardTitle>
          <CardDescription className="mt-1">
            {t("taseSentiment.description", { count: stocks.length })}
          </CardDescription>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={overallSentiment}>
              {t("sentiment.overall", {
                value: t(`sentiment.${overallSentiment}`),
              })}
            </Badge>
            <Badge variant="outline">{t("taseSentiment.badge")}</Badge>
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
                  {t(`sentiment.${sentiment}`)}
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
