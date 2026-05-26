import { REFRESH_INTERVAL_DAYS } from "@/lib/config";
import type { DashboardSnapshot } from "@/lib/types/stock";
import { RefreshButton } from "@/components/dashboard/RefreshButton";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatNextRefreshAt, formatUpdatedAt } from "@/lib/utils/format";

type DashboardStatusBannerProps = {
  snapshot: DashboardSnapshot;
  showRefresh?: boolean;
};

export function DashboardStatusBanner({
  snapshot,
  showRefresh = false,
}: DashboardStatusBannerProps) {
  const nextRefreshAt = formatNextRefreshAt(
    snapshot.updatedAt,
    REFRESH_INTERVAL_DAYS,
  );

  return (
    <Card padding="md" className="mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            {snapshot.stocks.length} recommendations loaded
          </p>
          <p className="mt-1 text-sm text-muted">
            Sources: {snapshot.sources.join(" · ")}
          </p>
          <p className="mt-2 text-sm text-muted">
            Last refreshed{" "}
            <span className="text-foreground">
              {formatUpdatedAt(snapshot.updatedAt)}
            </span>
            {" · "}
            Next refresh{" "}
            <span className="text-foreground">{nextRefreshAt}</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">Weekly auto-refresh</Badge>
            {Object.entries(snapshot.providers).map(([provider, status]) =>
              status === "skipped" ? null : (
                <Badge
                  key={provider}
                  variant={
                    status === "ok"
                      ? "low"
                      : status === "degraded"
                        ? "medium"
                        : "high"
                  }
                >
                  {provider}: {status}
                </Badge>
              ),
            )}
          </div>
          {showRefresh ? <RefreshButton /> : null}
        </div>
      </div>
    </Card>
  );
}
