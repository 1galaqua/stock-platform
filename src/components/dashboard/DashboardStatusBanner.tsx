import type { DashboardSnapshot } from "@/lib/types/stock";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatUpdatedAt } from "@/lib/utils/format";

type DashboardStatusBannerProps = {
  snapshot: DashboardSnapshot;
};

export function DashboardStatusBanner({ snapshot }: DashboardStatusBannerProps) {
  return (
    <Card padding="md" className="mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            {snapshot.stocks.length} recommendations loaded
          </p>
          <p className="mt-1 text-sm text-muted">
            Sources: {snapshot.sources.join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            Updated {formatUpdatedAt(snapshot.updatedAt)}
          </Badge>
          {Object.entries(snapshot.providers).map(([provider, status]) =>
            status === "skipped" ? null : (
              <Badge
                key={provider}
                variant={status === "ok" ? "low" : status === "degraded" ? "medium" : "high"}
              >
                {provider}: {status}
              </Badge>
            ),
          )}
        </div>
      </div>
    </Card>
  );
}
