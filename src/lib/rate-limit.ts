import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getClientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/**
 * Fixed-window limiter backed by Postgres so it works across serverless
 * instances. Returns true if the request is allowed.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const rows = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "rate_limits" ("key", "count", "windowStart")
    VALUES (${key}, 1, now())
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "rate_limits"."windowStart" < now() - ${windowSeconds}::int * interval '1 second' THEN 1
        ELSE "rate_limits"."count" + 1
      END,
      "windowStart" = CASE
        WHEN "rate_limits"."windowStart" < now() - ${windowSeconds}::int * interval '1 second' THEN now()
        ELSE "rate_limits"."windowStart"
      END
    RETURNING "count"
  `;
  return rows[0].count <= limit;
}
