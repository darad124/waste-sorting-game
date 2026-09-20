import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True when Supabase env vars are present. When false, the game runs exactly
 * as before and all feedback calls become no-ops (see src/api/feedback.ts),
 * so the app never breaks in environments without the keys.
 */
export const supabaseConfigured = Boolean(url && anonKey);

/**
 * Auth-enabled client — used ONLY by the admin dashboard, which needs a
 * persisted login session.
 */
export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "ws-admin-auth",
      },
    })
  : null;

/**
 * Write-only client for gameplay feedback. It deliberately does NOT persist or
 * attach any auth session, so it always authenticates with the anon/publishable
 * key alone. This keeps a stale admin login from ever poisoning feedback writes
 * with an expired Bearer token (which would 401).
 */
export const supabaseWrite: SupabaseClient | null = supabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;
