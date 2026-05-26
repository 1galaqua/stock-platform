import { getDashboardSnapshot } from "@/lib/services/dashboard";
import { NextResponse } from "next/server";

export async function GET() {
  const snapshot = await getDashboardSnapshot("global");

  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
