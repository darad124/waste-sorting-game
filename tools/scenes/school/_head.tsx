import React, { useEffect, useState } from "react";
import { playSound } from "../../utils/audio";

/* ==================================================================== *
 *  School Lunch — high-fidelity scene
 *
 *  One SVG on a fixed 1200x900 viewBox, matching the frame's 4:3, so the
 *  art never distorts.
 *
 *  The fifth camera, and the only interior of the five. Indoors the
 *  horizon is EYE LEVEL, and eye level is a real line on the back wall —
 *  so unlike the outdoor scenes it belongs inside the frame, at y=120.
 *  Everything else falls out of five numbers: a 1300px lens, the near edge
 *  of the table 1.95m away, the camera 1.907m off the floor, the table
 *  1.8m by 1.1m at 0.75m high, and the back wall at 10m. From those come
 *  the vanishing point, where the table's far edge lands, how fast the
 *  floor tiles compress, how big a clock is at that distance, and the two
 *  scale rules everything in the room is drawn with.
 *
 *  Light: tall windows in the right-hand wall, out of frame. A window
 *  throws its own SHAPE, not a glow, so it lands as rectangles — and a
 *  rectangle on a horizontal plane has two vanishing points on the
 *  horizon, both shared by the floor and the table, because parallel
 *  horizontal directions vanish at the same point whatever height the
 *  plane is at. That is what makes the light on the table and the light
 *  on the floor read as one beam broken by a table.
 *
 *  The five pieces of litter are NOT in this backdrop — the game has to
 *  tap, light and remove them, so they live in schoolClues.tsx and are
 *  positioned by the screen.
 * ==================================================================== */

/** Things on this table that are genuinely confusable with litter but are
 *  not waste. Each carries its own note rather than a template.
 *
 *  The bin is the one that teaches, and it teaches by being across the hall
 *  from all of this. */
const DECOYS: { label: string; note: string; x: number; y: number; w: number; h: number }[] = [
  { label: "lunch tray",    note: "That goes back on the rack, not in a bin.",       x: 292,  y: 719, w: 256, h: 92  },
  { label: "stack of trays", note: "Somebody already cleared those.",                x: 768,  y: 524, w: 216, h: 140 },
  { label: "exercise book", note: "Half a term's homework in there.",                x: 500,  y: 810, w: 260, h: 84  },
  { label: "beaker",        note: "Water. Still someone's.",                         x: 338,  y: 674, w: 44,  h: 54  },
  { label: "banana",        note: "That's a banana. Come back when it's a peel.",    x: 639,  y: 766, w: 134, h: 40  },
  { label: "pencil case",   note: "Not rubbish. Somebody will cry.",                 x: 988,  y: 844, w: 140, h: 40  },
  { label: "lanyard",       note: "Somebody's name is on that.",                     x: 490,  y: 678, w: 140, h: 44  },
  { label: "rucksack",      note: "That is a whole school day in a bag.",            x: 263,  y: 526, w: 134, h: 112 },
  { label: "bin",           note: "A bin. Across the hall. Remember that.",          x: 502,  y: 318, w: 92,  h: 128 },
];

interface SchoolSceneProps {
  /** Called with that object's own note when the player taps something that
   *  turns out not to be litter. */
  onDecoy?: (note: string) => void;
}

export const SchoolScene: React.FC<SchoolSceneProps> = ({ onDecoy }) => {
  // Three things the player can poke at. The cracked tablet is deliberately
  // NOT one of them: it is a clue, and tapping a clue has to open the
  // sorting picker, so the third toy is the water jug instead.
  const [ringing, setRinging] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [sloshing, setSloshing] = useState(false);

  // Each one-shot is owned by the state that ends it rather than by a ref,
  // so it cleans itself up if the scene unmounts mid-cycle.
  useEffect(() => {
    if (!ringing) return;
    const t = window.setTimeout(() => setRinging(false), 1300);
    return () => window.clearTimeout(t);
  }, [ringing]);

  useEffect(() => {
    if (!launched) return;
    const t = window.setTimeout(() => setLaunched(false), 4200);
    return () => window.clearTimeout(t);
  }, [launched]);

  useEffect(() => {
    if (!sloshing) return;
    const t = window.setTimeout(() => setSloshing(false), 1600);
    return () => window.clearTimeout(t);
  }, [sloshing]);

  const ringBell = () => {
    if (ringing) return;
    setRinging(true);
    playSound.detectiveScan();
  };
  const launchPlane = () => {
    if (launched) return;
    setLaunched(true);
    playSound.detectiveScan();
  };
  const sloshWater = () => {
    if (sloshing) return;
    setSloshing(true);
    playSound.detectiveScan();
  };

  const prop = (label: string, onActivate: () => void) => ({
    role: "button" as const,
    tabIndex: 0,
    "aria-label": label,
    style: { cursor: "pointer" as const, pointerEvents: "auto" as const },
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onActivate();
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate();
      }
    },
  });

  return (
  <svg
    className={`absolute inset-0 w-full h-full${ringing ? " sc-ringing" : ""}${
      launched ? " sc-launched" : ""}${sloshing ? " sc-sloshing" : ""}`}
    viewBox="0 0 1200 900"
    preserveAspectRatio="xMidYMid slice"
    // the backdrop is inert; only the three props and the decoys opt back in
    style={{ pointerEvents: "none" }}
  >
