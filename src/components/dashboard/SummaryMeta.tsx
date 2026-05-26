"use client";

import { Badge } from "@/components/ui/Badge";
import type { StockRecommendation } from "@/lib/types/stock";
import { useI18n } from "@/components/providers/LocaleProvider";

type SummaryMetaProps = {
  stock: Pick<
    StockRecommendation,
    "summarySource" | "summaryAttribution" | "sentimentFactors"
  >;
};

export function SummaryMeta({ stock }: SummaryMetaProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={stock.summarySource === "openai" ? "accent" : "outline"}>
          {stock.summarySource === "openai"
            ? t("stock.aiSummary")
            : t("stock.ruleSummary")}
        </Badge>
        {stock.sentimentFactors ? (
          <>
            <Badge variant={stock.sentimentFactors.priceAction}>
              {t("stock.priceSentiment", {
                value: t(`sentiment.${stock.sentimentFactors.priceAction}`),
              })}
            </Badge>
            <Badge variant={stock.sentimentFactors.news}>
              {t("stock.newsSentiment", {
                value: t(`sentiment.${stock.sentimentFactors.news}`),
              })}
            </Badge>
            <Badge variant={stock.sentimentFactors.analyst}>
              {t("stock.analystSentiment", {
                value: t(`sentiment.${stock.sentimentFactors.analyst}`),
              })}
            </Badge>
          </>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">
        {t("stock.summaryBy", { source: stock.summaryAttribution })}
      </p>
    </div>
  );
}
