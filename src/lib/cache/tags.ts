import type { DashboardKind } from "@/lib/types/stock";

export const CACHE_TAGS = {
  global: "global-stocks",
  israel: "israel-stocks",
  meta: "dashboard-meta",
} as const;

export const CACHE_REVALIDATE_SECONDS = 60 * 60 * 24 * 7;

export function cacheTagForKind(kind: DashboardKind): string {
  return kind === "global" ? CACHE_TAGS.global : CACHE_TAGS.israel;
}
