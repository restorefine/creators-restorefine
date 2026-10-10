// Reads public follower counts from profile pages. Unofficial and may break
// if Instagram/TikTok change their markup — callers must treat null as
// "unknown" and fall back to the creator's own number.

export const LOOKUP_PLATFORMS = ["instagram", "tiktok"] as const;
export type LookupPlatform = (typeof LOOKUP_PLATFORMS)[number];

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

export function isLookupPlatform(platform: string): platform is LookupPlatform {
  return (LOOKUP_PLATFORMS as readonly string[]).includes(platform);
}

export function normaliseHandle(handle: string) {
  const cleaned = handle.trim().replace(/^@/, "");
  return /^[\w.]{1,30}$/.test(cleaned) ? cleaned : null;
}

async function fetchHtml(url: string, userAgent: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": userAgent },
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  return res.ok ? res.text() : null;
}

export async function fetchFollowers(platform: LookupPlatform, rawHandle: string): Promise<number | null> {
  const handle = normaliseHandle(rawHandle);
  if (!handle) return null;

  try {
    if (platform === "instagram") {
      const html = await fetchHtml(`https://www.instagram.com/${handle}/embed/`, "Mozilla/5.0");
      const match = html?.match(/followers_count\\?":(\d+)/);
      return match ? Number(match[1]) : null;
    }

    const html = await fetchHtml(`https://www.tiktok.com/@${handle}?lang=en`, BROWSER_UA);
    const match = html?.match(/"followerCount":(\d+)/);
    return match ? Number(match[1]) : null;
  } catch {
    return null;
  }
}
