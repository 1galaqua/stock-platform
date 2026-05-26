"use client";

import { useEffect } from "react";
import { useI18n } from "@/components/providers/LocaleProvider";
import { reportClientError } from "@/lib/monitoring/client";

type ErrorFallbackProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
  title?: string;
  description?: string;
  component?: string;
};

export function ErrorFallback({
  error,
  unstable_retry,
  title,
  description,
  component = "ErrorFallback",
}: ErrorFallbackProps) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
    void reportClientError(error, {
      digest: error.digest,
      component,
    });
  }, [error, component]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex max-w-md flex-col items-center rounded-xl border border-dashed border-border-subtle bg-surface px-6 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-negative/10 text-negative">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          {title ?? t("error.title")}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {description ?? t("error.description")}
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-muted"
        >
          {t("error.retry")}
        </button>
      </div>
    </div>
  );
}
