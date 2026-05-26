import Image from "next/image";
import type { StockRecommendation } from "@/lib/types/stock";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SparklineChart } from "@/components/dashboard/SparklineChart";
import {
  formatPercent,
  formatPrice,
  formatUpdatedAt,
} from "@/lib/utils/format";
import { cn } from "@/lib/utils";

type StockCardProps = {
  stock: StockRecommendation;
};

export function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.dailyChangePercent >= 0;

  return (
    <Card padding="none" hover className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface">
              {stock.logoUrl ? (
                <Image
                  src={stock.logoUrl}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-contain p-1.5"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted">
                  {stock.ticker.slice(0, 2)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-semibold text-foreground">
                {stock.companyName}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="outline">{stock.displayTicker}</Badge>
                <Badge variant="outline">{stock.sector}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold tracking-tight">
              {formatPrice(stock.price, stock.currency)}
            </p>
            <p
              className={cn(
                "mt-0.5 text-sm font-medium",
                isPositive ? "text-positive" : "text-negative",
              )}
            >
              {formatPercent(stock.dailyChangePercent)} today
            </p>
            {typeof stock.weeklyChangePercent === "number" ? (
              <p className="mt-0.5 text-xs text-muted">
                {formatPercent(stock.weeklyChangePercent)} this week
              </p>
            ) : null}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={stock.sentiment}>{stock.sentiment}</Badge>
            <Badge variant={stock.riskLevel}>{stock.riskLevel} risk</Badge>
          </div>
        </div>

        {stock.sparkline && stock.sparkline.length > 1 ? (
          <SparklineChart
            values={stock.sparkline}
            positive={isPositive}
            className="mb-4"
          />
        ) : (
          <div className="mb-4 h-14 rounded-lg bg-surface-hover" aria-hidden />
        )}

        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {stock.summary}
        </p>
      </div>

      <div className="border-t border-border-subtle bg-surface px-5 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Source: {stock.source}
          </p>
          <a
            href={stock.readMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-accent transition-colors hover:text-accent-muted"
          >
            Read more →
          </a>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Updated {formatUpdatedAt(stock.updatedAt)}
        </p>
      </div>
    </Card>
  );
}
