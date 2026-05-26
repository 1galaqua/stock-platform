import Link from "next/link";
import { REFRESH_INTERVAL_DAYS, ROUTES } from "@/lib/config";
import { getServerI18n } from "@/lib/i18n/server";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function HomePage() {
  const { t } = await getServerI18n();

  const dashboards = [
    {
      href: ROUTES.global,
      title: t("home.global.title"),
      description: t("home.global.description"),
      badge: t("home.global.badge"),
      accent: "text-accent",
    },
    {
      href: ROUTES.israel,
      title: t("home.israel.title"),
      description: t("home.israel.description"),
      badge: t("home.israel.badge"),
      accent: "text-warning",
    },
  ] as const;

  const features = [
    {
      title: t("home.features.sentiment.title"),
      body: t("home.features.sentiment.body"),
    },
    {
      title: t("home.features.risk.title"),
      body: t("home.features.risk.body"),
    },
    {
      title: t("home.features.sources.title"),
      body: t("home.features.sources.body"),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-12 max-w-3xl">
        <Badge variant="accent" className="mb-4">
          {t("home.badge")}
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t("home.title")}
        </h1>
        <p className="mt-4 text-lg text-muted">
          {t("home.description", {
            appName: t("app.name"),
            days: REFRESH_INTERVAL_DAYS,
          })}
        </p>
      </section>

      <section
        className="grid gap-6 md:grid-cols-2"
        aria-label={t("home.dashboardsAria")}
      >
        {dashboards.map((dashboard) => (
          <Link
            key={dashboard.href}
            href={dashboard.href}
            className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`${t("home.openDashboard")} — ${dashboard.title}`}
          >
            <Card hover padding="lg" className="h-full">
              <CardHeader className="mb-0">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <CardTitle className="text-xl transition-colors group-hover:text-accent">
                    {dashboard.title}
                  </CardTitle>
                  <Badge variant="outline">{dashboard.badge}</Badge>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {dashboard.description}
                </CardDescription>
              </CardHeader>
              <span
                className={`mt-6 inline-flex items-center gap-2 text-sm font-medium ${dashboard.accent}`}
              >
                {t("home.openDashboard")}
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </Card>
          </Link>
        ))}
      </section>

      <section
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label={t("home.highlightsAria")}
      >
        {features.map((feature) => (
          <Card key={feature.title} padding="md">
            <CardTitle className="mb-2">{feature.title}</CardTitle>
            <CardDescription>{feature.body}</CardDescription>
          </Card>
        ))}
      </section>
    </div>
  );
}
