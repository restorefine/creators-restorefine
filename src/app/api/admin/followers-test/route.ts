import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Temporary: checks whether profile meta tags are reachable from Vercel.
const PROFILE_URLS = {
  instagram: (handle: string) => `https://www.instagram.com/${handle}/`,
  tiktok: (handle: string) => `https://www.tiktok.com/@${handle}`,
} as const;

type Platform = keyof typeof PROFILE_URLS;

function parseCount(raw: string) {
  const match = raw.replace(/,/g, "").match(/^([\d.]+)([kmb])?$/i);
  if (!match) return null;
  const multiplier = { k: 1e3, m: 1e6, b: 1e9 }[match[2]?.toLowerCase() as "k" | "m" | "b"] ?? 1;
  return Math.round(parseFloat(match[1]) * multiplier);
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const platform = (searchParams.get("platform") ?? "instagram") as Platform;
  const handle = (searchParams.get("handle") ?? "").replace(/^@/, "").trim();

  if (!(platform in PROFILE_URLS) || !/^[\w.]{1,30}$/.test(handle)) {
    return Response.json({ ok: false, error: "Invalid platform or handle" }, { status: 400 });
  }

  const url = PROFILE_URLS[platform](handle);
  const started = Date.now();

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "facebookexternalhit/1.1" },
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    const html = await res.text();
    const description =
      html.match(/property="og:description"\s+content="([^"]+)"/)?.[1] ?? null;
    const rawFollowers = description?.match(/([\d.,]+[KMBkmb]?)\s+Followers/)?.[1] ?? null;

    return Response.json({
      ok: rawFollowers !== null,
      platform,
      handle,
      httpStatus: res.status,
      finalUrl: res.url,
      ms: Date.now() - started,
      description,
      rawFollowers,
      followers: rawFollowers ? parseCount(rawFollowers) : null,
    });
  } catch (error) {
    return Response.json({
      ok: false,
      platform,
      handle,
      ms: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
