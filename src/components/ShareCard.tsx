import React, { Suspense, useEffect, useState } from "react";
import { CASES, CLUE_ART, CLUE_BOX, DEFAULT_CLUE_BOX } from "./detective/cases";

/* ==================================================================== *
 *  Share cards.
 *
 *  A link preview is a POSTER, not a screenshot. The Trash Detective
 *  card used to be a photograph of its own menu — five text rows on a
 *  yellow background — which told a stranger nothing about the game and
 *  showed none of the artwork it is made of.
 *
 *  This renders at exactly 1200x630, the size Open Graph and Twitter
 *  ask for, and is captured by scripts/capture-gameplay-share-cards.mjs
 *  through ?card=<target>. It is deliberately a SEPARATE query from
 *  ?share=, which is the link a real person follows: they should land in
 *  the game, not on a poster of it.
 * ==================================================================== */

/** The scene the card is cut from, and the window of it that is used.
 *  The scenes are 1200x900 and the card is 1200x630, so something has to
 *  go; this picks the band rather than letting a crop choose. It is
 *  dropped low enough that the litter is in it, because the litter is the
 *  whole point of the picture. */
const CARD_CASE = "park";

/** Two clues, ringed the way an evidence photo rings things. The
 *  coordinates come from the case itself, so they cannot drift away from
 *  the artwork underneath. Both are on the RIGHT of the band, clear of the
 *  type, and they are deliberately two things that look nothing like each
 *  other — a sandwich still in its cling film, and an opened steel can. */
const RINGED = ["p5", "p4"];

/** The card is 1200x630 and the scene is 1200x900, so the scene's frame is
 *  scaled up until the chosen band is the full width and then slid so that
 *  band is what shows. Doing it this way rather than with an SVG viewBox
 *  means the frame is the SAME thing the game renders — backdrop plus the
 *  clue overlay on top of it — instead of the backdrop on its own, which is
 *  a picture of a park with no rubbish in it. */
const BAND = { x: 60, y: 300, w: 1120 };
const K = 1200 / BAND.w;

export const DetectiveShareCard: React.FC = () => {
  const kase = CASES.find((c) => c.id === CARD_CASE)!;
  const [ready, setReady] = useState(false);

  // The capture browser screenshots on a virtual-time budget, so the
  // scene's chunk has to be in before anything is painted.
  useEffect(() => {
    let live = true;
    kase.preload().then(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, [kase]);

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        position: "relative",
        overflow: "hidden",
        background: "#14301f",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -BAND.x * K,
          top: -BAND.y * K,
          width: 1200 * K,
          height: 900 * K,
        }}
      >
        {ready && (
          <Suspense fallback={null}>
            <kase.Scene />
          </Suspense>
        )}

        {/* the litter, seated exactly where the game seats it */}
        {ready &&
          kase.items.map((item) => {
            const box = CLUE_BOX[item.id] ?? DEFAULT_CLUE_BOX;
            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  top: item.top,
                  left: item.left,
                  width: `${(box.w / 1200) * 100}%`,
                  height: `${(box.h / 900) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {CLUE_ART[item.id]}
              </div>
            );
          })}

        {/* Evidence rings. The dashes are the whole idiom — a solid circle
            is a target, a dashed one is something somebody has marked. */}
        <svg
          viewBox="0 0 1200 900"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          {RINGED.map((id, i) => {
            const item = kase.items.find((it) => it.id === id)!;
            const cx = (parseFloat(item.left) / 100) * 1200;
            const cy = (parseFloat(item.top) / 100) * 900;
            const r = i === 0 ? 74 : 62;
            return (
              <g key={id}>
                <circle cx={cx + 2} cy={cy + 3} r={r} fill="none" stroke="#12200F"
                        strokeOpacity=".4" strokeWidth="7" strokeDasharray="15 11" />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FFF3C4"
                        strokeWidth="3.5" strokeDasharray="15 11" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* a scrim, so the type has something to sit on wherever the crop
          lands rather than fighting the grass for contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(101deg, rgba(8,20,13,.93) 0%, rgba(8,20,13,.8) 28%," +
            " rgba(8,20,13,.2) 54%, rgba(8,20,13,0) 70%)",
        }}
      />

      <div style={{ position: "absolute", left: 64, top: 122, width: 520 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#FFE9A0",
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFE9A0" strokeWidth="3">
            <circle cx="10.5" cy="10.5" r="7" />
            <path d="M16 16l5 5" strokeLinecap="round" />
          </svg>
          EcoSort
        </div>

        <h1
          style={{
            margin: "14px 0 0",
            color: "#FFFFFF",
            fontSize: 74,
            lineHeight: "0.96",
            fontWeight: 900,
            letterSpacing: "-0.028em",
          }}
        >
          Trash
          <br />
          Detective
        </h1>

        <p
          style={{
            margin: "22px 0 0",
            color: "#DCEBD8",
            fontSize: 22,
            lineHeight: "1.38",
            fontWeight: 600,
            maxWidth: 470,
          }}
        >
          Five scenes. Five pieces of litter in each. Not everything here is
          rubbish — find what is, and don't spoil a bin guessing.
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 26 }}>
          {CASES.map((c) => (
            <span
              key={c.id}
              style={{
                color: "#0C1B12",
                background: "rgba(255,243,196,.92)",
                borderRadius: 999,
                padding: "6px 13px",
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: "0.04em",
              }}
            >
              {c.title.split(" ")[0]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
