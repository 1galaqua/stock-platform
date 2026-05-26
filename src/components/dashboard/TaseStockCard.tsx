"use client";

import { useState } from "react";
import Image from "next/image";
import type { StockRecommendation } from "@/lib/types/stock";
import { SparklineChart } from "@/components/dashboard/SparklineChart";
import { SummaryMeta } from "@/components/dashboard/SummaryMeta";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import {
  formatPercent,
  formatPrice,
  formatUpdatedAt,
} from "@/lib/utils/format";
import { cn } from "@/lib/utils";

type ChartPeriod = "daily" | "weekly";

type TaseStockCardProps = {
  stock: StockRecommendation;
};

export function TaseStockCard({ stock }: TaseStockCardProps) {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");
  const isPositive =
    chartPeriod === "daily"
      ? stock.dailyChangePercent >= 0
      : (stock.weeklyChangePercent ?? stock.dailyChangePercent) >= 0;

  const chartValues =
    chartPeriod === "weekly" && stock.sparklineWeekly?.length
      ? stock.sparklineWeekly
      : stock.sparkline;

  const performanceLabel =
    chartPeriod === "weekly" && typeof stock.weeklyChangePercent === "number"
      ? `${formatPercent(stock.weeklyChangePercent)} this week`
      : `${formatPercent(stock.dailyChangePercent)} today`;

  return (
    <Card padding="none" hover className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start gap-3">
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
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-foreground">{stock.companyName}</h2>
            {stock.companyNameHe ? (
              <p
                className="mt-1 text-base font-medium text-foreground/90"
                dir="rtl"
                lang="he"
              >
                {stock.companyNameHe}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="accent">{stock.displayTicker}</Badge>
              <Badge variant="outline">{stock.sector}</Badge>
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
              {performanceLabel}
            </p>
            {typeof stock.weeklyChangePercent === "number" ? (
              <p className="mt-0.5 text-xs text-muted">
                Daily {formatPercent(stock.dailyChangePercent)} · Weekly{" "}
                {formatPercent(stock.weeklyChangePercent)}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={stock.sentiment}>{stock.sentiment}</Badge>
            <Badge variant={stock.riskLevel}>{stock.riskLevel} risk</Badge>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <Chip
            selected={chartPeriod === "daily"}
            onClick={() => setChartPeriod("daily")}
          >
            Daily chart
          </Chip>
          <Chip
            selected={chartPeriod === "weekly"}
            onClick={() => setChartPeriod("weekly")}
          >
            Weekly chart
          </Chip>
        </div>

        {chartValues && chartValues.length > 1 ? (
          <SparklineChart
            values={chartValues}
            positive={isPositive}
            className="mb-4"
          />
        ) : (
          <div className="mb-4 h-14 rounded-lg bg-surface-hover" aria-hidden />
        )}

        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {stock.summary}
        </p>
        <div className="mt-4">
          <SummaryMeta stock={stock} />
        </div>
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
