"use client";

import Link from "next/link";
import { REFRESH_INTERVAL_DAYS, ROUTES } from "@/lib/config";
import { useI18n } from "@/components/providers/LocaleProvider";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto border-t border-border-subtle bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{t("app.name")}</p>
            <p className="mt-1 text-sm text-muted">
              {t("footer.refreshNote", { days: REFRESH_INTERVAL_DAYS })}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link
              href={ROUTES.global}
              className="text-muted transition-colors hover:text-foreground"
            >
              {t("nav.global")}
            </Link>
            <Link
              href={ROUTES.israel}
              className="text-muted transition-colors hover:text-foreground"
            >
              {t("nav.israel")}
            </Link>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
}
