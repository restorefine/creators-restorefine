"use server";

import { fetchFollowers, isLookupPlatform } from "@/lib/followers";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function lookupFollowers(platform: string, handle: string): Promise<number | null> {
  if (!isLookupPlatform(platform)) return null;
  if (!(await rateLimit(`followers:ip:${await getClientIp()}`, 20, 10 * 60))) return null;
  return fetchFollowers(platform, handle);
}
