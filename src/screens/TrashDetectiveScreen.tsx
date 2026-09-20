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

/** Clue art for every scene that has been rebuilt to the high-fidelity
 *  standard, keyed by clue id. Ids are unique across scenes, so one lookup
 *  serves them all and the remaining dioramas simply fall through to the
 *  generic ItemSVG chip. */
const CLUE_ART: Record<string, React.ReactNode> = { ...KITCHEN_CLUE_ART, ...BEACH_CLUE_ART };

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
      { id: "o1", itemId: "charging_cable", name: "Charging Cable", category: "eWaste", top: "66%", left: "16%" },
      { id: "o2", itemId: "keyboard", name: "Broken Keyboard", category: "eWaste", top: "74%", left: "48%" },
      { id: "o3", itemId: "styrofoam_cup", name: "Styrofoam Cup", category: "general", top: "38%", left: "78%" },
      { id: "o4", itemId: "coffee_grounds", name: "Coffee Grounds", category: "organic", top: "46%", left: "34%" },
      { id: "o5", itemId: "spray_can", name: "Aerosol Spray Can", category: "hazardous", top: "70%", left: "82%" },
    ]
  },
  {
    id: "park",
    title: "Park Picnic",
    description: "Clean up the grass after a sunny afternoon lunch.",
    colorClass: "from-green-100 to-emerald-100 border-green-200/60 hover:border-green-400",
    bgDecorationClass: "bg-[radial-gradient(#047857_1px,transparent_1px)] [background-size:14px_14px] opacity-10",
    items: [
      { id: "p1", itemId: "tea_bag", name: "Paper Tea Bag", category: "organic", top: "68%", left: "16%" },
      { id: "p2", itemId: "wooden_chopsticks", name: "Wooden Chopsticks", category: "organic", top: "74%", left: "42%" },
      { id: "p3", itemId: "chewing_gum", name: "Chewing Gum", category: "general", top: "54%", left: "62%" },
      { id: "p4", itemId: "steel_tin_can", name: "Steel Soup Can", category: "recyclable", top: "78%", left: "82%" },
      { id: "p5", itemId: "plastic_wrap", name: "Cling Wrap", category: "general", top: "36%", left: "54%" }
    ]
  },
  {
    id: "school",
    title: "School Lunch",
    description: "Sort leftovers and wrappers left on the school cafeteria table.",
    colorClass: "from-violet-100 to-indigo-100 border-violet-200/60 hover:border-violet-400",
    bgDecorationClass: "bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:18px_18px] opacity-10",
    items: [
      { id: "s1", itemId: "milk_jug", name: "Plastic Milk Jug", category: "recyclable", top: "56%", left: "12%" },
      { id: "s2", itemId: "broken_tablet", name: "Cracked Tablet", category: "eWaste", top: "76%", left: "34%" },
      { id: "s3", itemId: "chewing_gum", name: "Chewing Gum", category: "general", top: "32%", left: "56%" },
      { id: "s4", itemId: "apple_core", name: "Apple Core", category: "organic", top: "78%", left: "74%" },
      { id: "s5", itemId: "charging_cable", name: "Charging Cable", category: "eWaste", top: "66%", left: "52%" }
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

// Scene 3: Office Diorama Props with Interactive Micro-Animations
const OfficeProps: React.FC = () => {
  const [isMonitorOn, setIsMonitorOn] = useState(true);
  const [isLampOn, setIsLampOn] = useState(false);
  const [isPlantSwaying, setIsPlantSwaying] = useState(false);

  const handlePlantClick = () => {
    if (isPlantSwaying) return;
    setIsPlantSwaying(true);
    playSound.detectiveScan();
    setTimeout(() => setIsPlantSwaying(false), 1000);
  };

  return (
    <>
      {/* Office wall background */}
      <div className="absolute inset-x-0 top-0 h-[50%] bg-[#cbd5e1] border-b-2 border-slate-400 z-0">
        {/* Wall Panel lines */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "linear-gradient(to right, #475569 1px, transparent 1px)",
          backgroundSize: "80px 100%"
        }} />
        
        {/* Framed Poster */}
        <div className="absolute left-[70%] top-[8%] w-[20%] h-[30%] bg-slate-900 border-2 border-slate-100 rounded-sm shadow-md flex items-center justify-center p-1 overflow-hidden">
          <div className="w-full h-full bg-emerald-700/80 rounded-xs flex flex-col items-center justify-center text-[5px] text-white font-bold tracking-tighter">
            <span>GO</span>
            <span>GREEN</span>
          </div>
        </div>
      </div>
      
      {/* Wooden Desk Surface */}
      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-b from-[#7c2d12] to-[#4c1d95]/0 bg-[#451a03] z-0 shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] border-t border-amber-950" />
      {/* Desk Mat */}
      <div className="absolute left-[5%] top-[55%] right-[5%] bottom-[5%] bg-slate-800/25 rounded-2xl border border-slate-700/30 z-0" />

      {/* Interactive Monitor */}
      <div 
        onClick={() => {
          setIsMonitorOn(!isMonitorOn);
          playSound.detectiveScan();
        }}
        className="absolute left-[32%] top-[18%] w-[36%] h-[32%] z-10 cursor-pointer"
      >
        <svg className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 70 50">
          <rect x="5" y="5" width="60" height="36" rx="3" fill="#1e293b" />
          <rect x="8" y="8" width="54" height="30" fill={isMonitorOn ? "#0f172a" : "#334155"} />
          {isMonitorOn ? (
            <>
              <text x="35" y="24" textAnchor="middle" fontSize="6" fill="#10b981" fontWeight="bold">EcoOS 1.0</text>
              <line x1="12" y1="28" x2="58" y2="28" stroke="#10b981" strokeWidth="1" opacity="0.7" />
              <rect x="15" y="14" width="4" height="4" fill="#10b981" opacity="0.6" className="animate-pulse" />
            </>
          ) : (
            <circle cx="35" cy="23" r="5" fill="#f43f5e" opacity="0.3" />
          )}
          <rect x="30" y="41" width="10" height="6" fill="#475569" />
          <ellipse cx="35" cy="47" rx="14" ry="2" fill="#334155" />
        </svg>
      </div>

      {/* Keyboard Base */}
      <svg className="absolute left-[28%] top-[52%] w-[44%] h-[12%] z-10 filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.15)]" viewBox="0 0 80 20">
        <rect x="2" y="2" width="76" height="16" rx="2" fill="#475569" stroke="#334155" strokeWidth="1" />
        <rect x="8" y="6" width="64" height="3" fill="#1e293b" opacity="0.4" />
        <rect x="8" y="11" width="64" height="3" fill="#1e293b" opacity="0.4" />
      </svg>
      
      {/* Interactive Desk Plant */}
      <motion.div 
        onClick={handlePlantClick}
        animate={isPlantSwaying ? { rotate: [-5, 5, -3, 3, 0] } : {}}
        transition={{ duration: 1 }}
        className="absolute left-[8%] top-[38%] w-[16%] h-[28%] z-30 cursor-pointer"
      >
        <svg className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 40 65">
          <rect x="10" y="38" width="20" height="24" rx="2" fill="#d97706" />
          <path d="M 20 38 C 10 22 2 30 12 38 Z" fill="#22c55e" />
          <path d="M 20 38 C 30 22 38 30 28 38 Z" fill="#15803d" />
          <path d="M 20 38 C 20 15 15 12 20 38 Z" fill="#166534" />
        </svg>
      </motion.div>

      {/* Organizer Tray */}
      <svg className="absolute left-[70%] top-[34%] w-[22%] h-[24%] z-30 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 50 50">
        <rect x="5" y="10" width="40" height="32" rx="2" fill="#cbd5e1" opacity="0.8" />
        <rect x="5" y="18" width="40" height="3" fill="#94a3b8" />
        <rect x="5" y="28" width="40" height="3" fill="#94a3b8" />
        <rect x="5" y="38" width="40" height="3" fill="#94a3b8" />
      </svg>
      
      {/* Interactive Desk Lamp */}
      <div 
        onClick={() => {
          setIsLampOn(!isLampOn);
          playSound.detectiveScan();
        }}
        className="absolute left-[64%] top-[45%] w-[12%] h-[24%] z-30 cursor-pointer"
      >
        <svg className="w-full h-full filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.15)]" viewBox="0 0 30 60">
          <path d="M 15 45 L 15 15 M 15 15 L 10 10" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="15" cy="48" rx="8" ry="2" fill="#334155" />
          <path d="M 5 20 L 25 20 L 20 8 L 10 8 Z" fill="#dc2626" />
        </svg>
      </div>

      {/* Lamp Light Glow Overlay */}
      {isLampOn && (
        <div 
          className="absolute pointer-events-none z-20 opacity-30 bg-gradient-to-b from-yellow-300/80 to-transparent rounded-full blur-[8px]"
          style={{
            left: "58%",
            top: "56%",
            width: "24%",
            height: "40%",
            transform: "rotate(-10deg)"
          }}
        />
      )}
    </>
  );
};

// Scene 4: Park Picnic Diorama Props with Interactive Micro-Animations
const ParkProps: React.FC = () => {
  const [isGrillOn, setIsGrillOn] = useState(false);
  const [isSquirrelPeeking, setIsSquirrelPeeking] = useState(false);
  const [frisbeeSpin, setFrisbeeSpin] = useState(false);

  const handleFrisbeeClick = () => {
    if (frisbeeSpin) return;
    setFrisbeeSpin(true);
    playSound.detectiveScan();
    setTimeout(() => setFrisbeeSpin(false), 1200);
  };

  return (
    <>
      {/* Sky & Tree line */}
      <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-sky-200 to-sky-100 z-0">
        <circle cx="85" cy="22" r="10" fill="#fef08a" opacity="0.8" className="filter blur-[1px]" />
        <svg className="absolute left-[8%] top-[20%] w-16 h-7 text-white/80" viewBox="0 0 50 20">
          <path d="M 5 15 A 8 8 0 0 1 20 10 A 10 10 0 0 1 38 12 A 7 7 0 0 1 45 15 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Grassy floor */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[#86efac] z-0 shadow-[inset_0_4px_6px_rgba(0,0,0,0.1)] border-t border-emerald-300">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(#059669 1px, transparent 1px)",
          backgroundSize: "12px 12px"
        }} />
      </div>

      {/* Picnic Blanket */}
      <svg className="absolute left-[8%] top-[50%] w-[32%] h-[32%] z-10 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 80 60">
        <polygon points="5,45 75,30 65,58 12,56" fill="#ef4444" />
        <path d="M15,43 L22,56 M30,40 L37,56 M45,36 L52,56 M60,33 L67,56" stroke="#ffffff" strokeWidth="2.5" opacity="0.4" />
        <path d="M9,47 L68,34 M11,51 L66,37 M13,55 L64,41" stroke="#ffffff" strokeWidth="2.5" opacity="0.4" />
      </svg>

      {/* Interactive Picnic Basket & Peeking Squirrel */}
      <div 
        onClick={() => {
          setIsSquirrelPeeking(!isSquirrelPeeking);
          playSound.detectiveScan();
        }}
        className="absolute left-[38%] top-[40%] w-[18%] h-[24%] z-30 cursor-pointer"
      >
        <AnimatePresence>
          {isSquirrelPeeking && (
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: -8, opacity: 1 }}
              exit={{ y: 15, opacity: 0 }}
              className="absolute left-[26%] top-[-10%] text-sm pointer-events-none z-10"
            >
              🐿️
            </motion.div>
          )}
        </AnimatePresence>
        <svg className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 50 40">
          <rect x="5" y="15" width="40" height="22" rx="2" fill="#d97706" />
          <rect x="3" y="12" width="44" height="4" rx="1" fill="#b45309" />
          <line x1="12" y1="16" x2="12" y2="35" stroke="#b45309" strokeWidth="1.5" />
          <line x1="25" y1="16" x2="25" y2="35" stroke="#b45309" strokeWidth="1.5" />
          <line x1="38" y1="16" x2="38" y2="35" stroke="#b45309" strokeWidth="1.5" />
          <line x1="6" y1="24" x2="44" y2="24" stroke="#b45309" strokeWidth="1.5" />
          <path d="M 12 12 Q 25 -4 38 12" fill="none" stroke="#b45309" strokeWidth="3" />
        </svg>
      </div>

      {/* Interactive Barbecue Grill */}
      <div 
        onClick={() => {
          setIsGrillOn(!isGrillOn);
          playSound.detectiveScan();
        }}
        className="absolute left-[66%] top-[30%] w-[20%] h-[40%] z-10 cursor-pointer"
      >
        <svg className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 50 80">
          <line x1="15" y1="46" x2="10" y2="76" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          <line x1="35" y1="46" x2="40" y2="76" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          <line x1="25" y1="46" x2="25" y2="74" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 8 36 A 17 17 0 0 0 42 36 Z" fill="#334155" />
          <motion.path
            animate={isGrillOn ? { y: -8, rotate: -8 } : { y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            d="M 8 33 A 17 17 0 0 1 42 33 Z"
            fill="#dc2626"
            style={{ originX: "42px", originY: "33px" }}
          />
          <motion.rect
            animate={isGrillOn ? { y: -8, rotate: -8 } : { y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            x="20" y="10" width="10" height="4" fill="#334155" rx="1"
            style={{ originX: "42px", originY: "33px" }}
          />
        </svg>

        <AnimatePresence>
          {isGrillOn && (
            <motion.div
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: [-5, -28], x: [-2, 2, -1], opacity: [0, 0.7, 0] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="absolute left-[36%] top-[-8%] text-[10px] pointer-events-none"
            >
              💨
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Frisbee */}
      <motion.div
        onClick={handleFrisbeeClick}
        animate={frisbeeSpin ? { x: [0, 60, -40, 0], y: [0, -45, -20, 0], rotate: [0, 360, 720] } : {}}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute left-[54%] top-[72%] w-[12%] h-[8%] z-30 cursor-pointer"
      >
        <svg className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]" viewBox="0 0 40 20">
          <ellipse cx="20" cy="10" rx="18" ry="8" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
          <ellipse cx="20" cy="8" rx="14" ry="5" fill="#fef08a" opacity="0.8" />
        </svg>
      </motion.div>
    </>
  );
};

// Scene 5: School Lunch Table Diorama Props with Interactive Micro-Animations
const SchoolProps: React.FC = () => {
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [juiceSquirts, setJuiceSquirts] = useState(false);
  const [isSmileDrawing, setIsSmileDrawing] = useState(false);

  const handleJuiceClick = () => {
    setJuiceSquirts(true);
    playSound.detectiveFound();
    setTimeout(() => setJuiceSquirts(false), 900);
  };

  return (
    <>
      {/* Background Blackboard & Wall */}
      <div className="absolute inset-x-0 top-0 h-[46%] bg-[#e2e8f0] border-b-2 border-slate-400 z-0">
        <div 
          onClick={() => {
            setIsSmileDrawing(!isSmileDrawing);
            playSound.detectiveScan();
          }}
          className="absolute left-[15%] top-[8%] right-[15%] bottom-[12%] bg-[#064e3b] border-8 border-[#78350f] rounded-sm shadow-md cursor-pointer flex flex-col items-center justify-center relative overflow-hidden"
        >
          <svg className="w-14 h-14 text-white/80 filter drop-shadow-sm" viewBox="0 0 40 40">
            {isSmileDrawing ? (
              <>
                <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="14" cy="15" r="2" fill="currentColor" />
                <circle cx="26" cy="15" r="2" fill="currentColor" />
                <path d="M 12 24 Q 20 32 28 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              <path d="M12 28 H28 L20 12 Z M20 28 L24 24 M16 24 L20 28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            )}
          </svg>
          <span className="absolute bottom-1 right-2 text-[5px] text-white/50 font-mono">CHALK</span>
        </div>
      </div>

      {/* Classroom Cafeteria Table */}
      <div className="absolute inset-x-0 bottom-0 h-[54%] bg-gradient-to-b from-[#ca8a04] to-[#a16207] z-0 shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] border-t border-yellow-800" />
      <div className="absolute left-[12%] top-[56%] right-[12%] bottom-[8%] bg-sky-600/25 rounded-3xl border border-sky-500/20 z-0" />

      {/* Interactive Backpack with sliding notebook */}
      <div 
        onClick={() => {
          setIsBackpackOpen(!isBackpackOpen);
          playSound.detectiveScan();
        }}
        className="absolute left-[66%] top-[38%] w-[22%] h-[36%] z-30 cursor-pointer"
      >
        <div className="relative w-full h-full">
          <AnimatePresence>
            {isBackpackOpen && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -16, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="absolute left-[15%] top-0 w-[70%] h-[70%] z-10"
              >
                <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 30 35">
                  <rect x="2" y="2" width="26" height="31" rx="2" fill="#a855f7" />
                  <rect x="6" y="2" width="2" height="31" fill="#cbd5e1" />
                  <line x1="12" y1="8" x2="24" y2="8" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="12" y1="14" x2="24" y2="14" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="12" y1="20" x2="24" y2="20" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          <svg className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.18)] relative z-20" viewBox="0 0 45 60">
            <path d="M 5 55 Q 5 15 22.5 10 Q 40 15 40 55 Z" fill="#3b82f6" />
            <path d="M 8 55 Q 8 32 22.5 28 Q 37 32 37 55 Z" fill="#2563eb" />
            <rect x="18" y="28" width="9" height="2" rx="0.5" fill="#94a3b8" />
          </svg>
        </div>
      </div>

      {/* Interactive Juice Box (squirt animation) */}
      <div 
        onClick={handleJuiceClick}
        className="absolute left-[38%] top-[46%] w-[16%] h-[26%] z-30 cursor-pointer"
      >
        <svg className="w-full h-full filter drop-shadow-[0_4px_5px_rgba(0,0,0,0.15)]" viewBox="0 0 35 50">
          <rect x="5" y="10" width="25" height="36" rx="2" fill="#ec4899" />
          <rect x="8" y="15" width="19" height="20" fill="#fbcfe8" opacity="0.9" />
          <circle cx="18" cy="25" r="5" fill="#f43f5e" />
          <line x1="15" y1="10" x2="12" y2="2" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        {juiceSquirts && (
          <div className="absolute left-[15%] top-[-10px] flex flex-col gap-1 text-[8px] opacity-80 pointer-events-none z-30">
            💦
          </div>
        )}
      </div>

      {/* Apple Bowl */}
      <svg className="absolute left-[4%] top-[72%] w-[20%] h-[18%] z-30 filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.15)]" viewBox="0 0 60 30">
        <path d="M 5 5 Q 30 35 55 5 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <ellipse cx="30" cy="5" rx="25" ry="3" fill="#cbd5e1" />
      </svg>
    </>
  );
};

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
                {selectedScene.id === "office" && <OfficeProps />}
                {selectedScene.id === "park" && <ParkProps />}
                {selectedScene.id === "school" && <SchoolProps />}
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
                                // 200 scene units wide out of 1200x900, centred on
                                // the anchor, so the art scales with the frame.
                                // The box is inert: an HTML div takes pointer
                                // events across its whole rectangle whether or not
                                // anything is drawn there, and at this size it
                                // would swallow every decoy underneath it. Only
                                // the painted litter inside takes them back.
                                width: "16.667%",
                                height: "22.222%",
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
