import React, { useEffect } from "react";
import { AlertCircle, RotateCcw, Home, HelpCircle } from "lucide-react";
import { useGameStore } from "../state/gameStore";
import { CATEGORY_META } from "../components/BinBadge";
import { playSound } from "../utils/audio";
import { ItemSVG } from "../components/ItemSVG";

interface EducationScreenProps {
  onRetryLevel: (levelId: number) => void;
  onExit: () => void;
}

export const EducationScreen: React.FC<EducationScreenProps> = ({
  onRetryLevel,
  onExit,
}) => {
  const {
    currentLevel,
    correctCount,
    wrongCount,
    sortedItems,
  } = useGameStore();

  const totalProcessed = correctCount + wrongCount;
  const accuracy = totalProcessed > 0 ? Math.round((correctCount / totalProcessed) * 100) : 0;
  const passAccuracyPercent = currentLevel ? currentLevel.passAccuracy * 100 : 80;

  useEffect(() => {
    // Play fail/retry soft chime
    playSound.levelFail();
  }, []);

  if (!currentLevel) return null;

  // Filter out mistakes (distinct items to avoid repeating the exact same item multiple times)
  const mistakes = sortedItems.filter((itemRecord) => !itemRecord.isCorrect);
  
  // Deduplicate mistakes by item ID so we only explain each mis-sorted item once
  const uniqueMistakes = mistakes.filter(
    (record, index, self) =>
      self.findIndex((r) => r.item.id === record.item.id) === index
  );

  return (
    <div className="flex flex-col h-full justify-center items-center p-6 select-none relative overflow-y-auto no-scrollbar">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-950/10 p-6 flex flex-col gap-4 scale-in shadow-2xl bg-white/75 backdrop-blur-md max-h-[92vh]">
        {/* Header Info */}
        <div className="flex flex-col items-center justify-center pt-2 pb-1 shrink-0">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-600/30 flex items-center justify-center text-rose-700 mb-2 shadow-[0_0_12px_rgba(239,68,68,0.15)]">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-none">
            Let's Practice!
          </h2>
          <p className="text-xs text-slate-700 mt-2 font-semibold">
            Accuracy: <span className="text-rose-700 font-extrabold">{accuracy}%</span> (Target: {passAccuracyPercent}%)
          </p>
        </div>

        {/* Review List of Mistakes */}
        <div className="flex-1 my-2 overflow-y-auto pr-1 text-left flex flex-col gap-3.5 no-scrollbar">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
            Review your mistakes before retrying:
          </p>

          {uniqueMistakes.length > 0 ? (
            uniqueMistakes.map((record, index) => {
              const item = record.item;
              const chosenMeta = CATEGORY_META[record.chosenCategory];
              const correctMeta = CATEGORY_META[item.category];

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-slate-950/5 border border-slate-950/5 p-4 rounded-2xl flex flex-col gap-3 shadow-inner"
                >
                  {/* Item header */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white/70 border border-slate-950/5 flex items-center justify-center shadow-inner filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] shrink-0">
                      <ItemSVG itemId={item.id} size={42} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-tight">{item.name}</h4>
                      <span className="text-[10px] text-slate-600 font-black uppercase tracking-wider">Incorrectly Sorted</span>
                    </div>
                  </div>

                  {/* Compare choice vs correct */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] leading-tight">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-600/20 flex flex-col gap-0.5">
                      <span className="text-rose-800 font-black uppercase text-[9px] tracking-wider opacity-85">Your Choice</span>
                      <span className="text-rose-700 font-extrabold line-through">
                        {chosenMeta.emoji} {chosenMeta.label}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-600/20 flex flex-col gap-0.5">
                      <span className="text-emerald-800 font-black uppercase text-[9px] tracking-wider opacity-85">Correct Bin</span>
                      <span className="text-emerald-800 font-black">
                        {correctMeta.emoji} {correctMeta.label}
                      </span>
                    </div>
                  </div>

                  {/* Disposal Fact explanation */}
                  <div className="text-xs bg-white/75 p-3 rounded-xl border border-slate-950/5 flex gap-2 shadow-premium">
                    <HelpCircle size={14} className="text-blue-700 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1 w-full">
                      <span className="text-[10px] font-black text-blue-800 uppercase tracking-wide">Disposal Guide</span>
                      <p className="text-slate-800 leading-normal font-semibold">{item.disposalInstruction}</p>
                      <p className="text-slate-700 leading-normal mt-1.5 border-t border-slate-950/10 pt-1.5 text-[11px] font-semibold">
                        <span className="font-bold text-slate-950">Why? </span>
                        {item.impactNote}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-slate-950/5 border border-slate-950/5 p-6 rounded-2xl text-center text-slate-600 text-xs shadow-inner font-semibold">
              No items were sorted incorrectly. Check if time limit ran out!
            </div>
          )}
        </div>

        {/* Bottom Action buttons */}
        <div className="flex flex-col gap-3 shrink-0 mt-auto">
          <button
            onClick={() => onRetryLevel(currentLevel.id)}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl shadow-[0_6px_25px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <RotateCcw size={16} />
            <span>RETRY LEVEL</span>
          </button>

          <button
            onClick={onExit}
            className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-slate-300 shadow-premium"
          >
            <Home size={14} />
            <span>BACK TO LEVEL SELECT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
