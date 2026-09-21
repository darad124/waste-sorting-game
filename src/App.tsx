import { useState, useEffect, lazy, Suspense } from "react";
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
import { Hourglass } from "lucide-react";
import { backgroundMusic } from "./utils/audio";
import { parseShareQuery } from "./utils/share";
import { SHARE_CARDS } from "./components/shareCards";
import { ModeLoader } from "./components/ModeLoader";
import { ChunkBoundary } from "./components/ChunkBoundary";
import { logVisit } from "./api/analytics";

const AdminDashboard = lazy(() => import("./screens/AdminDashboard"));

// Outlast carries 25 hand-drawn objects, which is most of a megabyte of SVG
// source. Somebody who came here to play Arcade should not download it.
const OutlastScreen = lazy(() =>
  import("./screens/OutlastScreen").then((m) => ({ default: m.OutlastScreen })),
);

const isAdminRoute = () =>
  typeof window !== "undefined" && window.location.hash.replace(/^#/, "").startsWith("admin");

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
  const [admin, setAdmin] = useState(isAdminRoute());
  useEffect(() => {
    const onHash = () => setAdmin(isAdminRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Record a site visit once per session (skips the admin route).
  useEffect(() => {
    if (!isAdminRoute()) logVisit();
  }, []);

  // ?card= renders a link-preview POSTER and nothing else — no shell, no
  // music, no visit logged. It is what the capture script screenshots, and
  // it is deliberately not ?share=, which is the link a real person follows
  // and which has to put them in the game rather than on a picture of it.
  const cardTarget = new URLSearchParams(window.location.search).get("card");
  const ShareCard = cardTarget ? SHARE_CARDS[cardTarget] : undefined;

  const initialShareTarget = parseShareQuery(new URLSearchParams(window.location.search).get("share"));
  const [screen, setScreen] = useState<ScreenName>(() => {
    if (!initialShareTarget) return "home";
    if (initialShareTarget.kind === "level") return "game";
    return initialShareTarget.id === "arcade" ? "levels" : initialShareTarget.id;
  });
  const { gameStatus, startLevel } = useGameStore();

  // Shared links use a tiny query value so the static social page can hand
  // the visitor back to the correct game inside the SPA.
  useEffect(() => {
    const target = parseShareQuery(new URLSearchParams(window.location.search).get("share"));
    if (!target) return;

    if (target.kind === "level") {
      startLevel(target.id);
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }, [startLevel]);

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
        // The route id stays "contamination" although the mode is now Outlast,
        // so every /share/mode/contamination link already in the wild keeps
        // resolving.
        return (
          <ChunkBoundary label="Outlast" onBack={() => setScreen("home")}>
            <Suspense
              fallback={
                <ModeLoader
                  fullBleed
                  background="#FDE047"
                  label="Loading Outlast"
                  icon={<Hourglass size={20} />}
                />
              }
            >
              <OutlastScreen onBack={() => setScreen("home")} />
            </Suspense>
          </ChunkBoundary>
        );
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

  if (admin) {
    return (
      <ChunkBoundary label="The dashboard">
        <Suspense fallback={<div style={{ padding: 24 }}>Loading dashboard…</div>}>
          <AdminDashboard />
        </Suspense>
      </ChunkBoundary>
    );
  }

  // No loader here on purpose: the only thing that renders a card is the
  // capture script, which waits for the screenshot rather than for a
  // spinner, and a spinner could land in the poster.
  if (ShareCard) {
    return (
      <Suspense fallback={<div style={{ width: 1200, height: 630 }} />}>
        <ShareCard />
      </Suspense>
    );
  }

  return (
    <div className="app-shell w-screen bg-[#fde047] font-sans antialiased text-slate-800 overflow-hidden select-none relative flex flex-col">
      <div className="flex-1 min-h-0 w-full relative z-10">
        {renderActiveScreen()}
      </div>
    </div>
  );
}

export default App;
