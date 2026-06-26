import React, { useState } from "react";
import { ArrowLeft, Trash2, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";
import { useGameStore } from "../state/gameStore";
import { SoundToggle } from "../components/SoundToggle";
import { WASTE_ITEMS } from "../data/wasteItems";
import { LEVELS } from "../data/levels";

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const {
    highScores,
    unlockedEncyclopediaIds,
    resetProgress,
  } = useGameStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  // Stats calculation
  const totalScore = Object.values(highScores).reduce((acc, curr) => acc + curr.score, 0);
  const totalStars = Object.values(highScores).reduce((acc, curr) => acc + curr.stars, 0);
  const levelsCount = Object.keys(highScores).length;

  const handleReset = () => {
    resetProgress();
    setResetDone(true);
    setShowConfirm(false);
    setTimeout(() => setResetDone(false), 2000);
  };

  return (
    <div className="flex flex-col h-full p-5 text-left select-none overflow-hidden relative max-w-xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full glass-card text-slate-700 hover:text-slate-950 transition-all cursor-pointer border border-slate-950/10 shadow-premium"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-extrabold text-slate-950 m-0">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6 no-scrollbar">
        {/* Audio Card */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-950/5 shadow-premium">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-wider mb-3">Sound Options</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">Adjust Audio Settings</span>
            <SoundToggle />
          </div>
        </div>

        {/* Lifetime Statistics Card */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-950/5 shadow-premium">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-wider mb-4">Your Lifetime Stats</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-950/10 pb-2">
              <span className="text-xs text-slate-500 font-semibold">Total High Score</span>
              <span className="text-sm font-bold text-emerald-800">{totalScore} pts</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-950/10 pb-2">
              <span className="text-xs text-slate-500 font-semibold">Stars Earned</span>
              <span className="text-sm font-bold text-amber-800">{totalStars} / {LEVELS.length * 3}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-950/10 pb-2">
              <span className="text-xs text-slate-500 font-semibold">Levels Mastered</span>
              <span className="text-sm font-bold text-slate-950">{levelsCount} / {LEVELS.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Encyclopedia Unlocked</span>
              <span className="text-sm font-bold text-blue-800">
                {unlockedEncyclopediaIds.length} / {WASTE_ITEMS.length} items
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-panel p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 shadow-premium">
          <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-wider mb-2">Danger Zone</h3>
          <p className="text-xs text-slate-700 mb-4 leading-normal font-semibold">
            Resetting your progress will delete all high scores, stars, unlocked levels, and fact book entries. This cannot be undone.
          </p>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
            >
              {resetDone ? (
                <>
                  <ShieldCheck size={14} className="text-rose-600" />
                  <span>PROGRESS RESET SUCCESSFULLY!</span>
                </>
              ) : (
                <>
                  <RotateCcw size={14} />
                  <span>RESET ALL GAME PROGRESS</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex flex-col gap-2 bg-rose-500/10 border border-rose-300 p-3 rounded-xl">
              <div className="flex items-start gap-2 text-rose-600 mb-1">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span className="text-xs font-bold leading-tight">ARE YOU ABSOLUTELY SURE?</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={handleReset}
                  className="py-2 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
                >
                  <Trash2 size={12} />
                  <span>YES, DELETE IT</span>
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center justify-center cursor-pointer transition-all border border-slate-300"
                >
                  <span>CANCEL</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
