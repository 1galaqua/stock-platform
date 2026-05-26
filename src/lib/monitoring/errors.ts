import { env } from "@/lib/env";

export type ErrorReportContext = {
  source: "server" | "client" | "cron" | "api";
  digest?: string;
  path?: string;
  component?: string;
  extra?: Record<string, unknown>;
};

function serializeError(error: unknown): {
  name: string;
  message: string;
  stack?: string;
} {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    name: "UnknownError",
    message: String(error),
  };
}

export async function reportError(
  error: unknown,
  context: ErrorReportContext,
): Promise<void> {
  const payload = {
    event: "stock_platform.error",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    error: serializeError(error),
    context,
  };

  console.error("[monitoring]", JSON.stringify(payload));

  const webhook = env.errorReportingWebhookUrl ?? env.refreshAlertWebhookUrl;
  if (!webhook) return;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (reportingError) {
    console.error("Error reporting webhook failed", reportingError);
  }
}
