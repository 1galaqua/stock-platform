import Link from "next/link";
import { APP_NAME, REFRESH_INTERVAL_DAYS, ROUTES } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border-subtle bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{APP_NAME}</p>
            <p className="mt-1 text-sm text-muted">
              Recommendations refresh every {REFRESH_INTERVAL_DAYS} days from
              trusted market sources.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link
              href={ROUTES.global}
              className="text-muted transition-colors hover:text-foreground"
            >
              Global Stocks
            </Link>
            <Link
              href={ROUTES.israel}
              className="text-muted transition-colors hover:text-foreground"
            >
              Israeli Stocks
            </Link>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Not financial advice. Data and AI summaries are for informational
          purposes only.
        </p>
      </div>
    </footer>
  );
}
