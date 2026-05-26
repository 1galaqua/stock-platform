"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/config";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { NavLinks } from "@/components/layout/NavLinks";
import { useI18n } from "@/components/providers/LocaleProvider";

export function Header() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href={ROUTES.home}
          className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none transition-opacity hover:opacity-90"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
          </span>
          <div className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold tracking-tight">
              {t("app.name")}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {t("app.tagline")}
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <NavLinks />
          <LanguageToggle compact />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle compact />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface text-foreground"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? t("header.closeMenu") : t("header.openMenu")}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 top-16 z-40 bg-black/50 md:hidden"
            aria-label={t("header.closeOverlay")}
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-nav"
            className="absolute left-0 right-0 top-16 z-50 border-b border-border-subtle bg-surface p-4 md:hidden"
          >
            <NavLinks vertical onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      ) : null}
    </header>
  );
}
