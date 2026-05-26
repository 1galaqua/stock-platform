"use client";

import type { DashboardMeta, DashboardSnapshot } from "@/lib/types/stock";
import { REFRESH_INTERVAL_DAYS } from "@/lib/config";
import { RefreshButton } from "@/components/dashboard/RefreshButton";
import { useI18n } from "@/components/providers/LocaleProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatUpdatedAt } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

type DashboardStatusBannerProps = {
  snapshot: DashboardSnapshot;
  refreshMeta?: DashboardMeta | null;
  showRefresh?: boolean;
};

function statusVariant(
  status: DashboardMeta["lastRefreshStatus"],
): "low" | "medium" | "high" | "accent" | "outline" {
  switch (status) {
    case "success":
      return "low";
    case "partial":
      return "medium";
    case "failed":
      return "high";
    default:
      return "outline";
  }
}

export function DashboardStatusBanner({
  snapshot,
  refreshMeta,
  showRefresh = false,
}: DashboardStatusBannerProps) {
  const { locale, t } = useI18n();
  const dateLocale = locale === "he" ? "he-IL" : "en-US";

  const nextRefreshAt = refreshMeta?.nextScheduledRefreshAt
    ? formatUpdatedAt(refreshMeta.nextScheduledRefreshAt, dateLocale)
    : formatUpdatedAt(snapshot.updatedAt, dateLocale);

  const lastJobStatus = refreshMeta?.lastRefreshStatus ?? "idle";
  const isStale =
    refreshMeta?.lastRefreshAttemptAt &&
    Date.now() - new Date(refreshMeta.lastRefreshAttemptAt).getTime() >
      REFRESH_INTERVAL_DAYS * 24 * 60 * 60 * 1000;

  return (
    <Card
      padding="md"
      className={cn("mb-6", isStale && "border-warning/30 bg-warning/5")}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            {t("statusBanner.loaded", { count: snapshot.stocks.length })}
          </p>
          <p className="mt-1 text-sm text-muted">
            {t("statusBanner.sources", {
              sources: snapshot.sources.join(" · "),
            })}
          </p>
          <p className="mt-2 text-sm text-muted">
            {t("statusBanner.dataUpdated", {
              date: formatUpdatedAt(snapshot.updatedAt, dateLocale),
            })}
            {" · "}
            {t("statusBanner.nextRefresh", { date: nextRefreshAt })}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("statusBanner.autoRefresh", {
              schedule: t("statusBanner.cronSchedule"),
            })}
          </p>
          {refreshMeta?.lastRefreshMessage ? (
            <p className="mt-2 text-sm text-muted">
              {refreshMeta.lastRefreshMessage}
            </p>
          ) : null}
          {isStale ? (
            <p className="mt-2 text-sm text-warning">
              {t("statusBanner.stale", { days: REFRESH_INTERVAL_DAYS })}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">{t("statusBanner.weeklyAuto")}</Badge>
            <Badge variant={statusVariant(lastJobStatus)}>
              {t("statusBanner.lastJob", {
                status: t(`refreshStatus.${lastJobStatus}`),
              })}
            </Badge>
            {refreshMeta?.lastRefreshTrigger ? (
              <Badge variant="outline">{refreshMeta.lastRefreshTrigger}</Badge>
            ) : null}
            {typeof refreshMeta?.lastRefreshDurationMs === "number" ? (
              <Badge variant="outline">
                {Math.round(refreshMeta.lastRefreshDurationMs / 1000)}s
              </Badge>
            ) : null}
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
