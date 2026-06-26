import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../state/gameStore";
import { WASTE_ITEMS } from "../data/wasteItems";
import type { WasteCategory } from "../data/wasteItems";
import { CATEGORY_META } from "../components/BinBadge";
import { playSound } from "../utils/audio";
import { triggerConfetti } from "./ParticleEmitter";
import { ItemSVG } from "./ItemSVG";

interface FallingItem {
  id: string;
  itemData: typeof WASTE_ITEMS[0];
  xPercent: number;
  y: number;
  speed: number;
  isDragged: boolean;
  rotation: number;
  rotationSpeed: number;
  isSnapping?: boolean;
  snapTargetX?: number;
  snapTargetY?: number;
}

interface ScorePopup {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

// Actual Bucket SVG component (Now larger and with support for shake and hover animations)
const BucketSVG: React.FC<{ category: WasteCategory; isHovered: boolean; isShaking: boolean }> = ({
  category,
  isHovered,
  isShaking,
}) => {
  const meta = CATEGORY_META[category];
  
  let color = "#10b981";
  let rimColor = "#059669";
  let handleColor = "#6ee7b7";
  
  if (category === "organic") {
    color = "#b45309";
    rimColor = "#92400e";
    handleColor = "#f59e0b";
  } else if (category === "hazardous") {
    color = "#f43f5e";
    rimColor = "#e11d48";
    handleColor = "#fda4af";
  } else if (category === "eWaste") {
    color = "#3b82f6";
    rimColor = "#2563eb";
    handleColor = "#93c5fd";
  } else if (category === "general") {
    color = "#6b7280";
    rimColor = "#4b5563";
    handleColor = "#cbd5e1";
  }

  return (
    <motion.svg
      viewBox="0 0 100 120"
      animate={
        isShaking
          ? { x: [-12, 12, -9, 9, -5, 5, 0] }
          : isHovered
          ? { scale: 1.15, y: -8 }
          : { scale: 1, y: 0 }
      }
      transition={isShaking ? { duration: 0.4 } : { type: "spring", stiffness: 300, damping: 15 }}
      className={`w-20 h-24 sm:w-44 sm:h-52 transition-shadow duration-300 ${
        isHovered
          ? "filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.22)]"
          : "filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.12)]"
      }`}
    >
      {/* Bucket Handle */}
      <path
        d="M 22 45 Q 50 8 78 45"
        fill="none"
        stroke={handleColor}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Bucket Body */}
      <path
        d="M 18 45 L 28 112 Q 50 118 72 112 L 82 45 Z"
        fill={color}
      />
      {/* Bucket Rim Outer */}
      <ellipse
        cx="50"
        cy="45"
        rx="32"
        ry="8"
        fill={rimColor}
      />
      {/* Bucket Rim Inner */}
      <ellipse
        cx="50"
        cy="45"
        rx="27"
        ry="5"
        fill="rgba(0,0,0,0.25)"
      />
      {/* Badge Emblem */}
      <circle
        cx="50"
        cy="78"
        r="16"
        fill="rgba(255, 255, 255, 0.95)"
        className="filter drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.15)]"
      />
      <text
        x="50"
        y="85"
        textAnchor="middle"
        fontSize="19"
        className="select-none pointer-events-none"
      >
        {meta.emoji}
      </text>
    </motion.svg>
  );
};

export const GamePlayBoard: React.FC = () => {
  const {
    currentLevel,
    gameStatus,
    streak,
    recordSort,
    finishSession,
  } = useGameStore();

  const [items, setItems] = useState<FallingItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<WasteCategory | null>(null);
  
  // Interactive triggers
  const [shakingBucketCategory, setShakingBucketCategory] = useState<WasteCategory | null>(null);
  const [popups, setPopups] = useState<ScorePopup[]>([]);

  const spawnedCountRef = useRef(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<FallingItem[]>([]);

  if (!currentLevel) return null;

  // Spawning system
  useEffect(() => {
    if (gameStatus !== "playing") return;

    spawnedCountRef.current = 0;
    itemsRef.current = [];
    setItems([]);
    setPopups([]);

    const possibleItems = WASTE_ITEMS.filter(
      (item) =>
        currentLevel.unlockedCategories.includes(item.category) &&
        item.difficulty <= currentLevel.id
    );

    if (possibleItems.length === 0) return;

    const spawn = () => {
      if (spawnedCountRef.current >= currentLevel.itemCount) return;

      const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
      
      const newItem: FallingItem = {
        id: Math.random().toString(36).substring(2),
        itemData: randomItem,
        xPercent: 15 + Math.random() * 70, // Keep clean margins
        y: 8,
        speed: currentLevel.gravity * 1.7 + Math.random() * 48,
        isDragged: false,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 70, // degrees per second
        isSnapping: false,
      };

      itemsRef.current = [...itemsRef.current, newItem];
      setItems([...itemsRef.current]);
      spawnedCountRef.current++;
    };

    spawn();

    const spawnInterval = setInterval(spawn, currentLevel.spawnDelay);
    return () => clearInterval(spawnInterval);
  }, [gameStatus, currentLevel]);

  // Physics animation loop
  useEffect(() => {
    if (gameStatus !== "playing") return;

    let lastTime = performance.now();

    const updatePhysics = () => {
      const time = performance.now();
      const deltaSeconds = Math.min((time - lastTime) / 1000, 1);
      lastTime = time;

      const prevItems = itemsRef.current;

      if (
        spawnedCountRef.current >= currentLevel.itemCount &&
        prevItems.length === 0
      ) {
        finishSession();
        return;
      }

      if (prevItems.length === 0) {
        return;
      }

      let updated = prevItems.map((item) => {
        if (item.isDragged || item.isSnapping) return item;
        return {
          ...item,
          y: item.y + item.speed * deltaSeconds,
          rotation: (item.rotation + item.rotationSpeed * deltaSeconds) % 360,
        };
      });

      // Check for missed items
      const boardRect = boardRef.current?.getBoundingClientRect();
      const binElements = document.querySelectorAll("[data-bin-category]");
      const binBottoms = Array.from(binElements).map((el) => el.getBoundingClientRect().bottom);
      const lowestBinBottom = binBottoms.length > 0 ? Math.max(...binBottoms) : undefined;
      const missLine =
        boardRect && lowestBinBottom
          ? lowestBinBottom - boardRect.top
          : boardRef.current?.clientHeight || window.innerHeight;

      const missed = updated.filter((item) => !item.isDragged && !item.isSnapping && item.y > missLine);
      if (missed.length > 0) {
        missed.forEach((m) => {
          recordSort(m.itemData, "general");
          playSound.missed();
          
          // Trigger bucket shake on the correct bin to hint the player where it belonged
          setShakingBucketCategory(m.itemData.category);
          setTimeout(() => setShakingBucketCategory(null), 400);

          // Spawn floating missed popup
          const screenX = (m.xPercent / 100) * (boardRef.current?.clientWidth || window.innerWidth);
          const popupId = Math.random().toString();
          setPopups((prev) => [
            ...prev,
            {
              id: popupId,
              x: screenX,
              y: missLine - 50,
              text: "⚠️ Missed!",
              color: "#f43f5e",
            },
          ]);
          setTimeout(() => {
            setPopups((prev) => prev.filter((p) => p.id !== popupId));
          }, 800);
        });
        updated = updated.filter((item) => !(!item.isDragged && item.y > missLine));
      }

      itemsRef.current = updated;
      setItems([...itemsRef.current]);
    };

    const physicsInterval = window.setInterval(updatePhysics, 16);
    return () => window.clearInterval(physicsInterval);
  }, [gameStatus, currentLevel, finishSession, recordSort]);

  // Drag handlers
  const handleDragStart = (id: string) => {
    itemsRef.current = itemsRef.current.map((item) =>
      item.id === id ? { ...item, isDragged: true } : item
    );
    setItems([...itemsRef.current]);
    playSound.dragStart();
  };

  const handleDrag = (_id: string, info: any) => {
    const clientX = info.point.x;
    const clientY = info.point.y;

    const binElements = document.querySelectorAll("[data-bin-category]");
    let currentHover: WasteCategory | null = null;

    for (const el of binElements) {
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        currentHover = el.getAttribute("data-bin-category") as WasteCategory;
        break;
      }
    }

    setHoveredCategory(currentHover);
  };

  const triggerSort = (
    targetItem: FallingItem,
    droppedCategory: WasteCategory,
    dragPoint?: { x: number; y: number }
  ) => {
    const isCorrect = targetItem.itemData.category === droppedCategory;
    const boardRect = boardRef.current?.getBoundingClientRect();
    const binEl = document.querySelector(`[data-bin-category="${droppedCategory}"]`);
    const targetRect = binEl?.getBoundingClientRect();

    if (boardRect && targetRect) {
      const itemOriginalX = (targetItem.xPercent / 100) * boardRect.width - 56;
      const itemOriginalY = targetItem.y;
      
      // Target: mouth of the bucket (center X, top 1/3 of bucket height)
      const targetCenterX = targetRect.left + targetRect.width / 2 - boardRect.left;
      const targetCenterY = targetRect.top + targetRect.height / 3 - boardRect.top;

      const snapX = targetCenterX - itemOriginalX;
      const snapY = targetCenterY - itemOriginalY;

      // Clear selection
      setSelectedItemId(null);

      // Set item to snapping
      itemsRef.current = itemsRef.current.map((it) =>
        it.id === targetItem.id
          ? {
              ...it,
              isDragged: false,
              isSnapping: true,
              snapTargetX: snapX,
              snapTargetY: snapY,
            }
          : it
      );
      setItems([...itemsRef.current]);

      // Perform the state score update and recording
      const currentStreak = useGameStore.getState().streak;
      const pointsAdded = isCorrect ? (100 + (currentStreak >= 1 ? currentStreak * 20 : 0)) : 0;
      recordSort(targetItem.itemData, droppedCategory);

      // Popup coordinates
      const binCenterX = targetRect.left + targetRect.width / 2;
      const binCenterY = targetRect.top + targetRect.height / 2;
      const popupX = dragPoint ? dragPoint.x : binCenterX;
      const popupY = dragPoint ? dragPoint.y : targetRect.top;

      if (isCorrect) {
        playSound.correct();
        triggerConfetti(binCenterX, binCenterY, "#10b981");

        // Spawn Floating score popup
        const popupId = Math.random().toString();
        setPopups((prev) => [
          ...prev,
          {
            id: popupId,
            x: popupX,
            y: popupY - 30,
            text: `+${pointsAdded}`,
            color: "#059669",
          },
        ]);
        setTimeout(() => {
          setPopups((prev) => prev.filter((p) => p.id !== popupId));
        }, 800);
      } else {
        playSound.wrong();
        // Shake the incorrect bucket
        setShakingBucketCategory(droppedCategory);
        setTimeout(() => setShakingBucketCategory(null), 400);

        // Spawn wrong mark popup
        const popupId = Math.random().toString();
        setPopups((prev) => [
          ...prev,
          {
            id: popupId,
            x: popupX,
            y: popupY - 30,
            text: "❌ Wrong",
            color: "#e11d48",
          },
        ]);
        setTimeout(() => {
          setPopups((prev) => prev.filter((p) => p.id !== popupId));
        }, 800);
      }

      // Wait for snapping animation to finish before removing item from state
      setTimeout(() => {
        itemsRef.current = itemsRef.current.filter((it) => it.id !== targetItem.id);
        setItems([...itemsRef.current]);
      }, 350);
    }
  };

  const handleDragEnd = (id: string, info: any) => {
    setHoveredCategory(null);
    const clientX = info.point.x;
    const clientY = info.point.y;

    const binElements = document.querySelectorAll("[data-bin-category]");
    let droppedCategory: WasteCategory | null = null;

    for (const el of binElements) {
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        droppedCategory = el.getAttribute("data-bin-category") as WasteCategory;
        break;
      }
    }

    const targetItem = itemsRef.current.find((it) => it.id === id);

    if (droppedCategory && targetItem) {
      triggerSort(targetItem, droppedCategory, { x: clientX, y: clientY });
    } else {
      itemsRef.current = itemsRef.current.map((item) =>
        item.id === id ? { ...item, isDragged: false } : item
      );
      setItems([...itemsRef.current]);
      playSound.drop();
    }
  };

  return (
    <div
      ref={boardRef}
      onClick={() => setSelectedItemId(null)}
      className="flex-1 w-full h-full relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(253,224,71,0.15)_0%,rgba(0,0,0,0)_100%)] flex flex-col justify-between"
    >
      {/* Popups Overlay */}
      <AnimatePresence>
        {popups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ scale: 0.6, y: popup.y, opacity: 0 }}
            animate={{ scale: 1.1, y: popup.y - 60, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: popup.x - 40,
              color: popup.color,
              pointerEvents: "none",
              zIndex: 60,
            }}
            className="text-lg font-black tracking-wide filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] text-center w-20"
          >
            {popup.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Top Spawning Area */}
      <div className="flex-1 w-full relative z-40">
        <AnimatePresence>
          {items.map((item) => {
            const leftOffset = `calc(${item.xPercent}% - 56px)`;
            const isHighStreak = streak >= 3;

            return (
              <motion.div
                key={item.id}
                drag={!item.isSnapping}
                dragMomentum={false}
                dragElastic={0.2}
                onDragStart={() => handleDragStart(item.id)}
                onDrag={(_, info) => handleDrag(item.id, info)}
                onDragEnd={(_, info) => handleDragEnd(item.id, info)}
                whileDrag={{ scale: 1.25, zIndex: 50 }}
                onTap={(e) => {
                  e.stopPropagation();
                  if (item.isSnapping) return;
                  setSelectedItemId((prev) => (prev === item.id ? null : item.id));
                  playSound.dragStart();
                }}
                animate={
                  item.isSnapping
                    ? {
                        x: item.snapTargetX,
                        y: item.snapTargetY,
                        scale: 0.1,
                        opacity: 0,
                      }
                    : {
                        x: 0,
                        y: 0,
                        scale: selectedItemId === item.id ? 1.15 : 1,
                      }
                }
                transition={
                  item.isSnapping
                    ? { duration: 0.35, ease: [0.25, 1, 0.5, 1] }
                    : { type: "spring", stiffness: 350, damping: 20 }
                }
                style={{
                  position: "absolute",
                  left: leftOffset,
                  top: item.isDragged ? undefined : item.y,
                  touchAction: "none",
                }}
                className={`z-40 w-28 h-28 flex flex-col items-center justify-center select-none rounded-2xl transition-none ${
                  item.isDragged
                    ? "cursor-grabbing"
                    : "cursor-grab"
                } ${
                  selectedItemId === item.id
                    ? "shadow-[0_0_25px_#fbbf24,inset_0_0_10px_rgba(251,191,36,0.3)] border border-amber-400 bg-amber-400/10"
                    : "border border-transparent"
                }`}
              >
                {/* Free-floating custom SVG item (isolated rotation) */}
                <motion.div
                  animate={
                    item.isSnapping
                      ? { rotate: item.rotation + 270 }
                      : item.isDragged
                      ? { rotate: item.rotation + 6 }
                      : { rotate: item.rotation }
                  }
                  transition={
                    item.isSnapping
                      ? { duration: 0.35, ease: "easeOut" }
                      : { duration: 0 }
                  }
                  className="mb-2 select-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.22)]"
                >
                  <ItemSVG itemId={item.itemData.id} size={56} />
                </motion.div>
                {/* Rounded Label Pill */}
                <span className={`text-[10px] font-black text-center px-2 py-0.5 rounded-full border shadow-sm leading-tight tracking-wide flex items-center gap-0.5 ${
                  isHighStreak
                    ? "text-white bg-amber-500 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse"
                    : "text-slate-800 bg-white/80 border-white/60"
                }`}>
                  {isHighStreak && <span>🔥</span>}
                  <span>{item.itemData.name}</span>
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Responsive Bins Rack (Transparent Shelf Container) */}
      <div className="h-32 sm:h-64 bg-transparent shrink-0 flex w-full relative z-30 pb-4">
        {currentLevel.unlockedCategories.map((category) => {
          const meta = CATEGORY_META[category];
          const isHovered = hoveredCategory === category;
          const isShaking = shakingBucketCategory === category;

          return (
            <div
              key={category}
              data-bin-category={category}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedItemId) {
                  const targetItem = items.find((it) => it.id === selectedItemId);
                  if (targetItem) {
                    triggerSort(targetItem, category);
                  }
                }
              }}
              className={`flex-1 flex flex-col items-center justify-end pb-2 transition-all duration-300 cursor-pointer rounded-xl ${
                isHovered ? "scale-105" : ""
              } ${
                selectedItemId
                  ? "hover:scale-105 hover:bg-slate-800/5 active:scale-95"
                  : ""
              }`}
            >
              {/* Actual Bucket SVG in Center */}
              <div className="relative flex items-center justify-center h-24 sm:h-52 w-full mb-1">
                <BucketSVG category={category} isHovered={isHovered} isShaking={isShaking} />
              </div>
              
              {/* Label */}
              <span className={`text-[10px] font-black uppercase tracking-widest text-center truncate w-full ${
                isHovered ? "text-slate-900" : "text-slate-700"
              } transition-all duration-200`}>
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
