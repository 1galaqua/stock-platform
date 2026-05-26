import { env } from "@/lib/env";
import type { RefreshLogEntry } from "@/lib/types/stock";

export async function sendRefreshAlert(log: RefreshLogEntry): Promise<boolean> {
  if (!env.refreshAlertWebhookUrl) {
    return false;
  }

  if (log.status === "success") {
    return false;
  }

  try {
    const response = await fetch(env.refreshAlertWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "stock_platform.refresh.failed",
        status: log.status,
        trigger: log.trigger,
        message: log.message,
        startedAt: log.startedAt,
        finishedAt: log.finishedAt,
        durationMs: log.durationMs,
        global: log.global,
        israel: log.israel,
        errors: log.errors,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Refresh alert webhook failed", error);
    return false;
  }
}
