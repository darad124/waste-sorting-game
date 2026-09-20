import { supabaseWrite, supabaseConfigured } from "../lib/supabase";
import { getPlayerId } from "./feedback";

const VISIT_LOGGED_KEY = "ws_visitLogged"; // sessionStorage: one visit per session

/**
 * Record a single site visit for this session. Safe to call on every app load:
 * it fires at most once per browser session, is a no-op when Supabase isn't
 * configured, and never throws (fire-and-forget).
 */
export async function logVisit(): Promise<void> {
  if (!supabaseConfigured || !supabaseWrite) return;

  try {
    if (sessionStorage.getItem(VISIT_LOGGED_KEY)) return;
    sessionStorage.setItem(VISIT_LOGGED_KEY, "1");
  } catch {
    // Storage blocked (private mode): fall through and log the visit anyway.
  }

  try {
    // Plain insert (write-only): anon has INSERT but no SELECT, so an upsert
    // that returns the row would fail the SELECT policy.
    await supabaseWrite.from("visits").insert({
      player_id: getPlayerId(),
      referrer: document.referrer || null,
      path: window.location.pathname || null,
    });
  } catch {
    /* analytics must never break the app */
  }
}
