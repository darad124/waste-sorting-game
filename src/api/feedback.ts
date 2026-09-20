import { supabase, supabaseConfigured } from "../lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type GameMode = "arcade" | "trivia" | "detective" | "hunt" | "game_overall";

export type AgeRange =
  | "under_13"
  | "13_17"
  | "18_24"
  | "25_34"
  | "35_49"
  | "50_plus";

export const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: "under_13", label: "Under 13" },
  { value: "13_17", label: "13–17" },
  { value: "18_24", label: "18–24" },
  { value: "25_34", label: "25–34" },
  { value: "35_49", label: "35–49" },
  { value: "50_plus", label: "50+" },
];

export interface FeedbackInput {
  mode: GameMode;
  levelId: number | null;
  enjoyed: boolean;
  learned?: string | null;
  score?: number | null;
  accuracy?: number | null;
  stars?: number | null;
}

// ---------------------------------------------------------------------------
// Anonymous player identity (per device/browser, not a real account)
// ---------------------------------------------------------------------------
const PLAYER_ID_KEY = "ws_playerId";
const AGE_DONE_KEY = "ws_ageRecorded"; // local flag so we only ask age once

export function getPlayerId(): string {
  try {
    let id = localStorage.getItem(PLAYER_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(PLAYER_ID_KEY, id);
    }
    return id;
  } catch {
    // Private mode / storage blocked: fall back to an ephemeral id.
    return crypto.randomUUID();
  }
}

/** Whether we've already captured this player's age range. */
export function hasAgeOnRecord(): boolean {
  try {
    return localStorage.getItem(AGE_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Mark that we've shown the age question, so it is never asked again on this
 * device. Called after the first prompt whether or not an age was chosen —
 * the tables are insert-only, so age can only be captured at row creation.
 */
export function markAgeAsked() {
  try {
    localStorage.setItem(AGE_DONE_KEY, "1");
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Writes — the single seam every screen goes through.
// If Supabase isn't configured these resolve to { ok: false } without throwing,
// so the game is never blocked by a missing backend.
// ---------------------------------------------------------------------------

/** Ensure a players row exists, optionally recording the age range (once). */
async function ensurePlayer(ageRange?: AgeRange | null): Promise<void> {
  if (!supabase) return;
  const id = getPlayerId();

  const row: { id: string; age_range?: AgeRange } = { id };
  if (ageRange) row.age_range = ageRange;

  // Insert-only: ON CONFLICT DO NOTHING. The players table has no public
  // UPDATE policy, so a returning player's row is created once and never
  // altered. Age is therefore captured only on this first insert.
  const { error } = await supabase
    .from("players")
    .upsert(row, { onConflict: "id", ignoreDuplicates: true });

  if (error) throw error;
}

export interface SubmitResult {
  ok: boolean;
  skipped?: boolean; // backend not configured
  error?: string;
}

/**
 * Record a feedback response. The first answer for a given (player, mode,
 * level) wins; later resubmits are ignored by the DB (insert-only).
 */
export async function submitFeedback(
  input: FeedbackInput,
  ageRange?: AgeRange | null,
): Promise<SubmitResult> {
  if (!supabaseConfigured || !supabase) {
    return { ok: false, skipped: true };
  }

  try {
    await ensurePlayer(ageRange);

    const learned = input.learned?.trim() ? input.learned.trim().slice(0, 500) : null;

    const { error } = await supabase.from("feedback").upsert(
      {
        player_id: getPlayerId(),
        game_mode: input.mode,
        level_id: input.levelId,
        enjoyed: input.enjoyed,
        learned,
        score: input.score ?? null,
        accuracy: input.accuracy ?? null,
        stars: input.stars ?? null,
      },
      // Insert-only: ON CONFLICT DO NOTHING (first answer wins). No public
      // UPDATE policy exists, so existing feedback can never be overwritten.
      { onConflict: "player_id,game_mode,level_id", ignoreDuplicates: true },
    );

    if (error) throw error;
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
