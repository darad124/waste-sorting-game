import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { useGameStore } from "../state/gameStore";
import { WASTE_ITEMS } from "../data/wasteItems";
import type { WasteCategory } from "../data/wasteItems";
import { CATEGORY_META } from "../components/BinBadge";
import { ItemSVG } from "../components/ItemSVG";
import { triggerConfetti } from "../components/ParticleEmitter";
import { playSound } from "../utils/audio";

interface HuntRound {
  binCategory: WasteCategory;
  binLabel: string;
  validItemIds: string[];
  imposterItemId: string;
  explanation: string;
}

const HUNTS: HuntRound[] = [
  {
    binCategory: "recyclable",
    binLabel: "Recyclable Bin",
    validItemIds: ["plastic_bottle", "cardboard_box", "soda_can", "newspaper"],
    imposterItemId: "banana_peel",
    explanation: "Banana peels are organic food waste. Food oils and organics contaminate clean papers and plastic batches, making them unrecyclable!"
  },
  {
    binCategory: "organic",
    binLabel: "Organic Bin",
    validItemIds: ["apple_core", "egg_shells", "coffee_grounds"],
    imposterItemId: "alkaline_battery",
    explanation: "Batteries are Hazardous Waste. They leak mercury and lead, which contaminate organic compost and pollute the soil!"
  },
  {
    binCategory: "hazardous",
    binLabel: "Hazardous Bin",
    validItemIds: ["paint_can", "spray_can", "thermometer"],
    imposterItemId: "newspaper",
    explanation: "Newspapers are Recyclable. Putting recyclable paper in hazardous waste bins wastes reusable fibers and fills chemical disposal zones."
  },
  {
    binCategory: "eWaste",
    binLabel: "E-Waste Recycler",
    validItemIds: ["old_cellphone", "charging_cable", "led_bulb"],
    imposterItemId: "styrofoam_cup",
    explanation: "Styrofoam belongs in General Waste. It cannot be recycled with electronics and clogs technical disassembly lines."
  },
  {
    binCategory: "recyclable",
    binLabel: "Recyclable Bin",
    validItemIds: ["soda_can", "glass_jar", "newspaper"],
    imposterItemId: "diaper",
    explanation: "Diapers are General Waste. They contain composite fibers and biological waste, contaminating sorting centers immediately."
  },
  {
    binCategory: "organic",
    binLabel: "Organic Bin",
    validItemIds: ["banana_peel", "apple_core", "tea_bag"],
    imposterItemId: "plastic_wrap",
    explanation: "Plastic wrap is non-biodegradable cling wrap. It does not compost and ruins organic batches in commercial sorting facilities!"
  },
  {
    binCategory: "hazardous",
    binLabel: "Hazardous Bin",
    validItemIds: ["alkaline_battery", "paint_can", "medicine_expired"],
    imposterItemId: "wooden_chopsticks",
    explanation: "Wooden chopsticks are clean organics. They do not require chemical hazardous waste treatment and should be composted!"
  },
  {
    binCategory: "eWaste",
    binLabel: "E-Waste Recycler",
    validItemIds: ["old_cellphone", "broken_tablet", "remote_control"],
    imposterItemId: "chewing_gum",
    explanation: "Chewing gum belongs in General Waste. It has no circuitry or metal to recover and ruins electronic recycling belts."
  },
  {
    binCategory: "recyclable",
    binLabel: "Recyclable Bin",
    validItemIds: ["milk_jug", "steel_tin_can", "glass_jar"],
    imposterItemId: "paint_thinner",
    explanation: "Paint thinners and chemical solvents are highly toxic and flammable. They damage pipelines and contaminate recycling centers."
  },
  {
    binCategory: "general",
    binLabel: "General Waste",
    validItemIds: ["styrofoam_cup", "diaper", "plastic_wrap", "chewing_gum"],
    imposterItemId: "steel_tin_can",
    explanation: "Steel tin cans are 100% recyclable. Putting them in general waste wastes precious metal that can be recycled infinitely."
  }
];

// Absolute offset positions for organic layout inside the container
const PILE_LAYOUTS = [
  { top: "15%", left: "12%", rotate: -12, zIndex: 10 },
  { top: "18%", left: "52%", rotate: 10, zIndex: 12 },
  { top: "42%", left: "16%", rotate: 18, zIndex: 14 },
  { top: "40%", left: "54%", rotate: -8, zIndex: 16 },
  { top: "28%", left: "34%", rotate: 6, zIndex: 18 },
  { top: "46%", left: "36%", rotate: -14, zIndex: 20 }
];

interface ContaminationHuntScreenProps {
  onBack: () => void;
}

export const ContaminationHuntScreen: React.FC<ContaminationHuntScreenProps> = ({ onBack }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isFound, setIsFound] = useState(false);
  const [shakingItemId, setShakingItemId] = useState<string | null>(null);
  const [isPileShaking, setIsPileShaking] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState<{ itemId: string; explanation: string }[]>([]);
  const [shuffledItems, setShuffledItems] = useState<{ id: string; isImposter: boolean }[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Prepare items for the active round
  useEffect(() => {
    if (currentRoundIdx < HUNTS.length) {
      const activeRound = HUNTS[currentRoundIdx];
      const itemsList = [
        ...activeRound.validItemIds.map(id => ({ id, isImposter: false })),
        { id: activeRound.imposterItemId, isImposter: true }
      ];
      // Shuffle items so position is random
      setShuffledItems(itemsList.sort(() => 0.5 - Math.random()));
      setIsFound(false);
      setShakingItemId(null);
      setIsPileShaking(false);
      setShowExplanation(false);
    }
  }, [currentRoundIdx]);

  const handleTapItem = (id: string, isImposter: boolean) => {
    if (isFound) return;

    if (isImposter) {
      // Correct! Spotted the contaminant
      setIsFound(true);
      playSound.huntImposterFound();
      
      // Confetti burst from center of screen
      const binEl = document.querySelector(".hunt-bin-container");
      if (binEl) {
        const rect = binEl.getBoundingClientRect();
        triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 3, "#10b981");
      }

      // Unlock item in encyclopedia caddy
      const activeRound = HUNTS[currentRoundIdx];
      useGameStore.getState().unlockEncyclopediaItem(activeRound.imposterItemId);

      // Show explanation card after a short delay
      setTimeout(() => {
        setShowExplanation(true);
      }, 1000);
    } else {
      // Wrong! Tapped a valid item -> trigger local item shake + entire pile wobble
      setShakingItemId(id);
      setIsPileShaking(true);
      
      setTimeout(() => {
        setShakingItemId(null);
        setIsPileShaking(false);
      }, 400);

      playSound.huntInspect();
      setWrongCount((prev) => prev + 1);

      const activeRound = HUNTS[currentRoundIdx];
      if (!wrongAttempts.some(att => att.itemId === activeRound.imposterItemId)) {
        setWrongAttempts((prev) => [
          ...prev,
          { itemId: activeRound.imposterItemId, explanation: activeRound.explanation }
        ]);
      }
    }
  };

  const handleNextRound = () => {
    if (currentRoundIdx < HUNTS.length - 1) {
      playSound.huntRoundClear();
      setCurrentRoundIdx((prev) => prev + 1);
    } else {
      playSound.huntRoundClear();
      setCurrentRoundIdx(HUNTS.length); // Result screen
    }
  };

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setWrongCount(0);
    setIsFound(false);
    setWrongAttempts([]);
    setShowExplanation(false);
  };

  const activeRound = HUNTS[currentRoundIdx];
  const isFinished = currentRoundIdx >= HUNTS.length;
  const accuracy = Math.round((HUNTS.length / (HUNTS.length + wrongCount || 1)) * 100);
  const totalPoints = HUNTS.length * 200;

  // Custom bin colors matching main game categories
  const getBinColors = (category: WasteCategory) => {
    if (category === "recyclable") return { color: "#10b981", rim: "#059669", neon: "shadow-[0_0_15px_#10b981]" };
    if (category === "organic") return { color: "#b45309", rim: "#92400e", neon: "shadow-[0_0_15px_#f59e0b]" };
    if (category === "hazardous") return { color: "#f43f5e", rim: "#e11d48", neon: "shadow-[0_0_15px_#f43f5e]" };
    if (category === "eWaste") return { color: "#3b82f6", rim: "#2563eb", neon: "shadow-[0_0_15px_#3b82f6]" };
    return { color: "#6b7280", rim: "#4b5563", neon: "shadow-[0_0_15px_#94a3b8]" };
  };

  const binColors = activeRound ? getBinColors(activeRound.binCategory) : { color: "#10b981", rim: "#059669", neon: "" };

  return (
    <div className="flex flex-col min-h-full w-full relative bg-transparent overflow-y-auto no-scrollbar text-center select-none justify-between max-w-xl mx-auto py-2">
      
      {/* Background Glow Flash on Mistakes */}
      <motion.div
        animate={{
          backgroundColor: isPileShaking ? "rgba(244, 63, 94, 0.08)" : "rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 pointer-events-none z-0 rounded-3xl"
      />

      {/* Header Panel */}
      <div className="p-4 relative z-40 shrink-0 glass-panel border-b border-slate-950/10 shadow-premium w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-700 hover:text-slate-950 transition-all cursor-pointer border border-slate-950/10 hover:bg-white/60 shadow-premium"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm uppercase tracking-wider">
          <Trash2 size={16} className="text-rose-600 animate-pulse" />
          <span>Imposter Hunt</span>
        </div>
        <div className="w-8 h-8" />
      </div>

      <div className="flex-1 w-full overflow-visible relative flex flex-col items-center justify-center p-6 z-10">
        
        {/* State 1: Active Imposter Spotting */}
        {!isFinished && activeRound && !showExplanation && (
          <div className="w-full flex flex-col relative justify-between max-w-sm mx-auto my-auto gap-4">
            
            {/* Top Indicator Stats */}
            <div className="flex justify-between items-center w-full px-2 text-slate-800 font-extrabold text-xs">
              <span className="text-[10px] uppercase tracking-wide bg-slate-950/5 border border-slate-950/5 px-3 py-1 rounded-full">
                Compartment {currentRoundIdx + 1} of {HUNTS.length}
              </span>
              <span className="text-[10px] text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-950/5">
                FAILS: {wrongCount}
              </span>
            </div>

            {/* Industrial Sorting Caddy Frame */}
            <div className="w-full relative flex flex-col items-center justify-center py-6 hunt-bin-container shrink-0 overflow-visible bg-white/40 border border-slate-950/5 rounded-3xl shadow-sm">
              
              {/* Conveyor Belt Background Tile */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-3xl" style={{
                backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }} />

              {/* Suction Funnel / Hood at the top */}
              <div className="absolute top-2 w-28 h-6 bg-slate-800 border-b border-slate-700 rounded-b-xl flex items-center justify-center shadow-md z-30">
                <div className="w-12 h-1 bg-slate-950 rounded-full" />
              </div>

              {/* Glowing category neons on the sides of the caddy */}
              <div className={`absolute left-3 top-[22%] bottom-[12%] w-1 rounded-full transition-all duration-500 bg-slate-800 ${binColors.neon}`} style={{ backgroundColor: binColors.color }} />
              <div className={`absolute right-3 top-[22%] bottom-[12%] w-1 rounded-full transition-all duration-500 bg-slate-800 ${binColors.neon}`} style={{ backgroundColor: binColors.color }} />

              {/* Custom illustrated Bin SVG */}
              <div className="relative w-40 h-[32vh] max-h-[220px] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] select-none aspect-[100/120]">
                <svg viewBox="0 0 100 120" className="w-full h-full">
                  {/* Bin Body */}
                  <path d="M 18 45 L 28 112 Q 50 118 72 112 L 82 45 Z" fill={binColors.color} />
                  {/* Rim */}
                  <ellipse cx="50" cy="45" rx="32" ry="8" fill={binColors.rim} />
                  {/* Rim Inner */}
                  <ellipse cx="50" cy="45" rx="27" ry="5" fill="rgba(0,0,0,0.25)" />
                  {/* Category symbol emblem */}
                  <circle cx="50" cy="78" r="14" fill="rgba(255,255,255,0.9)" />
                  <text x="50" y="83" textAnchor="middle" fontSize="15" className="font-extrabold select-none">
                    {CATEGORY_META[activeRound.binCategory].emoji}
                  </text>
                </svg>

                {/* Items overlapping in a staggered pile with falling gravity drops */}
                <motion.div
                  animate={isPileShaking ? { rotate: [-1.5, 1.5, -1, 1, 0], scale: [1, 0.98, 1.01, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-x-3 top-2 bottom-14"
                >
                  {shuffledItems.map((item, idx) => {
                    const isShaking = shakingItemId === item.id;
                    const isRemoved = isFound && item.isImposter;
                    const layout = PILE_LAYOUTS[idx % PILE_LAYOUTS.length];

                    return (
                      <AnimatePresence key={item.id}>
                        {!isRemoved && (
                          <motion.button
                            // Satisfying gravity drop with spring bounce landing
                            initial={{ y: -220, opacity: 0, scale: 0.7 }}
                            animate={{ y: 0, opacity: 1, scale: 1, rotate: layout.rotate }}
                            // Vacuum pull up into suction funnel when imposter is correctly tapped
                            exit={{ scale: 1.4, y: -160, rotate: 360, opacity: 0 }}
                            transition={{ 
                              type: "spring", 
                              damping: 12, 
                              stiffness: 110,
                              delay: idx * 0.08
                            }}
                            onClick={() => handleTapItem(item.id, item.isImposter)}
                            style={{
                              position: "absolute",
                              top: layout.top,
                              left: layout.left,
                              zIndex: layout.zIndex,
                            }}
                            className={`w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center rounded-2xl bg-white/95 border shadow-[0_4px_8px_-2px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.06)] hover:scale-105 active:scale-95 transition-all cursor-pointer relative ${
                              isShaking 
                                ? "border-rose-500 bg-rose-50 border-2" 
                                : "border-slate-950/10"
                            }`}
                          >
                            <ItemSVG itemId={item.id} size={28} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    );
                  })}
                </motion.div>
              </div>
            </div>

            {/* Instruction label */}
            <div className="mt-2 text-center">
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                Target Compartment: {activeRound.binLabel}
              </span>
              <p className="text-[10px] font-semibold text-slate-600 mt-0.5">
                Spot the contaminant item and tap to vacuum eject it!
              </p>
            </div>
          </div>
        )}

        {/* State 2: Ejection Analysis Facts report */}
        {!isFinished && activeRound && showExplanation && (
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm glass-panel border border-slate-950/10 bg-white/95 rounded-3xl p-5 flex flex-col gap-4 text-left my-auto shadow-2xl relative z-10"
          >
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-950/10 text-emerald-700">
              <CheckCircle size={18} />
              <span className="text-xs font-black uppercase tracking-wider">
                Contamination Cleared
              </span>
            </div>

            {/* Imposter Info panel */}
            <div className="flex gap-4 items-center bg-slate-950/5 p-3.5 rounded-2xl border border-slate-950/5">
              <ItemSVG itemId={activeRound.imposterItemId} size={50} />
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Imposter Item</span>
                <span className="text-sm font-black text-slate-950 leading-tight">
                  {WASTE_ITEMS.find(it => it.id === activeRound.imposterItemId)?.name}
                </span>
                <span className="text-[9px] font-semibold text-slate-600 mt-0.5">
                  Category: <span className="font-extrabold uppercase text-amber-700">{WASTE_ITEMS.find(it => it.id === activeRound.imposterItemId)?.category}</span>
                </span>
              </div>
            </div>

            {/* Facts breakdown */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Disposal Analysis</span>
              <p className="text-[11px] leading-relaxed text-slate-700 font-medium">
                {activeRound.explanation}
              </p>
            </div>

            {/* Next Round Action */}
            <button
              onClick={handleNextRound}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>PROCEED TO NEXT COMPARTMENT</span>
            </button>
          </motion.div>
        )}

        {/* State 3: Results Review Screen */}
        {isFinished && (
          <div className="w-full max-w-md glass-panel border border-slate-950/10 rounded-3xl p-6 flex flex-col gap-5 scale-in shadow-2xl bg-white/95 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 mb-2 shadow-[0_0_12px_rgba(16,185,129,0.15)] animate-bounce">
                <CheckCircle size={26} />
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-none">
                Hunt Complete!
              </h2>
              <p className="text-xs text-slate-700 mt-2 font-semibold">
                You successfully purified all {HUNTS.length} compartments.
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950/5 p-4 rounded-2xl border border-slate-950/5">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider">Score</span>
                <span className="text-xl font-black text-slate-900 mt-0.5">+{totalPoints} XP</span>
              </div>
              <div className="flex flex-col items-center border-l border-slate-950/10">
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider">Accuracy</span>
                <span className={`text-xl font-black mt-0.5 ${accuracy >= 80 ? "text-emerald-700" : "text-amber-700"}`}>
                  {accuracy}%
                </span>
              </div>
            </div>

            {/* Mistakes & Explanations Review */}
            {wrongAttempts.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-[170px] overflow-y-auto no-scrollbar text-left border border-slate-950/5 p-3 rounded-2xl bg-white/50">
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlertCircle size={10} className="text-amber-500" />
                  <span>Contamination Facts:</span>
                </span>
                {wrongAttempts.map((attempt) => {
                  const dbItem = WASTE_ITEMS.find((it) => it.id === attempt.itemId);
                  if (!dbItem) return null;
                  return (
                    <div key={attempt.itemId} className="text-[10px] leading-tight border-b border-slate-950/5 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center gap-1.5 font-extrabold mb-1">
                        <ItemSVG itemId={attempt.itemId} size={16} />
                        <span className="text-slate-900">{dbItem.name} Imposter</span>
                      </div>
                      <p className="text-slate-700 font-medium">{attempt.explanation}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-4 px-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold leading-relaxed">
                🎉 Perfect Purification! You identified every contaminant on the first attempt. Excellent sorting discipline!
              </div>
            )}

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-3 mt-1.5">
              <button
                onClick={handleRestart}
                className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-premium"
              >
                HUNT AGAIN
              </button>

              <button
                onClick={onBack}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
              >
                MAIN MENU
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
