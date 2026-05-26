import {
  getNextScheduledRefreshDate,
  REFRESH_CRON_LABEL,
  REFRESH_CRON_SCHEDULE,
} from "@/lib/config";
import { sendRefreshAlert } from "@/lib/services/refresh-alerts";
import {
  invalidateDashboardCache,
  refreshAllDashboards,
} from "@/lib/services/dashboard";
import { persistRefreshResults } from "@/lib/storage/snapshot-store";
import { appendRefreshLog } from "@/lib/storage/refresh-log-store";
import type {
  DashboardSnapshot,
  RefreshLogEntry,
  RefreshTrigger,
} from "@/lib/types/stock";

function countAiSummaries(snapshot: DashboardSnapshot): number {
  return snapshot.stocks.filter((stock) => stock.summarySource === "openai")
    .length;
}

function buildRefreshMessage(
  global: DashboardSnapshot,
  israel: DashboardSnapshot,
  status: RefreshLogEntry["status"],
): string {
  if (status === "success") {
    return `Weekly refresh completed: ${global.stocks.length} global and ${israel.stocks.length} Israeli stocks updated with prices, charts, news, and AI summaries.`;
  }

  if (status === "partial") {
    return `Partial refresh: global ${global.stocks.length}/20, Israel ${israel.stocks.length} stocks. Review provider health and retry.`;
  }

  return "Weekly refresh failed. No dashboard snapshots were updated.";
}

export function resolveRefreshTrigger(request: Request): RefreshTrigger {
  if (request.headers.get("x-vercel-cron") === "1") {
    return "cron";
  }

  const trigger = new URL(request.url).searchParams.get("trigger");
  if (trigger === "cron" || trigger === "manual") {
    return trigger;
  }

  return "manual";
}

export async function runWeeklyRefresh(trigger: RefreshTrigger): Promise<{
  global: DashboardSnapshot;
  israel: DashboardSnapshot;
  log: RefreshLogEntry;
}> {
  const startedAt = new Date();
  const errors: string[] = [];

  let global: DashboardSnapshot;
  let israel: DashboardSnapshot;

  try {
    const result = await refreshAllDashboards(trigger);
    global = result.global;
    israel = result.israel;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown refresh error";
    errors.push(message);

    global = {
      kind: "global",
      updatedAt: startedAt.toISOString(),
      stocks: [],
      sources: ["Yahoo Finance"],
      providers: {
        yahoo: "failed",
        finnhub: "skipped",
        "alpha-vantage": "skipped",
      },
    };
    israel = {
      kind: "israel",
      updatedAt: startedAt.toISOString(),
      stocks: [],
      sources: ["Yahoo Finance", "TASE"],
      providers: {
        yahoo: "failed",
        finnhub: "skipped",
        "alpha-vantage": "skipped",
      },
    };

    await persistRefreshResults([global, israel], "failed", {
      trigger,
      durationMs: Date.now() - startedAt.getTime(),
      message: "Weekly refresh failed. No dashboard snapshots were updated.",
    });
  }

  invalidateDashboardCache();

  const finishedAt = new Date();
  const hasGlobal = global.stocks.length > 0;
  const hasIsrael = israel.stocks.length > 0;
  const status =
    hasGlobal && hasIsrael
      ? "success"
      : hasGlobal || hasIsrael
        ? "partial"
        : "failed";

  const log: RefreshLogEntry = {
    id: `refresh-${startedAt.getTime()}`,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    status,
    trigger,
    global: {
      stockCount: global.stocks.length,
      updatedAt: hasGlobal ? global.updatedAt : null,
      aiSummaryCount: countAiSummaries(global),
    },
    israel: {
      stockCount: israel.stocks.length,
      updatedAt: hasIsrael ? israel.updatedAt : null,
      aiSummaryCount: countAiSummaries(israel),
    },
    message: buildRefreshMessage(global, israel, status),
    errors,
  };

  await appendRefreshLog(log);
  await sendRefreshAlert(log);

  console.info("[refresh]", JSON.stringify(log));

  return { global, israel, log };
}

export function getRefreshScheduleInfo() {
  const nextScheduledAt = getNextScheduledRefreshDate();

  return {
    cron: REFRESH_CRON_SCHEDULE,
    label: REFRESH_CRON_LABEL,
    nextScheduledAt: nextScheduledAt.toISOString(),
  };
}
