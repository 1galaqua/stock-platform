import { getPlatformHealth } from "@/lib/services/dashboard";
import { NextResponse } from "next/server";

export async function GET() {
  const health = await getPlatformHealth();

  return NextResponse.json(health, {
    status: health.status === "unhealthy" ? 503 : 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
