"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/config";
import { cn } from "@/lib/utils";

type NavLinksProps = {
  onNavigate?: () => void;
  className?: string;
  vertical?: boolean;
};

export function NavLinks({
  onNavigate,
  className,
  vertical = false,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        vertical ? "flex flex-col gap-1" : "hidden items-center gap-1 md:flex",
        className,
      )}
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
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
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
