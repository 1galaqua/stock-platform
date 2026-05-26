import {
  isCronAuthorized,
  unauthorizedResponse,
} from "@/lib/api/auth";
import { runWeeklyRefresh, resolveRefreshTrigger } from "@/lib/services/refresh";
import { NextResponse } from "next/server";

async function handleRefresh(request: Request) {
  if (!isCronAuthorized(request)) {
    return unauthorizedResponse();
  }

  const trigger = resolveRefreshTrigger(request);
  const result = await runWeeklyRefresh(trigger);

  return NextResponse.json(
    {
      ok: result.log.status !== "failed",
      refreshedAt: result.log.finishedAt,
      status: result.log.status,
      trigger: result.log.trigger,
      durationMs: result.log.durationMs,
      message: result.log.message,
      global: result.log.global,
      israel: result.log.israel,
      errors: result.log.errors,
    },
    { status: result.log.status === "failed" ? 500 : 200 },
  );
}

export async function GET(request: Request) {
  return handleRefresh(request);
}

export async function POST(request: Request) {
  return handleRefresh(request);
}
