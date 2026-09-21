import React, { memo, useMemo } from "react";
import type { OutlastItem } from "./items";
import { laneMarkup } from "./markup";

/* ====================================================================== *
 *  One side of the race.
 *
 *  The SVG is written once as a string and handed over with
 *  dangerouslySetInnerHTML, which is deliberate. Decay is driven sixty times
 *  a second by setting attributes on filter primitives — a displacement
 *  scale, a mask threshold — and routing that through React state would
 *  re-render 3,000 nodes per frame to change four numbers. The markup is
 *  static and comes from our own module; only attributes move.
 *
 *  Which is exactly why the artwork is its own memoised component. Anything
 *  that re-renders the <svg> makes React write the markup back over the top,
 *  and every attribute the race has set is silently reset — the objects snap
 *  back to pristine mid-decay. LaneArt depends on nothing that changes during
 *  a race, so it renders once per pair and then holds still.
 * ====================================================================== */

const LaneArt = memo(function LaneArt({ prefix, item }: { prefix: string; item: OutlastItem }) {
  const html = useMemo(() => laneMarkup(prefix, item), [prefix, item]);
  return (
    <svg
      viewBox="0 0 300 420"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

interface LaneProps {
  prefix: string;
  item: OutlastItem;
  /** Undefined while the race runs — nothing is tappable then. */
  onPick?: () => void;
  picked: boolean;
  dimmed: boolean;
  verdict: string;
  verdictTone: "gone" | "warn" | "here" | "";
}

export const OutlastLane: React.FC<LaneProps> = ({
  prefix, item, onPick, picked, dimmed, verdict, verdictTone,
}) => (
  <button
    type="button"
    onClick={onPick}
    disabled={!onPick}
    aria-label={item.name}
    className={`ol-lane ${picked ? "ol-picked" : ""} ${dimmed ? "ol-dim" : ""}`}
  >
    <LaneArt prefix={prefix} item={item} />
    <div className="ol-floor" />
    <div className="ol-tag">
      {item.name}
      <span className={`ol-verdict ${verdict ? "ol-show" : ""} ol-${verdictTone}`}>
        {verdict || " "}
      </span>
    </div>
  </button>
);
