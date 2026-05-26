import { NextResponse } from "next/server";
import { reportError } from "@/lib/monitoring/errors";

type ClientErrorPayload = {
  message?: string;
  name?: string;
  stack?: string;
  digest?: string;
  path?: string;
  component?: string;
};

export async function POST(request: Request) {
  let payload: ClientErrorPayload = {};

  try {
    payload = (await request.json()) as ClientErrorPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const error = new Error(payload.message ?? "Client error");
  error.name = payload.name ?? "ClientError";
  error.stack = payload.stack;

  await reportError(error, {
    source: "client",
    digest: payload.digest,
    path: payload.path,
    component: payload.component,
  });

  return NextResponse.json({ ok: true });
}
