import { env } from "@/lib/env";

export function isCronAuthorized(request: Request): boolean {
  if (!env.cronSecret) {
    return process.env.NODE_ENV === "development";
  }

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${env.cronSecret}`;
}

export function unauthorizedResponse(): Response {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
