import type { MarketNewsItem } from "@/lib/types/stock";
import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatNewsDate } from "@/lib/utils/format";

type MarketNewsFeedProps = {
  news: MarketNewsItem[];
};

export function MarketNewsFeed({ news }: MarketNewsFeedProps) {
  return (
    <Card padding="md" className="h-full">
      <CardTitle className="text-lg">Israeli market news</CardTitle>
      <CardDescription className="mt-1">
        Headlines from Yahoo Finance and Finnhub for leading TASE names.
      </CardDescription>

      {news.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No headlines available"
            description="News will appear after the next data refresh."
            className="py-10"
          />
        </div>
      ) : (
        <ul className="mt-5 space-y-4">
          {news.map((item) => (
            <li
              key={item.id}
              className="border-b border-border-subtle pb-4 last:border-b-0 last:pb-0"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <p className="font-medium leading-snug text-foreground transition-colors group-hover:text-accent">
                  {item.title}
                </p>
              </a>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatNewsDate(item.publishedAt)}
                </span>
                <Badge variant="outline">{item.source}</Badge>
                {item.relatedTicker ? (
                  <Badge variant="outline">TASE:{item.relatedTicker}</Badge>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
