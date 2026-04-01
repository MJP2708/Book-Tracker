const requiredServerKeys = ["SUPABASE_URL", "SUPABASE_ANON_KEY"] as const;

export function hasSupabaseEnv() {
  return requiredServerKeys.every((key) => Boolean(process.env[key]));
}

export function getEnv() {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    supabaseUrl: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    openAiApiKey: process.env.OPENAI_API_KEY,
    openAiModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
  };
}