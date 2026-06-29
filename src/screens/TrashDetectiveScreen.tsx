import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Clock, AlertTriangle, Check } from "lucide-react";
import { useGameStore } from "../state/gameStore";
import { WASTE_ITEMS } from "../data/wasteItems";
import type { WasteCategory } from "../data/wasteItems";
import { CATEGORY_META } from "../components/BinBadge";
import { ItemSVG } from "../components/ItemSVG";
import { playSound } from "../utils/audio";

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
      { id: "k1", itemId: "plastic_bottle", name: "Plastic Water Bottle", category: "recyclable", top: "68%", left: "12%" },
      { id: "k2", itemId: "banana_peel", name: "Banana Peel", category: "organic", top: "75%", left: "34%" },
      { id: "k3", itemId: "newspaper", name: "Newspaper", category: "recyclable", top: "54%", left: "56%" },
      { id: "k4", itemId: "alkaline_battery", name: "Alkaline Battery", category: "hazardous", top: "78%", left: "82%" },
      { id: "k5", itemId: "apple_core", name: "Apple Core", category: "organic", top: "32%", left: "44%" },
    ]
  },
  {
    id: "beach",
    title: "Beach Cleanup",
    description: "Scan the sandy shore for litter left by beachgoers.",
    colorClass: "from-blue-100 to-cyan-100 border-blue-200/60 hover:border-blue-400",
    bgDecorationClass: "bg-[radial-gradient(#0284c7_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10",
    items: [
      { id: "b1", itemId: "plastic_bottle", name: "Plastic Water Bottle", category: "recyclable", top: "48%", left: "22%" },
      { id: "b2", itemId: "soda_can", name: "Aluminum Soda Can", category: "recyclable", top: "72%", left: "42%" },
      { id: "b3", itemId: "paint_can", name: "Paint Can", category: "hazardous", top: "36%", left: "74%" },
      { id: "b4", itemId: "face_mask", name: "Disposable Face Mask", category: "general", top: "78%", left: "14%" },
      { id: "b5", itemId: "chip_bag", name: "Potato Chip Bag", category: "general", top: "62%", left: "84%" },
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

const getCategoryHexColor = (category: WasteCategory) => {
  if (category === "recyclable") return "#10b981";
  if (category === "organic") return "#b45309";
  if (category === "hazardous") return "#f43f5e";
  if (category === "eWaste") return "#3b82f6";
  return "#6b7280";
};

const getPickerAlignment = (left: string) => {
  const leftPercent = parseFloat(left);
  if (leftPercent >= 70) return "right";
  if (leftPercent <= 28) return "left";
  return "center";
};

// Scene 1: Kitchen Diorama Props with Interactive Micro-Animations
const KitchenProps: React.FC = () => {
  const [isToasting, setIsToasting] = useState(false);
  const [isCoffeeBrewing, setIsCoffeeBrewing] = useState(false);
  const [cerealShake, setCerealShake] = useState(false);

  const handleToasterClick = () => {
    if (isToasting) return;
    setIsToasting(true);
    playSound.detectiveScan();
    setTimeout(() => {
      setIsToasting(false);
      playSound.detectiveFound();
    }, 1500);
  };

  const handleCerealClick = () => {
    setCerealShake(true);
    playSound.detectiveScan();
    setTimeout(() => setCerealShake(false), 500);
  };

  return (
    <>
      {/* Subway tile wall background */}
      <div className="absolute inset-x-0 top-0 h-[65%] bg-[#f1f5f9] border-b border-slate-300 z-0">
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: "linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)",
          backgroundSize: "28px 16px"
        }} />
      </div>
      {/* Wooden Countertop */}
      <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-b from-[#854d0e] to-[#713f12] z-0 shadow-[inset_0_4px_6px_rgba(0,0,0,0.25)] border-t border-amber-900/40" />
      {/* Counter Reflection/Depth */}
      <div className="absolute inset-x-0 bottom-[31%] h-[4%] bg-white/10 z-0" />
      
      {/* Wall Shelf */}
      <div className="absolute right-[5%] top-[12%] w-[26%] h-[8%] bg-amber-800/80 rounded-sm shadow-md z-10 border-b-2 border-amber-950">
        {/* Pots on the shelf */}
        <svg className="absolute -top-5 left-2 w-6 h-5" viewBox="0 0 24 20">
          <rect x="4" y="8" width="16" height="12" rx="2" fill="#f43f5e" />
          <path d="M 12 8 C 8 0 16 0 12 8 Z" fill="#22c55e" />
        </svg>
        <svg className="absolute -top-4 right-3 w-5 h-4" viewBox="0 0 20 16">
          <rect x="3" y="6" width="14" height="10" rx="1.5" fill="#eab308" />
          <path d="M 10 6 C 7 0 13 0 10 6 Z" fill="#10b981" />
        </svg>
      </div>
      
      {/* Window */}
      <div className="absolute left-[4%] top-[4%] w-[28%] h-[40%] border-4 border-amber-950/20 bg-gradient-to-b from-sky-200 to-cyan-100 rounded-lg flex items-center justify-center overflow-hidden z-10 shadow-sm">
        <div className="w-0.5 h-full bg-amber-950/15 absolute left-1/2" />
        <div className="h-0.5 w-full bg-amber-950/15 absolute top-1/2" />
        <div className="w-8 h-8 rounded-full bg-amber-200 absolute -top-1 -right-1 opacity-70 animate-pulse" />
      </div>
      
      {/* Interactive Coffee Maker */}
      <div 
        onClick={() => {
          setIsCoffeeBrewing(!isCoffeeBrewing);
          playSound.detectiveScan();
        }}
        className="absolute left-[64%] top-[34%] w-[16%] h-[36%] z-10 cursor-pointer"
      >
        <svg className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 50 80">
          <rect x="5" y="10" width="40" height="60" rx="3" fill="#334155" />
          <rect x="10" y="45" width="30" height="20" rx="2" fill={isCoffeeBrewing ? "#78350f" : "#94a3b8"} opacity="0.4" />
          <circle cx="25" cy="25" r="10" fill="#e2e8f0" />
          <circle cx="25" cy="25" r="3" fill={isCoffeeBrewing ? "#10b981" : "#ef4444"} className={isCoffeeBrewing ? "animate-pulse" : ""} />
          <rect x="20" y="20" width="10" height="10" fill="#475569" />
          <path d="M12 42 H38 V48 H12 Z" fill="#475569" />
        </svg>
        {/* Steam overlay when brewing */}
        <AnimatePresence>
          {isCoffeeBrewing && (
            <motion.div 
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: [-5, -20], opacity: [0, 0.7, 0] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute left-[38%] top-[-8%] text-xs pointer-events-none"
            >
              💨
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Interactive Toaster */}
      <div 
        onClick={handleToasterClick}
        className="absolute left-[14%] top-[54%] w-[18%] h-[24%] z-10 cursor-pointer"
      >
        <motion.div
          animate={isToasting ? { y: [0, 1, 0] } : {}}
          className="relative w-full h-full"
        >
          <svg className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 60 40">
            <rect x="5" y="5" width="50" height="30" rx="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
            <motion.rect 
              animate={isToasting ? { y: 10 } : { y: 0 }}
              x="50" y="12" width="4" height="8" fill="#475569" rx="1" 
            />
            <line x1="20" y1="2" x2="20" y2="6" stroke="#475569" strokeWidth="2.5" />
            <line x1="40" y1="2" x2="40" y2="6" stroke="#475569" strokeWidth="2.5" />
          </svg>
          {/* Pop-up toast bread slices */}
          <AnimatePresence>
            {isToasting && (
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -16, opacity: 1 }}
                exit={{ y: -30, opacity: 0, scale: 0.8 }}
                className="absolute left-[30%] top-[-10%] text-xs pointer-events-none"
              >
                🍞
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Bread Box */}
      <svg className="absolute left-[36%] top-[42%] w-[20%] h-[22%] z-10 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 60 45">
        <path d="M 5 40 Q 5 10 30 10 Q 55 10 55 40 Z" fill="#d97706" opacity="0.85" />
        <rect x="5" y="36" width="50" height="4" fill="#b45309" />
        <circle cx="30" cy="28" r="3.5" fill="#f59e0b" />
      </svg>
      
      {/* Fruit Bowl */}
      <svg className="absolute left-[6%] top-[72%] w-[20%] h-[18%] z-30 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 60 30">
        <path d="M 5 5 Q 30 35 55 5 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
        <ellipse cx="30" cy="5" rx="25" ry="3" fill="#cbd5e1" />
      </svg>
      
      {/* Interactive Cereal Box */}
      <motion.div 
        onClick={handleCerealClick}
        animate={cerealShake ? { x: [-3, 3, -2, 2, 0], rotate: [-2, 2, -1, 1, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="absolute left-[74%] top-[48%] w-[18%] h-[28%] z-30 cursor-pointer"
      >
        <svg className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 45 60">
          <rect x="5" y="5" width="35" height="50" rx="2" fill="#ef4444" />
          <rect x="9" y="9" width="27" height="42" fill="#fef08a" opacity="0.9" />
          <circle cx="22" cy="30" r="10" fill="#f97316" />
          <text x="22" y="47" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#7f1d1d">CEREAL</text>
        </svg>
        {/* Grain particles falling when shaken */}
        {cerealShake && (
          <div className="absolute left-[40%] bottom-[-15px] flex flex-col gap-1 text-[8px] opacity-80 pointer-events-none">
            ⭐
          </div>
        )}
      </motion.div>
    </>
  );
};

// Scene 2: Beach Diorama Props with Interactive Micro-Animations
const BeachProps: React.FC = () => {
  const [umbrellaRot, setUmbrellaRot] = useState(0);
  const [isCrabPeeking, setIsCrabPeeking] = useState(false);
  const [ballBounce, setBallBounce] = useState(false);

  const handleUmbrellaClick = () => {
    setUmbrellaRot(prev => prev + 360);
    playSound.detectiveScan();
  };

  const handleBallClick = () => {
    if (ballBounce) return;
    setBallBounce(true);
    playSound.detectiveFound();
    setTimeout(() => setBallBounce(false), 850);
  };

  return (
    <>
      {/* Sunny Sky */}
      <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-[#7dd3fc] to-[#bae6fd] z-0">
        {/* Cloud */}
        <svg className="absolute left-[15%] top-[15%] w-14 h-6 text-white/70" viewBox="0 0 50 20">
          <path d="M 5 15 A 8 8 0 0 1 20 10 A 10 10 0 0 1 38 12 A 7 7 0 0 1 45 15 Z" fill="currentColor" />
        </svg>
      </div>
      
      {/* Ocean waves */}
      <div className="absolute inset-x-0 top-[38%] h-[22%] bg-gradient-to-b from-[#0284c7] to-[#0369a1] z-0 overflow-hidden">
        <svg className="w-full h-full opacity-40 text-sky-100" viewBox="0 0 100 20" preserveAspectRatio="none">
          <path d="M 0 10 Q 25 5 50 10 Q 75 15 100 10 L 100 20 L 0 20 Z" fill="currentColor" />
        </svg>
      </div>
      
      {/* Sandy beach floor */}
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[#fef08a] z-0 shadow-[inset_0_4px_6px_rgba(0,0,0,0.15)] border-t-2 border-amber-300">
        {/* Sandy details */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(#b45309 1px, transparent 1px)",
          backgroundSize: "8px 8px"
        }} />
      </div>

      {/* Beach Towel */}
      <svg className="absolute left-[10%] top-[54%] w-[28%] h-[30%] z-10 filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.18)]" viewBox="0 0 60 50">
        <rect x="5" y="10" width="50" height="30" rx="3" fill="#3b82f6" transform="rotate(-10 30 25)" />
        <line x1="12" y1="5" x2="22" y2="45" stroke="#fef08a" strokeWidth="4.5" opacity="0.3" />
        <line x1="38" y1="5" x2="48" y2="45" stroke="#fef08a" strokeWidth="4.5" opacity="0.3" />
      </svg>
      
      {/* Sandcastle with peeking Crab */}
      <div 
        onClick={() => {
          setIsCrabPeeking(!isCrabPeeking);
          playSound.detectiveScan();
        }}
        className="absolute left-[40%] top-[42%] w-[20%] h-[26%] z-30 cursor-pointer"
      >
        <AnimatePresence>
          {isCrabPeeking && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: -8, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute left-[30%] top-[-8%] text-xs pointer-events-none z-10"
            >
              🦀
            </motion.div>
          )}
        </AnimatePresence>
        <svg className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 50 60">
          <rect x="15" y="20" width="20" height="35" fill="#ca8a04" opacity="0.8" />
          <rect x="8" y="32" width="34" height="23" fill="#b45309" opacity="0.75" />
          <polygon points="10,20 15,10 20,20" fill="#eab308" />
          <polygon points="30,20 35,10 40,20" fill="#eab308" />
        </svg>
      </div>
      
      {/* Interactive Beach Umbrella */}
      <div 
        onClick={handleUmbrellaClick}
        className="absolute left-[64%] top-[22%] w-[26%] h-[48%] z-10 cursor-pointer"
      >
        <svg className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 60 80">
          <line x1="30" y1="10" x2="30" y2="78" stroke="#64748b" strokeWidth="3" />
          <motion.g 
            animate={{ rotate: umbrellaRot }} 
            transition={{ type: "spring", damping: 15 }}
            style={{ originX: "30px", originY: "40px" }}
          >
            <path d="M 5 40 Q 30 10 55 40 Z" fill="#ef4444" />
            <path d="M 12 40 Q 30 18 48 40" fill="#ffffff" opacity="0.8" />
          </motion.g>
        </svg>
      </div>

      {/* Interactive Beach Ball */}
      <motion.div
        onClick={handleBallClick}
        animate={ballBounce ? { y: [0, -35, 0], rotate: [0, 180, 360] } : {}}
        transition={{ duration: 0.8 }}
        className="absolute left-[70%] top-[72%] w-[12%] h-[15%] z-20 cursor-pointer"
      >
        <svg className="w-full h-full filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.15)]" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="#f43f5e" />
          <path d="M 20 2 C 10 2 10 38 20 38 C 30 38 30 2 20 2 Z" fill="#eab308" />
          <path d="M 2 20 C 2 10 38 10 38 20 C 38 30 2 30 2 20 Z" fill="#3b82f6" />
          <circle cx="20" cy="20" r="4" fill="#ffffff" />
        </svg>
      </motion.div>
    </>
  );
};

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
  
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameState, setGameState] = useState<"select" | "play" | "results">("select");
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

  const handleStartScene = (scene: SceneConfig) => {
    setSelectedScene(scene);
    setFoundIds([]);
    setActiveItemId(null);
    setWrongAttempts([]);
    setGameState("play");
    playSound.detectiveScan();
  };

  const handleSelectCategory = (item: DetectiveItem, category: WasteCategory) => {
    if (item.category === category) {
      // Correct sorting!
      setFoundIds((prev) => [...prev, item.id]);
      setActiveItemId(null);
      playSound.detectiveFound();
      // Unlock in Encyclopedia
      useGameStore.getState().unlockEncyclopediaItem(item.itemId);
    } else {
      // Wrong sorting!
      setShakingItemId(item.id);
      setTimeout(() => setShakingItemId(null), 400);
      playSound.wrong();
      
      // Save mistake record
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

  const totalPoints = foundIds.length * 150;
  const accuracy = selectedScene 
    ? Math.round((foundIds.length / (foundIds.length + wrongAttempts.length || 1)) * 100) 
    : 0;

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
            <div className="text-slate-800 text-xs font-black text-center mb-2 px-3 py-1 bg-white/50 border border-slate-950/5 rounded-full inline-block mx-auto">
              Found {foundIds.length} / {selectedScene.items.length} items
            </div>

            {/* Scene Canvas Container */}
            <div className="w-full aspect-[4/3] max-h-[42vh] relative rounded-3xl overflow-visible border border-slate-950/10 shadow-premium bg-slate-50 shrink-0">
              <div className="absolute inset-0 rounded-3xl overflow-hidden bg-slate-50">
                {/* Pattern Background matching scene */}
                <div className={`absolute inset-0 ${selectedScene.bgDecorationClass}`} />

                {/* Render vector diorama props */}
                {selectedScene.id === "kitchen" && <KitchenProps />}
                {selectedScene.id === "beach" && <BeachProps />}
                {selectedScene.id === "office" && <OfficeProps />}
                {selectedScene.id === "park" && <ParkProps />}
                {selectedScene.id === "school" && <SchoolProps />}
              </div>

              {/* Tappable hidden objects */}
              {selectedScene.items.map((item) => {
                const isFound = foundIds.includes(item.id);
                const isSelected = activeItemId === item.id;
                const isShaking = shakingItemId === item.id;
                const pickerAlignment = getPickerAlignment(item.left);

                return (
                  <AnimatePresence key={item.id}>
                    {!isFound && (
                      <div
                        style={{
                          position: "absolute",
                          top: item.top,
                          left: item.left,
                          zIndex: isSelected ? 50 : 20,
                        }}
                        className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center animate-soft-pulse"
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
                          className={`w-8.5 h-8.5 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg sm:rounded-xl transition-all duration-300 relative ${
                            isSelected
                              ? "shadow-[0_0_20px_#fbbf24] border-2 border-amber-400 bg-amber-400/20 scale-110"
                              : "border border-slate-950/5 bg-white/45 hover:bg-white/80 hover:scale-105"
                          }`}
                        >
                          <ItemSVG itemId={item.itemId} size={26} />

                          {/* Sparkle/Glow Ring indicating interactive area */}
                          {!isSelected && (
                            <span className="absolute -inset-1 rounded-lg sm:rounded-xl border border-dashed border-blue-500/20 animate-pulse pointer-events-none" />
                          )}
                        </motion.button>

                        {/* Radial Category Picker */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              style={{
                                position: "absolute",
                                top: parseFloat(item.top) < 35 ? "120%" : undefined,
                                bottom: parseFloat(item.top) >= 35 ? "120%" : undefined,
                                left: pickerAlignment === "left" ? 0 : pickerAlignment === "center" ? "50%" : undefined,
                                right: pickerAlignment === "right" ? 0 : undefined,
                                transform: pickerAlignment === "center" ? "translateX(-50%)" : undefined,
                              }}
                              className="flex gap-1.5 p-2 rounded-2xl glass-panel border border-slate-950/10 shadow-2xl bg-white/95 z-50 min-w-[210px] justify-center relative"
                            >
                              {/* Indicator pointer arrow */}
                              <div
                                className={`absolute ${
                                  pickerAlignment === "left"
                                    ? "left-4"
                                    : pickerAlignment === "right"
                                      ? "right-4"
                                      : "left-1/2 -translate-x-1/2"
                                } w-3 h-3 rotate-45 bg-white border z-[-1] ${
                                  parseFloat(item.top) < 35
                                    ? "-top-1.5 border-t border-l border-slate-950/10"
                                    : "-bottom-1.5 border-b border-r border-slate-950/10"
                                }`}
                              />

                              {(["recyclable", "organic", "hazardous", "eWaste", "general"] as WasteCategory[]).map((cat) => {
                                const meta = CATEGORY_META[cat];
                                return (
                                  <button
                                    key={cat}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectCategory(item, cat);
                                    }}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base hover:scale-110 active:scale-95 transition-all shadow-sm border border-slate-950/5 cursor-pointer"
                                    style={{ backgroundColor: `${getCategoryHexColor(cat)}25` }}
                                    title={meta.label}
                                  >
                                    {meta.emoji}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>

            {/* Target Items Checklist */}
            <div className="mt-3 bg-white/40 p-2.5 rounded-2xl border border-slate-950/5 flex flex-col items-center gap-1.5 shrink-0 max-w-sm mx-auto w-full">
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Target Items List</span>
              <div className="flex gap-4 items-center justify-center">
                {selectedScene.items.map((it) => {
                  const wasFound = foundIds.includes(it.id);
                  return (
                    <div key={it.id} className="relative flex flex-col items-center gap-0.5">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all bg-white/85 ${
                        wasFound ? "opacity-30 border-emerald-500 bg-emerald-50/20" : "border-slate-950/5"
                      }`}>
                        <ItemSVG itemId={it.itemId} size={20} className={wasFound ? "grayscale opacity-50" : ""} />
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
              Tap the hidden waste items in the scene above, then select where they belong!
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
              </div>
              <div className="flex flex-col items-center border-l border-slate-950/10">
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider">Accuracy</span>
                <span className={`text-xl font-black mt-0.5 ${accuracy >= 80 ? "text-emerald-700" : "text-amber-700"}`}>
                  {accuracy}%
                </span>
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
    </div>
  );
};
