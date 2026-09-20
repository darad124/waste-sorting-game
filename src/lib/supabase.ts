import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True when Supabase env vars are present. When false, the game runs exactly
 * as before and all feedback calls become no-ops (see src/api/feedback.ts),
 * so the app never breaks in environments without the keys.
 */
export const supabaseConfigured = Boolean(url && anonKey);

// A single shared client, or null when unconfigured.
export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
