import React from "react";
import { Play, BookOpen, Settings, Trash2, Award } from "lucide-react";
import { useGameStore } from "../state/gameStore";
import { SoundToggle } from "../components/SoundToggle";
import { LEVELS } from "../data/levels";
import { WASTE_ITEMS } from "../data/wasteItems";
import { ItemSVG } from "../components/ItemSVG";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  onStartLevel: (levelId: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { highScores, unlockedEncyclopediaIds } = useGameStore();

  // Statistics calculations
  const levelsCompleted = Object.keys(highScores).length;
  const encyclopediaPercent = Math.round(
    (unlockedEncyclopediaIds.length / WASTE_ITEMS.length) * 100
  );
  
  // Calculate total stars earned
  const totalStars = Object.values(highScores).reduce((acc, curr) => acc + curr.stars, 0);
  const maxPossibleStars = (LEVELS.length) * 3;

  return (
    <div className="flex flex-col min-h-full justify-between py-4 px-5 text-center select-none overflow-y-auto no-scrollbar relative max-w-xl mx-auto w-full">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />

      {/* Top Floating SVGs Decoration */}
      <div className="absolute top-10 left-4 opacity-15 animate-bounce" style={{ animationDuration: "5s" }}>
        <ItemSVG itemId="plastic_bottle" size={44} />
      </div>
      <div className="absolute top-20 right-8 opacity-20 animate-bounce" style={{ animationDuration: "6s", animationDelay: "1s" }}>
        <ItemSVG itemId="banana_peel" size={42} />
      </div>
      <div className="absolute top-1/2 left-6 opacity-15 animate-bounce" style={{ animationDuration: "7s", animationDelay: "2s" }}>
        <ItemSVG itemId="charging_cable" size={38} />
      </div>
      <div className="absolute bottom-32 right-12 opacity-15 animate-bounce" style={{ animationDuration: "8s", animationDelay: "0.5s" }}>
        <ItemSVG itemId="alkaline_battery" size={38} />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between w-full z-10 mb-2 shrink-0">
        <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xl tracking-wide uppercase">
          <Trash2 size={22} className="text-emerald-800 drop-shadow-[0_2px_4px_rgba(6,78,59,0.15)]" />
          <span>EcoSort</span>
        </div>
        <SoundToggle />
      </div>

      {/* Hero Header */}
      <div className="flex flex-col items-center justify-center z-10 py-2 sm:py-3 shrink-0">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight mb-1.5">
          Sort the Waste,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-teal-800">
            Save the Planet
          </span>
        </h1>
        <p className="text-[10px] sm:text-xs text-slate-700 max-w-xs font-semibold leading-tight">
          Learn recycling rules through interactive, hands-on green gameplay.
        </p>
      </div>

      {/* Game Modes Grid */}
      <div className="flex-1 flex flex-col justify-center my-3 sm:my-4 z-10">
        <h2 className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2.5">Select Game Mode</h2>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto w-full">
          {/* Arcade Card */}
          <button
            onClick={() => onNavigate("levels")}
            className="flex flex-col items-start text-left p-3 sm:p-4 rounded-2xl border-2 border-slate-950/10 bg-white/75 hover:bg-white transition-all duration-200 cursor-pointer shadow-premium hover:-translate-y-0.5 active:translate-y-0 hover:border-emerald-500 group min-h-[105px] sm:min-h-[125px] justify-between"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play size={16} className="fill-emerald-800" />
            </div>
            <div className="mt-2">
              <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-none">Arcade Mode</div>
              <div className="text-[9px] sm:text-[10px] text-slate-600 font-semibold mt-1 leading-snug">Falling waste action with timer, combos, and stars.</div>
            </div>
          </button>

          {/* Trash Detective */}
          <button
            onClick={() => onNavigate("detective")}
            className="flex flex-col items-start text-left p-3 sm:p-4 rounded-2xl border-2 border-slate-950/10 bg-white/75 hover:bg-white transition-all duration-200 cursor-pointer shadow-premium hover:-translate-y-0.5 active:translate-y-0 hover:border-blue-500 group min-h-[105px] sm:min-h-[125px] justify-between"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen size={16} />
            </div>
            <div className="mt-2">
              <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-none">Trash Detective</div>
              <div className="text-[9px] sm:text-[10px] text-slate-600 font-semibold mt-1 leading-snug">Scan cooking or cleaning scenes to spot hidden litter.</div>
            </div>
          </button>

          {/* Yes/No Trivia */}
          <button
            onClick={() => onNavigate("trivia")}
            className="flex flex-col items-start text-left p-3 sm:p-4 rounded-2xl border-2 border-slate-950/10 bg-white/75 hover:bg-white transition-all duration-200 cursor-pointer shadow-premium hover:-translate-y-0.5 active:translate-y-0 hover:border-amber-500 group min-h-[105px] sm:min-h-[125px] justify-between"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award size={16} />
            </div>
            <div className="mt-2">
              <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-none">Yes/No Trivia</div>
              <div className="text-[9px] sm:text-[10px] text-slate-600 font-semibold mt-1 leading-snug">Quick facts statement quiz to test your sorting knowledge.</div>
            </div>
          </button>

          {/* Contamination Hunt */}
          <button
            onClick={() => onNavigate("contamination")}
            className="flex flex-col items-start text-left p-3 sm:p-4 rounded-2xl border-2 border-slate-950/10 bg-white/75 hover:bg-white transition-all duration-200 cursor-pointer shadow-premium hover:-translate-y-0.5 active:translate-y-0 hover:border-rose-500 group min-h-[105px] sm:min-h-[125px] justify-between"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-500/10 text-rose-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trash2 size={16} />
            </div>
            <div className="mt-2">
              <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-none">Imposter Hunt</div>
              <div className="text-[9px] sm:text-[10px] text-slate-600 font-semibold mt-1 leading-snug">Find the contaminant item placed in the wrong bin.</div>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Menu & Stats */}
      <div className="flex flex-col gap-3.5 z-10 shrink-0 mt-2">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-2 rounded-xl flex flex-col items-center justify-center shadow-premium border-slate-950/5 hover:bg-white/40 transition-colors">
            <Award className="text-amber-600 mb-0.5" size={16} />
            <span className="text-[9px] text-slate-600 uppercase font-black tracking-wider leading-none">Stars</span>
            <span className="text-xs font-bold text-slate-800 mt-1 leading-none">{totalStars} / {maxPossibleStars}</span>
          </div>
          <div className="glass-card p-2 rounded-xl flex flex-col items-center justify-center shadow-premium border-slate-950/5 hover:bg-white/40 transition-colors">
            <Trash2 className="text-emerald-700 mb-0.5" size={16} />
            <span className="text-[9px] text-slate-600 uppercase font-black tracking-wider leading-none">Levels</span>
            <span className="text-xs font-bold text-slate-800 mt-1 leading-none">{levelsCompleted} / {LEVELS.length}</span>
          </div>
          <div className="glass-card p-2 rounded-xl flex flex-col items-center justify-center shadow-premium border-slate-950/5 hover:bg-white/40 transition-colors">
            <BookOpen className="text-blue-700 mb-0.5" size={16} />
            <span className="text-[9px] text-slate-600 uppercase font-black tracking-wider leading-none">Fact Book</span>
            <span className="text-xs font-bold text-slate-800 mt-1 leading-none">{encyclopediaPercent}%</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full">
          <button
            onClick={() => onNavigate("encyclopedia")}
            className="glass-card py-2.5 rounded-xl text-slate-700 font-extrabold text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-2 border border-slate-950/5 cursor-pointer hover:bg-white/60 hover:text-slate-950 shadow-premium"
          >
            <BookOpen size={14} className="text-slate-700" />
            <span>Fact Book</span>
          </button>

          <button
            onClick={() => onNavigate("settings")}
            className="glass-card py-2.5 rounded-xl text-slate-700 font-extrabold text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-2 border border-slate-950/5 cursor-pointer hover:bg-white/60 hover:text-slate-950 shadow-premium"
          >
            <Settings size={14} className="text-slate-700" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
