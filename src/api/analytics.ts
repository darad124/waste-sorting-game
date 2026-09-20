import { supabaseWrite, supabaseConfigured } from "../lib/supabase";
import { getPlayerId } from "./feedback";

const VISIT_LOGGED_KEY = "ws_visitLogged"; // sessionStorage: one visit per session
const COUNTRY_KEY = "ws_country";

/** Coarse device category from the user agent. */
function deviceType(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent || "";
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod|IEMobile|BlackBerry|Opera Mini/i.test(ua)) return "mobile";
  return "desktop";
}

/**
 * Country from the Vercel edge (server-side IP -> ISO code, no raw IP exposed).
 * Returns null off Vercel (e.g. localhost) or if the endpoint is unavailable.
 */
async function getCountry(): Promise<string | null> {
  try {
    const cached = sessionStorage.getItem(COUNTRY_KEY);
    if (cached !== null) return cached || null;
  } catch {
    /* ignore */
  }
  try {
    const res = await fetch("/api/geo", { cache: "no-store" });
    if (!res.ok) return null;
    const { country } = (await res.json()) as { country: string | null };
    try {
      sessionStorage.setItem(COUNTRY_KEY, country ?? "");
    } catch {
      /* ignore */
    }
    return country || null;
  } catch {
    return null;
  }
}

/**
 * Record a single site visit for this session with coarse, anonymous
 * demographics (language, device, country). Fires at most once per session,
 * is a no-op when Supabase isn't configured, and never throws.
 */
export async function logVisit(): Promise<void> {
  if (!supabaseConfigured || !supabaseWrite) return;

  try {
    if (sessionStorage.getItem(VISIT_LOGGED_KEY)) return;
    sessionStorage.setItem(VISIT_LOGGED_KEY, "1");
  } catch {
    /* storage blocked: log anyway */
  }

  try {
    const country = await getCountry();
    // Plain insert (write-only): anon has INSERT but no SELECT.
    await supabaseWrite.from("visits").insert({
      player_id: getPlayerId(),
      referrer: document.referrer || null,
      path: window.location.pathname || null,
      language: navigator.language || null,
      device: deviceType(),
      country,
    });
  } catch {
    /* analytics must never break the app */
  }
}
