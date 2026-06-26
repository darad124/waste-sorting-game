import { useState, useEffect } from "react";
import { useGameStore } from "./state/gameStore";
import { HomeScreen } from "./screens/HomeScreen";
import { LevelSelectScreen } from "./screens/LevelSelectScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { EncyclopediaScreen } from "./screens/EncyclopediaScreen";
import { GameScreen } from "./screens/GameScreen";
import { LevelResultScreen } from "./screens/LevelResultScreen";
import { EducationScreen } from "./screens/EducationScreen";
import { TrashDetectiveScreen } from "./screens/TrashDetectiveScreen";
import { TriviaScreen } from "./screens/TriviaScreen";
import { ContaminationHuntScreen } from "./screens/ContaminationHuntScreen";
import { backgroundMusic } from "./utils/audio";

type ScreenName =
  | "home"
  | "levels"
  | "settings"
  | "encyclopedia"
  | "game"
  | "completed"
  | "failed"
  | "detective"
  | "trivia"
  | "contamination";

function App() {
  const [screen, setScreen] = useState<ScreenName>("home");
  const { gameStatus, startLevel } = useGameStore();

  // Synchronize screen state with Zustand gameStatus changes (triggered by game completions/failures)
  useEffect(() => {
    if (gameStatus === "completed") {
      setScreen("completed");
    } else if (gameStatus === "failed") {
      setScreen("failed");
    } else if (gameStatus === "playing") {
      setScreen("game");
    }
  }, [gameStatus]);

  // Unlock background music from the first real user gesture.
  useEffect(() => {
    const unlockMusic = () => {
      backgroundMusic.start();
    };

    window.addEventListener("pointerdown", unlockMusic, { once: true, capture: true });
    window.addEventListener("keydown", unlockMusic, { once: true, capture: true });

    return () => {
      window.removeEventListener("pointerdown", unlockMusic, { capture: true });
      window.removeEventListener("keydown", unlockMusic, { capture: true });
      backgroundMusic.stop();
    };
  }, []);

  const handleStartLevel = (levelId: number) => {
    backgroundMusic.start();
    startLevel(levelId);
    setScreen("game");
  };

  const handleNextLevel = (levelId: number) => {
    if (levelId > 7) {
      setScreen("levels");
    } else {
      backgroundMusic.start();
      startLevel(levelId);
      setScreen("game");
    }
  };

  const handleReplayLevel = (levelId: number) => {
    backgroundMusic.start();
    startLevel(levelId);
    setScreen("game");
  };

  const renderActiveScreen = () => {
    switch (screen) {
      case "home":
        return (
          <HomeScreen
            onNavigate={(screenName) => setScreen(screenName as ScreenName)}
            onStartLevel={handleStartLevel}
          />
        );
      case "levels":
        return (
          <LevelSelectScreen
            onBack={() => setScreen("home")}
            onSelectLevel={handleStartLevel}
          />
        );
      case "settings":
        return <SettingsScreen onBack={() => setScreen("home")} />;
      case "encyclopedia":
        return <EncyclopediaScreen onBack={() => setScreen("home")} />;
      case "game":
        return <GameScreen onExit={() => setScreen("levels")} />;
      case "detective":
        return <TrashDetectiveScreen onBack={() => setScreen("home")} />;
      case "trivia":
        return <TriviaScreen onBack={() => setScreen("home")} />;
      case "contamination":
        return <ContaminationHuntScreen onBack={() => setScreen("home")} />;
      case "completed":
        return (
          <LevelResultScreen
            onNextLevel={handleNextLevel}
            onReplayLevel={handleReplayLevel}
            onExit={() => setScreen("levels")}
          />
        );
      case "failed":
        return (
          <EducationScreen
            onRetryLevel={handleReplayLevel}
            onExit={() => setScreen("levels")}
          />
        );
      default:
        return (
          <HomeScreen
            onNavigate={(screenName) => setScreen(screenName as ScreenName)}
            onStartLevel={handleStartLevel}
          />
        );
    }
  };

  return (
    <div className="w-screen h-screen bg-[#fde047] font-sans antialiased text-slate-800 overflow-hidden select-none relative flex flex-col">
      <div className="flex-1 h-full w-full relative z-10">
        {renderActiveScreen()}
      </div>
    </div>
  );
}

export default App;
