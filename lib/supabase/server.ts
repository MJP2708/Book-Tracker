import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getEnv } from "@/lib/env";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const env = getEnv();

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(entries) {
        entries.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}