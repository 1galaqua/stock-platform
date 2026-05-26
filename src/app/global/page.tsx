import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { DashboardStatusBanner } from "@/components/dashboard/DashboardStatusBanner";
import { GlobalDashboard } from "@/components/dashboard/GlobalDashboard";
import { getDashboardMeta, getDashboardSnapshot } from "@/lib/services/dashboard";
import { formatUpdatedAt } from "@/lib/utils/format";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Global Recommended Stocks",
  description:
    "Weekly curated global stock recommendations with prices, charts, sentiment, and AI summaries.",
};

export default async function GlobalDashboardPage() {
  const [snapshot, refreshMeta] = await Promise.all([
    getDashboardSnapshot("global"),
    getDashboardMeta(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="accent" className="mb-3">
            Global market
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Global Recommended Stocks
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            20 weekly picks from reliable financial sources — prices, mini charts,
            sentiment, risk levels, and recommendation summaries.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Last updated: {formatUpdatedAt(snapshot.updatedAt)}
        </p>
      </div>

      <DashboardStatusBanner
        snapshot={snapshot}
        refreshMeta={refreshMeta}
        showRefresh
      />
      <GlobalDashboard stocks={snapshot.stocks} />
    </div>
  );
}
