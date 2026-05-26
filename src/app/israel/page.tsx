import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { DashboardStatusBanner } from "@/components/dashboard/DashboardStatusBanner";
import { IsraelDashboard } from "@/components/dashboard/IsraelDashboard";
import { getDashboardSnapshot } from "@/lib/services/dashboard";
import { formatUpdatedAt } from "@/lib/utils/format";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Israeli Stocks (TASE)",
  description:
    "Tel Aviv Stock Exchange dashboard with bilingual names, charts, news, and sector filters.",
};

export default async function IsraelDashboardPage() {
  const snapshot = await getDashboardSnapshot("israel");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="neutral" className="mb-3">
            TASE · Tel Aviv · ₪ ILS
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Israeli Stocks Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            Top TASE recommendations with Hebrew and English names, daily and
            weekly performance, market news, and sentiment.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Last updated: {formatUpdatedAt(snapshot.updatedAt)}
        </p>
      </div>

      <DashboardStatusBanner snapshot={snapshot} showRefresh />
      <IsraelDashboard
        stocks={snapshot.stocks}
        news={snapshot.news}
        marketSentiment={snapshot.marketSentiment}
      />
    </div>
  );
}
