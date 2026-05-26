"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type RefreshButtonProps = {
  className?: string;
};

export function RefreshButton({ className }: RefreshButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const enabled =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ENABLE_MANUAL_REFRESH === "true";

  if (!enabled) return null;

  async function handleRefresh() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/cron/refresh?trigger=manual", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Refresh request failed");
      }

      setMessage("Data refreshed");
      router.refresh();
    } catch {
      setMessage("Refresh failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={handleRefresh}
        disabled={loading}
        className="inline-flex h-9 items-center rounded-lg border border-border-subtle bg-surface px-3 text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Refreshing…" : "Refresh now"}
      </button>
      {message ? (
        <span className="text-xs text-muted" aria-live="polite">
          {message}
        </span>
      ) : null}
    </div>
  );
}
