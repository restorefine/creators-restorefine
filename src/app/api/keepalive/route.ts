import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ ok: false }, { status: 401 });
    }
  }

  await prisma.$queryRaw`SELECT 1`;

  return Response.json({ ok: true });
}
