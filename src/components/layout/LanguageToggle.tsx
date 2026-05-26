"use client";

import { useI18n } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

const options: Array<{ locale: Locale; labelKey: "language.en" | "language.he" }> =
  [
    { locale: "en", labelKey: "language.en" },
    { locale: "he", labelKey: "language.he" },
  ];

type LanguageToggleProps = {
  className?: string;
  compact?: boolean;
};

export function LanguageToggle({
  className,
  compact = false,
}: LanguageToggleProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="group"
      aria-label={t("language.label")}
    >
      {options.map((option) => {
        const selected = locale === option.locale;

        return (
          <button
            key={option.locale}
            type="button"
            onClick={() => setLocale(option.locale)}
            className={cn(
              "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              selected
                ? "border-accent/40 bg-accent/15 text-accent"
                : "border-border-subtle bg-surface text-muted hover:border-border hover:bg-surface-hover hover:text-foreground",
            )}
            aria-pressed={selected}
            aria-label={t(option.labelKey)}
          >
            {t(option.labelKey)}
          </button>
        );
      })}
      {!compact ? (
        <span className="hidden text-xs text-muted-foreground lg:inline">
          {t("language.label")}
        </span>
      ) : null}
    </div>
  );
}
