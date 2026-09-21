import type { FC, ReactNode } from "react";

/* ====================================================================== *
 *  Shown while a mode's artwork chunk is on its way.
 *
 *  Every mode here is code-split because the art is the bulk of it — the
 *  Park scene alone is 180 KB and Outlast carries 25 hand-drawn objects —
 *  and somebody who came to play Arcade should download none of it. The
 *  cost is a gap between tapping the tile and seeing anything, which on a
 *  warm cache is one frame and on a cold phone is not.
 *
 *  Filling that gap with an empty coloured rectangle reads as a broken
 *  app. This says what is happening, and keeps moving so it is obvious
 *  that something still is.
 * ====================================================================== */

interface ModeLoaderProps {
  /** What is being fetched, in the mode's own words. */
  label: string;
  icon?: ReactNode;
  /** Covers the whole viewport rather than sitting inside the shell. */
  fullBleed?: boolean;
  /** Matches the mode's own background so there is no flash of the wrong
   *  colour on the way in. */
  background?: string;
}

export const ModeLoader: FC<ModeLoaderProps> = ({
  label, icon, fullBleed = false, background,
}) => (
  <div
    className={`ml-root ${fullBleed ? "ml-full" : ""}`}
    style={background ? { background } : undefined}
    role="status"
    aria-live="polite"
  >
    {icon && <div className="ml-icon">{icon}</div>}
    <p className="ml-label">{label}</p>
    <div className="ml-bar" aria-hidden>
      <span />
    </div>
  </div>
);
