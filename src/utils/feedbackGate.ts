import type { GameMode } from "../api/feedback";

// Controls how often the feedback prompt is *shown* (separate from what the
// DB will accept). Keeps the experience from feeling nagging.

const SESSION_CAP = 1; // max prompts shown per browser session
const SESSION_COUNT_KEY = "ws_fb_session_count";

function levelKey(mode: GameMode, levelId: number | null): string {
  return `ws_fb_${mode}_${levelId ?? "x"}`;
}

function sessionShownCount(): number {
  try {
    return Number(sessionStorage.getItem(SESSION_COUNT_KEY) || "0");
  } catch {
    return 0;
  }
}

/**
 * Whether we may show the prompt for this mode+level right now.
 * False if we've already prompted here, or hit the per-session cap.
 */
export function canPrompt(mode: GameMode, levelId: number | null): boolean {
  try {
    if (localStorage.getItem(levelKey(mode, levelId))) return false;
  } catch {
    /* storage blocked -> treat as first time */
  }
  return sessionShownCount() < SESSION_CAP;
}

/**
 * Record that the prompt was shown for this mode+level. Call this whether the
 * player submits OR dismisses, so dismissing doesn't re-trigger it next time.
 */
export function markPrompted(mode: GameMode, levelId: number | null): void {
  try {
    localStorage.setItem(levelKey(mode, levelId), Date.now().toString());
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.setItem(SESSION_COUNT_KEY, String(sessionShownCount() + 1));
  } catch {
    /* ignore */
  }
}
