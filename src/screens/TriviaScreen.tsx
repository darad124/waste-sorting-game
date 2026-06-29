import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, HelpCircle, Check, X, Award, AlertCircle } from "lucide-react";
import { playSound } from "../utils/audio";
import { ItemSVG } from "../components/ItemSVG";
import { triggerConfetti } from "../components/ParticleEmitter";

interface TriviaQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  itemId?: string;
}

const TRIVIA_BANK: TriviaQuestion[] = [
  {
    id: "t1",
    statement: "A banana peel belongs in the organic waste bin.",
    isTrue: true,
    explanation: "Banana peels are 100% biodegradable and make excellent compost.",
    itemId: "banana_peel"
  },
  {
    id: "t2",
    statement: "A greasy pizza box should go in cardboard/paper recycling.",
    isTrue: false,
    explanation: "Grease and food residue ruin recycled paper pulp. Soiled sections should be composted in organics.",
    itemId: "pizza_box_soiled"
  },
  {
    id: "t3",
    statement: "Used household batteries can be thrown in general waste.",
    isTrue: false,
    explanation: "Batteries leak toxic heavy metals that pollute soil. They belong in hazardous waste depots.",
    itemId: "alkaline_battery"
  },
  {
    id: "t4",
    statement: "Glass bottles and jars should be rinsed before recycling.",
    isTrue: true,
    explanation: "Food waste creates odors and bacteria, which can contaminate entire recycling loads.",
    itemId: "glass_jar"
  },
  {
    id: "t5",
    statement: "Old smartphones and chargers are classified as e-waste.",
    isTrue: true,
    explanation: "Electronics contain valuable metals and chemicals that must be extracted separately.",
    itemId: "old_cellphone"
  },
  {
    id: "t6",
    statement: "Styrofoam coffee cups are highly and infinitely recyclable.",
    isTrue: false,
    explanation: "Styrofoam (expanded polystyrene) is rarely recycled and takes up massive landfill space.",
    itemId: "styrofoam_cup"
  },
  {
    id: "t7",
    statement: "Plastic shopping bags belong in standard home recycling bins.",
    isTrue: false,
    explanation: "Soft bags tangle and clog sorting machinery. Recycle them at grocery store drop-offs.",
    itemId: "plastic_bottle"
  },
  {
    id: "t8",
    statement: "Aluminum foil can be recycled if it is clean of food waste.",
    isTrue: true,
    explanation: "Like aluminum cans, clean foil can be melted down and recycled infinitely.",
    itemId: "soda_can"
  },
  {
    id: "t9",
    statement: "Expired medicines can be safely flushed down the toilet.",
    isTrue: false,
    explanation: "Flushing medicines pollutes rivers and threatens aquatic life. Use pharmacy drop boxes instead.",
    itemId: "medicine_expired"
  },
  {
    id: "t10",
    statement: "Steel soup cans can be melted down and recycled infinitely without loss of quality.",
    isTrue: true,
    explanation: "Steel is a robust metal that can be recycled infinitely, saving 75% energy over mining new ore.",
    itemId: "steel_tin_can"
  },
  {
    id: "t11",
    statement: "HDPE plastic milk jugs must go to landfill because they held milk.",
    isTrue: false,
    explanation: "Rinsed plastic milk jugs are highly recyclable and remade into drainage pipes and plastic wood.",
    itemId: "milk_jug"
  },
  {
    id: "t12",
    statement: "Clean bamboo or wooden chopsticks belong in organic/compost caddies.",
    isTrue: true,
    explanation: "Untreated wooden utensils are natural materials and decompose safely in composting facilities.",
    itemId: "wooden_chopsticks"
  },
  {
    id: "t13",
    statement: "TV remote controls should have their batteries removed before disposal.",
    isTrue: true,
    explanation: "Batteries must be extracted and recycled as hazardous waste, while the remote is processed as e-waste.",
    itemId: "remote_control"
  },
  {
    id: "t14",
    statement: "Thin plastic cling wrap can be thrown in the standard recycling bin.",
    isTrue: false,
    explanation: "Thin wraps tangle in sorting machinery and cause shutdowns. Place them in general waste.",
    itemId: "plastic_wrap"
  },
  {
    id: "t15",
    statement: "Chewing gum is organic and can be composted in green bins.",
    isTrue: false,
    explanation: "Modern chewing gum is made of synthetic polymers (plastic rubber) and will not compost.",
    itemId: "chewing_gum"
  },
  {
    id: "t16",
    statement: "Cracked tablets can go in general trash if the screen is not leaking chemicals.",
    isTrue: false,
    explanation: "All electronic devices contain circuitry with heavy metals and belong in specialized e-waste recycling.",
    itemId: "broken_tablet"
  },
  {
    id: "t17",
    statement: "Chemical paint thinners are fine to pour down the sink drain.",
    isTrue: false,
    explanation: "Chemical solvents are toxic and flammable. They damage pipes and poison water systems.",
    itemId: "paint_thinner"
  },
  {
    id: "t18",
    statement: "Paper tea bags can go directly in the compost bin, even with staples.",
    isTrue: false,
    explanation: "You must remove metal staples first. Metal does not compost and contaminates compost soil.",
    itemId: "tea_bag"
  },
  {
    id: "t19",
    statement: "Disposable diapers can be thrown in the organic compost bin.",
    isTrue: false,
    explanation: "Diapers are made of plastics, absorbent gels, and biological waste, and belong in general waste.",
    itemId: "diaper"
  },
  {
    id: "t20",
    statement: "LED bulbs should be thrown in the glass recycling bin.",
    isTrue: false,
    explanation: "LED bulbs contain microchips and metal components and must be processed as e-waste.",
    itemId: "led_bulb"
  }
];

interface EcoGuideMascotProps {
  state: "idle" | "correct" | "wrong";
}

const EcoGuideMascot: React.FC<EcoGuideMascotProps> = ({ state }) => {
  return (
    <motion.div
      aria-hidden="true"
      animate={
        state === "correct"
          ? { y: [-1, -5, -1], rotate: [-2, 3, -2] }
          : state === "wrong"
          ? { x: [-2, 2, -1, 1, 0], rotate: [-3, 3, -2, 2, 0] }
          : { y: [0, -3, 0] }
      }
      transition={{ repeat: state === "idle" ? Infinity : 0, duration: state === "idle" ? 2.4 : 0.45, ease: "easeInOut" }}
      className="pointer-events-none absolute right-1 top-1 z-30 w-14 h-14 sm:w-16 sm:h-16"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_8px_12px_rgba(15,23,42,0.18)]">
        <ellipse cx="50" cy="88" rx="27" ry="6" fill="#0f172a" opacity="0.12" />
        <rect x="22" y="22" width="56" height="58" rx="20" fill="#34d399" />
        <path d="M24 42 H76 V70 C76 78 69 84 60 84 H40 C31 84 24 78 24 70 Z" fill="#10b981" />
        <path d="M30 20 H70 L66 11 H34 Z" fill="#065f46" />
        <rect x="29" y="18" width="42" height="8" rx="4" fill="#047857" />
        <path d="M35 34 H65" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.65" />

        {state === "wrong" ? (
          <>
            <path d="M35 48 Q40 44 45 48" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <path d="M55 48 Q60 44 65 48" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <path d="M43 63 Q50 58 57 63" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="39" cy="49" r="6" fill="#ffffff" />
            <circle cx="61" cy="49" r="6" fill="#ffffff" />
            <circle cx={state === "correct" ? 39 : 41} cy="50" r="3" fill="#0f172a" />
            <circle cx={state === "correct" ? 61 : 59} cy="50" r="3" fill="#0f172a" />
            <path d="M42 63 Q50 70 58 63" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
          </>
        )}

        <circle cx="32" cy="59" r="3" fill="#fda4af" opacity="0.75" />
        <circle cx="68" cy="59" r="3" fill="#fda4af" opacity="0.75" />
        <path d="M20 55 C13 57 12 67 21 69" fill="none" stroke="#047857" strokeWidth="6" strokeLinecap="round" />
        <path d="M80 55 C88 55 89 66 80 69" fill="none" stroke="#047857" strokeWidth="6" strokeLinecap="round" />

        {state === "correct" && (
          <>
            <path d="M76 20 L79 25 L84 26 L80 30 L81 35 L76 32 L71 35 L72 30 L68 26 L73 25 Z" fill="#fde047" />
            <path d="M17 32 L19 35 L22 36 L20 39 L21 42 L17 40 L14 42 L15 39 L13 36 L16 35 Z" fill="#fde047" />
          </>
        )}
      </svg>
    </motion.div>
  );
};

interface StreakFlameProps {
  streak: number;
  isExtinguishing: boolean;
}

const StreakFlame: React.FC<StreakFlameProps> = ({ streak, isExtinguishing }) => {
  const displayStreak = isExtinguishing ? 0 : streak;
  const isSuperStreak = streak >= 4;
  const progressPercent = Math.min((displayStreak / 5) * 100, 100);
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-slate-950 to-slate-900 text-white px-3 py-1 rounded-2xl border border-slate-800 shadow-xl relative overflow-visible select-none leading-none">
      {/* Flame Icon with progress ring */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg className="absolute -rotate-90 w-9 h-9">
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2.5"
          />
          <motion.circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke={isExtinguishing ? "#64748b" : isSuperStreak ? "#22d3ee" : "#f59e0b"}
            strokeWidth="2.5"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            strokeLinecap="round"
          />
        </svg>

        {/* Custom Vector Fire Flame SVG */}
        <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="none">
          {/* Flame Shapes */}
          <motion.path
            animate={isExtinguishing 
              ? { scaleY: 0.2, opacity: 0.3 }
              : {
                  scaleY: [1, 1.15, 1],
                  scaleX: [1, 0.95, 1],
                  translateY: [0, -0.8, 0]
                }
            }
            transition={{
              repeat: isExtinguishing ? 0 : Infinity,
              duration: 0.65,
              ease: "easeInOut"
            }}
            d="M12 2C10.5 4.5 9 6.5 9 9.5C9 12.5 10.3 14.5 12 14.5C13.7 14.5 15 12.5 15 9.5C15 6.5 13.5 4.5 12 2Z"
            fill={isExtinguishing ? "#475569" : isSuperStreak ? "#0891b2" : "#f97316"}
          />
          <motion.path
            animate={isExtinguishing
              ? { scaleY: 0.1, opacity: 0.1 }
              : {
                  scaleY: [1, 1.22, 1],
                  scaleX: [1, 0.91, 1],
                  translateY: [0, -0.4, 0]
                }
            }
            transition={{
              repeat: isExtinguishing ? 0 : Infinity,
              duration: 0.48,
              ease: "easeInOut",
              delay: 0.08
            }}
            d="M12 5C11 7 10 8.5 10 10.5C10 12.5 11 13.5 12 13.5C13 13.5 14 12.5 14 10.5C14 8.5 13 7 12 5Z"
            fill={isExtinguishing ? "#64748b" : isSuperStreak ? "#22d3ee" : "#fde047"}
          />
        </svg>

        {/* Smoke Puff when Extinguished */}
        <AnimatePresence>
          {isExtinguishing && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1, y: 0 }}
              animate={{ scale: 2.2, opacity: 0, y: -24 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute text-sm pointer-events-none z-20"
            >
              💨
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Streak Text Label */}
      <div className="flex flex-col gap-0.5 justify-center text-left">
        <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase leading-none">
          COMBO
        </span>
        <span className={`text-[9px] font-black tracking-wider uppercase leading-none ${isSuperStreak ? "text-cyan-400" : "text-amber-400"}`}>
          {isSuperStreak ? "SUPER STREAK" : "STREAK"}
        </span>
      </div>

      {/* Pop Multiplier Bubble */}
      <motion.div
        key={streak}
        initial={{ scale: 0.4, rotate: -15 }}
        animate={{ scale: [1, 1.35, 1], rotate: [0, 10, 0] }}
        transition={{ type: "spring", stiffness: 350, damping: 10 }}
        className={`px-2 py-0.5 rounded-lg text-slate-950 text-[10px] font-black shadow-md border leading-none flex items-center justify-center min-w-[22px] ${
          isSuperStreak 
            ? "bg-cyan-400 border-cyan-300 shadow-cyan-400/30" 
            : "bg-amber-500 border-amber-300 shadow-amber-500/30"
        }`}
      >
        {streak}x
      </motion.div>
    </div>
  );
};

interface ComboBannerProps {
  text: string;
  isSuper: boolean;
}

const ComboBanner: React.FC<ComboBannerProps> = ({ text, isSuper }) => {
  return (
    <motion.div
      initial={{ scale: 0.5, y: 35, opacity: 0, rotate: -8 }}
      animate={{ 
        scale: [0.9, 1.15, 1], 
        y: [35, -5, 0], 
        opacity: [0, 1, 1],
        rotate: [-8, 4, 0]
      }}
      exit={{ scale: 0.8, y: -30, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`absolute top-[28%] z-50 pointer-events-none px-6 py-2 border-2 rounded-2xl shadow-xl flex items-center justify-center font-black text-white text-xs sm:text-sm tracking-wider uppercase ${
        isSuper 
          ? "from-cyan-500 via-sky-500 to-cyan-600 border-cyan-300 shadow-cyan-400/40 bg-gradient-to-r" 
          : "from-amber-500 via-orange-500 to-amber-600 border-yellow-300 shadow-amber-500/40 bg-gradient-to-r"
      }`}
    >
      <motion.span
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

interface TriviaScreenProps {
  onBack: () => void;
}

export const TriviaScreen: React.FC<TriviaScreenProps> = ({ onBack }) => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [cardPulseState, setCardPulseState] = useState<"none" | "correct" | "wrong">("none");
  const [bgFlashColor, setBgFlashColor] = useState<"none" | "correct" | "wrong">("none");
  const [isLocked, setIsLocked] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; answer: boolean; isCorrect: boolean }[]>([]);
  
  // Points, Combo, and Break states
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [comboText, setComboText] = useState<string | null>(null);
  const [isExtinguishing, setIsExtinguishing] = useState(false);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setCardPulseState("none");
    setBgFlashColor("none");
    setIsLocked(false);
    setPoints(0);
    setStreak(0);
    setComboText(null);
    setIsExtinguishing(false);
    
    // Select 5 random unique questions.
    const shuffled = [...TRIVIA_BANK].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  };

  const handleAnswer = (answer: boolean) => {
    if (isLocked) return;
    
    setIsLocked(true);
    setSelectedAnswer(answer);
    
    const activeQuestion = questions[currentIndex];
    if (!activeQuestion) return;
    const isCorrect = answer === activeQuestion.isTrue;
    
    setUserAnswers((prev) => [
      ...prev,
      { questionId: activeQuestion.id, answer, isCorrect }
    ]);

    if (isCorrect) {
      setCardPulseState("correct");
      setBgFlashColor("correct");
      playSound.triviaCorrect();
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      setPoints((prev) => prev + 100 * newStreak);

      // Handle Combo Milestones
      if (newStreak >= 2) {
        if (newStreak >= 4) {
          setComboText(`🔥 SUPER COMBO x${newStreak}! 🔥`);
        } else {
          setComboText(`🔥 COMBO x${newStreak}!`);
        }
        setTimeout(() => setComboText(null), 1450);
      }

      const cardElement = document.getElementById("statement-card");
      if (cardElement) {
        const rect = cardElement.getBoundingClientRect();
        triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, "#10b981");
      } else {
        triggerConfetti(window.innerWidth / 2, window.innerHeight / 2.5, "#10b981");
      }
    } else {
      setCardPulseState("wrong");
      setBgFlashColor("wrong");
      playSound.triviaWrong();
      
      if (streak > 0) {
        setIsExtinguishing(true);
        setTimeout(() => {
          setIsExtinguishing(false);
          setStreak(0);
        }, 1200);
      } else {
        setStreak(0);
      }
    }

    // Delay next slide
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setCardPulseState("none");
        setBgFlashColor("none");
        setIsLocked(false);
      } else {
        // Round complete
        setCurrentIndex(questions.length); // Result index
      }
    }, 1800);
  };

  const correctCount = userAnswers.filter(ans => ans.isCorrect).length;
  const isFinished = currentIndex >= questions.length;
  const activeQuestion = questions[currentIndex];

  return (
    <div className="flex flex-col min-h-full w-full relative bg-transparent overflow-y-auto no-scrollbar text-center select-none justify-between max-w-xl mx-auto py-2">
      
      {/* Background flash feedback */}
      <motion.div
        animate={{
          backgroundColor:
            bgFlashColor === "correct"
              ? "rgba(16, 185, 129, 0.08)"
              : bgFlashColor === "wrong"
              ? "rgba(244, 63, 94, 0.08)"
              : "rgba(253, 224, 71, 0)",
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 pointer-events-none z-0 rounded-3xl"
      />

      {/* Header Panel */}
      <div className="p-4 relative z-40 shrink-0 glass-panel border-b border-slate-950/10 shadow-premium w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-700 hover:text-slate-950 transition-all cursor-pointer border border-slate-950/10 hover:bg-white/60 shadow-premium"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm uppercase tracking-wider">
          <HelpCircle size={16} className="text-amber-600" />
          <span>Yes/No Trivia</span>
        </div>
        <div className="w-8 h-8" />
      </div>

      <div className="flex-1 w-full overflow-visible relative flex flex-col items-center justify-center p-6 z-10">
        
        {/* Combo Milestone Popup Banner */}
        <AnimatePresence>
          {comboText && (
            <ComboBanner text={comboText} isSuper={streak >= 4} />
          )}
        </AnimatePresence>

        {/* State 1: Question Cards */}
        {!isFinished && activeQuestion && (
          <div className="w-full max-w-sm flex flex-col gap-4 items-center my-auto">
            
            {/* Score HUD & Combo Streaks */}
            <div className="flex justify-between items-center w-full px-2 text-slate-800 font-extrabold text-xs">
              <div className="flex items-center gap-1 bg-slate-950/5 px-3 py-1 rounded-full border border-slate-950/5">
                <span>SCORE:</span>
                <span className="text-amber-700 font-black text-sm">{points}</span>
              </div>
              <AnimatePresence>
                {(streak > 0 || isExtinguishing) && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: -10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.5, opacity: 0, y: -10 }}
                    className="z-20"
                  >
                    <StreakFlame streak={streak} isExtinguishing={isExtinguishing} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Round counter progress indicators */}
            <div className="flex items-center gap-2 mb-1">
              {questions.map((_, idx) => {
                const isCompleted = idx < currentIndex;
                const isActive = idx === currentIndex;
                
                let colorClass = "bg-slate-300";
                if (isActive) colorClass = "bg-amber-500 scale-110";
                else if (isCompleted) {
                  const wasCorrect = userAnswers[idx]?.isCorrect;
                  colorClass = wasCorrect ? "bg-emerald-500" : "bg-rose-500";
                }

                return (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${colorClass}`}
                  />
                );
              })}
            </div>

            {/* Statement Card Container with Slide-in Transition */}
            <div className="w-full relative overflow-visible h-[260px] flex items-center justify-center">
              <EcoGuideMascot state={cardPulseState === "none" ? "idle" : cardPulseState} />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  id="statement-card"
                  initial={{ x: 220, opacity: 0, scale: 0.95 }}
                  animate={
                    cardPulseState === "correct"
                      ? { x: 0, opacity: 1, scale: 1.02, borderColor: "#10b981", boxShadow: "0 0 25px rgba(16,185,129,0.35)" }
                      : cardPulseState === "wrong"
                      ? { x: [-6, 6, -4, 4, 0], opacity: 1, borderColor: "#f43f5e", boxShadow: "0 0 25px rgba(244,63,94,0.35)" }
                      : streak >= 4
                      ? { x: 0, opacity: 1, scale: 1, borderColor: "#22d3ee", boxShadow: "0 0 30px rgba(34,211,238,0.5)" }
                      : streak >= 2
                      ? { x: 0, opacity: 1, scale: 1, borderColor: "#f59e0b", boxShadow: "0 0 20px rgba(245,158,11,0.35)" }
                      : { x: 0, opacity: 1, scale: 1, borderColor: "rgba(15,23,42,0.1)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }
                  }
                  exit={{ x: -220, opacity: 0, scale: 0.95, transition: { duration: 0.22, ease: "easeIn" } }}
                  transition={{ type: "spring", damping: 24, stiffness: 220, opacity: { duration: 0.18 } }}
                  className="absolute inset-x-0 h-full glass-panel border bg-white/85 border-slate-950/10 py-5 px-4 rounded-3xl flex items-center justify-center flex-col overflow-hidden"
                >
                  {/* Floating flame embers behind the question text when streak is active */}
                  {streak >= 2 && Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 220, x: 20 + Math.random() * 260, opacity: 0.7, scale: 0.6 + Math.random() * 0.8 }}
                      animate={{ y: -30, opacity: 0, scale: 0.1 }}
                      transition={{ repeat: Infinity, duration: 1.4 + Math.random() * 1.2, delay: i * 0.25 }}
                      className={`absolute w-2.5 h-2.5 rounded-full pointer-events-none z-0 ${
                        streak >= 4 
                          ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]" 
                          : "bg-amber-500 shadow-[0_0_8px_#f59e0b]"
                      }`}
                    />
                  ))}

                  {/* Central Large Item Circle */}
                  {activeQuestion.itemId ? (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100/80 flex items-center justify-center border-4 border-slate-950/5 shadow-inner mb-3 relative z-10 overflow-hidden">
                      <div className="absolute inset-0 bg-radial-gradient from-white to-slate-100 opacity-80" />
                      <motion.div
                        animate={selectedAnswer !== null ? { rotate: [0, -10, 10, 0], scale: 1.05 } : { scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10"
                      >
                        <ItemSVG itemId={activeQuestion.itemId} size={48} />
                      </motion.div>
                    </div>
                  ) : (
                    <HelpCircle className="text-amber-500 mb-3 opacity-80" size={28} />
                  )}

                  {/* Question text */}
                  <p className="text-xs sm:text-sm font-black text-slate-800 leading-snug relative z-10 px-2">
                    "{activeQuestion.statement}"
                  </p>

                  {/* Tactile Stamp Overlay */}
                  <AnimatePresence>
                    {selectedAnswer !== null && (
                      <motion.div
                        initial={{ scale: 2.5, opacity: 0, rotate: -35 }}
                        animate={{ scale: 1.1, opacity: 0.95, rotate: -10 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 11, stiffness: 220 }}
                        className={`absolute z-30 pointer-events-none px-4 py-1.5 rounded-xl border-4 font-black uppercase text-xs sm:text-sm tracking-wider shadow-lg ${
                          userAnswers[currentIndex]?.isCorrect
                            ? "border-emerald-600 text-emerald-600 bg-emerald-50/95 rotate-[-10deg]"
                            : "border-rose-600 text-rose-600 bg-rose-50/95 rotate-[-10deg]"
                        }`}
                      >
                        {userAnswers[currentIndex]?.isCorrect ? "APPROVED!" : "CONTAMINATION!"}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Tactile YES and NO Button Actions */}
            <div className="grid grid-cols-2 gap-4 w-full mt-1">
              <button
                disabled={isLocked}
                onClick={() => {
                  playSound.triviaReveal();
                  handleAnswer(true);
                }}
                className={`py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-[0_5px_0_#047857] hover:translate-y-[2px] hover:shadow-[0_3px_0_#047857] active:translate-y-[5px] active:shadow-none transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  selectedAnswer === true ? "translate-y-[5px] shadow-none ring-2 ring-emerald-400" : ""
                } ${isLocked && selectedAnswer !== true ? "opacity-50" : ""}`}
              >
                <Check size={16} className="stroke-[3]" />
                <span>YES</span>
              </button>

              <button
                disabled={isLocked}
                onClick={() => {
                  playSound.triviaReveal();
                  handleAnswer(false);
                }}
                className={`py-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm rounded-2xl shadow-[0_5px_0_#be123c] hover:translate-y-[2px] hover:shadow-[0_3px_0_#be123c] active:translate-y-[5px] active:shadow-none transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  selectedAnswer === false ? "translate-y-[5px] shadow-none ring-2 ring-rose-400" : ""
                } ${isLocked && selectedAnswer !== false ? "opacity-50" : ""}`}
              >
                <X size={16} className="stroke-[3]" />
                <span>NO</span>
              </button>
            </div>

            {/* Inspector Report sliding card */}
            <div className="w-full h-18 overflow-visible relative">
              <AnimatePresence>
                {selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="absolute inset-x-0 p-3 rounded-2xl bg-slate-900 text-slate-100 text-left border border-slate-700/50 shadow-md flex gap-2.5 items-start z-10"
                  >
                    <AlertCircle className={`shrink-0 mt-0.5 ${userAnswers[currentIndex]?.isCorrect ? "text-emerald-400" : "text-rose-400"}`} size={16} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Inspector's Report</span>
                      <p className="text-[10px] leading-tight font-semibold text-slate-200">
                        {activeQuestion.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}

        {/* State 2: Results Review Screen */}
        {isFinished && questions.length > 0 && (
          <div className="w-full max-w-md glass-panel border border-slate-950/10 rounded-3xl p-6 flex flex-col gap-5 scale-in shadow-2xl bg-white/90 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 mb-2 shadow-[0_0_12px_rgba(245,158,11,0.15)] animate-bounce">
                <Award size={26} />
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-none">
                Trivia Cleared!
              </h2>
              <p className="text-xs text-slate-700 mt-2 font-semibold">
                You correctly answered <span className="font-black text-slate-900">{correctCount} of {questions.length}</span> statements.
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950/5 p-4 rounded-2xl border border-slate-950/5">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider">Score</span>
                <span className="text-xl font-black text-slate-900 mt-0.5">+{points} XP</span>
              </div>
              <div className="flex flex-col items-center border-l border-slate-950/10">
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider">Accuracy</span>
                <span className={`text-xl font-black mt-0.5 ${correctCount >= 3 ? "text-emerald-700" : "text-amber-700"}`}>
                  {Math.round((correctCount / questions.length) * 100)}%
                </span>
              </div>
            </div>

            {/* Explanations List */}
            <div className="flex flex-col gap-2.5 max-h-[190px] overflow-y-auto no-scrollbar text-left border border-slate-950/5 p-3 rounded-2xl bg-white/50">
              <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <AlertCircle size={10} className="text-slate-600" />
                <span>Trivia Explanations:</span>
              </span>
              {questions.map((q, index) => {
                const userRec = userAnswers.find(ans => ans.questionId === q.id);
                return (
                  <div key={q.id} className="text-[10px] leading-tight border-b border-slate-950/5 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                    <div className="flex items-center gap-1 font-extrabold mb-1">
                      {userRec?.isCorrect ? (
                        <Check size={11} className="text-emerald-700 stroke-[3.5]" />
                      ) : (
                        <X size={11} className="text-rose-600 stroke-[3.5]" />
                      )}
                      <span className="text-slate-900">Statement {index + 1}: {q.isTrue ? "TRUE" : "FALSE"}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{q.explanation}</p>
                  </div>
                );
              })}
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-3 mt-1.5">
              <button
                onClick={startNewRound}
                className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-premium"
              >
                PLAY AGAIN
              </button>

              <button
                onClick={onBack}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
              >
                MAIN MENU
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
