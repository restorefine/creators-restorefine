import { config } from "dotenv";
import { createAdminClient, CREATOR_PHOTOS_BUCKET } from "../src/lib/supabase/admin";

config({ path: ".env" });
config({ path: ".env.local", override: true });

async function main() {
  const supabase = createAdminClient();

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(`Failed to list buckets: ${listError.message}`);
  }

  if (buckets?.some((bucket) => bucket.id === CREATOR_PHOTOS_BUCKET)) {
    console.log(`Bucket "${CREATOR_PHOTOS_BUCKET}" already exists.`);
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(CREATOR_PHOTOS_BUCKET, {
    public: false,
  });

  if (createError) {
    throw new Error(`Failed to create bucket: ${createError.message}`);
  }

  console.log(`Created private bucket "${CREATOR_PHOTOS_BUCKET}".`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
