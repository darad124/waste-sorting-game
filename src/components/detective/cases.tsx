import React from "react";
import type { WasteCategory } from "../../data/wasteItems";
import { KITCHEN_CLUE_ART } from "./kitchenClues";
import { BEACH_CLUE_ART } from "./beachClues";
import { OFFICE_CLUE_ART, OFFICE_CLUE_BOX } from "./officeClues";
import { PARK_CLUE_ART, PARK_CLUE_BOX } from "./parkClues";
import { SCHOOL_CLUE_ART, SCHOOL_CLUE_BOX } from "./schoolClues";

/* ==================================================================== *
 *  The five cases.
 *
 *  Everything that distinguishes one case from another lives here: its
 *  name, its artwork, and the five pieces of litter seated on it. The
 *  screen holds the rules of the game and nothing about any particular
 *  case, which is what stops it growing a branch per scene.
 * ==================================================================== */

export interface DetectiveItem {
  /** Unique across ALL cases, because the clue-art registry is one map. */
  id: string;
  /** The waste-catalogue entry this is, which supplies the facts. */
  itemId: string;
  name: string;
  category: WasteCategory;
  /** Seated on the authored artwork: the measured centre of that piece's
   *  drawing, as a percentage of the 1200x900 scene. Not a guess. */
  top: string;
  left: string;
}

export interface DetectiveCase {
  id: "kitchen" | "beach" | "office" | "park" | "school";
  title: string;
  description: string;
  /** Tailwind gradient + border for this case's card on the select screen. */
  accentClass: string;
  /** The backdrop. Every scene is 40–360 KB of SVG, which is far too much
   *  to hand to somebody who came here to play Arcade Mode, so each one is
   *  its own chunk. `preload` is the same import, exposed so the screen can
   *  fetch the chunk BEFORE it starts the round — a Suspense fallback in
   *  the middle of the frame would leave the clue overlay on screen with no
   *  scene under it and no gradients to draw itself with. */
  Scene: React.LazyExoticComponent<React.FC<{ onDecoy?: (note: string) => void }>>;
  preload: () => Promise<unknown>;
  items: DetectiveItem[];
}

/** React.lazy wants a default export; the scenes are named, like everything
 *  else in this codebase. This keeps one import expression per scene so the
 *  bundler can still see it statically.
 *
 *  The retry is not defensive padding. A dynamic import is a network request
 *  for a file named after its own content hash, and it fails for real reasons:
 *  a dropped connection, or — far more often — a deploy that happened while
 *  this tab was open, after which the browser is still holding an index.html
 *  that names chunks the server no longer has. One retry clears the transient
 *  case. The rest is the caller's to handle, and it must handle it: an
 *  unhandled rejection here leaves the round stuck on its loading screen for
 *  ever, because the code that would have started the round never runs. */
const lazyScene = <K extends string>(
  load: () => Promise<Record<K, React.FC<{ onDecoy?: (note: string) => void }>>>,
  key: K
) => {
  const loadOnce = () =>
    load().catch(() => new Promise<Record<K, React.FC<{ onDecoy?: (note: string) => void }>>>(
      (resolve, reject) => { setTimeout(() => load().then(resolve, reject), 350); },
    ));
  return {
    Scene: React.lazy(() => loadOnce().then((m) => ({ default: m[key] }))),
    preload: loadOnce,
  };
};

export const CASES: DetectiveCase[] = [
  {
    id: "kitchen",
    title: "Kitchen Mess",
    description: "Find food prep waste and cooking cleanup items.",
    accentClass: "from-amber-100 to-orange-100 border-amber-200/60 hover:border-amber-400",
    ...lazyScene(() => import("./KitchenScene"), "KitchenScene"),
    items: [
      { id: "k1", itemId: "plastic_bottle", name: "Plastic Water Bottle", category: "recyclable", top: "87.8%", left: "39.2%" },
      { id: "k2", itemId: "banana_peel", name: "Banana Peel", category: "organic", top: "85.3%", left: "45.3%" },
      { id: "k3", itemId: "newspaper", name: "Newspaper", category: "recyclable", top: "92%", left: "75.2%" },
      { id: "k4", itemId: "alkaline_battery", name: "Alkaline Battery", category: "hazardous", top: "83.1%", left: "69.8%" },
      { id: "k5", itemId: "apple_core", name: "Apple Core", category: "organic", top: "84.7%", left: "83.7%" },
    ],
  },
  {
    id: "beach",
    title: "Beach Cleanup",
    description: "Scan the sandy shore for litter left by beachgoers.",
    accentClass: "from-blue-100 to-cyan-100 border-blue-200/60 hover:border-blue-400",
    ...lazyScene(() => import("./BeachScene"), "BeachScene"),
    items: [
      { id: "b1", itemId: "plastic_bottle", name: "Plastic Water Bottle", category: "recyclable", top: "73%", left: "39%" },
      { id: "b2", itemId: "soda_can", name: "Aluminum Soda Can", category: "recyclable", top: "68.4%", left: "76.8%" },
      { id: "b3", itemId: "paint_can", name: "Paint Can", category: "hazardous", top: "63.4%", left: "48.4%" },
      { id: "b4", itemId: "face_mask", name: "Disposable Face Mask", category: "general", top: "75%", left: "14.6%" },
      // Was a chip bag. A crumpled foil packet has no canonical silhouette —
      // every one is a different shape — so at this size it never stopped
      // reading as something else. A foam cup is a truncated cone, and it is
      // the better lesson besides: it is the one piece of litter here that
      // most people would wrongly put in the recycling.
      { id: "b5", itemId: "styrofoam_cup", name: "Styrofoam Coffee Cup", category: "general", top: "88.8%", left: "66.8%" },
    ],
  },
  {
    id: "office",
    title: "Office Desk",
    description: "Find electronics waste and desk clutter.",
    accentClass: "from-slate-100 to-zinc-200 border-slate-300/60 hover:border-slate-500",
    ...lazyScene(() => import("./OfficeScene"), "OfficeScene"),
    items: [
      { id: "o1", itemId: "charging_cable", name: "Charging Cable", category: "eWaste", top: "87.7%", left: "20.8%" },
      { id: "o2", itemId: "keyboard", name: "Broken Keyboard", category: "eWaste", top: "77.7%", left: "48.3%" },
      // Was a styrofoam cup, which the Beach now uses. A broken ceramic mug is
      // more of a desk object, its lesson is sharper — ceramics melt at a
      // different temperature and ruin a whole batch of recycled glass — and it
      // pairs with the coffee grounds beside it: one accident, two clues.
      { id: "o3", itemId: "ceramic_mug", name: "Broken Ceramic Mug", category: "general", top: "81.8%", left: "68.9%" },
      { id: "o4", itemId: "coffee_grounds", name: "Coffee Grounds", category: "organic", top: "87.6%", left: "60.5%" },
      { id: "o5", itemId: "spray_can", name: "Aerosol Spray Can", category: "hazardous", top: "69.2%", left: "93.5%" },
    ],
  },
  {
    id: "park",
    title: "Park Picnic",
    description: "Clean up the grass after a sunny afternoon lunch.",
    accentClass: "from-green-100 to-emerald-100 border-green-200/60 hover:border-green-400",
    ...lazyScene(() => import("./ParkScene"), "ParkScene"),
    items: [
      { id: "p1", itemId: "tea_bag", name: "Paper Tea Bag", category: "organic", top: "89.8%", left: "38.0%" },
      { id: "p2", itemId: "wooden_chopsticks", name: "Wooden Chopsticks", category: "organic", top: "85.8%", left: "45.9%" },
      { id: "p3", itemId: "chewing_gum", name: "Chewing Gum", category: "general", top: "94.9%", left: "31.7%" },
      { id: "p4", itemId: "steel_tin_can", name: "Steel Soup Can", category: "recyclable", top: "88.4%", left: "79.9%" },
      { id: "p5", itemId: "plastic_wrap", name: "Cling Wrap", category: "general", top: "81.9%", left: "57.2%" },
    ],
  },
  {
    id: "school",
    title: "School Lunch",
    description: "Sort leftovers and wrappers left on the school cafeteria table.",
    accentClass: "from-violet-100 to-indigo-100 border-violet-200/60 hover:border-violet-400",
    ...lazyScene(() => import("./SchoolScene"), "SchoolScene"),
    items: [
      { id: "s1", itemId: "milk_jug", name: "Plastic Milk Jug", category: "recyclable", top: "84.0%", left: "9.4%" },
      { id: "s2", itemId: "broken_tablet", name: "Cracked Tablet", category: "eWaste", top: "80.4%", left: "55.0%" },
      { id: "s3", itemId: "chewing_gum", name: "Chewing Gum", category: "general", top: "96.1%", left: "33.9%" },
      { id: "s4", itemId: "apple_core", name: "Apple Core", category: "organic", top: "92.2%", left: "64.0%" },
      { id: "s5", itemId: "charging_cable", name: "Charging Cable", category: "eWaste", top: "89.5%", left: "81.6%" },
    ],
  },
];

/** Clue art keyed by clue id. Ids are unique across cases, so one lookup
 *  serves them all. These are small — a few KB each — so unlike the
 *  backdrops they are not worth splitting out. */
export const CLUE_ART: Record<string, React.ReactNode> = {
  ...KITCHEN_CLUE_ART,
  ...BEACH_CLUE_ART,
  ...OFFICE_CLUE_ART,
  ...PARK_CLUE_ART,
  ...SCHOOL_CLUE_ART,
};

/** Most clues fit a 200x200 window of scene units. Plenty do not — the
 *  Office keyboard is 543 wide, the School milk jug 287 tall — so a clue
 *  may declare its own slot and the rest fall back to the square. */
export const CLUE_BOX: Record<string, { w: number; h: number }> = {
  ...OFFICE_CLUE_BOX,
  ...PARK_CLUE_BOX,
  ...SCHOOL_CLUE_BOX,
};

export const DEFAULT_CLUE_BOX = { w: 200, h: 200 };

/** Every clue in every case is drawn. The screen used to carry a second
 *  rendering path — a white chip with a generic icon on it — for the cases
 *  that were still low-fidelity dioramas; there are none left, so that path
 *  is gone and this is what guarantees it stays gone. It costs one loop at
 *  module load and it fails at the point the mistake was made rather than
 *  as a blank square in the middle of a scene. */
if (import.meta.env.DEV) {
  const missing = CASES.flatMap((c) => c.items)
    .filter((i) => !CLUE_ART[i.id])
    .map((i) => `${i.id} (${i.name})`);
  if (missing.length) {
    throw new Error(`Detective clues with no artwork: ${missing.join(", ")}`);
  }
}
