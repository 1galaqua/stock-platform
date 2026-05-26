import { Badge } from "@/components/ui/Badge";
import type { StockRecommendation } from "@/lib/types/stock";

type SummaryMetaProps = {
  stock: Pick<
    StockRecommendation,
    "summarySource" | "summaryAttribution" | "sentimentFactors"
  >;
};

export function SummaryMeta({ stock }: SummaryMetaProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={stock.summarySource === "openai" ? "accent" : "outline"}>
          {stock.summarySource === "openai" ? "AI summary" : "Rule-based summary"}
        </Badge>
        {stock.sentimentFactors ? (
          <>
            <Badge variant={stock.sentimentFactors.priceAction}>
              Price {stock.sentimentFactors.priceAction}
            </Badge>
            <Badge variant={stock.sentimentFactors.news}>
              News {stock.sentimentFactors.news}
            </Badge>
            <Badge variant={stock.sentimentFactors.analyst}>
              Analyst {stock.sentimentFactors.analyst}
            </Badge>
          </>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">
        Summary by {stock.summaryAttribution}
      </p>
    </div>
  );
}
