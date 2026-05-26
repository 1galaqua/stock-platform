import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { DashboardStatusBanner } from "@/components/dashboard/DashboardStatusBanner";
import { IsraelDashboard } from "@/components/dashboard/IsraelDashboard";
import { ROUTES } from "@/lib/config";
import { getDateLocale } from "@/lib/i18n/config";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getDashboardMeta, getDashboardSnapshot } from "@/lib/services/dashboard";
import { formatUpdatedAt } from "@/lib/utils/format";

export const revalidate = 604800;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();

  return createPageMetadata({
    title: t("israelPage.title"),
    description: t("israelPage.description"),
    path: ROUTES.israel,
    keywords: ["TASE", "Tel Aviv", "Israeli stocks", "ILS"],
  });
}

export default async function IsraelDashboardPage() {
  const { locale, t } = await getServerI18n();
  const dateLocale = getDateLocale(locale);

  const [snapshot, refreshMeta] = await Promise.all([
    getDashboardSnapshot("israel"),
    getDashboardMeta(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="neutral" className="mb-3">
            {t("israelPage.badge")}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("israelPage.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-muted">{t("israelPage.description")}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("israelPage.lastUpdated", {
            date: formatUpdatedAt(snapshot.updatedAt, dateLocale),
          })}
        </p>
      </div>

      <DashboardStatusBanner
        snapshot={snapshot}
        refreshMeta={refreshMeta}
        showRefresh
      />
      <IsraelDashboard
        stocks={snapshot.stocks}
        news={snapshot.news}
        marketSentiment={snapshot.marketSentiment}
      />
    </div>
  );
}
