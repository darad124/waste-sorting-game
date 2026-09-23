import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, X, Flame, HelpCircle, ArrowDown } from "lucide-react";
import { useGameStore } from "../state/gameStore";
import { GamePlayBoard, BucketSVG } from "../components/GamePlayBoard";
import { ParticleEmitter } from "../components/ParticleEmitter";
import { ItemSVG } from "../components/ItemSVG";
import { hasSeenArcadeTutorial, markArcadeTutorialSeen } from "../utils/tutorial";

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

  // Show the "how to play" overlay (and pause) the first time anyone plays Arcade.
  const [showTutorial, setShowTutorial] = useState(false);
  const tutorialCheckedRef = useRef(false);
  useEffect(() => {
    if (tutorialCheckedRef.current) return;
    tutorialCheckedRef.current = true;
    if (!hasSeenArcadeTutorial()) {
      markArcadeTutorialSeen();
      pauseGame();
      setShowTutorial(true);
    }
  }, [pauseGame]);

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

      {/* How to Play Overlay */}
      {gameStatus === "paused" && showTutorial && (
        <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-panel w-full max-w-[360px] rounded-3xl border border-slate-950/10 p-6 flex flex-col gap-4 scale-in shadow-2xl">
            <div className="flex flex-col items-center text-center gap-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-600/20 flex items-center justify-center text-emerald-700 mb-1">
                <HelpCircle size={26} />
              </div>
              <h3 className="text-xl font-black text-slate-950 tracking-wide">How to Play</h3>
            </div>

            <div className="flex items-center justify-center gap-3 py-1">
              <ItemSVG itemId="plastic_bottle" size={40} />
              <ArrowDown size={18} className="text-slate-500 shrink-0" />
              <BucketSVG category="recyclable" isHovered={false} isShaking={false} />
            </div>

            <ul className="flex flex-col gap-2.5 text-left">
              <li className="flex items-start gap-2.5 text-sm text-slate-800 font-semibold">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center">1</span>
                <span>Drag each falling item down and drop it onto the <b>white circle</b> in the matching bucket.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-800 font-semibold">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center">2</span>
                <span>No time to drag? Tap the item, then tap the correct bucket instead.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-800 font-semibold">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center">3</span>
                <span>Sort it before it hits the bottom, and chain streaks for bonus points!</span>
              </li>
            </ul>

            <button
              onClick={() => setShowTutorial(false)}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all mt-1"
            >
              <span>GOT IT, LET'S GO</span>
            </button>
          </div>
        </div>
      )}

      {/* Pause Modal Overlay */}
      {gameStatus === "paused" && !showTutorial && (
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
                onClick={() => setShowTutorial(true)}
                className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-300 shadow-premium"
              >
                <HelpCircle size={16} />
                <span>HOW TO PLAY</span>
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
