import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";

export function getSupabaseAdminClient() {
  const env = getEnv();

  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}