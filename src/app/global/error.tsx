"use client";

import { ErrorFallback } from "@/components/layout/ErrorFallback";
import { useI18n } from "@/components/providers/LocaleProvider";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const { t } = useI18n();

  return (
    <ErrorFallback
      error={error}
      unstable_retry={unstable_retry}
      title={t("error.globalTitle")}
      description={t("error.globalDesc")}
      component="GlobalError"
    />
  );
}
