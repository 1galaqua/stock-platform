import {
  invalidateDashboardCache,
  refreshAllDashboards,
} from "@/lib/services/dashboard";
import {
  isCronAuthorized,
  unauthorizedResponse,
} from "@/lib/api/auth";
import { NextResponse } from "next/server";

async function handleRefresh(request: Request) {
  if (!isCronAuthorized(request)) {
    return unauthorizedResponse();
  }

  const result = await refreshAllDashboards();
  invalidateDashboardCache();

  return NextResponse.json({
    ok: true,
    refreshedAt: result.meta.lastRefreshAttemptAt,
    status: result.meta.lastRefreshStatus,
    global: {
      stockCount: result.global.stocks.length,
      updatedAt: result.global.updatedAt,
    },
    israel: {
      stockCount: result.israel.stocks.length,
      updatedAt: result.israel.updatedAt,
    },
  });
}

export async function GET(request: Request) {
  return handleRefresh(request);
}

export async function POST(request: Request) {
  return handleRefresh(request);
}
