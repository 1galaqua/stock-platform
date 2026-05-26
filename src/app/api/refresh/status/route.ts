import { getDashboardMeta, getPlatformHealth } from "@/lib/services/dashboard";
import { readRefreshLogs } from "@/lib/storage/refresh-log-store";
import { getRefreshScheduleInfo } from "@/lib/services/refresh";
import { NextResponse } from "next/server";

export async function GET() {
  const [meta, health, logs, schedule] = await Promise.all([
    getDashboardMeta(),
    getPlatformHealth(),
    readRefreshLogs(10),
    Promise.resolve(getRefreshScheduleInfo()),
  ]);

  return NextResponse.json(
    {
      schedule,
      meta,
      health: {
        status: health.status,
        lastRefresh: health.lastRefresh,
        dashboards: health.dashboards,
      },
      recentLogs: logs,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
