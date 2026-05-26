import { unstable_cache, revalidateTag } from "next/cache";
import {
  CACHE_REVALIDATE_SECONDS,
  CACHE_TAGS,
  cacheTagForKind,
} from "@/lib/cache/tags";
import { REFRESH_INTERVAL_DAYS } from "@/lib/config";
import {
  buildDashboardSnapshotResilient,
} from "@/lib/services/recommendations";
import {
  persistRefreshResults,
  readMeta,
  readSnapshot,
  writeSnapshot,
} from "@/lib/storage/snapshot-store";
import type {
  DashboardKind,
  DashboardMeta,
  DashboardSnapshot,
  HealthStatus,
  PlatformHealth,
  ProviderName,
  ProviderStatus,
} from "@/lib/types/stock";

const fetchSnapshotUncached = async (
  kind: DashboardKind,
): Promise<DashboardSnapshot> => {
  const cached = await readSnapshot(kind);
  if (cached && cached.stocks.length > 0) {
    return cached;
  }

  const snapshot = await buildDashboardSnapshotResilient(kind);

  if (snapshot.stocks.length > 0) {
    try {
      await writeSnapshot(snapshot);
    } catch (error) {
      console.warn(`Unable to persist ${kind} snapshot`, error);
    }
  }

  return snapshot;
};

const getGlobalSnapshotCached = unstable_cache(
  async () => fetchSnapshotUncached("global"),
  ["dashboard-snapshot-global"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.global],
  },
);

const getIsraelSnapshotCached = unstable_cache(
  async () => fetchSnapshotUncached("israel"),
  ["dashboard-snapshot-israel"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.israel],
  },
);

export async function getDashboardSnapshot(
  kind: DashboardKind,
): Promise<DashboardSnapshot> {
  const snapshot =
    kind === "global"
      ? await getGlobalSnapshotCached()
      : await getIsraelSnapshotCached();
  return { ...snapshot, kind };
}

function hoursSince(isoDate: string | null): number | null {
  if (!isoDate) return null;
  const diffMs = Date.now() - new Date(isoDate).getTime();
  return Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
}

function isFresh(updatedAt: string | null): boolean {
  const ageHours = hoursSince(updatedAt);
  if (ageHours === null) return false;
  return ageHours <= REFRESH_INTERVAL_DAYS * 24;
}

function derivePlatformStatus(
  dashboards: PlatformHealth["dashboards"],
): HealthStatus {
  const items = Object.values(dashboards);
  const allHealthy = items.every(
    (dashboard) => dashboard.stockCount > 0 && dashboard.fresh,
  );
  const anyData = items.some((dashboard) => dashboard.stockCount > 0);

  if (allHealthy) return "healthy";
  if (anyData) return "degraded";
  return "unhealthy";
}

function mergeProviderStatus(
  left: Record<ProviderName, ProviderStatus>,
  right: Record<ProviderName, ProviderStatus>,
): Record<ProviderName, ProviderStatus> {
  const names: ProviderName[] = ["yahoo", "finnhub", "alpha-vantage"];
  const merged = {} as Record<ProviderName, ProviderStatus>;

  for (const name of names) {
    if (left[name] === "ok" || right[name] === "ok") {
      merged[name] = "ok";
    } else if (left[name] === "degraded" || right[name] === "degraded") {
      merged[name] = "degraded";
    } else if (left[name] === "failed" || right[name] === "failed") {
      merged[name] = "failed";
    } else {
      merged[name] = "skipped";
    }
  }

  return merged;
}

export async function getPlatformHealth(): Promise<PlatformHealth> {
  const [globalSnapshot, israelSnapshot, meta] = await Promise.all([
    getDashboardSnapshot("global"),
    getDashboardSnapshot("israel"),
    readMeta(),
  ]);

  const dashboards: PlatformHealth["dashboards"] = {
    global: {
      kind: "global",
      updatedAt: globalSnapshot.updatedAt,
      stockCount: globalSnapshot.stocks.length,
      ageHours: hoursSince(globalSnapshot.updatedAt),
      fresh: isFresh(globalSnapshot.updatedAt),
      providers: globalSnapshot.providers,
    },
    israel: {
      kind: "israel",
      updatedAt: israelSnapshot.updatedAt,
      stockCount: israelSnapshot.stocks.length,
      ageHours: hoursSince(israelSnapshot.updatedAt),
      fresh: isFresh(israelSnapshot.updatedAt),
      providers: israelSnapshot.providers,
    },
  };

  return {
    status: derivePlatformStatus(dashboards),
    checkedAt: new Date().toISOString(),
    refreshIntervalDays: REFRESH_INTERVAL_DAYS,
    dashboards,
    providers: mergeProviderStatus(
      globalSnapshot.providers,
      israelSnapshot.providers,
    ),
    lastRefresh: {
      lastRefreshAttemptAt: meta.lastRefreshAttemptAt,
      lastRefreshStatus: meta.lastRefreshStatus,
    },
  };
}

export async function refreshAllDashboards(): Promise<{
  global: DashboardSnapshot;
  israel: DashboardSnapshot;
  meta: DashboardMeta;
}> {
  const [global, israel] = await Promise.all([
    buildDashboardSnapshotResilient("global"),
    buildDashboardSnapshotResilient("israel"),
  ]);

  const hasGlobal = global.stocks.length > 0;
  const hasIsrael = israel.stocks.length > 0;
  const status =
    hasGlobal && hasIsrael
      ? "success"
      : hasGlobal || hasIsrael
        ? "partial"
        : "failed";

  const meta = await persistRefreshResults([global, israel], status);

  return { global, israel, meta };
}

export function invalidateDashboardCache(): void {
  revalidateTag(CACHE_TAGS.global, "max");
  revalidateTag(CACHE_TAGS.israel, "max");
  revalidateTag(CACHE_TAGS.meta, "max");
}

export { cacheTagForKind };
