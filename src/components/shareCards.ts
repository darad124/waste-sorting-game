import type { FC } from "react";
import { DetectiveShareCard } from "./ShareCard";
import { OutlastShareCard } from "./OutlastShareCard";

/** Which share targets have a purpose-made poster. Anything not listed is
 *  still captured from live gameplay, which is the right card for a mode
 *  whose screen IS the picture — but Trash Detective's screen is a menu,
 *  and a photograph of a menu tells a stranger nothing about the game.
 *
 *  Kept apart from the component itself so the component file exports
 *  nothing but components and fast refresh keeps working. */
export const SHARE_CARDS: Record<string, FC> = {
  "mode-detective": DetectiveShareCard,
  // The route id is still "contamination" so old links keep resolving, but
  // the mode behind it is Outlast now.
  "mode-contamination": OutlastShareCard,
};
