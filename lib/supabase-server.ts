import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server credentials are not configured.");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export async function ensurePublicBucket(bucket: string) {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.storage.listBuckets();
  const fileSizeLimit = bucket === "listing-videos" ? 250 * 1024 * 1024 : 20 * 1024 * 1024;

  if (!data?.some((entry) => entry.name === bucket)) {
    const { error } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit
    });
    if (error && !error.message.toLowerCase().includes("already exists")) throw error;
  } else {
    const { error } = await supabase.storage.updateBucket(bucket, { public: true, fileSizeLimit });
    if (error) throw error;
  }

  return supabase;
}
