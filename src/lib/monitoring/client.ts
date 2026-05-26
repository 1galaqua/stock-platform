"use client";

type ClientErrorContext = {
  digest?: string;
  path?: string;
  component?: string;
};

export async function reportClientError(
  error: Error,
  context: ClientErrorContext = {},
): Promise<void> {
  try {
    await fetch("/api/monitoring/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        name: error.name,
        stack: error.stack,
        digest: context.digest,
        path: context.path ?? window.location.pathname,
        component: context.component,
      }),
      keepalive: true,
    });
  } catch {
    // Ignore secondary reporting failures.
  }
}
