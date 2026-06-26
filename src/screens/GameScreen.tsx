import React, { useEffect } from "react";
import { Pause, Play, RotateCcw, X, Flame } from "lucide-react";
import { useGameStore } from "../state/gameStore";
import { GamePlayBoard } from "../components/GamePlayBoard";
import { ParticleEmitter } from "../components/ParticleEmitter";

interface GameScreenProps {
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onExit }) => {
  const {
    currentLevel,
    gameStatus,
    score,
    streak,
    correctCount,
    wrongCount,
    timeRemaining,
    tickTimer,
    pauseGame,
    resumeGame,
    startLevel,
    exitSession,
  } = useGameStore();

  // Timer tick effect
  useEffect(() => {
    if (gameStatus !== "playing") return;

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, tickTimer]);

  const handleRestart = () => {
    if (currentLevel) {
      startLevel(currentLevel.id);
    }
  };

  const handleExit = () => {
    exitSession();
    onExit();
  };

  if (!currentLevel) return null;

  const totalLimit = currentLevel.timeLimitSeconds;
  const timePercent = Math.max(0, Math.min(100, (timeRemaining / totalLimit) * 100));

  // Determine color for the timer bar based on time left
  let timerBarColor = "bg-gradient-to-r from-emerald-500 to-teal-400";
  if (timePercent < 25) {
    timerBarColor = "bg-red-500 animate-pulse";
  } else if (timePercent < 50) {
    timerBarColor = "bg-amber-500";
  }

  const totalItems = correctCount + wrongCount;

  return (
    <div className="flex flex-col h-full w-full text-center select-none overflow-hidden relative bg-transparent">
      
      {/* Top HUD Controls Overlay */}
      <div className="p-4 pt-6 z-40 shrink-0 glass-panel border-b border-slate-950/10 shadow-premium w-full">
        <div className="max-w-4xl mx-auto flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            {/* Pause Button */}
            <button
              onClick={pauseGame}
              className="p-2.5 rounded-xl glass-card text-slate-700 hover:text-slate-950 transition-all cursor-pointer border border-slate-950/10 hover:bg-white/60 shadow-premium"
            >
              <Pause size={16} />
            </button>

            {/* Score Panel */}
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Score</span>
              <span className="text-xl font-extrabold text-slate-950 tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                {score}
              </span>
            </div>

            {/* Streak Panel */}
            <div className="flex items-center gap-1 min-w-[60px] justify-end">
              {streak > 1 ? (
                <div className="flex items-center gap-0.5 text-amber-900 bg-amber-500/25 border border-amber-600/30 px-2 py-0.5 rounded-lg text-xs font-black animate-soft-pulse">
                  <Flame size={12} className="fill-amber-600 text-amber-600" />
                  <span>{streak}x</span>
                </div>
              ) : (
                <div className="text-xs font-black text-slate-600">
                  {totalItems}/{currentLevel.itemCount}
                </div>
              )}
            </div>
          </div>

          {/* Timer Bar */}
          <div className="w-full h-2 bg-slate-950/10 rounded-full overflow-hidden border border-slate-950/5 mt-1">
            <div
              className={`h-full transition-all duration-1000 rounded-full ${timerBarColor}`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Game Play Area with Confetti Canvas */}
      <div className="flex-1 w-full relative flex flex-col overflow-hidden">
        <GamePlayBoard />
        <ParticleEmitter />
      </div>

      {/* Pause Modal Overlay */}
      {gameStatus === "paused" && (
        <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-panel w-full max-w-[340px] rounded-3xl border border-slate-950/10 p-6 flex flex-col gap-5 scale-in shadow-2xl">
            <h3 className="text-xl font-black text-slate-950 uppercase tracking-wider mb-1">Game Paused</h3>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={resumeGame}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play size={16} className="fill-white" />
                <span>RESUME GAME</span>
              </button>

              <button
                onClick={handleRestart}
                className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-300 shadow-premium"
              >
                <RotateCcw size={16} />
                <span>RESTART LEVEL</span>
              </button>

              <button
                onClick={handleExit}
                className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-800 border border-rose-600/20 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-premium"
              >
                <X size={16} />
                <span>QUIT TO LEVEL SELECT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
