import type { WasteCategory } from "./wasteItems";

export interface LevelConfig {
  id: number;
  name: string;
  itemCount: number;
  unlockedCategories: WasteCategory[];
  timeLimitSeconds: number;
  gravity: number; // Y gravity in Phaser physics
  spawnDelay: number; // ms between item spawns
  passAccuracy: number; // e.g. 0.80 for 80%
  description: string;
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Level 1: The Green & Brown Basics",
    itemCount: 6,
    unlockedCategories: ["recyclable", "organic"],
    timeLimitSeconds: 60,
    gravity: 80,
    spawnDelay: 3500,
    passAccuracy: 0.80,
    description: "Learn to sort recyclables from organic compost. A slow, easy start!"
  },
  {
    id: 2,
    name: "Level 2: Quickening the Pace",
    itemCount: 8,
    unlockedCategories: ["recyclable", "organic"],
    timeLimitSeconds: 55,
    gravity: 110,
    spawnDelay: 2800,
    passAccuracy: 0.80,
    description: "Same bins, but the items are falling slightly faster. Stay alert!"
  },
  {
    id: 3,
    name: "Level 3: Hazardous Materials",
    itemCount: 10,
    unlockedCategories: ["recyclable", "organic", "hazardous"],
    timeLimitSeconds: 50,
    gravity: 120,
    spawnDelay: 2600,
    passAccuracy: 0.80,
    description: "A red Hazardous bin is unlocked. Watch out for chemical and battery waste!"
  },
  {
    id: 4,
    name: "Level 4: Spotting the Tricks",
    itemCount: 12,
    unlockedCategories: ["recyclable", "organic", "hazardous"],
    timeLimitSeconds: 45,
    gravity: 140,
    spawnDelay: 2200,
    passAccuracy: 0.80,
    description: "Lookalikes and trickier items appear. Think twice before dropping!"
  },
  {
    id: 5,
    name: "Level 5: Enter the E-Waste",
    itemCount: 14,
    unlockedCategories: ["recyclable", "organic", "hazardous", "eWaste"],
    timeLimitSeconds: 40,
    gravity: 150,
    spawnDelay: 2000,
    passAccuracy: 0.80,
    description: "Blue E-waste bin unlocked. Properly route cables, phones, and lightbulbs!"
  },
  {
    id: 6,
    name: "Level 6: Full Operations",
    itemCount: 16,
    unlockedCategories: ["recyclable", "organic", "hazardous", "eWaste", "general"],
    timeLimitSeconds: 35,
    gravity: 160,
    spawnDelay: 1800,
    passAccuracy: 0.80,
    description: "The grey General Waste bin is unlocked. Can you handle all 5 categories?"
  },
  {
    id: 7,
    name: "Level 7: The Master Recycler",
    itemCount: 20,
    unlockedCategories: ["recyclable", "organic", "hazardous", "eWaste", "general"],
    timeLimitSeconds: 30,
    gravity: 185,
    spawnDelay: 1400,
    passAccuracy: 0.85,
    description: "High speed, more items, and an 85% accuracy requirement. The ultimate test!"
  },
  {
    id: 8,
    name: "Level 8: E-Waste & Hazard Rush",
    itemCount: 22,
    unlockedCategories: ["recyclable", "organic", "hazardous", "eWaste"],
    timeLimitSeconds: 32,
    gravity: 210,
    spawnDelay: 1200,
    passAccuracy: 0.85,
    description: "Very fast pace, focused on hazardous and electronic items. Keep your focus sharp!"
  },
  {
    id: 9,
    name: "Level 9: Organic Compost Jam",
    itemCount: 25,
    unlockedCategories: ["recyclable", "organic", "general"],
    timeLimitSeconds: 30,
    gravity: 230,
    spawnDelay: 1000,
    passAccuracy: 0.85,
    description: "Focused on trick organic/recyclable lookalikes, wood sticks, tea bags, and gum. Sort carefully!"
  },
  {
    id: 10,
    name: "Level 10: Eco-Champion Marathon",
    itemCount: 30,
    unlockedCategories: ["recyclable", "organic", "hazardous", "eWaste", "general"],
    timeLimitSeconds: 35,
    gravity: 250,
    spawnDelay: 850,
    passAccuracy: 0.90,
    description: "All categories unlocked, ultra-fast speeds, and a 90% accuracy requirement. The ultimate test of an Eco-Champion!"
  }
];
