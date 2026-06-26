import React from "react";
import { Volume2, VolumeX, Music, Music2 } from "lucide-react";
import { useGameStore } from "../state/gameStore";
import { backgroundMusic } from "../utils/audio";

export const SoundToggle: React.FC = () => {
  const { musicEnabled, sfxEnabled, setMusicEnabled, setSfxEnabled } = useGameStore();

  const handleMusicToggle = () => {
    const shouldEnable = !musicEnabled;
    setMusicEnabled(shouldEnable);

    if (shouldEnable) {
      backgroundMusic.start();
    } else {
      backgroundMusic.stop();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Music Toggle */}
      <button
        onClick={handleMusicToggle}
        className={`p-2.5 rounded-full transition-all duration-200 glass-card flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 ${
          musicEnabled
            ? "text-purple-900 border-purple-600/40 bg-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.22)]"
            : "text-slate-500 border-slate-900/10"
        }`}
        title="Toggle Music"
      >
        {musicEnabled ? <Music size={18} /> : <Music2 size={18} className="opacity-50" />}
      </button>

      {/* SFX Toggle */}
      <button
        onClick={() => setSfxEnabled(!sfxEnabled)}
        className={`p-2.5 rounded-full transition-all duration-200 glass-card flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 ${
          sfxEnabled
            ? "text-emerald-950 border-emerald-600/40 bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.22)]"
            : "text-slate-500 border-slate-900/10"
        }`}
        title="Toggle Sound Effects"
      >
        {sfxEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="opacity-50" />}
      </button>
    </div>
  );
};
