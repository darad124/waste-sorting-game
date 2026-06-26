import React from "react";
import { ArrowLeft, Lock, Trophy, Play } from "lucide-react";
import { LEVELS } from "../data/levels";
import { useGameStore } from "../state/gameStore";
import { ProgressStars } from "../components/ProgressStars";
import { CATEGORY_META } from "../components/BinBadge";

interface LevelSelectScreenProps {
  onBack: () => void;
  onSelectLevel: (levelId: number) => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({ onBack, onSelectLevel }) => {
  const { unlockedLevelId, highScores } = useGameStore();

  return (
    <div className="flex flex-col h-full p-5 text-left select-none overflow-hidden relative max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full glass-card text-slate-700 hover:text-slate-950 transition-all cursor-pointer border border-slate-950/10 shadow-premium"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-extrabold text-slate-950 m-0">Level Select</h2>
      </div>

      {/* Levels Scroll List */}
      <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 no-scrollbar pb-6 align-start content-start">
        {LEVELS.map((level) => {
          const isUnlocked = level.id <= unlockedLevelId;
          const scoreRecord = highScores[level.id];
          const score = scoreRecord ? scoreRecord.score : 0;
          const stars = scoreRecord ? scoreRecord.stars : 0;

          return (
            <div
              key={level.id}
              onClick={() => isUnlocked && onSelectLevel(level.id)}
              className={`p-4 rounded-2xl transition-all duration-300 flex items-center justify-between border ${
                isUnlocked
                  ? "glass-card border-slate-950/5 shadow-premium cursor-pointer hover:border-emerald-500/50 hover:bg-white/60 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-slate-950/5 border-slate-950/10 opacity-70 cursor-not-allowed"
              }`}
            >
              {/* Left Column: Level Info */}
              <div className="flex-1 pr-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-black text-slate-600 uppercase tracking-wide">
                    Level {level.id}
                  </span>
                  {!isUnlocked ? (
                    <Lock size={12} className="text-slate-500" />
                  ) : (
                    scoreRecord && (
                      <div className="flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        <Trophy size={9} />
                        <span>{score}</span>
                      </div>
                    )
                  )}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1 tracking-tight">
                  {level.name.split(": ")[1] || level.name}
                </h3>
                <p className="text-xs text-slate-700 leading-snug mb-2.5 max-w-[240px] font-medium">
                  {level.description}
                </p>

                {/* Show active bins in this level */}
                <div className="flex flex-wrap gap-1">
                  {level.unlockedCategories.map((cat) => (
                    <span
                      key={cat}
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/60 border border-slate-950/5 text-slate-800 flex items-center gap-1"
                    >
                      <span>{CATEGORY_META[cat].emoji}</span>
                      <span>{CATEGORY_META[cat].label}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Stars or Lock */}
              <div className="flex flex-col items-center justify-center shrink-0 min-w-[70px]">
                {isUnlocked ? (
                  <>
                    <ProgressStars stars={stars} size={16} />
                    <button
                      className="mt-2.5 p-2 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <Play size={12} className="fill-white" />
                    </button>
                  </>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-950/10 border border-slate-950/15 flex items-center justify-center text-slate-500">
                    <Lock size={16} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
