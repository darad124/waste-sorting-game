import React, { useEffect } from "react";
import { ITEMS } from "./outlast/items";
import { laneMarkup } from "./outlast/markup";
import { apply } from "./outlast/decay";

/* ==================================================================== *
 *  Outlast — link preview poster.
 *
 *  A link preview is a POSTER, not a screenshot. The old card for this
 *  slot was a photograph of Imposter Hunt, a mode that no longer exists.
 *
 *  Rendered at exactly 1200x630 and captured by
 *  scripts/capture-gameplay-share-cards.mjs through ?card=<target>.
 *  Deliberately a SEPARATE query from ?share=, which is the link a real
 *  person follows: they should land in the game, not on a picture of it.
 *
 *  The two objects are the real library art run through the real decay
 *  function, so the poster cannot drift away from what the game shows.
 *  One eaten through, one untouched, side by side — which is the entire
 *  game in a single frame and needs no caption to explain it.
 * ==================================================================== */

/** A paper bag most of the way gone against a pristine glass bottle. The
 *  pairing matters: two objects somebody would throw away in the same
 *  minute, with nothing in common by the time the clock stops. */
// 0.42, and the window is narrow. Much past 0.5 the hole mask has taken so
// much of the bag that all a stranger sees is brown debris; past 0.7 the lane
// is empty, which is a picture of nothing. Here the silhouette still reads as
// a bag, and a bag visibly coming apart says far more than its wreckage does.
const LEFT = { id: "paper_bag", decay: 0.42 };
const RIGHT = { id: "glass_bottle", decay: 0 };

const CHIPS = ["Cigarette butt", "Coffee cup", "Foam cup", "Tin can"];

export const OutlastShareCard: React.FC = () => {
  useEffect(() => {
    apply("sc0_", ITEMS[LEFT.id], LEFT.decay);
    apply("sc1_", ITEMS[RIGHT.id], RIGHT.decay);
  }, []);

  const lane = (prefix: string, id: string) => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <svg
        viewBox="0 0 300 420"
        preserveAspectRatio="xMidYMax meet"
        style={{ width: "100%", height: 400, display: "block" }}
        dangerouslySetInnerHTML={{ __html: laneMarkup(prefix, ITEMS[id]) }}
      />
    </div>
  );

  return (
    <div
      style={{
        width: 1200, height: 630, background: "#FDE047", position: "relative",
        overflow: "hidden", display: "flex", alignItems: "center",
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        color: "#2A2418", WebkitFontSmoothing: "antialiased",
      }}
    >
      <div style={{ width: 560, paddingLeft: 64, paddingRight: 24, flexShrink: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 800, letterSpacing: ".26em",
          textTransform: "uppercase", color: "#96600C", marginBottom: 20,
        }}>
          EcoSort
        </div>
        <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: "-.035em", lineHeight: .95 }}>
          Outlast
        </div>
        <p style={{
          marginTop: 22, marginBottom: 0, fontSize: 23, lineHeight: 1.45,
          fontWeight: 600, color: "#4A4024", maxWidth: 440,
        }}>
          Two bits of rubbish. One of them is still here in a hundred years.
          Which one?
        </p>
        <div style={{ marginTop: 26, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CHIPS.map((c) => (
            <span key={c} style={{
              fontSize: 14, fontWeight: 700, color: "#4A4024",
              background: "rgba(255,255,255,.55)", border: "1px solid rgba(42,36,24,.12)",
              borderRadius: 999, padding: "7px 14px",
            }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 8, paddingRight: 56, paddingBottom: 96 }}>
        {lane("sc0_", LEFT.id)}
        {lane("sc1_", RIGHT.id)}
      </div>

      {/* The verdicts, which are what make the two halves mean something */}
      <div style={{
        position: "absolute", right: 56, bottom: 54, width: 552,
        display: "flex", gap: 8, textAlign: "center",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 800 }}>Paper bag</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#9A5A2E", marginTop: 4 }}>gone in 1 month</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 800 }}>Glass bottle</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#96600C", marginTop: 4 }}>still here</div>
        </div>
      </div>
      <div style={{
        position: "absolute", right: 56, bottom: 116, width: 552, height: 1,
        background: "linear-gradient(to right, transparent, rgba(42,36,24,.22) 15%, rgba(42,36,24,.22) 85%, transparent)",
      }} />
    </div>
  );
};
