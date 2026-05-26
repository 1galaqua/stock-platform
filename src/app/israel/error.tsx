"use client";

import { ErrorFallback } from "@/components/layout/ErrorFallback";

export default function IsraelError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <ErrorFallback
      error={error}
      unstable_retry={unstable_retry}
      title="Could not load Israeli dashboard"
      description="There was a problem loading TASE stock recommendations."
    />
  );
}
