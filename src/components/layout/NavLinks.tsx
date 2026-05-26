"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/config";
import { useI18n } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

type NavLinksProps = {
  onNavigate?: () => void;
  className?: string;
  vertical?: boolean;
};

const NAV_KEYS = {
  [ROUTES.home]: "nav.home",
  [ROUTES.global]: "nav.global",
  [ROUTES.israel]: "nav.israel",
} as const;

export function NavLinks({
  onNavigate,
  className,
  vertical = false,
}: NavLinksProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav
      className={cn(
        vertical ? "flex flex-col gap-1" : "flex items-center gap-1",
        !vertical && "hidden md:flex",
        className,
      )}
      aria-label={t("nav.aria")}
    >
      {Object.entries(NAV_KEYS).map(([href, key]) => {
        const isActive =
          href === ROUTES.home
            ? pathname === ROUTES.home
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              vertical && "w-full",
              isActive
                ? "bg-accent/15 text-accent"
                : "text-muted hover:bg-surface-hover hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}
