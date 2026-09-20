import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Clock, AlertTriangle, Check } from "lucide-react";
import { useGameStore } from "../state/gameStore";
import { WASTE_ITEMS } from "../data/wasteItems";
import type { WasteCategory } from "../data/wasteItems";
import { CATEGORY_META } from "../components/BinBadge";
import { ItemSVG } from "../components/ItemSVG";
import { playSound } from "../utils/audio";
import { ShareButton } from "../components/ShareButton";
import { FeedbackPrompt } from "../components/FeedbackPrompt";
import { canPrompt } from "../utils/feedbackGate";
import { KitchenScene } from "../components/detective/KitchenScene";
import { KITCHEN_CLUE_ART } from "../components/detective/kitchenClues";
import { BeachScene } from "../components/detective/BeachScene";
import { BEACH_CLUE_ART } from "../components/detective/beachClues";
import { OfficeScene } from "../components/detective/OfficeScene";
import { OFFICE_CLUE_ART, OFFICE_CLUE_BOX } from "../components/detective/officeClues";
import { ParkScene } from "../components/detective/ParkScene";
import { PARK_CLUE_ART, PARK_CLUE_BOX } from "../components/detective/parkClues";
import { SchoolScene } from "../components/detective/SchoolScene";
import { SCHOOL_CLUE_ART, SCHOOL_CLUE_BOX } from "../components/detective/schoolClues";

/** Clue art for every scene that has been rebuilt to the high-fidelity
 *  standard, keyed by clue id. Ids are unique across scenes, so one lookup
 *  serves them all and the remaining dioramas simply fall through to the
 *  generic ItemSVG chip. */
const CLUE_ART: Record<string, React.ReactNode> = {
  ...KITCHEN_CLUE_ART,
  ...BEACH_CLUE_ART,
  ...OFFICE_CLUE_ART,
  ...PARK_CLUE_ART,
  ...SCHOOL_CLUE_ART,
};

/** Most clues are drawn in a 200x200 window of scene units, but plenty are
 *  not that shape — the Office keyboard is 543 wide, the School milk jug is
 *  287 tall — so a clue may declare its own slot and the rest fall back to
 *  the square. */
const CLUE_BOX: Record<string, { w: number; h: number }> = {
  ...OFFICE_CLUE_BOX,
  ...PARK_CLUE_BOX,
  ...SCHOOL_CLUE_BOX,
};
const DEFAULT_CLUE_BOX = { w: 200, h: 200 };

interface DetectiveItem {
  id: string;
  itemId: string;
  name: string;
  category: WasteCategory;
  top: string;
  left: string;
  scale?: number;
}

interface SceneConfig {
  id: "kitchen" | "beach" | "office" | "park" | "school";
  title: string;
  description: string;
  colorClass: string;
  bgDecorationClass: string;
  items: DetectiveItem[];
}

const SCENES: SceneConfig[] = [
  {
    id: "kitchen",
    title: "Kitchen Mess",
    description: "Find food prep waste and cooking cleanup items.",
    colorClass: "from-amber-100 to-orange-100 border-amber-200/60 hover:border-amber-400",
    bgDecorationClass: "bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] opacity-10",
    items: [
      // Seated on the worktop in the artwork itself — these are the centres of
      // the pieces as they were drawn, not guesses.
      { id: "k1", itemId: "plastic_bottle", name: "Plastic Water Bottle", category: "recyclable", top: "87.8%", left: "39.2%" },
      { id: "k2", itemId: "banana_peel", name: "Banana Peel", category: "organic", top: "85.3%", left: "45.3%" },
      { id: "k3", itemId: "newspaper", name: "Newspaper", category: "recyclable", top: "92%", left: "75.2%" },
      { id: "k4", itemId: "alkaline_battery", name: "Alkaline Battery", category: "hazardous", top: "83.1%", left: "69.8%" },
      { id: "k5", itemId: "apple_core", name: "Apple Core", category: "organic", top: "84.7%", left: "83.7%" },
    ]
  },
  {
    id: "beach",
    title: "Beach Cleanup",
    description: "Scan the sandy shore for litter left by beachgoers.",
    colorClass: "from-blue-100 to-cyan-100 border-blue-200/60 hover:border-blue-400",
    bgDecorationClass: "bg-[radial-gradient(#0284c7_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10",
    items: [
      // Seated on the authored artwork: each figure is the centre of that
      // piece's drawing, as a percentage of the 1200x900 scene.
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
    ]
  },
  {
    id: "office",
    title: "Office Desk",
    description: "Find electronics waste and desk clutter.",
    colorClass: "from-slate-100 to-zinc-200 border-slate-300/60 hover:border-slate-500",
    bgDecorationClass: "bg-[linear-gradient(45deg,#6b7280_12%,transparent_12%,transparent_50%,#6b7280_50%,#6b7280_62%,transparent_62%,transparent_100%)] [background-size:12px_12px] opacity-5",
    items: [
      // Seated on the authored artwork: each figure is the measured centre of
      // that piece's drawing, as a percentage of the 1200x900 scene.
      { id: "o1", itemId: "charging_cable", name: "Charging Cable", category: "eWaste", top: "87.7%", left: "20.8%" },
      { id: "o2", itemId: "keyboard", name: "Broken Keyboard", category: "eWaste", top: "77.7%", left: "48.3%" },
      // Was a styrofoam cup, which the Beach now uses. A broken ceramic mug is
      // more of a desk object, its lesson is sharper — ceramics melt at a
      // different temperature and ruin a whole batch of recycled glass — and it
      // pairs with the coffee grounds beside it: one accident, two clues.
      { id: "o3", itemId: "ceramic_mug", name: "Broken Ceramic Mug", category: "general", top: "81.8%", left: "68.9%" },
      { id: "o4", itemId: "coffee_grounds", name: "Coffee Grounds", category: "organic", top: "87.6%", left: "60.5%" },
      { id: "o5", itemId: "spray_can", name: "Aerosol Spray Can", category: "hazardous", top: "69.2%", left: "93.5%" },
    ]
  },
  {
    id: "park",
    title: "Park Picnic",
    description: "Clean up the grass after a sunny afternoon lunch.",
    colorClass: "from-green-100 to-emerald-100 border-green-200/60 hover:border-green-400",
    bgDecorationClass: "bg-[radial-gradient(#047857_1px,transparent_1px)] [background-size:14px_14px] opacity-10",
    items: [
      { id: "p1", itemId: "tea_bag", name: "Paper Tea Bag", category: "organic", top: "89.8%", left: "38.0%" },
      { id: "p2", itemId: "wooden_chopsticks", name: "Wooden Chopsticks", category: "organic", top: "85.8%", left: "45.9%" },
      { id: "p3", itemId: "chewing_gum", name: "Chewing Gum", category: "general", top: "94.9%", left: "31.7%" },
      { id: "p4", itemId: "steel_tin_can", name: "Steel Soup Can", category: "recyclable", top: "88.4%", left: "79.9%" },
      { id: "p5", itemId: "plastic_wrap", name: "Cling Wrap", category: "general", top: "81.9%", left: "57.2%" }
    ]
  },
  {
    id: "school",
    title: "School Lunch",
    description: "Sort leftovers and wrappers left on the school cafeteria table.",
    colorClass: "from-violet-100 to-indigo-100 border-violet-200/60 hover:border-violet-400",
    bgDecorationClass: "bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:18px_18px] opacity-10",
    items: [
      { id: "s1", itemId: "milk_jug", name: "Plastic Milk Jug", category: "recyclable", top: "84.0%", left: "9.4%" },
      { id: "s2", itemId: "broken_tablet", name: "Cracked Tablet", category: "eWaste", top: "80.4%", left: "55.0%" },
      { id: "s3", itemId: "chewing_gum", name: "Chewing Gum", category: "general", top: "96.1%", left: "33.9%" },
      { id: "s4", itemId: "apple_core", name: "Apple Core", category: "organic", top: "92.2%", left: "64.0%" },
      { id: "s5", itemId: "charging_cable", name: "Charging Cable", category: "eWaste", top: "89.5%", left: "81.6%" }
    ]
  }
];

/** The brand bin colours are tuned for the light shell and go muddy on the
 *  picker's dark panel, so it uses these brighter hues instead. */
const CATEGORY_GLOW: Record<WasteCategory, string> = {
  recyclable: "#34d399",
  organic: "#fbbf24",
  hazardous: "#fb7185",
  eWaste: "#60a5fa",
  general: "#cbd5e1",
};

// Scene 1: Kitchen — now the high-fidelity KitchenScene component.

// Scene 2: Beach — now the high-fidelity BeachScene component.

// Scene 3: Office — now the high-fidelity OfficeScene component.

// Scene 4: Park — now the high-fidelity ParkScene component.

// Scene 5: School — now the high-fidelity SchoolScene component.

interface TrashDetectiveScreenProps {
  onBack: () => void;
}

export const TrashDetectiveScreen: React.FC<TrashDetectiveScreenProps> = ({ onBack }) => {
  const [selectedScene, setSelectedScene] = useState<SceneConfig | null>(null);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [shakingItemId, setShakingItemId] = useState<string | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState<{ itemId: string; category: WasteCategory }[]>([]);

  // ── The loop ──
  // Three things make this a game rather than a checklist:
  //   1. not everything in the scene is waste, so looking has to mean judging;
  //   2. a wrong bin contaminates that bin, and contamination is scored at the
  //      end, so one careless drop costs more than the item was worth;
  //   3. clean finds in a row compound, so caution pays.
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [contaminated, setContaminated] = useState<WasteCategory[]>([]);
  const [wrongPicks, setWrongPicks] = useState(0);
  const [decoyTaps, setDecoyTaps] = useState(0);
  // A costed hint gives the player agency when they are stuck, instead of the
  // game simply handing them the answer list up front.
  const [hintsLeft, setHintsLeft] = useState(2);
  const [hintedId, setHintedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string; tone: "good" | "bad" | "info" } | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [frameBox, setFrameBox] = useState({ w: 0, h: 0 });
  
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameState, setGameState] = useState<"select" | "play" | "results">("select");
  const [showFeedback, setShowFeedback] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Spawner and game timer effects
  useEffect(() => {
    if (gameState === "play") {
      setTimeLeft(90);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("results");
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Win condition trigger
  useEffect(() => {
    if (selectedScene && foundIds.length === selectedScene.items.length && gameState === "play") {
      setGameState("results");
      if (timerRef.current) clearInterval(timerRef.current);
      playSound.detectiveClear();
    }
  }, [foundIds, selectedScene, gameState]);

  // One timer owns the toast; a new message resets it through the cleanup.
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1700);
    return () => window.clearTimeout(t);
  }, [toast]);

  // The picker is clamped inside the frame, so it needs the frame's real size.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setFrameBox({ w: entry.contentRect.width, h: entry.contentRect.height })
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [gameState, selectedScene]);

  const handleStartScene = (scene: SceneConfig) => {
    setSelectedScene(scene);
    setFoundIds([]);
    setActiveItemId(null);
    setWrongAttempts([]);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setContaminated([]);
    setWrongPicks(0);
    setDecoyTaps(0);
    setHintsLeft(2);
    setHintedId(null);
    setToast(null);
    setGameState("play");
    playSound.detectiveScan();
  };

  const say = (text: string, tone: "good" | "bad" | "info") =>
    setToast((prev) => ({ id: (prev?.id ?? 0) + 1, text, tone }));

  /** Checking something that turns out to belong here is free: it is how you
   *  learn what does and does not count as waste, so it should not be
   *  punished. It still tells you, and the clock is still running. */
  const handleDecoy = (note: string) => {
    if (gameState !== "play") return;
    setDecoyTaps((n) => n + 1);
    playSound.detectiveScan();
    say(note, "info");
  };

  const useHint = () => {
    if (gameState !== "play" || hintsLeft <= 0 || !selectedScene) return;
    const remaining = selectedScene.items.filter((i) => !foundIds.includes(i.id));
    if (remaining.length === 0) return;
    const pick = remaining[timeLeft % remaining.length];
    setHintsLeft((n) => n - 1);
    setHintedId(pick.id);
    setTimeLeft((t) => Math.max(1, t - 5));
    playSound.detectiveScan();
    say("Swept. One piece marked. Cost you five seconds.", "info");
    window.setTimeout(() => setHintedId((h) => (h === pick.id ? null : h)), 1800);
  };

  const handleSelectCategory = (item: DetectiveItem, category: WasteCategory) => {
    if (item.category === category) {
      const nextStreak = streak + 1;
      const bonus = Math.min(200, (nextStreak - 1) * 50);
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      setScore((sc) => sc + 150 + bonus);
      setFoundIds((prev) => [...prev, item.id]);
      setActiveItemId(null);
      playSound.detectiveFound();
      say(bonus > 0 ? `+${150 + bonus} · ${nextStreak} clean in a row` : "+150 · bagged", "good");
      useGameStore.getState().unlockEncyclopediaItem(item.itemId);
    } else {
      // A wrong bin does not just fail — it contaminates that bin, and every
      // contaminated bin is scored against you at the end.
      setShakingItemId(item.id);
      setTimeout(() => setShakingItemId(null), 400);
      playSound.wrong();
      setStreak(0);
      setWrongPicks((n) => n + 1);
      setContaminated((c) => (c.includes(category) ? c : [...c, category]));
      say(`Wrong bin. That spoils the ${CATEGORY_META[category].label.toLowerCase()} load.`, "bad");

      if (!wrongAttempts.some(att => att.itemId === item.itemId)) {
        setWrongAttempts((prev) => [...prev, { itemId: item.itemId, category }]);
      }
    }
  };

  const handleQuitGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedScene(null);
    setGameState("select");
  };

  // Every contaminated bin takes a bite out of the whole haul, so one careless
  // drop can cost more than the item it was made on.
  const activeItem = selectedScene?.items.find((i) => i.id === activeItemId) ?? null;
  const purity = Math.max(0.4, 1 - 0.12 * contaminated.length);
  // Finishing early is worth something, so the clock matters even on a round
  // you would otherwise coast through.
  const cleared = !!selectedScene && foundIds.length === selectedScene.items.length;
  const timeBonus = cleared ? timeLeft * 5 : 0;
  const totalPoints = Math.round(score * purity) + timeBonus;
  const attempts = foundIds.length + wrongPicks;
  const accuracy = attempts > 0 ? Math.round((foundIds.length / attempts) * 100) : 0;

  useEffect(() => {
    if (gameState === "results" && canPrompt("detective", null)) {
      const t = setTimeout(() => setShowFeedback(true), 1200);
      return () => clearTimeout(t);
    }
  }, [gameState]);

  return (
    <div className="flex flex-col h-full w-full relative bg-transparent overflow-hidden text-center select-none">
      {/* Header Panel */}
      <div className="p-4 relative z-40 shrink-0 glass-panel border-b border-slate-950/10 shadow-premium w-full flex items-center justify-between">
        <button
          onClick={gameState !== "select" ? handleQuitGame : onBack}
          className="p-2 rounded-xl text-slate-700 hover:text-slate-950 transition-all cursor-pointer border border-slate-950/10 hover:bg-white/60 shadow-premium"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm uppercase tracking-wider">
          <Search size={16} className="text-blue-600" />
          <span>Trash Detective</span>
        </div>
        {gameState === "play" ? (
          <div className="flex items-center gap-1 text-slate-800 text-xs font-black bg-white/70 border border-slate-950/5 px-2.5 py-1 rounded-lg">
            <Clock size={12} className="text-slate-700 animate-pulse" />
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
          </div>
        ) : (
          <div className="w-8 h-8" />
        )}
      </div>

      <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col items-center justify-center p-6">
        
        {/* State 1: Choose Scene Screen */}
        {gameState === "select" && (
          <div className="w-full max-w-lg flex flex-col gap-6 py-4">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Choose scene to search</h2>
              <p className="text-xs text-slate-600 font-semibold mt-1">Locate and sort the hidden litter in these settings.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              {SCENES.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => handleStartScene(scene)}
                  className={`w-full text-left p-4 rounded-3xl border-2 bg-gradient-to-br ${scene.colorClass} transition-all duration-300 shadow-premium cursor-pointer hover:scale-[1.01] hover:shadow-lg active:scale-100 flex items-center justify-between group`}
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-black text-slate-900 text-base">{scene.title}</h3>
                    <p className="text-xs text-slate-700 font-semibold leading-tight">{scene.description}</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/75 flex items-center justify-center text-slate-800 shadow-sm border border-white/50 group-hover:scale-110 transition-transform">
                    <Search size={18} className="text-blue-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* State 2: Active Gameplay Screen */}
        {gameState === "play" && selectedScene && (
          <div className="w-full h-full flex flex-col relative justify-between max-w-xl mx-auto">
            {/* Top Indicator */}
            <div className="mb-2 w-full max-w-[calc(42vh*4/3)] mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-800 text-[11px] font-black px-2.5 py-1 bg-white/60 border border-slate-950/5 rounded-full">
                  {foundIds.length}/{selectedScene.items.length}
                </span>
                <span className="text-slate-900 text-sm font-black tabular-nums">
                  {score.toLocaleString()}
                </span>
                {streak > 1 && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-300/50 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    {streak}x clean
                  </span>
                )}
              </div>

              {/* Bin purity — one pip per bin, dirtied by a wrong drop */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={useHint}
                  disabled={hintsLeft <= 0}
                  className="mr-1 flex items-center gap-1 rounded-full border border-slate-950/10 bg-white/70 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700 transition-all hover:bg-white active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Search size={10} />
                  <span>Sweep {hintsLeft}</span>
                </button>
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 mr-0.5">Bins</span>
                {(["recyclable", "organic", "hazardous", "eWaste", "general"] as WasteCategory[]).map((cat) => {
                  const dirty = contaminated.includes(cat);
                  return (
                    <span
                      key={cat}
                      title={dirty ? `${CATEGORY_META[cat].label}: contaminated` : `${CATEGORY_META[cat].label}: clean`}
                      className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                        dirty ? "bg-rose-500 border-rose-700" : "bg-emerald-400 border-emerald-600/50"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Scene Canvas Container */}
            <div ref={frameRef}
              className="w-full max-w-[calc(42vh*4/3)] mx-auto aspect-[4/3] relative rounded-3xl overflow-visible border border-slate-950/10 shadow-premium bg-slate-50 shrink-0">
              <div className="absolute inset-0 rounded-3xl overflow-hidden bg-slate-50">
                {/* Pattern Background matching scene */}
                <div className={`absolute inset-0 ${selectedScene.bgDecorationClass}`} />

                {/* Render vector diorama props */}
                {selectedScene.id === "kitchen" && <KitchenScene onDecoy={handleDecoy} />}
                {selectedScene.id === "beach" && <BeachScene onDecoy={handleDecoy} />}
                {selectedScene.id === "office" && <OfficeScene onDecoy={handleDecoy} />}
                {selectedScene.id === "park" && <ParkScene onDecoy={handleDecoy} />}
                {selectedScene.id === "school" && <SchoolScene onDecoy={handleDecoy} />}
              </div>

              {/* Sorting panel.
                  Rendered once at frame level rather than inside the 40px clue
                  box, so it can be measured and clamped: it flips above or
                  below the litter depending on where the litter sits, never
                  runs off the edge, and its caret keeps pointing at the item
                  even when the panel has been pushed sideways to fit. */}
              <AnimatePresence>
                {activeItem && frameBox.w > 0 && (() => {
                  const W = Math.min(268, frameBox.w - 16);
                  const cx = (parseFloat(activeItem.left) / 100) * frameBox.w;
                  const cy = (parseFloat(activeItem.top) / 100) * frameBox.h;
                  const left = Math.max(8, Math.min(cx - W / 2, frameBox.w - W - 8));
                  const below = cy < frameBox.h * 0.55;
                  const caret = Math.max(20, Math.min(cx - left, W - 20));
                  const art = CLUE_ART[activeItem.id];

                  return (
                    <motion.div
                      key={activeItem.id}
                      initial={{ opacity: 0, y: below ? -8 : 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 420, damping: 28 }}
                      className="detective-picker absolute z-[70] rounded-2xl p-2.5"
                      style={{
                        left,
                        width: W,
                        ...(below ? { top: cy + 34 } : { bottom: frameBox.h - cy + 34 }),
                      }}
                    >
                      <span
                        className={`detective-picker__caret detective-picker__caret--${below ? "up" : "down"}`}
                        style={{ left: caret, ...(below ? { top: -7 } : { bottom: -7 }) }}
                      />

                      <div className="flex items-center gap-2 mb-2 px-0.5">
                        <span className="relative w-7 h-7 shrink-0">
                          {art ?? <ItemSVG itemId={activeItem.itemId} size={26} />}
                        </span>
                        <span className="truncate text-[11px] font-black text-white">
                          {activeItem.name}
                        </span>
                        <span className="ml-auto text-[8px] font-black uppercase tracking-[0.18em] text-white/40">
                          Which bin?
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5">
                        {(["recyclable", "organic", "hazardous", "eWaste", "general"] as WasteCategory[]).map((cat) => {
                          const meta = CATEGORY_META[cat];
                          const hex = CATEGORY_GLOW[cat];
                          return (
                            <button
                              key={cat}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectCategory(activeItem, cat);
                              }}
                              title={meta.description}
                              className="flex flex-col items-center gap-1 rounded-xl border px-0.5 py-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                              style={{ backgroundColor: `${hex}26`, borderColor: `${hex}59` }}
                            >
                              <span className="text-[15px] leading-none">{meta.emoji}</span>
                              <span
                                className="text-[7px] font-black uppercase leading-none tracking-tight"
                                style={{ color: hex }}
                              >
                                {meta.label.split(" ")[0]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

              {/* Feedback, so every action says what it cost or earned */}
              <AnimatePresence>
                {toast && (
                  <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`absolute inset-x-3 top-3 z-[60] pointer-events-none text-center text-[11px] font-black px-3 py-1.5 rounded-xl border shadow-premium ${
                      toast.tone === "good"
                        ? "bg-emerald-50/95 text-emerald-800 border-emerald-500/30"
                        : toast.tone === "bad"
                          ? "bg-rose-50/95 text-rose-800 border-rose-500/30"
                          : "bg-white/95 text-slate-800 border-slate-950/10"
                    }`}
                  >
                    {toast.text}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tappable hidden objects */}
              {selectedScene.items.map((item) => {
                const isFound = foundIds.includes(item.id);
                const isSelected = activeItemId === item.id;
                const isShaking = shakingItemId === item.id;
                const clueArt = CLUE_ART[item.id];

                return (
                  <AnimatePresence key={item.id}>
                    {!isFound && (
                      <div
                        style={{
                          position: "absolute",
                          top: item.top,
                          left: item.left,
                          zIndex: isSelected ? 50 : 20,
                          ...(clueArt
                            ? {
                                // the clue's own slot in scene units, as a share
                                // of the 1200x900 frame, centred on its anchor so
                                // the art scales with the frame.
                                // The box is inert: an HTML div takes pointer
                                // events across its whole rectangle whether or not
                                // anything is drawn there, and at this size it
                                // would swallow every decoy underneath it. Only
                                // the painted litter inside takes them back.
                                width: `${((CLUE_BOX[item.id] ?? DEFAULT_CLUE_BOX).w / 1200) * 100}%`,
                                height: `${((CLUE_BOX[item.id] ?? DEFAULT_CLUE_BOX).h / 900) * 100}%`,
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none" as const,
                              }
                            : {}),
                        }}
                        className={
                          clueArt
                            ? "flex items-center justify-center"
                            : "w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center animate-soft-pulse"
                        }
                      >
                        <motion.button
                          animate={isShaking ? { x: [-6, 6, -4, 4, 0] } : { scale: 1 }}
                          exit={{
                            scale: 0.2,
                            opacity: 0,
                            y: 280,
                            x: 40,
                            rotate: 45,
                            transition: { duration: 0.6, ease: "easeInOut" }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveItemId(isSelected ? null : item.id);
                            playSound.detectiveScan();
                          }}
                          className={
                            clueArt
                              ? `detective-clue relative w-full h-full ${isSelected ? "detective-clue--active" : ""} ${
                                  hintedId === item.id ? "detective-clue--hinted" : ""
                                }`
                              : `w-8.5 h-8.5 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg sm:rounded-xl transition-all duration-300 relative ${
                                  isSelected
                                    ? "shadow-[0_0_20px_#fbbf24] border-2 border-amber-400 bg-amber-400/20 scale-110"
                                    : "border border-slate-950/5 bg-white/45 hover:bg-white/80 hover:scale-105"
                                }`
                          }
                        >
                          {clueArt ?? <ItemSVG itemId={item.itemId} size={26} />}

                          {/* Sparkle/Glow Ring indicating interactive area */}
                          {!clueArt && !isSelected && (
                            <span className="absolute -inset-1 rounded-lg sm:rounded-xl border border-dashed border-blue-500/20 animate-pulse pointer-events-none" />
                          )}
                        </motion.button>

                      </div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>

            {/* Target Items Checklist */}
            <div className="mt-3 bg-white/40 p-2.5 rounded-2xl border border-slate-950/5 flex flex-col items-center gap-1.5 shrink-0 max-w-sm mx-auto w-full">
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Evidence recovered</span>
              <div className="flex gap-4 items-center justify-center">
                {selectedScene.items.map((it) => {
                  const wasFound = foundIds.includes(it.id);
                  return (
                    <div key={it.id} className="relative flex flex-col items-center gap-0.5">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                        wasFound
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-dashed border-slate-950/15 bg-white/40"
                      }`}>
                        {wasFound ? (
                          <ItemSVG itemId={it.itemId} size={20} />
                        ) : (
                          <span className="text-[13px] font-black text-slate-400">?</span>
                        )}
                      </div>
                      {wasFound && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                          <Check size={10} className="stroke-[3.5]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hint Box */}
            <div className="text-[10px] font-semibold text-slate-700 mt-2">
              Not everything here is rubbish. Find what is — and don't spoil a bin guessing.
            </div>
          </div>
        )}

        {/* State 3: Game Results Overlay */}
        {gameState === "results" && selectedScene && (
          <div className="w-full max-w-md glass-panel border border-slate-950/10 rounded-3xl p-6 flex flex-col gap-5 scale-in shadow-2xl bg-white/90 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-700 mb-2 shadow-[0_0_12px_rgba(59,130,246,0.15)] animate-bounce">
                <Search size={26} />
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-none">
                {foundIds.length === selectedScene.items.length ? "Scene Cleared!" : "Time's Up!"}
              </h2>
              <p className="text-xs text-slate-700 mt-2 font-bold uppercase tracking-wider">
                {selectedScene.title}
              </p>
            </div>

            {/* Score Stats */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950/5 p-4 rounded-2xl border border-slate-950/5">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider">Score</span>
                <span className="text-xl font-black text-slate-900 mt-0.5">+{totalPoints} XP</span>
                {contaminated.length > 0 && (
                  <span className="text-[9px] font-bold text-rose-700 mt-0.5">
                    {score.toLocaleString()} × {Math.round(purity * 100)}% purity
                  </span>
                )}
                {timeBonus > 0 && (
                  <span className="text-[9px] font-bold text-emerald-700">
                    +{timeBonus} time bonus
                  </span>
                )}
              </div>
              <div className="flex flex-col items-center border-l border-slate-950/10">
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider">Accuracy</span>
                <span className={`text-xl font-black mt-0.5 ${accuracy >= 80 ? "text-emerald-700" : "text-amber-700"}`}>
                  {accuracy}%
                </span>
              </div>
            </div>

            {/* What the round actually cost */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white/50 border border-slate-950/5 py-2">
                <div className="text-[8px] font-black uppercase tracking-wider text-slate-500">Best run</div>
                <div className="text-sm font-black text-slate-900">{bestStreak}x</div>
              </div>
              <div className="rounded-xl bg-white/50 border border-slate-950/5 py-2">
                <div className="text-[8px] font-black uppercase tracking-wider text-slate-500">Bins spoiled</div>
                <div className={`text-sm font-black ${contaminated.length ? "text-rose-700" : "text-emerald-700"}`}>
                  {contaminated.length}
                </div>
              </div>
              <div className="rounded-xl bg-white/50 border border-slate-950/5 py-2">
                <div className="text-[8px] font-black uppercase tracking-wider text-slate-500">Things checked</div>
                <div className="text-sm font-black text-slate-700">{decoyTaps}</div>
              </div>
            </div>

            {/* Mistakes & Explanations */}
            {wrongAttempts.length > 0 && (
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto no-scrollbar text-left border border-slate-950/5 p-3 rounded-2xl bg-white/50">
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlertTriangle size={10} className="text-amber-600" />
                  <span>Review Mistakes:</span>
                </span>
                {wrongAttempts.map((attempt) => {
                  const dbItem = WASTE_ITEMS.find((it) => it.id === attempt.itemId);
                  if (!dbItem) return null;
                  return (
                    <div key={attempt.itemId} className="text-[10px] leading-tight border-b border-slate-950/5 pb-1.5 mb-1.5 last:border-0 last:pb-0 last:mb-0">
                      <span className="font-extrabold text-slate-900">{dbItem.name}: </span>
                      <span className="text-slate-700 font-medium">{dbItem.shortFact}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions Grid */}
            <div className="flex flex-col gap-2.5 mt-1.5 w-full">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleStartScene(selectedScene)}
                  className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-premium"
                >
                  PLAY AGAIN
                </button>

                <button
                  onClick={handleQuitGame}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                >
                  SELECT SCENE
                </button>
              </div>

              <ShareButton target={{ kind: "mode", id: "detective" }} />

              <button
                onClick={onBack}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-200"
              >
                MAIN MENU
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showFeedback && (
          <FeedbackPrompt
            mode="detective"
            levelId={null}
            contextLabel="Trash Detective"
            score={totalPoints}
            accuracy={accuracy}
            onClose={() => setShowFeedback(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
