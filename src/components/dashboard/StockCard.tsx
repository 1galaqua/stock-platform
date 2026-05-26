"use client";

import type { StockRecommendation } from "@/lib/types/stock";
import { StockLogo } from "@/components/dashboard/StockLogo";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SparklineChart } from "@/components/dashboard/SparklineChart";
import { SummaryMeta } from "@/components/dashboard/SummaryMeta";
import { useI18n } from "@/components/providers/LocaleProvider";
import {
  formatPercent,
  formatPrice,
  formatUpdatedAt,
} from "@/lib/utils/format";
import { getDateLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type StockCardProps = {
  stock: StockRecommendation;
};

export function StockCard({ stock }: StockCardProps) {
  const { locale, t } = useI18n();
  const isPositive = stock.dailyChangePercent >= 0;
  const dateLocale = getDateLocale(locale);
  const riskLevelKey =
    `dashboard.riskLevels.${stock.riskLevel.toLowerCase()}` as const;

  return (
    <Card padding="none" hover className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <StockLogo
              ticker={stock.ticker}
              logoUrl={stock.logoUrl}
              companyName={stock.companyName}
            />
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
              {formatPercent(stock.dailyChangePercent)} {t("stock.today")}
            </p>
            {typeof stock.weeklyChangePercent === "number" ? (
              <p className="mt-0.5 text-xs text-muted">
                {formatPercent(stock.weeklyChangePercent)} {t("stock.thisWeek")}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={stock.sentiment}>
              {t(`sentiment.${stock.sentiment}`)}
            </Badge>
            <Badge variant={stock.riskLevel}>
              {t("stock.risk", { level: t(riskLevelKey) })}
            </Badge>
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
        <div className="mt-4">
          <SummaryMeta stock={stock} />
        </div>
      </div>

      <div className="border-t border-border-subtle bg-surface px-5 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {t("stock.source", { source: stock.source })}
          </p>
          <a
            href={stock.readMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-accent transition-colors hover:text-accent-muted"
          >
            {t("stock.readMore")}
          </a>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {t("stock.updated", {
            date: formatUpdatedAt(stock.updatedAt, dateLocale),
          })}
        </p>
      </div>
    </Card>
  );
}
