const ARCADE_TUTORIAL_KEY = "ws_seenArcadeTutorial";
const DETECTIVE_TUTORIAL_KEY = "ws_seenDetectiveTutorial";

/** Whether the player has already been shown the Arcade "how to play" overlay. */
export function hasSeenArcadeTutorial(): boolean {
  try {
    return localStorage.getItem(ARCADE_TUTORIAL_KEY) === "1";
  } catch {
    return false;
  }
}

export function markArcadeTutorialSeen(): void {
  try {
    localStorage.setItem(ARCADE_TUTORIAL_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** Whether the player has already been shown the Trash Detective "how to play" overlay. */
export function hasSeenDetectiveTutorial(): boolean {
  try {
    return localStorage.getItem(DETECTIVE_TUTORIAL_KEY) === "1";
  } catch {
    return false;
  }
}

export function markDetectiveTutorialSeen(): void {
  try {
    localStorage.setItem(DETECTIVE_TUTORIAL_KEY, "1");
  } catch {
    /* ignore */
  }
}
