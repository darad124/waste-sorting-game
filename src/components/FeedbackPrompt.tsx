import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, X, Check, MessageSquareHeart } from "lucide-react";
import {
  submitFeedback,
  hasAgeOnRecord,
  markAgeAsked,
  AGE_RANGES,
  type AgeRange,
  type GameMode,
} from "../api/feedback";
import { markPrompted } from "../utils/feedbackGate";
import { playSound } from "../utils/audio";

interface FeedbackPromptProps {
  mode: GameMode;
  levelId: number | null;
  /** Optional context stored alongside the answer. */
  score?: number | null;
  accuracy?: number | null;
  stars?: number | null;
  /** Label used in the heading, e.g. "Level 3" or "Trivia". */
  contextLabel: string;
  onClose: () => void;
}

type Enjoyed = boolean | null;

export const FeedbackPrompt: React.FC<FeedbackPromptProps> = ({
  mode,
  levelId,
  score,
  accuracy,
  stars,
  contextLabel,
  onClose,
}) => {
  const askAge = !hasAgeOnRecord();
  const [ageIndex, setAgeIndex] = useState<number>(-1); // -1 = skipped / unset
  const [enjoyed, setEnjoyed] = useState<Enjoyed>(null);
  const [learned, setLearned] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const dismiss = () => {
    markPrompted(mode, levelId);
    onClose();
  };

  const send = async () => {
    if (enjoyed === null || status !== "idle") return;
    setStatus("sending");
    markPrompted(mode, levelId);
    playSound.correct();

    const ageRange: AgeRange | null =
      askAge && ageIndex >= 0 ? AGE_RANGES[ageIndex].value : null;

    await submitFeedback(
      {
        mode,
        levelId,
        enjoyed,
        learned: learned || null,
        score: score ?? null,
        accuracy: accuracy ?? null,
        stars: stars ?? null,
      },
      ageRange,
    );

    if (askAge) markAgeAsked();

    setStatus("done");
    // Brief thank-you, then close.
    setTimeout(onClose, 1100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4"
      onClick={dismiss}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[#fde047] rounded-3xl p-5 shadow-2xl border-2 border-slate-950/10 relative"
      >
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
        >
          <X size={16} />
        </button>

        <AnimatePresence mode="wait">
          {status === "done" ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg">
                <Check size={30} className="text-white" strokeWidth={3} />
              </div>
              <p className="text-lg font-black text-slate-900">Thanks for the feedback!</p>
            </motion.div>
          ) : (
            <motion.div key="form" className="flex flex-col gap-4">
              <div className="flex items-center gap-2 pr-8">
                <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center shrink-0">
                  <MessageSquareHeart size={20} className="text-pink-600" />
                </div>
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  Quick question about {contextLabel}
                </h3>
              </div>

              {/* Enjoyed? */}
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-700 mb-2">
                  Did you enjoy it?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setEnjoyed(true)}
                    className={`py-3 rounded-xl font-black flex items-center justify-center gap-2 cursor-pointer transition-all border-2 ${
                      enjoyed === true
                        ? "bg-emerald-600 text-white border-emerald-700 scale-[1.02]"
                        : "bg-white/70 text-slate-700 border-transparent hover:bg-white"
                    }`}
                  >
                    <ThumbsUp size={18} /> Yes
                  </button>
                  <button
                    onClick={() => setEnjoyed(false)}
                    className={`py-3 rounded-xl font-black flex items-center justify-center gap-2 cursor-pointer transition-all border-2 ${
                      enjoyed === false
                        ? "bg-rose-600 text-white border-rose-700 scale-[1.02]"
                        : "bg-white/70 text-slate-700 border-transparent hover:bg-white"
                    }`}
                  >
                    <ThumbsDown size={18} /> No
                  </button>
                </div>
              </div>

              {/* Age — only on first ever submission */}
              {askAge && (
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-700 mb-1">
                    Your age range{" "}
                    {/* <span className="text-slate-500 font-bold normal-case">(optional)</span> */}
                  </p>
                  <input
                    type="range"
                    min={-1}
                    max={AGE_RANGES.length - 1}
                    step={1}
                    value={ageIndex}
                    onChange={(e) => setAgeIndex(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="text-center mt-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/70 text-sm font-black text-slate-800">
                      {ageIndex < 0 ? "Prefer not to say" : AGE_RANGES[ageIndex].label}
                    </span>
                  </div>
                </div>
              )}

              {/* Learned / improve — optional */}
              <div>
                <label className="text-xs font-black uppercase tracking-wide text-slate-700 mb-1 block">
                  Learn anything? Ideas to improve?{" "}
                  <span className="text-slate-500 font-bold normal-case">(optional)</span>
                </label>
                <textarea
                  value={learned}
                  onChange={(e) => setLearned(e.target.value.slice(0, 500))}
                  rows={2}
                  maxLength={500}
                  placeholder="Something you learned, or how we could make it better…"
                  className="w-full rounded-xl border-2 border-slate-950/10 bg-white/80 p-2.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 resize-none"
                />
                <div className="text-right text-[10px] font-bold text-slate-500">
                  {learned.length}/500
                </div>
              </div>

              <button
                onClick={send}
                disabled={enjoyed === null || status === "sending"}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {status === "sending" ? "Sending…" : "Send feedback"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
