import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Hourglass, RotateCcw } from "lucide-react";
import { ITEMS } from "../components/outlast/items";
import type { OutlastItem } from "../components/outlast/items";
import { apply, decayAt } from "../components/outlast/decay";
import { OutlastLane } from "../components/outlast/Lane";
import {
  noteFor, runSummary,
  OUTLAST_CONDITIONS, OUTLAST_MIN_GAP, OUTLAST_ALWAYS_PAIR,
} from "../data/outlast";
import { playSound } from "../utils/audio";
import { ShareButton } from "../components/ShareButton";
import { FeedbackPrompt } from "../components/FeedbackPrompt";
import { canPrompt } from "../utils/feedbackGate";

/* ====================================================================== *
 *  Outlast — two objects, one question: which one outlasts the other?
 *
 *  You commit, and then nothing tells you anything. The race runs, the thing
 *  you picked either falls apart in front of you or doesn't, and only when
 *  the clock stops does the game say a word.
 *
 *  That delay is the mode. Announcing "Right." on the tap answers the
 *  question before the six seconds of decay that exist to answer it, and
 *  turns the animation into a victory lap nobody watches. So the tap changes
 *  nothing visible: no verdict line, no sound, no streak tick — the counter
 *  in the header would give it away on its own.
 * ====================================================================== */

const RULES = {
  /** How long a full race takes. Short enough that the fifteenth one is not a
   *  chore, long enough that the decay is watchable. Tapping skips it. */
  raceMs: 5600,
  /** Time runs on a LOG scale — a month and a million years cannot share a
   *  linear axis — and this bends it so the animation lingers where things
   *  are actually falling apart instead of giving every decade equal screen
   *  time, which plays terribly. */
  bend: 2.4,
  /** Stop the clock at about two million years. Past that the number stops
   *  meaning anything. */
  capLog: 6.3,
  /** Decades of headroom below the shorter item and above the longer one.
   *
   *  padAfter has to clear the decay window or the race stops while the longer
   *  item is still 93% of the way through dying — and it then gets labelled
   *  "still here" when it is nothing of the sort. decayAt reaches 1.0 at
   *  log(years) + 0.65, so anything under that is a lie. */
  padBefore: 1.3,
  padAfter: 0.8,
  milestones: [5, 10, 20, 35],
} as const;

type Seated = OutlastItem & { id: string };
type Phase = "ask" | "racing" | "settled";

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/** Every pair with a gap wide enough that the ordering is not in dispute.
 *  Published decomposition figures disagree with each other; the ranking of
 *  two things an order of magnitude apart does not. */
const PAIRS: [string, string][] = (() => {
  const keys = Object.keys(ITEMS);
  const forced = new Set(OUTLAST_ALWAYS_PAIR.map((p) => [...p].sort().join("|")));
  const out: [string, string][] = [];
  for (let i = 0; i < keys.length; i++)
    for (let j = i + 1; j < keys.length; j++) {
      const gap = Math.abs(Math.log10(ITEMS[keys[i]].years) - Math.log10(ITEMS[keys[j]].years));
      if (gap >= OUTLAST_MIN_GAP || forced.has([keys[i], keys[j]].sort().join("|")))
        out.push([keys[i], keys[j]]);
    }
  return out;
})();

/** A number and its unit, and the unit agrees with the number — "gone in
 *  1 months" is the sort of thing nobody notices until they do. */
function timeLabel(years: number): [string, string] {
  const unit = (n: number, singular: string) => (n === 1 ? singular : singular + "s");
  if (years < 1 / 52) {
    const n = Math.max(1, Math.round(years * 365));
    return [String(n), unit(n, "day")];
  }
  if (years < 1 / 12) {
    const n = Math.max(1, Math.round(years * 52));
    return [String(n), unit(n, "week")];
  }
  if (years < 1) {
    const n = Math.max(1, Math.round(years * 12));
    return [String(n), unit(n, "month")];
  }
  if (years < 1e3) {
    const n = Math.round(years);
    return [n.toLocaleString(), unit(n, "year")];
  }
  if (years < 1e6) return [(Math.round(years / 100) * 100).toLocaleString(), "years"];
  const m = Math.round(years / 1e6);
  return [String(m), m === 1 ? "million years" : "million years"];
}

interface OutlastScreenProps {
  onBack: () => void;
}

export const OutlastScreen: React.FC<OutlastScreenProps> = ({ onBack }) => {
  const [pair, setPair] = useState<Seated[]>([]);
  const [phase, setPhase] = useState<Phase>("ask");
  const [picked, setPicked] = useState<string | null>(null);
  const [wasRight, setWasRight] = useState(false);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [seen, setSeen] = useState(0);
  const [milestone, setMilestone] = useState<number | null>(null);
  const [verdicts, setVerdicts] = useState<Record<string, { text: string; tone: "gone" | "warn" | "here" | "" }>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const numRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef(false);

  const dealt = useRef(false);
  const deal = useCallback(() => {
    const [a, b] = PAIRS[Math.floor(Math.random() * PAIRS.length)];
    const two: Seated[] = [{ ...ITEMS[a], id: a }, { ...ITEMS[b], id: b }];
    if (Math.random() < 0.5) two.reverse();
    setPair(two);
    setPhase("ask");
    setPicked(null);
    setVerdicts({});
    skipRef.current = false;
    if (numRef.current) numRef.current.textContent = "—";
    if (unitRef.current) unitRef.current.textContent = "your call";
  }, []);

  // First deal. Guarded so React's double-invoke in development does not
  // burn a pair before anybody has looked at it.
  useEffect(() => {
    if (dealt.current) return;
    dealt.current = true;
    deal();
  }, [deal]);

  const winner = useMemo(
    () => (pair.length === 2 ? (pair[0].years >= pair[1].years ? pair[0] : pair[1]) : null),
    [pair],
  );

  const answer = (id: string) => {
    if (phase !== "ask" || !winner) return;
    // Recorded, not revealed. Everything the player could read the answer off
    // — the line under the clock, the sound, the streak counter — waits for
    // the race to finish.
    setPicked(id);
    setWasRight(id === winner.id);
    setSeen((n) => n + 1);
    setPhase("racing");
  };

  // The race. The clock and the artwork are driven imperatively because they
  // change every frame; only the phase change at the end goes through state.
  useEffect(() => {
    if (phase !== "racing" || pair.length !== 2) return;

    const lo = Math.min(...pair.map((i) => Math.log10(i.years)));
    const hi = Math.max(...pair.map((i) => Math.log10(i.years)));
    const t0 = lo - RULES.padBefore;
    const t1 = Math.min(hi + RULES.padAfter, RULES.capLog);

    const marked = new Set<string>();
    const settle = (item: Seated, text: string, tone: "gone" | "warn" | "here") => {
      if (marked.has(item.id)) return;
      marked.add(item.id);
      setVerdicts((v) => ({ ...v, [item.id]: { text, tone } }));
    };

    let raf = 0;
    let start: number | null = null;
    const step = (now: number) => {
      if (start === null) start = now;
      const p = skipRef.current ? 1 : clamp((now - start) / RULES.raceMs, 0, 1);
      const logT = t0 + (t1 - t0) * Math.pow(p, RULES.bend);
      const [n, u] = timeLabel(Math.pow(10, logT));
      if (numRef.current) numRef.current.textContent = n;
      if (unitRef.current) unitRef.current.textContent = u;

      pair.forEach((item, i) => {
        const pre = `ol${i}_`;
        const d = decayAt(logT, item.years);
        apply(pre, item, d);
        if (d < 1) return;
        if (item.id === "battery") settle(item, "case gone. contents out.", "warn");
        else if (item.material === "plastic") settle(item, "in pieces. still here.", "warn");
        else if (item.material !== "glass") {
          const [ln, lu] = timeLabel(item.years);
          settle(item, `gone in ${ln} ${lu}`, "gone");
        }
      });

      if (p >= 1) {
        pair.forEach((item) => settle(item, "still here", "here"));
        // Everything the tap held back lands here, together, once the decay
        // has already made the case.
        if (wasRight) {
          const next = streak + 1;
          setStreak(next);
          setBest((b) => Math.max(b, next));
          if ((RULES.milestones as readonly number[]).includes(next)) setMilestone(next);
          playSound.triviaCorrect();
        } else {
          playSound.triviaWrong();
        }
        setPhase("settled");
        return;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // wasRight and streak are read at the finish. Both are safe here: they
    // change in the same render as `phase`, and by the time the settle writes
    // them back the phase is no longer "racing", so the effect early-returns.
  }, [phase, pair, wasRight, streak]);

  useEffect(() => {
    if (!milestone) return;
    const t = window.setTimeout(() => setMilestone(null), 1500);
    return () => window.clearTimeout(t);
  }, [milestone]);

  const runOver = phase === "settled" && !wasRight;

  useEffect(() => {
    if (runOver && seen >= 4 && canPrompt("hunt", null)) {
      const t = window.setTimeout(() => setShowFeedback(true), 1400);
      return () => window.clearTimeout(t);
    }
  }, [runOver, seen]);

  const restart = () => {
    setStreak(0);
    setSeen(0);
    deal();
  };

  const note = pair.length === 2 && winner ? noteFor(pair[0].id, pair[1].id, winner.id) : null;
  const noteSubject = note?.subjectId ? ITEMS[note.subjectId].name : null;

  return (
    <div className="ol-root">
      <div className="ol-bar">
        <button onClick={onBack} className="ol-back" aria-label="Back">
          <ArrowLeft size={16} />
        </button>
        <div className="ol-title">
          <Hourglass size={15} />
          <span>Outlast</span>
        </div>
        <div className="ol-streak" aria-label={`Streak ${streak}`}>
          <span className="ol-streak-n">{streak}</span>
          <span className="ol-streak-l">streak</span>
        </div>
      </div>

      <div
        className="ol-stage"
        onClick={() => { if (phase === "racing") skipRef.current = true; }}
      >
        <div className="ol-clock">
          <div className="ol-num" ref={numRef}>—</div>
          <div className="ol-unit" ref={unitRef}>your call</div>
        </div>

        <div className={`ol-ask ${phase === "settled" ? (wasRight ? "ol-good" : "ol-bad") : ""}`}>
          {phase === "ask" && "Which one outlasts the other?"}
          {/* Deliberately blank while it runs. Nothing to read; watch. */}
          {phase === "racing" && "\u00a0"}
          {phase === "settled" &&
            (wasRight
              ? (streak >= 8 ? "Still going." : streak >= 3 ? "Right again." : "Right.")
              : "Other way round.")}
        </div>

        <div className="ol-race">
          {pair.map((item, i) => (
            <OutlastLane
              key={`${item.id}-${seen}`}
              prefix={`ol${i}_`}
              item={item}
              onPick={phase === "ask" ? () => answer(item.id) : undefined}
              picked={picked === item.id}
              dimmed={phase === "settled" && picked !== item.id}
              verdict={verdicts[item.id]?.text ?? ""}
              verdictTone={verdicts[item.id]?.tone ?? ""}
            />
          ))}
        </div>

        <div className="ol-foot">
          {phase === "racing" && <span className="ol-hint">tap anywhere to skip</span>}
          {phase === "ask" && seen === 0 && (
            <span className="ol-hint ol-cond">{OUTLAST_CONDITIONS}</span>
          )}
        </div>
      </div>

      {/* One panel, in the middle of the screen. The race has finished by the
          time it arrives, so there is nothing left to watch behind it — and
          the middle is where the eye already is. */}
      <AnimatePresence>
        {phase === "settled" && (
          <>
            <motion.div
              key="scrim"
              className="ol-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            <div className="ol-centre" key="centre">
              {runOver ? (
                <motion.div
                  className="ol-over"
                  initial={{ y: 18, opacity: 0, scale: 0.97 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="ol-over-top">
                    <div className="ol-over-row">
                      <div>
                        <div className="ol-over-k">This run</div>
                        <div className="ol-over-v">{streak}</div>
                      </div>
                      <div>
                        <div className="ol-over-k">Best</div>
                        <div className="ol-over-v">{best}</div>
                      </div>
                    </div>
                    <p className="ol-over-line">{runSummary(streak)}</p>
                  </div>
                  {note?.text && (
                    <p className="ol-over-note">
                      <b>
                        Did you know
                        {noteSubject && <em>{noteSubject}</em>}
                      </b>
                      {note.text}
                    </p>
                  )}
                  <div className="ol-over-actions">
                    <button className="ol-again" onClick={restart}>
                      <RotateCcw size={14} /> Go again
                    </button>
                    <ShareButton target={{ kind: "mode", id: "contamination" }} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="ol-note"
                  initial={{ y: 18, opacity: 0, scale: 0.97 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <span className="ol-note-k">
                    Did you know
                    {noteSubject && <em>{noteSubject}</em>}
                  </span>
                  <p>{note?.text}</p>
                  <button className="ol-note-go" onClick={deal}>Next pair</button>
                </motion.div>
              )}
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {milestone && (
          <motion.div
            className="ol-milestone"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.25, opacity: 0 }}
          >
            {milestone} in a row
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && (
          <FeedbackPrompt
            mode="hunt"
            levelId={null}
            contextLabel="Outlast"
            score={best}
            // rounds called right this run, out of rounds played this run
            accuracy={seen ? Math.round((streak / seen) * 100) : 0}
            onClose={() => setShowFeedback(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
