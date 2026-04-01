import type { User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AuthContext = {
  user: User | null;
  profile: { id: string; premium: boolean } | null;
};

export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id,premium")
    .eq("id", authData.user.id)
    .maybeSingle();

  return {
    user: authData.user,
    profile: profile ?? null,
  };
}