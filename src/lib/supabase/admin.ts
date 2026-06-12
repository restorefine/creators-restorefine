import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only client using the service role key. Bypasses RLS.
 * Never import this from client components.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export const CREATOR_PHOTOS_BUCKET = "creator-photos";

const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

export async function getSignedPhotoUrl(path: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(CREATOR_PHOTOS_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error) {
    return null;
  }
  return data.signedUrl;
}
