import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

/** Which share targets have a purpose-made poster. Anything not listed is
 *  still captured from live gameplay, which is the right card for a mode
 *  whose screen IS the picture — but Trash Detective's screen is a menu,
 *  and a photograph of a menu tells a stranger nothing about the game.
 *
 *  LAZY, and that is load-bearing. These cards import the full scene and
 *  item artwork, so a static import drags 76 KB of SVG into the main bundle
 *  for every visitor — to render something only the capture script ever
 *  looks at. Importing OutlastShareCard directly did exactly that and took
 *  the entry chunk from 799 KB to 875 KB.
 *
 *  Kept apart from the components themselves so those files export nothing
 *  but components and fast refresh keeps working. */
export const SHARE_CARDS: Record<string, LazyExoticComponent<ComponentType>> = {
  "mode-detective": lazy(() =>
    import("./ShareCard").then((m) => ({ default: m.DetectiveShareCard })),
  ),
  // The route id is still "contamination" so old links keep resolving, but
  // the mode behind it is Outlast now.
  "mode-contamination": lazy(() =>
    import("./OutlastShareCard").then((m) => ({ default: m.OutlastShareCard })),
  ),
};
