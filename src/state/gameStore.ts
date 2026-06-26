import { create } from "zustand";
import type { WasteItem, WasteCategory } from "../data/wasteItems";
import type { LevelConfig } from "../data/levels";
import { LEVELS } from "../data/levels";

interface LevelResult {
  score: number;
  stars: number;
  accuracy: number;
  completedAt: string;
}

interface SortedItemRecord {
  item: WasteItem;
  chosenCategory: WasteCategory;
  isCorrect: boolean;
}

interface GameState {
  // Persistent progress
  unlockedLevelId: number;
  highScores: Record<number, LevelResult>;
  unlockedEncyclopediaIds: string[];
  
  // Persistent settings
  musicEnabled: boolean;
  sfxEnabled: boolean;
  
  // Game session state
  currentLevel: LevelConfig | null;
  gameStatus: "idle" | "playing" | "paused" | "completed" | "failed" | "review";
  score: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  wrongCount: number;
  timeRemaining: number;
  sortedItems: SortedItemRecord[];

  // Persistent Actions
  unlockLevel: (levelId: number) => void;
  saveLevelResult: (levelId: number, score: number, stars: number, accuracy: number) => void;
  unlockEncyclopediaItem: (itemId: string) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setSfxEnabled: (enabled: boolean) => void;
  resetProgress: () => void;

  // Session Actions
  startLevel: (levelId: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  recordSort: (item: WasteItem, chosenCategory: WasteCategory) => void;
  tickTimer: () => void;
  finishSession: () => void;
  exitSession: () => void;
}

// Load initial values from localStorage if available
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Ignore errors in sandbox/private browsing
  }
};

export const useGameStore = create<GameState>((set, get) => ({
  // Persistent progress loaded from storage
  unlockedLevelId: getLocalStorage<number>("ws_unlockedLevelId", 1),
  highScores: getLocalStorage<Record<number, LevelResult>>("ws_highScores", {}),
  unlockedEncyclopediaIds: getLocalStorage<string[]>("ws_unlockedEncyclopediaIds", []),
  
  // Settings loaded from storage
  musicEnabled: getLocalStorage<boolean>("ws_musicEnabled", true),
  sfxEnabled: getLocalStorage<boolean>("ws_sfxEnabled", true),

  // Session State
  currentLevel: null,
  gameStatus: "idle",
  score: 0,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  wrongCount: 0,
  timeRemaining: 0,
  sortedItems: [],

  // Progress actions
  unlockLevel: (levelId) => {
    set((state) => {
      const newUnlocked = Math.max(state.unlockedLevelId, levelId);
      setLocalStorage("ws_unlockedLevelId", newUnlocked);
      return { unlockedLevelId: newUnlocked };
    });
  },

  saveLevelResult: (levelId, score, stars, accuracy) => {
    set((state) => {
      const currentRecord = state.highScores[levelId];
      // Save if score is higher, or if it's the first time
      if (!currentRecord || score > currentRecord.score || stars > currentRecord.stars) {
        const updatedScores = {
          ...state.highScores,
          [levelId]: {
            score: Math.max(score, currentRecord?.score || 0),
            stars: Math.max(stars, currentRecord?.stars || 0),
            accuracy: Math.max(accuracy, currentRecord?.accuracy || 0),
            completedAt: new Date().toISOString(),
          },
        };
        setLocalStorage("ws_highScores", updatedScores);
        return { highScores: updatedScores };
      }
      return {};
    });
  },

  unlockEncyclopediaItem: (itemId) => {
    set((state) => {
      if (!state.unlockedEncyclopediaIds.includes(itemId)) {
        const newIds = [...state.unlockedEncyclopediaIds, itemId];
        setLocalStorage("ws_unlockedEncyclopediaIds", newIds);
        return { unlockedEncyclopediaIds: newIds };
      }
      return {};
    });
  },

  setMusicEnabled: (enabled) => {
    setLocalStorage("ws_musicEnabled", enabled);
    set({ musicEnabled: enabled });
  },

  setSfxEnabled: (enabled) => {
    setLocalStorage("ws_sfxEnabled", enabled);
    set({ sfxEnabled: enabled });
  },

  resetProgress: () => {
    localStorage.removeItem("ws_unlockedLevelId");
    localStorage.removeItem("ws_highScores");
    localStorage.removeItem("ws_unlockedEncyclopediaIds");
    set({
      unlockedLevelId: 1,
      highScores: {},
      unlockedEncyclopediaIds: [],
    });
  },

  // Session actions
  startLevel: (levelId) => {
    const level = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
    set({
      currentLevel: level,
      gameStatus: "playing",
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      wrongCount: 0,
      timeRemaining: level.timeLimitSeconds,
      sortedItems: [],
    });
  },

  pauseGame: () => {
    set((state) => {
      if (state.gameStatus === "playing") {
        return { gameStatus: "paused" };
      }
      return {};
    });
  },

  resumeGame: () => {
    set((state) => {
      if (state.gameStatus === "paused") {
        return { gameStatus: "playing" };
      }
      return {};
    });
  },

  recordSort: (item, chosenCategory) => {
    const isCorrect = item.category === chosenCategory;
    
    set((state) => {
      // 1. Calculate new counts
      const nextCorrectCount = state.correctCount + (isCorrect ? 1 : 0);
      const nextWrongCount = state.wrongCount + (isCorrect ? 0 : 1);
      
      // 2. Streaks and scoring
      let nextStreak = isCorrect ? state.streak + 1 : 0;
      let nextMaxStreak = Math.max(state.maxStreak, nextStreak);
      
      // Scoring formula:
      // Correct: +100 base score
      // Streak bonus: +10 per streak level
      // Wrong: 0 points (or no points, as per requirement, wrong does not subtract points, but breaks streak)
      let scoreIncrement = 0;
      if (isCorrect) {
        scoreIncrement = 100 + (nextStreak > 1 ? (nextStreak - 1) * 20 : 0);
      }
      const nextScore = state.score + scoreIncrement;

      // 3. Record item for result listing
      const newRecord: SortedItemRecord = {
        item,
        chosenCategory,
        isCorrect,
      };
      
      // 4. If correct, unlock it in the Encyclopedia
      if (isCorrect) {
        // We'll unlock it immediately
        setTimeout(() => {
          get().unlockEncyclopediaItem(item.id);
        }, 0);
      }

      return {
        correctCount: nextCorrectCount,
        wrongCount: nextWrongCount,
        streak: nextStreak,
        maxStreak: nextMaxStreak,
        score: nextScore,
        sortedItems: [...state.sortedItems, newRecord],
      };
    });
  },

  tickTimer: () => {
    set((state) => {
      if (state.gameStatus !== "playing") return {};
      
      const nextTime = state.timeRemaining - 1;
      if (nextTime <= 0) {
        // Time ran out!
        // We defer calling finishSession to avoid setState during rendering
        setTimeout(() => {
          get().finishSession();
        }, 0);
        return { timeRemaining: 0 };
      }
      
      return { timeRemaining: nextTime };
    });
  },

  finishSession: () => {
    const state = get();
    if (state.gameStatus !== "playing" && state.gameStatus !== "paused") return;

    const totalSorted = state.correctCount + state.wrongCount;
    const accuracy = totalSorted > 0 ? state.correctCount / totalSorted : 0;
    const currentLevel = state.currentLevel!;
    const levelId = currentLevel.id;

    // Check pass/fail based on accuracy limit
    const passed = accuracy >= currentLevel.passAccuracy;
    
    // Calculate star rating
    // 3 stars: 95-100% accuracy.
    // 2 stars: 85-94% accuracy.
    // 1 star: 80-84% accuracy.
    let stars = 0;
    if (passed) {
      if (accuracy >= 0.95) {
        stars = 3;
      } else if (accuracy >= 0.85) {
        stars = 2;
      } else {
        stars = 1;
      }
    }

    // Speed bonus: add 10 points per remaining second if passed
    const speedBonus = passed ? state.timeRemaining * 15 : 0;
    const finalScore = state.score + speedBonus;

    if (passed) {
      // Save result and unlock next level
      state.saveLevelResult(levelId, finalScore, stars, accuracy);
      state.unlockLevel(levelId + 1);
      
      set({
        gameStatus: "completed",
        score: finalScore,
      });
    } else {
      set({
        gameStatus: "failed",
      });
    }
  },

  exitSession: () => {
    set({
      currentLevel: null,
      gameStatus: "idle",
      score: 0,
      streak: 0,
      correctCount: 0,
      wrongCount: 0,
      timeRemaining: 0,
      sortedItems: [],
    });
  },
}));
