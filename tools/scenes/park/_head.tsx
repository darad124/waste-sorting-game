import React, { useEffect, useState } from "react";
import { playSound } from "../../utils/audio";

/* ==================================================================== *
 *  Park Picnic — high-fidelity scene
 *
 *  One SVG on a fixed 1200x900 viewBox, matching the frame's 4:3, so the
 *  art never distorts.
 *
 *  A fourth camera and a fourth light. The horizon is at y=232, so the
 *  vanishing point is (600, 232) and every depth line in the picture runs
 *  to it — the blanket's sides, the gaps between its checks, the mown
 *  stripes on the lawn. Its far edge is placed so the cloth comes out
 *  SQUARE on the ground rather than square on the page, because a picnic
 *  blanket is square and the gingham is what gives it away if it isn't.
 *
 *  Everything standing on the grass is drawn in MILLIMETRES at its real
 *  size and placed by a scale rule taken from that horizon —
 *
 *      pixels per metre = 0.7 * (y - 232)
 *
 *  which is why the hat, the football and the soup can are in scale with
 *  each other and with the check of the cloth they are lying on without
 *  anybody having decided it.
 *
 *  Late afternoon, sun low and to the upper RIGHT behind the crown of the
 *  tree. Cast shadows run down-LEFT at twice the height of the thing that
 *  threw them; shadows on grass are blue-GREEN, because sky plus bounce
 *  off the surrounding grass is what fills them, and the tree's own
 *  shadow is BLUE, because over red gingham a green shadow goes brown.
 *
 *  The five pieces of litter are NOT in this backdrop — the game has to
 *  tap, light and remove them, so they live in parkClues.tsx and are
 *  positioned by the screen.
 * ==================================================================== */

/** Things at this picnic that are genuinely confusable with litter but are
 *  not waste. Each carries its own note rather than a template — a line
 *  written for the object is the difference between a game with a voice and
 *  a game that fills in a blank.
 *
 *  The bin is the one that teaches, and it teaches by being thirty metres
 *  away from all of this. */
const DECOYS: { label: string; note: string; x: number; y: number; w: number; h: number }[] = [
  { label: "hamper",       note: "Somebody's lunch is still in there.",            x: 348,  y: 563, w: 120, h: 99  },
  { label: "flask",        note: "Still hot. Still theirs.",                       x: 236,  y: 612, w: 46,  h: 100 },
  { label: "cup of tea",   note: "Half drunk. That's not abandoned, that's paused.", x: 328, y: 716, w: 62,  h: 44  },
  { label: "strawberries", note: "Food. Not leftovers — food.",                    x: 592,  y: 618, w: 66,  h: 36  },
  { label: "paperback",    note: "Face down, holding its place. Someone's coming back.", x: 774, y: 652, w: 94, h: 28 },
  { label: "sun hat",      note: "Straw. Expensive straw.",                        x: 116,  y: 792, w: 162, h: 54  },
  { label: "football",     note: "Still bouncing. Not your problem.",              x: 1075, y: 548, w: 60,  h: 60  },
  { label: "lemonade",     note: "Two thirds full. Leave it alone.",               x: 728,  y: 688, w: 42,  h: 114 },
  { label: "bin",          note: "A bin. Thirty metres away. Remember that.",      x: 262,  y: 336, w: 70,  h: 122 },
];

interface ParkSceneProps {
  /** Called with that object's own note when the player taps something that
   *  turns out not to be litter. */
  onDecoy?: (note: string) => void;
}

export const ParkScene: React.FC<ParkSceneProps> = ({ onDecoy }) => {
  // Three things the player can poke at. None of them is a clue — a toy that
  // is also a clue cannot work, because tapping a clue has to open the
  // sorting picker.
  const [shedding, setShedding] = useState(false);
  const [gusting, setGusting] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Both one-shots are owned by the state that ends them rather than by a
  // ref, so they clean themselves up if the scene unmounts mid-cycle.
  useEffect(() => {
    if (!shedding) return;
    const t = window.setTimeout(() => setShedding(false), 4300);
    return () => window.clearTimeout(t);
  }, [shedding]);

  useEffect(() => {
    if (!gusting) return;
    const t = window.setTimeout(() => setGusting(false), 1500);
    return () => window.clearTimeout(t);
  }, [gusting]);

  const shedLeaves = () => {
    if (shedding) return;
    setShedding(true);
    playSound.detectiveScan();
  };
  const sendGust = () => {
    if (gusting) return;
    setGusting(true);
    playSound.detectiveScan();
  };
  const toggleSpeaker = () => {
    setPlaying((v) => !v);
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
    className={`absolute inset-0 w-full h-full${shedding ? " pk-shedding" : ""}${
      gusting ? " pk-gust" : ""}${playing ? " pk-playing" : ""}`}
    viewBox="0 0 1200 900"
    preserveAspectRatio="xMidYMid slice"
    // the backdrop is inert; only the three props and the decoys opt back in
    style={{ pointerEvents: "none" }}
  >
