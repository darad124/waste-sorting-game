import React, { useEffect, useState } from "react";
import { Award, ArrowRight, RotateCcw, Home, Info } from "lucide-react";
import { useGameStore } from "../state/gameStore";
import { ProgressStars } from "../components/ProgressStars";
import { playSound } from "../utils/audio";
import { ItemSVG } from "../components/ItemSVG";

interface LevelResultScreenProps {
  onNextLevel: (levelId: number) => void;
  onReplayLevel: (levelId: number) => void;
  onExit: () => void;
}

export const LevelResultScreen: React.FC<LevelResultScreenProps> = ({
  onNextLevel,
  onReplayLevel,
  onExit,
}) => {
  const {
    currentLevel,
    score,
    correctCount,
    wrongCount,
    maxStreak,
    timeRemaining,
    sortedItems,
  } = useGameStore();

  const [randomFact, setRandomFact] = useState<{ id: string; name: string; fact: string } | null>(null);

  // Calculate results on mount
  const totalProcessed = correctCount + wrongCount;
  const accuracy = totalProcessed > 0 ? Math.round((correctCount / totalProcessed) * 100) : 0;
  const speedBonus = timeRemaining * 15;

  // Calculate stars
  let stars = 0;
  if (accuracy >= 95) stars = 3;
  else if (accuracy >= 85) stars = 2;
  else if (accuracy >= 80) stars = 1;

  useEffect(() => {
    // Play celebratory chime
    playSound.levelComplete();

    // Pick a random fact from correct sorted items
    const correctRecords = sortedItems.filter((item) => item.isCorrect);
    if (correctRecords.length > 0) {
      const randomRecord = correctRecords[Math.floor(Math.random() * correctRecords.length)];
      setRandomFact({
        id: randomRecord.item.id,
        name: randomRecord.item.name,
        fact: randomRecord.item.shortFact,
      });
    } else if (sortedItems.length > 0) {
      // Fallback to any sorted item if none were correct
      const randomRecord = sortedItems[Math.floor(Math.random() * sortedItems.length)];
      setRandomFact({
        id: randomRecord.item.id,
        name: randomRecord.item.name,
        fact: randomRecord.item.shortFact,
      });
    }
  }, [sortedItems]);

  if (!currentLevel) return null;

  return (
    <div className="flex flex-col h-full justify-center items-center p-6 select-none relative overflow-y-auto no-scrollbar">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-950/10 p-6 flex flex-col gap-5 scale-in shadow-2xl bg-white/75 backdrop-blur-md">
        {/* Celebration Header */}
        <div className="flex flex-col items-center justify-center pt-2 pb-1">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-600/30 flex items-center justify-center text-amber-700 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-soft-pulse">
            <Award size={36} className="text-amber-700" />
          </div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight leading-tight">
            Level Cleared!
          </h2>
          <p className="text-xs text-slate-600 mt-1 uppercase tracking-wider font-extrabold">
            {currentLevel.name}
          </p>

          {/* Stars */}
          <div className="mt-3 scale-[1.2] py-1 flex justify-center">
            <ProgressStars stars={stars} size={24} animate={true} />
          </div>
        </div>

        {/* Score Summary Grid */}
        <div className="bg-slate-950/5 border border-slate-950/5 p-4 rounded-2xl text-left flex flex-col gap-2.5 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-950/10 pb-2">
            <span className="text-xs text-slate-600 font-bold">Accuracy</span>
            <span className="text-base font-black text-emerald-800">{accuracy}%</span>
          </div>
          
          <div className="flex items-center justify-between border-b border-slate-950/10 pb-2">
            <span className="text-xs text-slate-600 font-bold">Items Sorted</span>
            <span className="text-sm font-extrabold text-slate-800">
              {correctCount} / {totalProcessed}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-950/10 pb-2">
            <span className="text-xs text-slate-600 font-bold">Max Streak</span>
            <span className="text-sm font-extrabold text-amber-800">{maxStreak} correct</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-950/10 pb-2">
            <span className="text-xs text-slate-600 font-bold">Speed Bonus</span>
            <span className="text-sm font-extrabold text-teal-800">+{speedBonus} pts</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-600 font-black uppercase tracking-wide">Final Score</span>
            <span className="text-lg font-black text-slate-950">{score} pts</span>
          </div>
        </div>

        {/* Did You Know Fact Card */}
        {randomFact && (
          <div className="glass-card p-4 rounded-xl border border-blue-600/20 bg-blue-500/10 text-left flex gap-3.5 shadow-premium">
            <div className="w-12 h-12 rounded-xl bg-white/70 border border-slate-950/5 flex items-center justify-center shadow-inner shrink-0">
              <ItemSVG itemId={randomFact.id} size={36} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-[10px] font-black text-blue-800 mb-1 uppercase tracking-wider">
                <Info size={10} />
                <span>Did You Know? ({randomFact.name})</span>
              </div>
              <p className="text-xs text-slate-800 leading-normal font-semibold">
                {randomFact.fact}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onNextLevel(currentLevel.id + 1)}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl shadow-[0_6px_25px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <span>NEXT LEVEL</span>
            <ArrowRight size={16} />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onReplayLevel(currentLevel.id)}
              className="py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-300 shadow-premium"
            >
              <RotateCcw size={14} />
              <span>Replay</span>
            </button>
            
            <button
              onClick={onExit}
              className="py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-300 shadow-premium"
            >
              <Home size={14} />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
